-- Clean up existing legacy tables to ensure a fresh schema
DROP TABLE IF EXISTS public.onboarding_profiles CASCADE;
DROP TABLE IF EXISTS public.recognition_journey CASCADE;
DROP TABLE IF EXISTS public.document_vault CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.cases CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users Table (Modified PRD Schema - id changed to TEXT for Stytch)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client', -- 'client','admin','case_manager','support','content','finance'
    first_name VARCHAR(100), 
    last_name VARCHAR(100),
    phone VARCHAR(20), 
    date_of_birth DATE,
    nationality VARCHAR(100), 
    country_of_residence VARCHAR(100),
    city VARCHAR(100), 
    codice_fiscale VARCHAR(16),
    country_of_qualification VARCHAR(100),
    qualification_type VARCHAR(50), -- 'vocational','diploma','bachelor','master','phd','professional_license'
    profession VARCHAR(200), 
    years_of_experience INTEGER,
    preferred_language VARCHAR(10) DEFAULT 'it',
    communication_preference JSONB,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by TEXT REFERENCES public.users(id),
    profile_image_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE, -- Retained for legacy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- soft delete
);

-- 2. Onboarding Profiles (Legacy Table - retained to prevent breaking current UI)
CREATE TABLE IF NOT EXISTS public.onboarding_profiles (
    user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 3. Cases Table
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(20) UNIQUE NOT NULL, -- e.g. "AV-2024-0142"
    user_id TEXT NOT NULL REFERENCES public.users(id),
    assigned_to TEXT REFERENCES public.users(id),
    title VARCHAR(300),
    type VARCHAR(100) NOT NULL, -- 'professional_recognition_eu','professional_recognition_non_eu','dichiarazione_di_valore','equipollenza','cimea_attestation','professional_order','business_registration'
    country_of_qualification VARCHAR(100) NOT NULL,
    profession VARCHAR(200) NOT NULL,
    goal VARCHAR(50) NOT NULL, -- 'employment','self_employment','study','other'
    status VARCHAR(50) DEFAULT 'new', -- 'new','assessment','documents_collection','document_preparation','application_submitted','under_review','compensatory_measures','decision_received','post_recognition','closed_successful','closed_cancelled','on_hold','blocked'
    progress_percentage INTEGER DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'normal', -- 'low','normal','high','urgent'
    package_type VARCHAR(50), -- 'starter','standard','premium','custom'
    package_price DECIMAL(10,2), 
    total_paid DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id), -- Note: Can be null if uploaded before case creation
    user_id TEXT NOT NULL REFERENCES public.users(id),
    document_type VARCHAR(100) NOT NULL, -- 'diploma','transcript','apostille','sworn_translation','dichiarazione_di_valore','experience_certificate','identity_document','codice_fiscale_doc','residence_permit','professional_attestation','application_form','cover_letter','power_of_attorney','other'
    file_name VARCHAR(300) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER, 
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 for integrity
    status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded','under_review','verified','rejected','expired'
    rejection_reason TEXT, 
    rejection_instructions TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    deadline DATE, 
    version INTEGER DEFAULT 1,
    admin_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- Carried over from document_vault
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Messages & Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id),
    client_id TEXT NOT NULL REFERENCES public.users(id),
    assigned_to TEXT REFERENCES public.users(id),
    status VARCHAR(50) DEFAULT 'open', -- 'open','waiting_client','waiting_team','closed'
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count_client INTEGER DEFAULT 0,
    unread_count_team INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id),
    sender_id TEXT NOT NULL REFERENCES public.users(id),
    body TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- 'text','file','image','audio','system'
    is_internal BOOLEAN DEFAULT FALSE, -- team-only note
    is_read BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT 'portal', -- 'portal','whatsapp','email','sms','system'
    reply_to_id UUID REFERENCES public.messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payments & Invoices
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id),
    case_id UUID REFERENCES public.cases(id),
    amount DECIMAL(10,2) NOT NULL, 
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_type VARCHAR(50) NOT NULL, -- 'package','consultation','addon','installment'
    payment_method VARCHAR(50) NOT NULL, -- 'stripe_card','paypal','bank_transfer','other'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending','processing','completed','failed','refunded'
    stripe_payment_id VARCHAR(255), 
    paypal_order_id VARCHAR(255),
    bank_transfer_reference VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE, 
    due_date DATE, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(20) UNIQUE NOT NULL, -- "INV-2024-0089"
    user_id TEXT NOT NULL REFERENCES public.users(id),
    amount DECIMAL(10,2) NOT NULL, 
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL, 
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft','sent','paid','overdue','cancelled'
    issued_date DATE NOT NULL, 
    due_date DATE NOT NULL, 
    paid_date DATE,
    pdf_url TEXT, 
    sdi_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) as authorization is handled by FastAPI/Stytch
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;

-- 7. Legacy Journey Table
CREATE TABLE IF NOT EXISTS public.recognition_journey (
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    step_key TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, step_key)
);
ALTER TABLE public.recognition_journey DISABLE ROW LEVEL SECURITY;
