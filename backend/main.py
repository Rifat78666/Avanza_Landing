from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
import httpx
import stytch
from dotenv import load_dotenv
from fpdf import FPDF
from io import BytesIO
from openai import AsyncOpenAI
from validation_engine import generate_validation_roadmap, get_bridge_courses

load_dotenv()

app = FastAPI(title="Avanza Pathfinders API")

# Configure CORS for React frontend (Production + Local)
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",")]

# Safeguard: Explicitly add production domains
production_domains = [
    "https://avanza.it.com",
    "https://www.avanza.it.com",
    "https://avanza-landing.vercel.app"
]
for domain in production_domains:
    if domain not in allowed_origins:
        allowed_origins.append(domain)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PATCH", "PUT"],
    allow_headers=["*"],
)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
STYTCH_PROJECT_ID = os.getenv("STYTCH_PROJECT_ID", "")
STYTCH_SECRET = os.getenv("STYTCH_SECRET", "")

# AI & Job API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")

# Stytch Client
stytch_client = stytch.Client(
    project_id=STYTCH_PROJECT_ID,
    secret=STYTCH_SECRET,
)

# Supabase REST helper headers
SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


# --- Supabase REST helpers ---
async def supabase_select(table: str, filters: str = ""):
    """GET rows from a Supabase table via REST."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?{filters}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=SUPABASE_HEADERS)
        if resp.status_code >= 400:
            print(f"Supabase SELECT error: {resp.status_code} {resp.text}")
            return []
        return resp.json()


async def supabase_upsert(table: str, data: dict):
    """POST (upsert) a row into a Supabase table via REST."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {**SUPABASE_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation"}
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=data, headers=headers)
        if resp.status_code >= 400:
            print(f"Supabase UPSERT error: {resp.status_code} {resp.text}")
            return None
        return resp.json()


async def supabase_delete(table: str, filters: str):
    """DELETE rows from a Supabase table via REST."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?{filters}"
    async with httpx.AsyncClient() as client:
        resp = await client.delete(url, headers=SUPABASE_HEADERS)
        if resp.status_code >= 400:
            print(f"Supabase DELETE error: {resp.status_code} {resp.text}")
            return False
        return True


# --- Email Notifications (SendGrid) ---
async def send_notification_email(user_email: str, subject: str, html_content: str):
    """Sends a transactional email via SendGrid v3 API."""
    api_key = os.getenv("SENDGRID_API_KEY")
    sender = os.getenv("SENDGRID_SENDER_EMAIL", "info@avanza.it.com")
    
    if not api_key or "placeholder" in api_key:
        print(f"Skipping email to {user_email}: SendGrid API Key not configured.")
        return

    payload = {
        "personalizations": [{"to": [{"email": user_email}]}],
        "from": {"email": sender, "name": "Avanza Pathfinders"},
        "subject": subject,
        "content": [{"type": "text/html", "value": html_content}]
    }
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post("https://api.sendgrid.com/v3/mail/send", json=payload, headers=headers)
            if resp.status_code >= 400:
                print(f"SendGrid Error: {resp.status_code} {resp.text}")
        except Exception as e:
            print(f"Email Dispatch failed: {str(e)}")


# --- Auth Dependency ---
async def verify_stytch_session(authorization: Optional[str] = Header(None)):
    """Verifies the Stytch session token from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Missing or invalid token format.")

    token = authorization.split(" ")[1]

    try:
        resp = stytch_client.sessions.authenticate(session_token=token)
        if hasattr(resp, "session") and resp.session:
            return resp.session.user_id
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid session.")
    except Exception as e:
        print(f"Stytch Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Unauthorized: Session verification failed.")


async def verify_admin_session(user_id: str = Depends(verify_stytch_session)):
    """Dependency that ensures the current user is an authorized admin."""
    admin_emails_raw = os.getenv("ADMIN_EMAILS", "")
    admin_emails = [e.strip() for e in admin_emails_raw.split(",") if e.strip()]
    
    try:
        user_resp = stytch_client.users.get(user_id=user_id)
        user_email = ""
        for email_obj in user_resp.emails:
            if email_obj.email:
                user_email = email_obj.email
                break
        
        if user_email in admin_emails:
            return user_id
            
        raise HTTPException(status_code=403, detail="Forbidden: You do not have administrative privileges.")
    except Exception as e:
        print(f"Admin Verification Error: {e}")
        raise HTTPException(status_code=403, detail="Forbidden: Admin verification failed.")


# --- Endpoints ---

