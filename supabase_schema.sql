-- 1. Create the Users table
CREATE TABLE IF NOT EXISTS public.users (
    user_id TEXT PRIMARY KEY,
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- 2. Create the Onboarding Profiles table
CREATE TABLE IF NOT EXISTS public.onboarding_profiles (
    user_id TEXT PRIMARY KEY REFERENCES public.users(user_id) ON DELETE CASCADE,
    user_type TEXT,
    degree_level TEXT,
    degree_country TEXT,
    degree_field TEXT,
    time_in_italy TEXT,
    residence_permit_status TEXT,
    goals JSONB,
    language_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. We disable Row Level Security (RLS) because you are using Stytch for Auth 
-- instead of Supabase Auth. If RLS is enabled, the public anon key won't be able to insert rows.
-- Note: For a production app, you will want to move this insertion logic to your FastAPI backend
-- using a secure Service Role Key, or verify Stytch JWTs directly in Postgres.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_profiles DISABLE ROW LEVEL SECURITY;
