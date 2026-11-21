# JeevanSetu 2.0 — Features & User Flows

## 1. Feature Map & Modules

### 1.1 Smart SOS Emergency Assistance (`#/emergency`)
- **Intentional Trigger**: Press-and-hold (2-second hold timer) and instant fallback preventing accidental pocket dials.
- **Location Consent & Transparency**: Prompts user before accessing device GPS; pre-flight data transparency shows exactly what info will be shared. If denied, provides instant manual locality picker.
- **Official Emergency Numbers**: Preconfigured, verified numbers (108 Ambulance, 102 Maternal/Infant, 112 National Police/Emergency) with one-click direct dialing via telecom voice networks.
- **Truthful Status Tracker**: Tracks states accurately: `preparing` -> `alert_queued` -> `call_opened` -> `sent` / `resolved` / `cancelled`. Never claims false ambulance dispatch.
- **Trusted Contacts Alert**: Sends message alert via secure adapter (or displays clearly marked demo simulation mode when no SMS gateway is connected).

### 1.2 Symptom Assessment & Triage (`#/symptoms`, `#/assessment`)
- **Deterministic Versioned Rules**: Evaluates symptoms against audited rules (`v2.0.0-clinical-core`). Generative AI is constrained and strictly forbidden from altering deterministic red-flag thresholds.
- **Immediate Red-Flag Interruption**: High-risk selections (e.g. chest pain radiating to arm, snakebite, unconsciousness, severe hemorrhage, blue lips) immediately bypass further questions and present urgent emergency action instructions.
- **Missing-Answer Escalation**: Unanswered critical questions escalate safety risk tiers to prevent false negative reassurance.
- **Plain-Language Urgency Tiers**:
  - `CRITICAL`: Immediate emergency medical care required (Call 108 / nearest emergency hospital).
  - `MODERATE`: Seek clinical evaluation at PHC/CHC promptly (within 24 hours).
  - `LOW`: Safe supportive self-care guidance and monitoring.
- **Medical Disclaimer**: Prominent declaration that JeevanSetu provides supportive educational guidance and is not a clinical diagnosis.

### 1.3 Healthcare Facility Finder (`#/care-locator`)
- **Locality & GPS Search**: Sorts by GPS distance when permitted; falls back gracefully to taluka/village name search when location is disabled.
- **Verified Data Only**: Displays facility name, verified phone number, address, verified date, and source (`NHM Rural Registry`, `Directorate of Health Services`). Does not fabricate live bed counts or specialist availability.
- **Offline Caching**: Caches inspected facilities with visible stale-data timestamps.
- **Correction Reporting**: Allows users and health workers to report outdated phone numbers, changed operating hours, or missing emergency antivenom vials.

### 1.4 Digital Health Record & Reminders (`#/profile`, `#/reminders`)
- **Provenance Tagging**: Every record tracks origin (`patient_entered`, `worker_entered`, `clinician_verified`).
- **Medication Reminders**: Multi-slot reminders (`morning`, `afternoon`, `night`) with meal instructions and statuses (`taken`, `skipped`, `snoozed`, `pending`).
- **Native Chime & Web Notifications**: Web Audio API chime alerts and browser notifications without downloading bulky sound files.
- **Portable Health Summary Export**: Generates printable medical summary and JSON payload for doctor visits.
- **Right to Erasure (Wipe All Data)**: 1-click comprehensive local data purge for shared rural phones.

### 1.5 Community Health Worker (ASHA) Workspace (`#/worker`)
- **Assigned Patient Roster**: ASHA workers access only patients assigned to them with verified consent.
- **Consent Revocation**: Patients retain full autonomy to revoke worker consent anytime, immediately severing worker record access.
- **Visit Logs & Follow-up Notes**: Structured follow-ups for maternal care, immunization, and chronic disease adherence.

### 1.6 Voluntary Blood Donor Directory (`#/donors`)
- **Privacy First**: Zero public disclosure of donor home addresses or direct telephone numbers.
- **Masked Contact Requests**: In-app contact requests protect donor privacy while facilitating life-saving emergency transfusions.
- **Availability Toggle & Listing Withdrawal**: Donors can toggle their availability on/off or withdraw listing in one click.

### 1.7 Anonymized Community Health Trends (`#/trends`)
- **Early-Warning Syndromic Signals**: Aggregated cluster monitoring for waterborne, vector-borne, and seasonal respiratory illnesses.
- **Small-Cell Suppression**: Counts under 5 cases are suppressed (`< 5 cases (Suppressed)`) to prevent patient re-identification.
- **Clear Limitations**: Explicitly labels aggregate signals as surveillance indicators, never confirmed outbreak diagnoses.

### 1.8 Low-Connectivity & Offline-First Engine (`#/offline`)
- **Service Worker (`public/sw.js`)**: Caches core application shell, styles, and assets for offline execution.
- **Background Sync Queue (`src/services/offlineSyncService.ts`)**: Versioned transaction queue with states (`local_only`, `pending_sync`, `synced`, `sync_failed`, `conflict_detected`).
- **Offline Capability Matrix**: Clear transparency showing what functions offline vs what requires cellular voice or internet data.
- **Wipe Shared Device Cache**: Immediate cache flush for community kiosk safety.
- **13 Offline First-Aid Emergency Protocols**: Snakebites, CPR, burns, choking, heatstroke, and fractures available without data.

### 1.9 Role-Protected Governance & Audit Dashboard (`#/admin`)
- **Role Boundary Enforcement**: Strictly restricted to `administrator` and `clinician_reviewer` roles via Supabase RLS and `user_roles`.
- **Facility Verification Console**: Verify/revoke facility credentials and resolve crowdsourced correction reports.
- **Privacy-Preserved Incident Audit Trail**: Inspects emergency incident status transitions without leaking precise GPS coordinates or raw clinical chat payloads.
- **Public Health Signal Management**: Validate or close community syndromic cluster alerts.
- **RBAC Architecture Overview**: Interactive matrix explaining permissions across all 4 system roles.