# --- Roadmap Email HTML Builder ---
def _build_roadmap_email_html(greeting_name: str, country: str, field: str, level: str, roadmap: dict, bridge_courses: list) -> str:
    """Builds a branded HTML email for the free-tier onboarding roadmap."""
    
    # Build steps HTML
    steps_html = ""
    for step in roadmap.get("steps", []):
        steps_html += f"""
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #F0F0F0;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td width="44" valign="top">
                            <div style="width: 36px; height: 36px; border-radius: 50%; background: #FFF3ED; color: #F1592A; font-weight: 800; font-size: 15px; text-align: center; line-height: 36px;">
                                {step['step_number']}
                            </div>
                        </td>
                        <td style="padding-left: 12px;">
                            <p style="margin: 0 0 4px 0; font-weight: 700; font-size: 15px; color: #1A1A1A;">{step['title']}</p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666666; line-height: 1.5;">{step['description']}</p>
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background: #F5F5F5; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #888888; margin-right: 8px;">
                                        ⏱ {step['estimated_time']}
                                    </td>
                                    <td width="8"></td>
                                    <td style="background: #F5F5F5; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #888888;">
                                        💰 {step['estimated_cost']}
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 10px 0 0 0; padding: 8px 12px; background: #FFFBF5; border: 1px dashed #F1592A; border-radius: 6px; font-size: 12px; color: #C04A1F;">
                                🔒 <strong>Premium Feature:</strong> Upgrade to unlock step-by-step guidance, direct submission links, and exact document checklists for this step.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """
    
    # Build bridge courses HTML
    courses_html = ""
    for course in bridge_courses[:3]:  # Limit to 3 courses in email
        cost_badge_bg = "#E8F5E9" if "Free" in course.get("cost", "") else "#FFF3E0"
        cost_badge_color = "#2E7D32" if "Free" in course.get("cost", "") else "#E65100"
        courses_html += f"""
        <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #F0F0F0;">
                <p style="margin: 0 0 4px 0; font-weight: 700; font-size: 14px; color: #1A1A1A;">{course['title']}</p>
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #888888;">{course['provider']}</p>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #555555; line-height: 1.5;">{course['description']}</p>
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="background: #F5F5F5; padding: 3px 8px; border-radius: 4px; font-size: 11px; color: #888888;">
                            ⏱ {course['duration']}
                        </td>
                        <td width="6"></td>
                        <td style="background: #F5F5F5; padding: 3px 8px; border-radius: 4px; font-size: 11px; color: #888888;">
                            🌐 {course['language']}
                        </td>
                        <td width="6"></td>
                        <td style="background: {cost_badge_bg}; padding: 3px 8px; border-radius: 4px; font-size: 11px; color: {cost_badge_color}; font-weight: 700;">
                            {course['cost']}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """
    
    total_time = roadmap.get("total_estimated_time", "2-12 months")
    total_cost = roadmap.get("total_estimated_cost", "Varies")
    is_regulated = roadmap.get("is_regulated", False)
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8F8F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F8F8F8;">
            <tr>
                <td align="center" style="padding: 32px 16px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #F1592A 0%, #E04520 100%); padding: 36px 32px; text-align: center;">
                                <img src="https://avanza.it.com/avanza_Logo.jpeg" alt="Avanza" width="120" style="margin-bottom: 16px; border-radius: 8px;" />
                                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                                    Your Recognition Roadmap
                                </h1>
                                <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.85);">
                                    Personalized pathway for your career in Italy
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Greeting -->
                        <tr>
                            <td style="padding: 28px 32px 8px 32px;">
                                <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6;">
                                    Hello <strong>{greeting_name}</strong>,
                                </p>
                                <p style="margin: 12px 0 0 0; font-size: 14px; color: #555555; line-height: 1.7;">
                                    Thank you for completing the Avanza assessment! Based on your <strong>{level}</strong> in <strong>{field}</strong> from <strong>{country}</strong>, 
                                    here is your personalized recognition roadmap for Italy.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Summary Badge -->
                        <tr>
                            <td style="padding: 16px 32px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FFF8F5; border: 1px solid #FFE0D4; border-radius: 10px;">
                                    <tr>
                                        <td style="padding: 16px 20px; text-align: center;">
                                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Estimated Timeline</p>
                                            <p style="margin: 0; font-size: 20px; font-weight: 800; color: #F1592A;">{total_time}</p>
                                        </td>
                                        <td width="1" style="background: #FFE0D4;"></td>
                                        <td style="padding: 16px 20px; text-align: center;">
                                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Estimated Cost</p>
                                            <p style="margin: 0; font-size: 20px; font-weight: 800; color: #F1592A;">{total_cost}</p>
                                        </td>
                                        <td width="1" style="background: #FFE0D4;"></td>
                                        <td style="padding: 16px 20px; text-align: center;">
                                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Total Steps</p>
                                            <p style="margin: 0; font-size: 20px; font-weight: 800; color: #F1592A;">{len(roadmap.get('steps', []))}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Steps Section -->
                        <tr>
                            <td style="padding: 8px 32px 4px 32px;">
                                <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #1A1A1A;">📋 Your Validation Steps</h2>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #888888;">Follow these steps to get your qualification recognized in Italy</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 32px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FAFAFA; border-radius: 10px; border: 1px solid #F0F0F0;">
                                    {steps_html}
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Bridge Courses Section -->
                        <tr>
                            <td style="padding: 20px 32px 4px 32px;">
                                <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #1A1A1A;">🎓 Recommended Bridge Courses</h2>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #888888;">Training courses matched to your profession to help you succeed in Italy</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 32px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FAFAFA; border-radius: 10px; border: 1px solid #F0F0F0;">
                                    {courses_html}
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Premium CTA -->
                        <tr>
                            <td style="padding: 24px 32px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%); border-radius: 12px;">
                                    <tr>
                                        <td style="padding: 28px 24px; text-align: center;">
                                            <p style="margin: 0 0 4px 0; font-size: 11px; color: #C8F135; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">✨ AVANZA PREMIUM</p>
                                            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #FFFFFF;">Unlock Your Full Roadmap</h3>
                                            <p style="margin: 0 0 20px 0; font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">
                                                Get step-by-step guidance, direct submission links, exact document checklists, 
                                                live job matching, detailed regulatory analysis, and dedicated case manager support.
                                            </p>
                                            <a href="https://avanza.it.com/dashboard" style="display: inline-block; padding: 12px 32px; background: #C8F135; color: #1A1A2E; font-weight: 800; font-size: 14px; text-decoration: none; border-radius: 8px;">
                                                Upgrade to Premium →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 32px 28px 32px; text-align: center; border-top: 1px solid #F0F0F0;">
                                <p style="margin: 0 0 4px 0; font-size: 12px; color: #999999;">
                                    This email was sent by <strong>Avanza Pathfinders</strong> based on your assessment answers.
                                </p>
                                <p style="margin: 0; font-size: 11px; color: #BBBBBB;">
                                    avanza.it.com &bull; Your Career Navigation Partner in Italy
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html

@app.get("/")
def health_check():
    return {"status": "Avanza API is running. Fast and Secure."}


@app.get("/api/user/profile")
async def get_user_profile(user_id: str = Depends(verify_stytch_session)):
    """Fetches the user row including first_name and onboarding status."""
    users = await supabase_select("users", f"id=eq.{user_id}&select=id,first_name,onboarding_completed,profile_image_url")
    
    if len(users) == 0:
        # Fetch user's email from Stytch since email is a NOT NULL constraint on our DB
        user_email = ""
        try:
            user_resp = stytch_client.users.get(user_id=user_id)
            for email_obj in user_resp.emails:
                if email_obj.email:
                    user_email = email_obj.email
                    break
        except Exception as e:
            print(f"Stytch get user error: {e}")
            
        await supabase_upsert("users", {
            "id": user_id, 
            "email": user_email or f"{user_id}@placeholder.com", 
            "onboarding_completed": False
        })
        return {"first_name": None, "onboarding_completed": False, "profile_image_url": None}
    
    return {
        "first_name": users[0].get("first_name"),
        "onboarding_completed": users[0].get("onboarding_completed", False),
        "profile_image_url": users[0].get("profile_image_url")
    }


