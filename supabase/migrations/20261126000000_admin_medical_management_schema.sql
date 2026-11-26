-- JeevanSetu 2.0: Admin & Medical Authority Management System Schema
-- Migration Version: 20261126000000
-- Description: Doctor verification, emergency protocols with review workflow, blood donor management, notifications, and audit logging with strict PostgreSQL RLS.

-- 1. Helper function for role checking
CREATE OR REPLACE FUNCTION public.is_super_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = uid AND role IN ('administrator', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_verified_doctor(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.doctor_verifications
        WHERE user_id = uid AND status = 'VERIFIED'
    ) OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = uid AND role IN ('clinician_reviewer', 'verified_doctor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Doctor Verifications Table
CREATE TABLE IF NOT EXISTS public.doctor_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    registration_authority TEXT NOT NULL,
    state TEXT NOT NULL,
    qualification TEXT NOT NULL,
    specialization TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0 AND experience_years <= 75),
    professional_address TEXT NOT NULL,
    certificate_url TEXT DEFAULT '',
    supporting_documents TEXT DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    rejection_reason TEXT DEFAULT '',
    admin_notes TEXT DEFAULT '',
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(registration_number, registration_authority)
);

ALTER TABLE public.doctor_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins can manage all doctor verifications"
    ON public.doctor_verifications FOR ALL
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Doctors can view and manage own verification request"
    ON public.doctor_verifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Emergency Medical Protocols Table
CREATE TABLE IF NOT EXISTS public.emergency_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL,
    short_description TEXT NOT NULL,
    symptoms TEXT[] NOT NULL DEFAULT '{}',
    warning_signs TEXT[] NOT NULL DEFAULT '{}',
    immediate_safety_measures TEXT NOT NULL,
    response_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    what_not_to_do TEXT[] NOT NULL DEFAULT '{}',
    when_to_call_emergency TEXT NOT NULL DEFAULT 'Call 112 / 108 immediately if patient is unresponsive.',
    required_equipment TEXT[] NOT NULL DEFAULT '{}',
    special_precautions TEXT DEFAULT '',
    target_audience TEXT NOT NULL DEFAULT 'General Public & Rural First Responders',
    medical_references TEXT[] NOT NULL DEFAULT '{}',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT 'Medical Authority Board',
    author_registration_no TEXT DEFAULT '',
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewer_name TEXT DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' 
        CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'UNDER_REVIEW', 'PUBLISHED', 'REJECTED', 'CHANGES_REQUESTED', 'ARCHIVED', 'EXPIRED', 'UNDER_REVISION')),
    rejection_reason TEXT DEFAULT '',
    change_request_notes TEXT DEFAULT '',
    version INTEGER NOT NULL DEFAULT 1,
    is_public BOOLEAN NOT NULL DEFAULT false,
    last_reviewed_at TIMESTAMPTZ,
    review_due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for published emergency protocols"
    ON public.emergency_protocols FOR SELECT
    USING (is_public = true AND status = 'PUBLISHED');

CREATE POLICY "Super Admins full access to protocols"
    ON public.emergency_protocols FOR ALL
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Verified doctors can manage own authored protocols"
    ON public.emergency_protocols FOR ALL
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 4. Protocol Versions (Audit & History)
CREATE TABLE IF NOT EXISTS public.protocol_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID NOT NULL REFERENCES public.emergency_protocols(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content_snapshot JSONB NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    change_summary TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.protocol_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins and authors can view versions"
    ON public.protocol_versions FOR SELECT
    USING (
        public.is_super_admin(auth.uid()) OR 
        EXISTS (SELECT 1 FROM public.emergency_protocols ep WHERE ep.id = protocol_id AND ep.author_id = auth.uid())
    );

CREATE POLICY "Super Admins can insert versions"
    ON public.protocol_versions FOR INSERT
    WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_verified_doctor(auth.uid()));

-- 5. Protocol Reviews History
CREATE TABLE IF NOT EXISTS public.protocol_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID NOT NULL REFERENCES public.emergency_protocols(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id),
    action VARCHAR(32) NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'ARCHIVED')),
    comments TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.protocol_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins and authors view reviews"
    ON public.protocol_reviews FOR SELECT
    USING (
        public.is_super_admin(auth.uid()) OR 
        EXISTS (SELECT 1 FROM public.emergency_protocols ep WHERE ep.id = protocol_id AND ep.author_id = auth.uid())
    );

CREATE POLICY "Super Admins can insert reviews"
    ON public.protocol_reviews FOR INSERT
    WITH CHECK (public.is_super_admin(auth.uid()));

-- 6. Blood Donors Table
CREATE TABLE IF NOT EXISTS public.blood_donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    age INTEGER CHECK (age IS NULL OR (age >= 18 AND age <= 70)),
    gender VARCHAR(16) DEFAULT '',
    blood_group VARCHAR(8) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    rh_factor VARCHAR(8) NOT NULL DEFAULT 'POSITIVE' CHECK (rh_factor IN ('POSITIVE', 'NEGATIVE')),
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Pune',
    city TEXT NOT NULL DEFAULT '',
    pincode VARCHAR(10) DEFAULT '',
    area TEXT NOT NULL DEFAULT '',
    last_donation_date DATE,
    availability_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (availability_status IN ('ACTIVE', 'INACTIVE', 'TEMPORARILY_UNAVAILABLE', 'PENDING_VERIFICATION', 'SUSPENDED')),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED' 
        CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED')),
    preferred_contact_method VARCHAR(32) NOT NULL DEFAULT 'IN_APP' 
        CHECK (preferred_contact_method IN ('IN_APP', 'MASKED_PHONE', 'EMAIL')),
    emergency_contact TEXT DEFAULT '',
    consent_to_contact BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins manage all blood donors"
    ON public.blood_donors FOR ALL
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can manage own blood donor record"
    ON public.blood_donors FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public privacy-safe donor directory view"
    ON public.blood_donors FOR SELECT
    USING (
        availability_status = 'ACTIVE' 
        AND consent_to_contact = true
    );

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_role VARCHAR(32) DEFAULT 'ALL',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('DOCTOR_VERIFICATION', 'PROTOCOL', 'DONOR', 'SYSTEM', 'SECURITY')),
    reference_id TEXT DEFAULT '',
    reference_type TEXT DEFAULT '',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = recipient_user_id)
    WITH CHECK (auth.uid() = recipient_user_id);

CREATE POLICY "Super Admins can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (public.is_super_admin(auth.uid()) OR public.is_verified_doctor(auth.uid()));

-- 8. Admin Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'Super Admin',
    actor_role VARCHAR(32) NOT NULL DEFAULT 'super_admin',
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super Admins view audit logs"
    ON public.admin_audit_logs FOR SELECT
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "System logs audit records"
    ON public.admin_audit_logs FOR INSERT
    WITH CHECK (public.is_super_admin(auth.uid()) OR auth.uid() IS NOT NULL);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_doctor_status ON public.doctor_verifications(status);
CREATE INDEX IF NOT EXISTS idx_protocols_status ON public.emergency_protocols(status, category);
CREATE INDEX IF NOT EXISTS idx_protocols_author ON public.emergency_protocols(author_id);
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.blood_donors(blood_group, availability_status, district);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON public.admin_audit_logs(created_at DESC);
