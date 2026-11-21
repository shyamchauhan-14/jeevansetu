-- JeevanSetu 2.0: Core Schema & Row Level Security (RLS) Migration
-- Version: 20261121000000
-- Description: Core tables, RBAC roles, audit logs, and strict owner-scoped RLS policies.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Profiles Table (One-to-one with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT '',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    age INTEGER CHECK (age IS NULL OR (age >= 0 AND age <= 130)),
    sex VARCHAR(20) CHECK (sex IN ('male', 'female', 'other', '')),
    village_town TEXT DEFAULT '',
    district TEXT DEFAULT '',
    pincode VARCHAR(10) DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. User Roles (RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL CHECK (role IN ('patient', 'community_worker', 'administrator', 'clinician_reviewer')),
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- 4. Emergency Contacts
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    consent_status TEXT NOT NULL DEFAULT 'granted' CHECK (consent_status IN ('pending', 'granted', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own emergency contacts"
    ON public.emergency_contacts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Emergency Incidents (Smart SOS)
CREATE TABLE IF NOT EXISTS public.emergency_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'preparing' 
        CHECK (status IN ('not_started', 'preparing', 'call_opened', 'alert_queued', 'sent', 'failed', 'resolved', 'cancelled')),
    locality TEXT DEFAULT '',
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    emergency_type TEXT DEFAULT 'general',
    alert_status TEXT DEFAULT 'none',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own incidents"
    ON public.emergency_incidents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incidents"
    ON public.emergency_incidents FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own incidents"
    ON public.emergency_incidents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Medicine Reminders
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time_slot VARCHAR(16) NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'night')),
    time VARCHAR(8) NOT NULL,
    meal_instruction VARCHAR(16) NOT NULL CHECK (meal_instruction IN ('before_meal', 'after_meal', 'with_meal')),
    status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'skipped', 'snoozed')),
    last_taken_date TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reminders"
    ON public.medicine_reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
    ON public.medicine_reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
    ON public.medicine_reminders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
    ON public.medicine_reminders FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Symptom Assessments
CREATE TABLE IF NOT EXISTS public.symptom_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    duration TEXT NOT NULL DEFAULT '',
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
    risk_level VARCHAR(16) NOT NULL CHECK (risk_level IN ('CRITICAL', 'MODERATE', 'LOW')),
    outcome JSONB NOT NULL DEFAULT '{}'::jsonb,
    rule_version VARCHAR(32) NOT NULL DEFAULT '2.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.symptom_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own symptom assessments"
    ON public.symptom_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save own symptom assessments"
    ON public.symptom_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- 8. Facilities Directory
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    facility_type TEXT NOT NULL,
    distance_km NUMERIC(5,2) DEFAULT 0,
    location_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_open_24x7 BOOLEAN NOT NULL DEFAULT false,
    has_ambulance BOOLEAN NOT NULL DEFAULT false,
    has_emergency_bed BOOLEAN NOT NULL DEFAULT false,
    address TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'District Health Department',
    verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for healthcare facilities"
    ON public.facilities FOR SELECT
    USING (true);

-- 9. Health Records
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_type VARCHAR(32) NOT NULL CHECK (record_type IN ('allergy', 'condition', 'medication', 'visit_note', 'assessment_summary')),
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    provenance VARCHAR(32) NOT NULL CHECK (provenance IN ('patient_entered', 'worker_entered', 'clinician_verified', 'provider_imported')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health records"
    ON public.health_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own health records"
    ON public.health_records FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 10. Worker Assignments
CREATE TABLE IF NOT EXISTS public.worker_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_granted BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (worker_user_id, patient_user_id)
);

ALTER TABLE public.worker_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers and patients can view their assignments"
    ON public.worker_assignments FOR SELECT
    USING (auth.uid() = worker_user_id OR auth.uid() = patient_user_id);

-- 11. Audit Events (Append-only)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Rollback Instructions:
-- DROP TABLE IF EXISTS public.audit_events;
-- DROP TABLE IF EXISTS public.worker_assignments;
-- DROP TABLE IF EXISTS public.health_records;
-- DROP TABLE IF EXISTS public.facilities;
-- DROP TABLE IF EXISTS public.symptom_assessments;
-- DROP TABLE IF EXISTS public.medicine_reminders;
-- DROP TABLE IF EXISTS public.emergency_incidents;
-- DROP TABLE IF EXISTS public.emergency_contacts;
-- DROP TABLE IF EXISTS public.user_roles;
-- DROP TABLE IF EXISTS public.profiles;