@app.post("/api/user/name")
async def save_user_name(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    """Saves the user's first name."""
    first_name = (data.get("first_name") or "").strip()
    if not first_name or len(first_name) > 50:
        raise HTTPException(status_code=400, detail="Name is required and must be 50 characters or fewer.")
    
    # Ensure email is retrieved if user row is not yet fully created (constraint safety)
    users = await supabase_select("users", f"id=eq.{user_id}&select=email")
    user_email = users[0].get("email") if users else ""
    if not user_email:
        try:
            user_resp = stytch_client.users.get(user_id=user_id)
            for email_obj in user_resp.emails:
                if email_obj.email:
                    user_email = email_obj.email
                    break
        except Exception as e:
            print(f"Stytch get user error: {e}")

    result = await supabase_upsert("users", {
        "id": user_id, 
        "first_name": first_name,
        "email": user_email or f"{user_id}@placeholder.com"
    })
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to save name.")
    return {"status": "success", "first_name": first_name}


@app.get("/api/user/full-profile")
async def get_full_profile(user_id: str = Depends(verify_stytch_session)):
    """A high-performance endpoint returning all user data in a single roundrip."""
    users = await supabase_select("users", f"id=eq.{user_id}&select=*")
    if not users:
        # Fetch user's email from Stytch since email is a NOT NULL constraint on our DB
        user_email = ""
        try:
            user_resp = stytch_client.users.get(user_id=user_id)
            for email_obj in user_resp.emails:
                if email_obj.email:
                    user_email = email_obj.email
                    break
        except Exception as e:
            print(f"Stytch get user error: {e}")
            
        await supabase_upsert("users", {
            "id": user_id, 
            "email": user_email or f"{user_id}@placeholder.com", 
            "onboarding_completed": False
        })
        return {"onboarding_completed": False, "first_name": None, "profile_image_url": None, "profile": None}
    
    user_record = users[0]
    profiles = await supabase_select("onboarding_profiles", f"user_id=eq.{user_id}&select=*")
    onboarding = profiles[0] if profiles else None

    return {
        "onboarding_completed": user_record.get("onboarding_completed", False),
        "first_name": user_record.get("first_name"),
        "profile_image_url": user_record.get("profile_image_url"),
        "profile": onboarding
    }


@app.get("/api/onboarding")
async def get_onboarding_profile(user_id: str = Depends(verify_stytch_session)):
    """Checks completion status and fetches the profile if it exists."""
    users = await supabase_select("users", f"id=eq.{user_id}&select=onboarding_completed,first_name")

    if len(users) == 0:
        return {"onboarding_completed": False, "first_name": None}

    onboarding_completed = users[0].get("onboarding_completed", False)
    first_name = users[0].get("first_name")

    if not onboarding_completed:
        return {"onboarding_completed": False, "first_name": first_name}

    profiles = await supabase_select("onboarding_profiles", f"user_id=eq.{user_id}&select=*")
    if len(profiles) == 0:
        return {"onboarding_completed": False, "first_name": first_name}

    onboarding = profiles[0]
    user_record = users[0]
    return {
        "onboarding_completed": True,
        "first_name": user_record.get("first_name"),
        "profile_image_url": user_record.get("profile_image_url"),
        "profile": onboarding
    }


@app.post("/api/onboarding")
async def save_onboarding_profile(
    data: Dict[str, Any], 
    background_tasks: BackgroundTasks,
    user_id: str = Depends(verify_stytch_session)
):
    """Upserts wizard answers, marks onboarding as completed, and sends roadmap email."""

    # Extract experience as integer
    exp_str = data.get("years_of_experience", "")
    exp_int = 0
    if "1 - 3" in exp_str: exp_int = 2
    elif "4 - 7" in exp_str: exp_int = 5
    elif "8 - 15" in exp_str: exp_int = 10
    elif "More" in exp_str: exp_int = 16

    # Upsert users table first with new schema fields
    user_update_data = {
        "id": user_id, 
        "onboarding_completed": True,
        "country_of_qualification": data.get("degree_country"),
        "qualification_type": data.get("degree_level"),
        "profession": data.get("profession"),
        "years_of_experience": exp_int,
        "preferred_language": data.get("language_preference", "IT").lower()
    }
    user_result = await supabase_upsert("users", user_update_data)
    if user_result is None:
        raise HTTPException(status_code=500, detail="Failed to update users table.")

    # Upsert legacy profile to maintain backward compatibility
    profile_data = {
        "user_id": user_id,
        "user_type": data.get("user_type"),
        "degree_level": data.get("degree_level"),
        "degree_country": data.get("degree_country"),
        "degree_field": data.get("profession"), # Mapped to profession now
        "time_in_italy": data.get("time_in_italy"),
        "residence_permit_status": data.get("residence_permit_status"),
        "goals": data.get("goals", []),
        "language_preference": data.get("language_preference")
    }

    profile_result = await supabase_upsert("onboarding_profiles", profile_data)
    if profile_result is None:
        raise HTTPException(status_code=500, detail="Failed to save onboarding profile.")

    # --- Send Roadmap Email Asynchronously ---
    try:
        # 1. Retrieve user email & name
        user_email = ""
        user_name = ""
        try:
            user_resp = stytch_client.users.get(user_id=user_id)
            for email_obj in user_resp.emails:
                if email_obj.email:
                    user_email = email_obj.email
                    break
        except Exception as e:
            print(f"Stytch user lookup for email failed: {e}")
        
        # Try to get name from DB (may not exist yet if NameCollection hasn't run)
        users_db = await supabase_select("users", f"id=eq.{user_id}&select=first_name")
        if users_db and users_db[0].get("first_name"):
            user_name = users_db[0]["first_name"]
        
        greeting_name = user_name if user_name else "Avanza Pathfinder"
        
        if user_email:
            # 2. Generate roadmap
            country = data.get("degree_country", "Unknown")
            field = data.get("profession", "General")
            level = data.get("degree_level", "Bachelor's")
            roadmap = generate_validation_roadmap(country, field, level)
            
            # 3. Get bridge courses
            bridge_courses = get_bridge_courses(field)
            
            # 4. Build HTML email
            html_email = _build_roadmap_email_html(
                greeting_name=greeting_name,
                country=country,
                field=field,
                level=level,
                roadmap=roadmap,
                bridge_courses=bridge_courses
            )
            
            # 5. Dispatch
            background_tasks.add_task(
                send_notification_email,
                user_email,
                "Your Personalized Recognition Roadmap — Avanza Pathfinders",
                html_email
            )
            print(f"Roadmap email queued for {user_email}")
    except Exception as e:
        # Email dispatch failure should never block onboarding
        print(f"Roadmap email generation failed (non-blocking): {e}")

    return {"status": "success"}


@app.delete("/api/user")
async def delete_user_account(user_id: str = Depends(verify_stytch_session)):
    """Permanently deletes the user's data from the database."""
    # 1. Delete from onboarding_profiles
    p_deleted = await supabase_delete("onboarding_profiles", f"user_id=eq.{user_id}")
    
    # 2. Delete from users table
    u_deleted = await supabase_delete("users", f"id=eq.{user_id}")
    
    if not u_deleted:
        raise HTTPException(status_code=500, detail="Failed to delete user record.")
        
    return {"status": "success", "message": "User data deleted successfully."}


@app.post("/api/user/image")
async def upload_profile_image(file: UploadFile = File(...), user_id: str = Depends(verify_stytch_session)):
    """Uploads a profile image to Supabase Storage and updates the user record."""
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG and PNG are supported.")
    
    # Check file size (max 2MB)
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 2MB.")
    
    import time
    timestamp = int(time.time())
    extension = file.filename.split('.')[-1] if '.' in file.filename else 'png'
    filename = f"avatar_{user_id}_{timestamp}.{extension}"
    bucket = "avatars"
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{filename}"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": file.content_type,
        "x-upsert": "true"
    }
    
    async with httpx.AsyncClient() as client:
        # 0. Try to upload to Supabase Storage
        upload_resp = await client.post(url, content=contents, headers=headers)
        
        if upload_resp.status_code == 404:
            # Bucket might not exist, try to create it
            print("Bucket 'avatars' not found. Attempting to create via /storage/v1/buckets...")
            # Trying plural endpoint which is common in newer Supabase versions
            create_bucket_url = f"{SUPABASE_URL}/storage/v1/buckets"
            create_resp = await client.post(create_bucket_url, json={"name": bucket, "public": True}, headers=headers)
            
            if create_resp.status_code >= 400:
                print(f"Bucket creation (plural) failed: {create_resp.status_code} {create_resp.text}")
                # Fallback to singular just in case
                create_bucket_url_singular = f"{SUPABASE_URL}/storage/v1/bucket"
                await client.post(create_bucket_url_singular, json={"name": bucket, "public": True}, headers=headers)
            
            # Retry upload
            upload_resp = await client.post(url, content=contents, headers=headers)

        if upload_resp.status_code >= 400:
            try:
                error_data = upload_resp.json()
                if error_data.get("error") == "Duplicate" or "already exists" in str(error_data.get("message")):
                    # It's a duplicate, we can ignore and continue
                    print("Duplicate file detected, ignoring error and proceeding.")
                else:
                    raise HTTPException(status_code=500, detail=f"Storage Error: {upload_resp.text}")
            except Exception as e:
                if isinstance(e, HTTPException): raise e
                raise HTTPException(status_code=500, detail=f"Storage Error: {upload_resp.text}")
        
        # 2. Get Public URL with cache busting
        import time
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{filename}?t={int(time.time())}"
        
        # 3. Update 'users' record (store the clean URL without timestamp)
        clean_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{filename}"
        await supabase_upsert("users", {"id": user_id, "profile_image_url": clean_url})
        
        return {"status": "success", "profile_image_url": public_url}


