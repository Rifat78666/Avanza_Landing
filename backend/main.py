from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import httpx
import stytch
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Avanza Pathfinders API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
STYTCH_PROJECT_ID = os.getenv("STYTCH_PROJECT_ID", "")
STYTCH_SECRET = os.getenv("STYTCH_SECRET", "")

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


# --- Endpoints ---

@app.get("/")
def health_check():
    return {"status": "Avanza API is running. Fast and Secure."}


@app.get("/api/user/profile")
async def get_user_profile(user_id: str = Depends(verify_stytch_session)):
    """Fetches the user row including first_name and onboarding status."""
    users = await supabase_select("users", f"user_id=eq.{user_id}&select=user_id,first_name,onboarding_completed,profile_image_url")
    
    if len(users) == 0:
        # First time user — create row
        await supabase_upsert("users", {"user_id": user_id, "onboarding_completed": False})
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
    
    result = await supabase_upsert("users", {"user_id": user_id, "first_name": first_name})
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to save name.")
    return {"status": "success", "first_name": first_name}


@app.get("/api/user/full-profile")
async def get_full_profile(user_id: str = Depends(verify_stytch_session)):
    """A high-performance endpoint returning all user data in a single roundrip."""
    users = await supabase_select("users", f"user_id=eq.{user_id}&select=*")
    if not users:
        await supabase_upsert("users", {"user_id": user_id, "onboarding_completed": False})
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
    users = await supabase_select("users", f"user_id=eq.{user_id}&select=onboarding_completed,first_name")

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
async def save_onboarding_profile(data: Dict[str, Any], user_id: str = Depends(verify_stytch_session)):
    """Upserts wizard answers and marks onboarding as completed."""

    # Upsert users table first (so foreign key reference exists)
    user_result = await supabase_upsert("users", {"user_id": user_id, "onboarding_completed": True})
    if user_result is None:
        raise HTTPException(status_code=500, detail="Failed to update users table.")

    # Upsert profile
    profile_data = {
        "user_id": user_id,
        "user_type": data.get("user_type"),
        "degree_level": data.get("degree_level"),
        "degree_country": data.get("degree_country"),
        "degree_field": data.get("degree_field"),
        "time_in_italy": data.get("time_in_italy"),
        "residence_permit_status": data.get("residence_permit_status"),
        "goals": data.get("goals", []),
        "language_preference": data.get("language_preference")
    }

    profile_result = await supabase_upsert("onboarding_profiles", profile_data)
    if profile_result is None:
        raise HTTPException(status_code=500, detail="Failed to save onboarding profile.")

    return {"status": "success"}


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
        await supabase_upsert("users", {"user_id": user_id, "profile_image_url": clean_url})
        
        return {"status": "success", "profile_image_url": public_url}


@app.get("/api/dashboard/jobs")
async def get_dashboard_jobs(user_id: str = Depends(verify_stytch_session)):
    """Simulates job matching based on user profile."""
    profile = await get_onboarding_profile(user_id)
    field = (profile.get("profile", {}).get("degree_field") or "General").lower()
    
    # Simple semantic matching
    if "nurs" in field or "medic" in field or "health" in field:
        return [
            {"id": "j1", "title": "Registered Nurse", "company": "Ospedale San Raffaele", "location": "Milan, Italy", "match": "98%", "tags": ["Full-time", "Hybrid Recognition"]},
            {"id": "j2", "title": "Health Care Assistant", "company": "Villa Salus", "location": "Rome, Italy", "match": "92%", "tags": ["Immediate Hire"]},
            {"id": "j3", "title": "Clinical Research Coordinator", "company": "HealthFirst IT", "location": "Turin, Italy", "match": "85%", "tags": ["English Required"]},
        ]
    elif "it" in field or "software" in field or "compute" in field or "engineer" in field:
        return [
            {"id": "j4", "title": "Full Stack Developer", "company": "TechItalia", "location": "Milan, Italy", "match": "95%", "tags": ["Remote", "Visa Support"]},
            {"id": "j5", "title": "Database Administrator", "company": "DataFlow Turin", "location": "Turin, Italy", "match": "89%", "tags": ["Contract"]},
            {"id": "j6", "title": "IT Project Manager", "company": "Global Connect", "location": "Rome, Italy", "match": "82%", "tags": ["Management"]},
        ]
    else:
        return [
            {"id": "j7", "title": "Professional Services Associate", "company": "Consult IT", "location": "Milan, Italy", "match": "90%", "tags": ["Entry Level"]},
            {"id": "j8", "title": "Customer Success Representative", "company": "ServiceHub", "location": "Smart Working", "match": "85%", "tags": ["Remote"]},
        ]

@app.get("/api/dashboard/training")
async def get_dashboard_training(user_id: str = Depends(verify_stytch_session)):
    """Simulates training suggestions based on user profile."""
    profile = await get_onboarding_profile(user_id)
    field = (profile.get("profile", {}).get("degree_field") or "General").lower()
    
    if "nurs" in field or "medic" in field or "health" in field:
        return [
            {"id": "t1", "title": "Italian for Medical Professionals (C1/B2)", "provider": "Università di Bologna", "duration": "4 Months", "price": "Free", "type": "Language"},
            {"id": "t2", "title": "The Italian National Health System (SSN) Basics", "provider": "Regione Lombardia", "duration": "20 Hours", "price": "€50", "type": "Regulations"},
        ]
    elif "it" in field or "software" in field or "compute" in field or "engineer" in field:
        return [
            {"id": "t3", "title": "Cloud Architecture (AWS/Azure) Certification", "provider": "Politecnico di Milano", "duration": "6 Months", "price": "Free (Regional Fund)", "type": "Technical"},
            {"id": "t4", "title": "Agile Methodologies in Italian Enterprise", "provider": "Milan Startup Hub", "duration": "2 Weeks", "price": "€150", "type": "Process"},
        ]
    else:
        return [
            {"id": "t5", "title": "Business Italian Intermediate", "provider": "Istituto Dante Alighieri", "duration": "3 Months", "price": "Free", "type": "Language"},
            {"id": "t6", "title": "Digital Skills for the Italian Workforce", "provider": "Google Career Certificates", "duration": "Flexible", "price": "Free", "type": "Digital"},
        ]


@app.post("/api/cv/upload")
async def upload_cv(file: UploadFile = File(...)):
    """Placeholder CV Upload."""
    if file.content_type not in ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and Word docs are supported.")
    return {"filename": file.filename, "status": "Uploaded successfully to backend memory."}


@app.post("/api/jobs/match")
async def match_jobs(target_role: str, location: str = "Italy", skills: List[str] = []):
    """Placeholder Job Matcher."""
    mock_jobs = [
        {"title": "Registered Nurse", "location": "Milan, IT", "match": "95%"},
        {"title": "Clinical Care Specialist", "location": "Rome, IT", "match": "88%"}
    ]
    return {"status": "success", "matches": mock_jobs}
