-- 1. Recognition Journey Tracking
-- This table tracks the progress of each user's specific recognition steps
CREATE TABLE IF NOT EXISTS public.recognition_journey (
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE,
    step_key TEXT NOT NULL, -- 'apostille', 'translation', 'cimea_submission', 'mur_application'
    status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, step_key)
);

-- 2. Document Vault
-- Stores metadata for user-uploaded academic and legal documents
CREATE TABLE IF NOT EXISTS public.document_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(user_id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL, -- 'degree', 'transcript', 'id', 'translation', 'apostille'
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (though frontend current disables it, backend will use Service Role)
-- ALTER TABLE public.recognition_journey ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;