@app.get("/api/validation/roadmap")
async def get_validation_roadmap(user_id: str = Depends(verify_stytch_session)):
    """Returns the personalized validation roadmap based on onboarding data."""
    profile_resp = await get_onboarding_profile(user_id)
    profile_data = profile_resp.get("profile") or {}
    
    country = profile_data.get("degree_country") or "Unknown"
    field = profile_data.get("degree_field") or "General"
    level = profile_data.get("degree_level") or "Bachelor's"
    
    roadmap = generate_validation_roadmap(country, field, level)
    return roadmap

async def fetch_adzuna_jobs(query, location="Italy"):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return None
    url = f"https://api.adzuna.com/v1/api/jobs/it/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": query,
        "where": location,
        "results_per_page": 4
    }
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                jobs = []
                for r in results:
                    salary_min = r.get('salary_min')
                    salary_max = r.get('salary_max')
                    salary_str = "Competitive"
                    if salary_min and salary_max:
                        salary_str = f"€{int(salary_min)} - €{int(salary_max)}"
                    elif salary_min:
                        salary_str = f"€{int(salary_min)}"
                    
                    jobs.append({
                        "id": str(r.get('id', '')),
                        "title": r.get('title', ''),
                        "company": r.get('company', {}).get('display_name', ''),
                        "location": r.get('location', {}).get('display_name', ''),
                        "match": "Live match",
                        "tags": ["Adzuna Listing"],
                        "url": r.get('redirect_url', ''),
                        "salary": salary_str
                    })
                return jobs
    except Exception as e:
        print(f"Adzuna Error: {e}")
    return None

