# JeevanSetu 2.0 — Database Schema & Row Level Security (RLS) Specification

## 1. Security Architecture
All tables storing user, health, contact, incident, or worker assignment data must have PostgreSQL Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) strictly enabled. No public CRUD policies (`USING (true)`) are permitted.

## 2. Role Model (RBAC)
- `patient`: Can manage their own profile, reminders, assessments, emergency contacts, and personal health summary. Cannot view other users' records.
- `community_worker` (ASHA): Can view and create visit notes only for explicitly assigned and consented patients.
- `administrator`: Can manage facility verifications, system roles, and view aggregated de-identified metrics and incident audit logs.
- `clinician_reviewer`: Can review clinical decision rules and flagged assessment records.

## 3. Data Tables Specification

### 3.1 `profiles`
- `id` (UUID, Primary Key, references `auth.users(id)`)
- `display_name` (TEXT)
- `preferred_language` (VARCHAR(10) DEFAULT 'en')
- `age` (INTEGER)
- `sex` (VARCHAR(20))
- `village_town` (TEXT)
- `district` (TEXT)
- `pincode` (VARCHAR(10))
- `created_at` (TIMESTAMPTZ DEFAULT now())
- `updated_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Users can read and update only their own profile (`id = auth.uid()`).

### 3.2 `user_roles`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID, references `auth.users(id)`)
- `role` (TEXT CHECK (role IN ('patient', 'community_worker', 'administrator', 'clinician_reviewer')))
- `granted_by` (UUID REFERENCES `auth.users(id)`)
- `created_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Only administrators or service roles can grant or revoke roles. Users can read their own assigned roles.

### 3.3 `emergency_contacts`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID, references `auth.users(id)`)
- `name` (TEXT NOT NULL)
- `phone` (TEXT NOT NULL)
- `relationship` (TEXT)
- `consent_status` (TEXT CHECK (consent_status IN ('pending', 'granted', 'revoked')) DEFAULT 'pending')
- `created_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Strict owner isolation (`user_id = auth.uid()`).

### 3.4 `emergency_incidents`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID references `auth.users(id)`, NULLABLE for local/guest incidents)
- `status` (TEXT CHECK (status IN ('not_started', 'preparing', 'call_opened', 'alert_queued', 'sent', 'failed', 'resolved', 'cancelled')))
- `locality` (TEXT)
- `location_lat` (NUMERIC(9,6))
- `location_lng` (NUMERIC(9,6))
- `alert_status` (TEXT)
- `created_at` (TIMESTAMPTZ DEFAULT now())
- `resolved_at` (TIMESTAMPTZ)
*RLS*: Owner can read/update their incidents; administrators can read for emergency coordination.

### 3.5 `symptom_assessments`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID references `auth.users(id)`)
- `symptoms` (JSONB NOT NULL)
- `duration` (TEXT)
- `severity` (TEXT)
- `risk_level` (TEXT CHECK (risk_level IN ('CRITICAL', 'MODERATE', 'LOW')))
- `outcome` (JSONB NOT NULL)
- `rule_version` (VARCHAR(50) NOT NULL)
- `created_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Strict owner isolation (`user_id = auth.uid()`).

### 3.6 `medicine_reminders`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID references `auth.users(id)`)
- `medicine_name` (TEXT NOT NULL)
- `dosage` (TEXT NOT NULL)
- `time_slot` (TEXT CHECK (time_slot IN ('morning', 'afternoon', 'night')))
- `time` (TIME NOT NULL)
- `meal_instruction` (TEXT CHECK (meal_instruction IN ('before_meal', 'after_meal', 'with_meal')))
- `status` (TEXT CHECK (status IN ('pending', 'taken', 'skipped', 'snoozed')) DEFAULT 'pending')
- `last_taken_date` (DATE)
- `is_active` (BOOLEAN DEFAULT true)
- `created_at` (TIMESTAMPTZ DEFAULT now())
- `updated_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Strict owner-only access (`user_id = auth.uid()`).

### 3.7 `health_records`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID references `auth.users(id)`)
- `record_type` (TEXT CHECK (record_type IN ('allergy', 'condition', 'medication', 'visit_note', 'assessment_summary')))
- `title` (TEXT NOT NULL)
- `content` (JSONB NOT NULL)
- `provenance` (TEXT CHECK (provenance IN ('patient_entered', 'worker_entered', 'clinician_verified', 'provider_imported')))
- `created_at` (TIMESTAMPTZ DEFAULT now())
*RLS*: Owner can read/write. Assigned workers can view only with active consent.

### 3.8 `facilities`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `name` (TEXT NOT NULL)
- `facility_type` (TEXT NOT NULL)
- `address` (TEXT NOT NULL)
- `locality` (TEXT NOT NULL)
- `phone` (TEXT NOT NULL)
- `services` (JSONB)
- `is_open_24x7` (BOOLEAN DEFAULT false)
- `has_ambulance` (BOOLEAN DEFAULT false)
- `has_emergency_beds` (BOOLEAN DEFAULT false)
- `source` (TEXT NOT NULL)
- `verified_at` (TIMESTAMPTZ)
*RLS*: Public read access for verified records; admin-only insert/update/delete.
