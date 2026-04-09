import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

async def check_storage():
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY
    }
    async with httpx.AsyncClient() as client:
        # List buckets
        resp = await client.get(f"{SUPABASE_URL}/storage/v1/bucket", headers=headers)
        print(f"Buckets: {resp.status_code} {resp.text}")
        
        # Try to create 'avatars' if not there
        if "avatars" not in resp.text:
            print("Creating 'avatars' bucket...")
            resp = await client.post(f"{SUPABASE_URL}/storage/v1/bucket", json={"name": "avatars", "public": True}, headers=headers)
            print(f"Create Result: {resp.status_code} {resp.text}")

if __name__ == "__main__":
    asyncio.run(check_storage())