@app.get("/api/dashboard/recommendations")
async def get_dashboard_recommendations(user_id: str = Depends(verify_stytch_session)):
    """Simulates job matching and training suggestions, using Adzuna if possible."""
    profile_resp = await get_onboarding_profile(user_id)
    profile_data = profile_resp.get("profile") or {}
    field = (profile_data.get("degree_field") or "General").lower()
    
    # 1. Ask Validation Engine if regulated
    country = profile_data.get("degree_country") or "Unknown"
    level = profile_data.get("degree_level") or "Bachelor's"
    roadmap = generate_validation_roadmap(country, field, level)
    
    search_query = field
    if roadmap["is_regulated"]:
        # Look for assistant/bridge roles
        search_query = f"{field} assistant OR associate"
    
    # Try Adzuna first
    jobs = await fetch_adzuna_jobs(search_query)
    
    if jobs is None or len(jobs) == 0:
        # Fallback to Curated Mock Data
        if "nurs" in field or "medic" in field or "health" in field:
            jobs = [
                {"id": "j1", "title": "Registered Nurse", "company": "Ospedale San Raffaele", "location": "Milan, Italy", "match": "98%", "tags": ["Full-time", "No recognition required"], "salary": "Competitive"},
                {"id": "j2", "title": "Clinical Care Specialist", "company": "Humanitas Research", "location": "Rozzano, Italy", "match": "92%", "tags": ["Immediate Hire"], "salary": "Competitive"},
            ]
        elif "it" in field or "software" in field or "compute" in field or "data" in field:
            jobs = [
                {"id": "j4", "title": "Full Stack Developer", "company": "TechItalia Solutions", "location": "Milan, Italy", "match": "95%", "tags": ["Remote"], "salary": "Competitive"},
                {"id": "j5", "title": "Data Analyst", "company": "Fintech Milano", "location": "Milan, Italy", "match": "89%", "tags": ["Hybrid"], "salary": "Competitive"},
            ]
        elif "engineer" in field or "architect" in field:
            jobs = [
                {"id": "j6", "title": "Junior Civil Engineer", "company": "EdilNord", "location": "Turin, Italy", "match": "90%", "tags": [], "salary": "Competitive"},
                {"id": "j7", "title": "CAD Technician", "company": "Arch Studio Milan", "location": "Milan, Italy", "match": "85%", "tags": [], "salary": "Competitive"},
            ]
        else:
            jobs = [
                {"id": "j8", "title": "Digital Marketing Associate", "company": "Creative Hub Italy", "location": "Rome, Italy", "match": "90%", "tags": [], "salary": "Competitive"},
                {"id": "j9", "title": "Customer Success Representative", "company": "ServicePlus", "location": "Remote", "match": "85%", "tags": [], "salary": "Competitive"},
            ]

    # Pre-curated free training lists
    training = []
    if "nurs" in field or "medic" in field or "health" in field:
        training = [
            {"id": "t1", "title": "Italian for Medical Professionals (C1/B2)", "provider": "Università di Bologna", "duration": "4 Months", "price": "FREE", "type": "Language"},
            {"id": "t2", "title": "The Italian National Health System (SSN) Basics", "provider": "Regione Lombardia", "duration": "20 Hours", "price": "FREE", "type": "Regulations"},
        ]
    elif "it" in field or "software" in field or "compute" in field or "data" in field:
         training = [
            {"id": "t3", "title": "Sviluppo Web Full Stack", "provider": "AFOL Metropolitana", "duration": "12 Weeks", "price": "FREE", "type": "Technical"},
            {"id": "t4", "title": "Google IT Support Certificate", "provider": "Google Activate", "duration": "6 Months", "price": "FREE", "type": "Technical"},
        ]
    elif "engineer" in field or "architect" in field:
         training = [
            {"id": "t5", "title": "Progettazione CAD 3D", "provider": "AFOL", "duration": "8 Weeks", "price": "FREE", "type": "Technical"},
            {"id": "t6", "title": "AutoCAD Fundamentals", "provider": "Coursera", "duration": "Self-paced", "price": "FREE", "type": "Technical"},
        ]
    else:
        training = [
            {"id": "t7", "title": "Digital Marketing Certificate", "provider": "Google Activate", "duration": "3 Months", "price": "FREE", "type": "Business"},
            {"id": "t8", "title": "Excel e Analisi Dati", "provider": "AFOL", "duration": "4 Weeks", "price": "FREE", "type": "Business"},
        ]

    return {
        "jobs": jobs,
        "training": training
    }

# --- Recognition Journey Endpoints ---

@app.get("/api/recognition/journey")
async def get_recognition_journey(user_id: str = Depends(verify_stytch_session)):
    """Fetches the user's recognition journey steps."""
    journey = await supabase_select("recognition_journey", f"user_id=eq.{user_id}&select=*")
    return journey

