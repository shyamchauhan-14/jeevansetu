# JeevanSetu 2.0 — Features & User Flows

## 1. Feature Map & Modules

### 1.1 Smart SOS Emergency Assistance
- **Intentional Trigger**: Press-and-hold (or 2-step confirmation) preventing accidental pocket dials.
- **Location Consent**: Prompts user before fetching device GPS. If denied, provides instant manual locality picker.
- **Official Emergency Numbers**: Preconfigured, verified numbers (108 Ambulance, 102 Maternal/Infant, 112 National Police/Emergency).
- **Truthful Status Tracker**: Tracks states accurately: `Not started` -> `Preparing` -> `Call option opened` -> `Alert queued` -> `Sent/Failed` -> `Resolved`. Never claims false ambulance dispatch.
- **Trusted Contacts Alert**: Sends message alert via secure adapter (or displays clearly marked demo simulation mode when no SMS gateway is connected).

### 1.2 Symptom Assessment & Triage
- **Deterministic Versioned Rules**: Evaluates symptoms against audited rules (`v2.0-clinical-core`). Generative AI is constrained and forbidden from altering deterministic red-flag thresholds.
- **Immediate Red-Flag Interruption**: High-risk selections (e.g. chest pain radiating to arm, snakebite, unconsciousness, severe hemorrhage) immediately bypass further questions and present urgent emergency action instructions.
- **Plain-Language Urgency Tiers**:
  - `CRITICAL`: Immediate emergency medical care required (Call 108 / nearest emergency hospital).
  - `MODERATE`: Seek clinical evaluation at PHC/CHC promptly (within 24 hours).
  - `LOW`: Safe supportive self-care guidance and monitoring.
- **Medical Disclaimer**: Clear declaration that JeevanSetu provides supportive guidance and is not a clinical diagnosis.

### 1.3 Healthcare Facility Finder
- **Locality & GPS Search**: Sorts by GPS distance when permitted; falls back gracefully to taluka/village name search when location is disabled.
- **Verified Data Only**: Displays facility name, verified phone number, address, verified date, and source. Does not fabricate live bed counts or specialist availability.
- **Offline Caching**: Caches inspected facilities with visible stale-data timestamps.
- **Correction Reporting**: Allows users and health workers to report outdated phone numbers or changed operating hours.

### 1.4 Digital Health Record & Reminders
- **Provenance Tagging**: Every record tracks origin (`patient_entered`, `worker_entered`, `clinician_verified`).
- **Medication Reminders**: Multi-slot reminders (`morning`, `afternoon`, `night`) with meal instructions and statuses (`taken`, `skipped`, `snoozed`).
- **PDF Export**: Generates printable medical summary for doctor visits.

### 1.5 Community Health Worker (ASHA) Workspace
- **Assigned Patient Roster**: ASHA workers access only patients assigned to them with verified consent.
- **Visit Logs & Follow-up Tasks**: Structured follow-ups for maternal care, immunization, and chronic disease adherence.

### 1.6 Multilingual & Voice Accessibility
- **Target Languages**: Reviewed translations for English, Hindi (हिन्दी), and Gujarati (ગુજરાતી).
- **Voice Recognition with Text Fallback**: Detects Web Speech API support; displays intuitive text-typing fallback if speech input is unsupported or denied.