@app.patch("/api/recognition/journey")
async def update_recognition_step(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    """Updates the status of a specific recognition step."""
    step_key = data.get("step_key")
    status = data.get("status") # 'not_started', 'in_progress', 'completed'
    
    if not step_key or not status:
        raise HTTPException(status_code=400, detail="step_key and status are required.")
    
    result = await supabase_upsert("recognition_journey", {
        "user_id": user_id,
        "step_key": step_key,
        "status": status,
        "updated_at": "now()"
    })
    
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to update recognition step.")
    
    return {"status": "success", "step": result[0] if result else None}

# --- Document Vault Endpoints ---

@app.get("/api/vault/documents")
async def get_vault_documents(user_id: str = Depends(verify_stytch_session)):
    """Fetches all documents in the user's vault."""
    docs = await supabase_select("documents", f"user_id=eq.{user_id}&select=*&order=uploaded_at.desc")
    for d in docs:
        d['doc_type'] = d.get('document_type')
        d['verification_status'] = d.get('status')
        d['created_at'] = d.get('uploaded_at')
    return docs

@app.post("/api/vault/upload")
async def upload_vault_document(
    doc_type: str, 
    file: UploadFile = File(...), 
    user_id: str = Depends(verify_stytch_session)
):
    """Uploads a document to Supabase Storage and records it in the vault table."""
    # Validate file type
    allowed_types = [
        "application/pdf", 
        "image/jpeg", 
        "image/png", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Support PDF, JPG, PNG, and Word.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    import time
    timestamp = int(time.time())
    safe_name = "".join([c if c.isalnum() else "_" for c in file.filename])
    filename = f"docs/{user_id}/{timestamp}_{safe_name}"
    bucket = "vault"
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{filename}"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": file.content_type,
        "x-upsert": "true"
    }
    
    async with httpx.AsyncClient() as client:
        # 1. Attempt Upload
        upload_resp = await client.post(url, content=contents, headers=headers)
        
        # 2. Heal if Bucket Not Found
        if upload_resp.status_code == 404:
            # We need JSON headers for the bucket creation step
            mgmt_headers = {**headers, "Content-Type": "application/json"}
            create_bucket_url = f"{SUPABASE_URL}/storage/v1/bucket" # Try /bucket first
            
            # Create bucket
            bucket_resp = await client.post(f"{SUPABASE_URL}/storage/v1/bucket", json={"id": bucket, "name": bucket, "public": False}, headers=mgmt_headers)
            
            # If that failed, try with 's' (some versions differ)
            if bucket_resp.status_code >= 400:
                await client.post(f"{SUPABASE_URL}/storage/v1/buckets", json={"id": bucket, "name": bucket, "public": False}, headers=mgmt_headers)
            
            # Retry original upload
            upload_resp = await client.post(url, content=contents, headers=headers)

        if upload_resp.status_code >= 400:
            error_msg = f"Storage Error: {upload_resp.text}"
            if "Bucket not found" in upload_resp.text:
                error_msg = "Critical: 'vault' bucket not found. Please create it manually in your Supabase Dashboard -> Storage."
            raise HTTPException(status_code=500, detail=error_msg)
        
        # 2. Record in database
        # Note: We use the private URL because these are sensitive documents
        clean_url = f"{SUPABASE_URL}/storage/v1/object/authenticated/{bucket}/{filename}"
        
        doc_record = {
            "user_id": user_id,
            "document_type": doc_type,
            "file_name": file.filename,
            "file_url": clean_url,
            "metadata": {"content_type": file.content_type, "size": len(contents)}
        }
        
        result = await supabase_upsert("documents", doc_record)
        doc = result[0] if result else None
        if doc:
            doc['doc_type'] = doc.get('document_type')
            doc['verification_status'] = doc.get('status')
            doc['created_at'] = doc.get('uploaded_at')
        return {"status": "success", "document": doc}

@app.delete("/api/vault/documents/{doc_id}")
async def delete_vault_document(doc_id: str, user_id: str = Depends(verify_stytch_session)):
    """Deletes a document from the vault."""
    # Verifying ownership first
    docs = await supabase_select("documents", f"id=eq.{doc_id}&user_id=eq.{user_id}")
    if not docs:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    # Delete from DB
    await supabase_delete("documents", f"id=eq.{doc_id}")
    return {"status": "success"}

@app.get("/api/partners/translators")
async def get_translators(city: Optional[str] = None):
    """Returns translators from the database."""
    query = "select=*"
    if city:
        query += f"&city=eq.{city}"
    
    translators = await supabase_select("partner_translators", query)
    return translators

@app.post("/api/admin/partners")
async def admin_add_translator(data: Dict[str, Any], admin_id: str = Depends(verify_admin_session)):
    """Adds a new translator to the directory."""
    result = await supabase_upsert("partner_translators", data)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to add translator.")
    return {"status": "success", "translator": result[0] if result else None}

@app.delete("/api/admin/partners/{id}")
async def admin_delete_translator(id: str, admin_id: str = Depends(verify_admin_session)):
    """Deletes a translator from the directory."""
    await supabase_delete("partner_translators", f"id=eq.{id}")
    return {"status": "success"}

@app.patch("/api/user/cimea-status")
async def update_cimea_status(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    status = data.get("cimea_status")
    if not status:
        raise HTTPException(status_code=400, detail="cimea_status is required.")
    
    result = await supabase_upsert("onboarding_profiles", {"user_id": user_id, "cimea_status": status})
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to update status.")
    return {"status": "success"}

@app.get("/api/user/cimea-status")
async def get_cimea_status(user_id: str = Depends(verify_stytch_session)):
    profiles = await supabase_select("onboarding_profiles", f"user_id=eq.{user_id}&select=cimea_status")
    if len(profiles) == 0:
        return {"cimea_status": "not_started"}
    return {"cimea_status": profiles[0].get("cimea_status") or "not_started"}

@app.post("/api/cv/generate")
async def generate_cv(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key missing.")
        
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    
    prompt = f"""
    You are an expert Italian career coach. Rewrite the following CV details into a professional, European-format CV tailored for the Italian job market.
    Personal Details: {data.get("personal", {})}
    Education: {data.get("education", [])}
    Experience: {data.get("experience", [])}
    Goals: {data.get("goals", "")}
    
    Return ONLY a JSON object with the following keys:
    "professional_summary" (String, rewritten to highlight their suitability for Italy),
    "experience" (List of objects, each with "title", "company", "dates", and a rewritten "description" that highlights achievements),
    "skills" (List of strings, tailored to the Italian market).
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You output JSON only."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"OpenAI error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate CV.")

@app.post("/api/cv/download-pdf")
async def download_cv_pdf(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    # Simple FPDF generation for CV
    class CVPDF(FPDF):
        def header(self):
            pass
            
    pdf = CVPDF()
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    
    personal = data.get("personal", {})
    name = f"{personal.get('firstName', '')} {personal.get('lastName', '')}"
    pdf.cell(0, 10, name, ln=True)
    
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 6, personal.get("email", ""), ln=True)
    pdf.cell(0, 6, personal.get("phone", ""), ln=True)
    pdf.ln(10)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 8, "Professional Summary", ln=True)
    pdf.set_font("helvetica", "", 11)
    
    # We must substitute characters to avoid encoding issues with FPDF (latin-1)
    summary = data.get("professional_summary", "").encode('latin-1', 'replace').decode('latin-1')
    pdf.multi_cell(0, 6, summary)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 8, "Experience", ln=True)
    for exp in data.get("experience", []):
        pdf.set_font("helvetica", "B", 12)
        title_company = f"{exp.get('title', '')} at {exp.get('company', '')}".encode('latin-1', 'replace').decode('latin-1')
        pdf.cell(0, 6, title_company, ln=True)
        
        pdf.set_font("helvetica", "I", 11)
        dates = str(exp.get('dates', '')).encode('latin-1', 'replace').decode('latin-1')
        pdf.cell(0, 6, dates, ln=True)
        
        pdf.set_font("helvetica", "", 11)
        desc = exp.get("description", "").encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(0, 6, desc)
        pdf.ln(3)
        
    return Response(
        content=pdf.output(), 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=CV_{name}.pdf"}
    )



@app.get("/api/recognition/dossier")
async def get_recognition_dossier(user_id: str = Depends(verify_stytch_session)):
    """Generates a professional PDF dossier for degree recognition."""
    # 1. Fetch data
    full_profile = await get_full_profile(user_id)
    profile = full_profile.get("profile")
    first_name = full_profile.get("first_name", "User")
    
    if not profile:
        raise HTTPException(status_code=400, detail="Profile not found. Please complete onboarding first.")

    # 2. Setup PDF Class with branding
    class AvanzaPDF(FPDF):
        def header(self):
            # Professional Header Bar
            self.set_fill_color(15, 18, 25) # Dark Blue-Black
            self.rect(0, 0, 210, 45, 'F')
            
            # Stylized Logo Circle
            self.set_fill_color(200, 241, 53) # Lime Accent
            self.circle(20, 22, 12, 'F')
            self.set_font("helvetica", "B", 18)
            self.set_text_color(15, 18, 25)
            self.set_xy(16.5, 18)
            self.cell(10, 10, "A", align='C')
            
            # Brand Name
            self.set_font("helvetica", "B", 26)
            self.set_text_color(255, 255, 255)
            self.set_xy(35, 15)
            self.cell(0, 10, "AVANZA PATHFINDERS", ln=True)
            
            self.set_font("helvetica", "I", 10)
            self.set_text_color(200, 241, 53)
            self.set_xy(35, 26)
            self.cell(0, 10, "Your Official Recognition Roadmap & Professional Dossier", ln=True)
            
            self.ln(25)

        def footer(self):
            self.set_y(-25)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.line(10, self.get_y(), 200, self.get_y())
            self.cell(0, 10, f"Page {self.page_no()} | Dossier ID: AV-{user_id[:8].upper()}-{int(time.time())}", align='L')
            self.cell(0, 10, "avanza.it.com | Official Institutional Guide", align='R')

    pdf = AvanzaPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=30)
    
    # Body Styling
    pdf.set_text_color(40, 40, 40)
    pdf.set_xy(15, 55)
    
    # SECTION 1: CANDIDATE
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "1. CANDIDATE PROFILE", ln=True)
    pdf.set_draw_color(200, 241, 53)
    pdf.set_line_width(0.8)
    pdf.line(15, 66, 70, 66)
    pdf.ln(8)
    
    pdf.set_font("helvetica", "", 12)
    pdf.set_text_color(60, 60, 60)
    
    details = [
        ("Candidate Name", first_name),
        ("Academic Level", profile.get("degree_level", "N/A")),
        ("Discipline", profile.get("degree_field", "N/A")),
        ("Source Country", profile.get("degree_country", "N/A")),
        ("Issuing University", profile.get("university", "Refer to verified vault items")),
    ]
    
    for label, val in details:
        pdf.set_font("helvetica", "B", 11)
        pdf.cell(60, 9, f"{label}:", 0)
        pdf.set_font("helvetica", "", 11)
        pdf.cell(0, 9, str(val), 0, 1)
    
    pdf.ln(10)
    
    # Fetch dynamic roadmap and bridge courses
    field_raw = profile.get("degree_field", "General")
    country_raw = profile.get("degree_country", "Unknown")
    level_raw = profile.get("degree_level", "Bachelor's")
    roadmap_data = generate_validation_roadmap(country_raw, field_raw, level_raw)
    bridge_courses = get_bridge_courses(field_raw)

    # SECTION 2: PREMIUM UPGRADE BANNER (regulatory details locked)
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "2. REGULATORY STATUS", ln=True)
    pdf.set_draw_color(200, 241, 53)
    pdf.set_line_width(0.8)
    pdf.line(15, pdf.get_y(), 75, pdf.get_y())
    pdf.ln(10)

    banner_y = pdf.get_y()
    pdf.set_fill_color(15, 18, 25)
    pdf.rect(15, banner_y, 180, 44, 'F')

    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(200, 241, 53)
    pdf.set_xy(15, banner_y + 6)
    pdf.cell(180, 6, "AVANZA PREMIUM FEATURE", align='C', ln=True)

    pdf.set_font("helvetica", "B", 13)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(15, banner_y + 14)
    pdf.cell(180, 7, "Unlock Your Full Regulatory Analysis", align='C', ln=True)

    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(180, 180, 180)
    pdf.set_xy(15, banner_y + 23)
    pdf.cell(180, 6, "Competent boards, language certificates, required exams & ministry contacts", align='C', ln=True)

    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(200, 241, 53)
    pdf.set_xy(15, banner_y + 32)
    pdf.cell(180, 6, "Upgrade at avanza.it.com/dashboard", align='C', ln=True)

    pdf.ln(52)
    pdf.set_text_color(40, 40, 40)

    # SECTION 3: RECOGNITION ROADMAP (dynamic steps, details locked)
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "3. YOUR RECOGNITION ROADMAP", ln=True)
    pdf.set_draw_color(200, 241, 53)
    pdf.line(15, pdf.get_y(), 115, pdf.get_y())
    pdf.ln(4)

    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(120, 120, 120)
    total_time = roadmap_data.get("total_estimated_time", "Varies")
    total_cost = roadmap_data.get("total_estimated_cost", "Varies")
    step_count = len(roadmap_data.get("steps", []))
    pdf.cell(0, 6, f"Estimated Timeline: {total_time}   |   Estimated Cost: {total_cost}   |   Total Steps: {step_count}", ln=True)
    pdf.ln(4)

    for step in roadmap_data.get("steps", []):
        pdf.set_font("helvetica", "B", 11)
        pdf.set_text_color(15, 18, 25)
        title_safe = step["title"].encode("latin-1", "replace").decode("latin-1")
        pdf.cell(0, 8, f"Step {step['step_number']}  |  {title_safe}", ln=True)

        pdf.set_font("helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        desc_safe = step["description"].encode("latin-1", "replace").decode("latin-1")
        pdf.multi_cell(0, 5, desc_safe)

        pdf.set_font("helvetica", "", 9)
        pdf.set_text_color(110, 110, 110)
        pdf.cell(0, 5, f"  Time: {step['estimated_time']}    Cost: {step['estimated_cost']}", ln=True)

        # Premium lock badge per step
        lock_y = pdf.get_y() + 2
        pdf.set_fill_color(255, 248, 245)
        pdf.set_draw_color(241, 89, 42)
        pdf.set_line_width(0.3)
        pdf.rect(15, lock_y, 180, 9, 'DF')
        pdf.set_font("helvetica", "B", 8)
        pdf.set_text_color(192, 74, 31)
        pdf.set_xy(15, lock_y + 1)
        pdf.cell(180, 7, "  Premium: Upgrade to unlock file checklists, submission links & step-by-step guide", align='L', ln=True)
        pdf.set_line_width(0.8)
        pdf.ln(5)

    pdf.set_draw_color(200, 241, 53)
    pdf.set_text_color(40, 40, 40)

    # SECTION 4: RECOMMENDED BRIDGE COURSES
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(15, 18, 25)
    pdf.cell(0, 10, "4. RECOMMENDED BRIDGE COURSES", ln=True)
    pdf.line(15, pdf.get_y(), 125, pdf.get_y())
    pdf.ln(4)

    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 6, "Training programmes matched to your profession to help you succeed in Italy", ln=True)
    pdf.ln(4)

    for course in bridge_courses[:4]:
        pdf.set_font("helvetica", "B", 11)
        pdf.set_text_color(15, 18, 25)
        course_title = course["title"].encode("latin-1", "replace").decode("latin-1")
        pdf.cell(0, 7, course_title, ln=True)

        pdf.set_font("helvetica", "I", 9)
        pdf.set_text_color(100, 100, 100)
        provider_safe = course["provider"].encode("latin-1", "replace").decode("latin-1")
        pdf.cell(0, 5, provider_safe, ln=True)

        pdf.set_font("helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        desc_safe = course["description"].encode("latin-1", "replace").decode("latin-1")
        pdf.multi_cell(0, 5, desc_safe)

        pdf.set_font("helvetica", "", 9)
        pdf.set_text_color(100, 100, 100)
        cost_safe = course.get("cost", "").encode("latin-1", "replace").decode("latin-1")
        pdf.cell(0, 5, f"  Duration: {course['duration']}    Language: {course['language']}    Cost: {cost_safe}", ln=True)
        pdf.ln(5)

    return Response(
        content=pdf.output(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Avanza_Dossier_{first_name}.pdf"}
    )

# --- Admin Portal Endpoints ---

@app.get("/api/admin/users")
async def admin_get_users(admin_id: str = Depends(verify_admin_session)):
    """Fetches all users and their onboarding profiles for admin review."""
    users = await supabase_select("users", "select=*&order=created_at.desc")
    # Join with profiles manually (REST doesn't support complex joins easily)
    profiles = await supabase_select("onboarding_profiles", "select=*")
    
    # Create a map for quick lookup
    profile_map = {p['user_id']: p for p in profiles}
    
    combined = []
    for u in users:
        u_id = u['user_id']
        combined.append({
            **u,
            "profile": profile_map.get(u_id)
        })
    
    return combined

@app.get("/api/admin/documents")
async def admin_get_all_documents(admin_id: str = Depends(verify_admin_session)):
    """Fetches all uploaded documents across all users."""
    docs = await supabase_select("documents", "select=*,users(first_name)&order=uploaded_at.desc")
    for d in docs:
        d['doc_type'] = d.get('document_type')
        d['verification_status'] = d.get('status')
        d['created_at'] = d.get('uploaded_at')
    return docs

@app.patch("/api/admin/documents/{doc_id}")
async def admin_update_document_status(
    doc_id: str, 
    data: Dict[str, Any], 
    background_tasks: BackgroundTasks,
    admin_id: str = Depends(verify_admin_session)
):
    """Updates the verification status of a user document and notifies the user."""
    status = data.get("verification_status") # 'pending', 'verified', 'rejected'
    notes = data.get("admin_notes")
    
    if not status:
        raise HTTPException(status_code=400, detail="verification_status is required.")
    
    # 1. Update the database
    update_data = {"id": doc_id, "status": status}
    if notes is not None:
        update_data["admin_notes"] = notes
        
    result = await supabase_upsert("documents", update_data)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to update document status.")
    
    updated_doc = result[0]
    updated_doc['doc_type'] = updated_doc.get('document_type')
    updated_doc['verification_status'] = updated_doc.get('status')
    updated_doc['created_at'] = updated_doc.get('uploaded_at')
    user_id = updated_doc.get("user_id")
    file_name = updated_doc.get("file_name")

    # 2. Fetch User Email from Stytch and send notification
    if user_id:
        try:
            user_resp = stytch_client.users.get(user_id=user_id)
            user_email = next((e.email for e in user_resp.emails if e.email), None)
            
            if user_email:
                subject = f"Avanza Update: Document {status.capitalize()}"
                
                if status == 'verified':
                    html = f"""
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2e7d32;">Great news!</h2>
                        <p>Your document <strong>{file_name}</strong> has been successfully verified.</p>
                        <p>You can now proceed to the next steps in your recognition journey on your dashboard.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #666;">Sent by Avanza Pathfinders Team</p>
                    </div>
                    """
                else: # rejected
                    html = f"""
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #d32f2f;">Action Required</h2>
                        <p>Your document <strong>{file_name}</strong> requires attention and has been marked as rejected.</p>
                        <p><strong>Admin Note:</strong> {notes or 'No specific notes provided.'}</p>
                        <p>Please log in to your vault to re-upload the correct document.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #666;">Sent by Avanza Pathfinders Team</p>
                    </div>
                    """
                
                background_tasks.add_task(send_notification_email, user_email, subject, html)
        except Exception as e:
            print(f"Failed to trigger notification flow: {str(e)}")
        
    return {"status": "success", "document": updated_doc}

# --- Phase 1 API Implementations ---
import uuid
import datetime

@app.get('/api/v1/cases')
async def get_v1_cases(user_id: str = Depends(verify_stytch_session)):
    cases = await supabase_select("cases", f"user_id=eq.{user_id}&select=*")
    
    if not cases:
        # Auto-generate a case for new users based on their profile
        users = await supabase_select("users", f"id=eq.{user_id}&select=*")
        user = users[0] if users else {}
        
        if user:
            new_case = {
                "case_number": f"AV-{datetime.datetime.now().year}-{str(uuid.uuid4())[:6].upper()}",
                "user_id": user_id,
                "title": f"Recognition for {user.get('profession', 'Unknown Profession')}",
                "type": "professional_recognition_non_eu", # Defaulting for now
                "country_of_qualification": user.get("country_of_qualification", "Unknown"),
                "profession": user.get("profession", "Unknown"),
                "goal": "employment",
                "status": "assessment",
                "progress_percentage": 10,
                "priority": "normal"
            }
            inserted = await supabase_upsert("cases", new_case)
            if inserted:
                cases = [inserted]

    return cases

@app.get('/api/v1/cases/{case_id}/timeline')
async def get_v1_case_timeline(case_id: str, user_id: str = Depends(verify_stytch_session)):
    cases = await supabase_select("cases", f"id=eq.{case_id}&user_id=eq.{user_id}&select=*")
    if not cases:
        raise HTTPException(status_code=404, detail="Case not found")
        
    case = cases[0]
    profession = case.get("profession", "").lower()
    
    regulated_keywords = ['medicine', 'medic', 'doctor', 'nurs', 'law', 'legal', 'engineer', 'architect', 'psycholog', 'pharmacist', 'vet', 'dentist', 'teacher', 'accountant']
    is_regulated = any(kw in profession for kw in regulated_keywords)
    
    timeline = {
        "case_id": case_id,
        "is_regulated": is_regulated,
        "profession_notes": f"Based on our assessment, {case.get('profession')} from {case.get('country_of_qualification')} is considered a {'regulated' if is_regulated else 'unregulated'} profession in Italy.",
        "competent_ministry": "Ministry of University and Research (MUR)" if is_regulated else None,
        "steps": []
    }
    
    if is_regulated:
        timeline["steps"] = [
            {"key": "step_apostille", "step_number": 1, "title": "Get your degree Apostilled", "description": "Contact your home country embassy.", "estimated_time": "~3-8 weeks", "estimated_cost": "Varies", "status": "completed"},
            {"key": "step_translation", "step_number": 2, "title": "Get a certified Italian translation", "description": "Find a perito giurato sworn translator.", "estimated_time": "~1 week", "estimated_cost": "~€80-150", "status": "active"},
            {"key": "step_mur", "step_number": 3, "title": "Submit application to MUR", "description": "Via your nearest Italian university desk.", "estimated_time": "~6-18 months", "estimated_cost": "€16", "status": "pending"},
        ]
    else:
        timeline["steps"] = [
            {"key": "step_cimea", "step_number": 1, "title": "Optional: CIMEA Statement", "description": "Get a comparability statement to negotiate better salaries.", "estimated_time": "~30 days", "estimated_cost": "€150", "status": "active"},
            {"key": "step_apply", "step_number": 2, "title": "Apply to Jobs Directly", "description": "No formal recognition is legally required for private sector roles.", "estimated_time": "Ongoing", "estimated_cost": "Free", "status": "pending"},
        ]
        
    return timeline

