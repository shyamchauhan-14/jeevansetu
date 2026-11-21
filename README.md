# 🌱 JeevanSetu 2.0 — Right Care. Right Now.
### AI-Assisted Rural Healthcare Triage, First-Aid Emergency Guidance & Community Health Engine

[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.12-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tests: 49 Passing](https://img.shields.io/badge/Tests-49%20Passing-brightgreen.svg)](#-test-suite--quality-assurance)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **JeevanSetu ("Bridge to Life")** is a resilient, low-bandwidth healthcare assistance platform built for rural and underserved communities in India. Operating reliably under intermittent 2G/3G connectivity or complete offline states, it delivers deterministic symptom triage with clinical red-flag escalation, 13 life-saving first-aid emergency protocols, rural healthcare facility routing, multi-slot medicine reminders with native audio chimes, an ASHA community health worker workspace, a privacy-first blood donor directory, and role-protected clinical administration.

---

## 🧭 Project Blueprint & Documentation Index

Comprehensive technical specifications and architectural documentation:

| Document | Purpose & Description |
| :--- | :--- |
| 🏛️ [**Architecture & System Overview**](docs/ARCHITECTURE.md) | High-level system architecture, client routing, data flows, and module directory structure. |
| 🔐 [**Database Schema & Row Level Security**](docs/DATABASE_AND_RLS.md) | Complete PostgreSQL schema specification, least-privilege RBAC role model, and RLS policies. |
| 📱 [**Features & User Flows**](docs/FEATURES_AND_USER_FLOWS.md) | Detailed walkthrough of all 9 core features, triage pathways, and user interaction states. |
| 🧪 [**Test Plan & QA Verification**](docs/TEST_PLAN.md) | Vitest automated test suite catalog (49 tests), negative security tests, and evaluation checklists. |
| 🚀 [**Deployment & DevOps Guide**](docs/DEPLOYMENT.md) | Vercel production hosting, static CDN configuration, and environment setup. |
| ⚠️ [**Known Limitations & Scope Boundaries**](docs/KNOWN_LIMITATIONS.md) | Truthful clinical disclaimers, telecom dependencies, and privacy constraints. |

---

## ✨ Key Capabilities & Features

### 1. 🩺 Deterministic Symptom Triage (`#/symptoms`, `#/assessment`)
- **Versioned Clinical Rules (`v2.0.0-clinical-core`)**: Structured triage matrix covering fever, respiratory illness, acute chest pain, snakebites, head injuries, and pediatric hydration.
- **Immediate Red-Flag Interruption**: High-risk selections immediately halt questionnaires to deliver immediate emergency instructions.
- **Missing-Answer Escalation**: Unanswered questions escalate safety risk tiers to prevent false negative reassurance.
- **Strict Disclaimers**: Clarifies that triage is supportive guidance and does not replace medical diagnosis by a qualified doctor.

### 2. 🚨 Smart SOS Emergency Assistance (`#/emergency`)
- **Intentional Trigger**: 2-second press-and-hold trigger prevents pocket dials; pre-flight data dialog reveals exactly what is shared.
- **Truthful Status Tracker**: Tracks states accurately (`preparing` -> `alert_queued` -> `call_opened` -> `sent` / `resolved` / `cancelled`). Never fabricates live ambulance dispatch.
- **One-Click Telecom Dialers**: Direct hooks to verified emergency lines (**108** Ambulance, **102** Maternal/Infant, **112** National Emergency) that connect over standard mobile voice networks.
- **GPS Denial Fallback**: Instantly provides regional manual locality selector if user declines geolocation permission.

### 3. 📍 Rural Healthcare Facility Locator (`#/care-locator`)
- **Verified Facility Directory**: Primary Health Centres (PHCs), Community Health Centres (CHCs), and sub-district hospitals verified against the National Health Mission (NHM) Rural Registry.
- **Specialized Service Filters**: Search by Anti-Snake Venom, 24/7 Emergency Beds, Blood Storage, and Maternity Care.
- **Crowdsourced Correction Reports**: Patients and health workers can report outdated phone numbers, changed hours, or out-of-stock antivenom.
- **Offline Cache**: Recently viewed facilities are cached on-device with visible timestamps.

### 4. 💊 Digital Health Records & Medicine Reminders (`#/profile`, `#/reminders`)
- **Multi-Slot Schedule**: Medication tracking across Morning, Afternoon, and Night slots with meal instructions.
- **Status Tracking**: Log doses as `Taken`, `Skipped`, or `Snoozed`.
- **Native Web Audio Chimes & Notifications**: Synthetic chime alerts generated directly by browser audio hardware (no sound files to download) plus browser notifications.
- **Provenance & Export**: All medical entries tag author provenance (`patient_entered`, `worker_entered`, `clinician_verified`). One-click portable summary export.
- **Right to Erasure**: Complete local data wipe for users on shared community kiosk phones.

### 5. 👩‍⚕️ ASHA Community Health Worker Workspace (`#/worker`)
- **Consent-Protected Roster**: Community health workers access records only for assigned patients who have explicitly granted consent.
- **Instant Consent Revocation**: Patients can revoke consent at any time, instantly severing worker access to their personal records.
- **Home Visit Logs & Vitals**: Record blood pressure, blood glucose, temperature, and maternal visit notes.

### 6. 🩸 Voluntary Blood Donor Directory (`#/donors`)
- **Privacy Guaranteed**: Zero public exposure of donor telephone numbers or home addresses.
- **Masked Contact Requests**: In-app contact requests facilitate emergency blood coordination while shielding donor identity.
- **Availability Toggle**: Donors can pause their availability or withdraw their listing in one click.

### 7. 📈 Anonymized Community Health Trends (`#/trends`)
- **Syndromic Early Warning**: Aggregated surveillance signals for seasonal fevers, diarrheal clusters, and respiratory illnesses.
- **Small-Cell Suppression**: Counts under 5 cases are systematically masked (`< 5 cases (Suppressed)`) to prevent re-identification of patients in small villages.
- **Surveillance Disclaimer**: Explicitly labeled as surveillance indicators rather than confirmed epidemiological outbreak declarations.

### 8. 📶 Low-Connectivity & Offline-First Engine (`#/offline`)
- **Service Worker (`public/sw.js`)**: Caches app shell, styles, and static assets for instantaneous boot without connectivity.
- **Background Sync Queue (`OfflineSyncService`)**: Queues local edits with optimistic client versioning, idempotent retry tracking, and server conflict detection.
- **13 Cached Emergency Protocols**: Complete step-by-step guides for snakebites, CPR, burns, choking, heatstroke, and fractures available 100% offline.
- **Connectivity Capability Matrix**: Clear transparency showing what works offline vs what requires cellular voice or internet data.

### 9. 🛡️ Role-Protected Governance & Audit Dashboard (`#/admin`)
- **Enforced RBAC Access**: Strictly protected for `administrator` and `clinician_reviewer` roles via PostgreSQL Row Level Security.
- **Facility Verification Management**: Verify facility credentials and review/resolve crowdsourced correction reports.
- **Privacy-Preserved Incident Audits**: Inspects emergency incident lifecycle timestamps without exposing precise GPS coordinates or raw clinical chat transcripts.
- **Public Health Signal Management**: Validate or close community syndromic alerts.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Vanilla TypeScript 5.3.3 + Vite 5.4.21 (Sub-500KB bundle size, zero heavy UI framework overhead).
- **Client Routing**: Hash-based single page client router (`#/` paths) ensuring zero server routing dependencies and seamless offline PWA navigation.
- **Design System**: High-contrast, mobile-first responsive CSS with bento-grid card layouts, 48px+ touch targets, and WCAG AA color contrast.
- **Database & Identity**: Supabase PostgreSQL with Row Level Security (RLS) enforcing least-privilege access across 4 roles (`patient`, `community_worker`, `administrator`, `clinician_reviewer`).
- **Offline Storage**: Local storage + IndexedDB dual-tier persistence paired with a versioned background sync queue.
- **Audio & Speech**: Web Audio API frequency synthesis for lightweight chime alerts + Web Speech API with typing fallback.

---

## 🧪 Test Suite & Quality Assurance

JeevanSetu 2.0 maintains a comprehensive automated test suite powered by Vitest, verifying security boundaries, clinical safety rules, emergency state progressions, and offline queue operations.

### Run Tests Locally
```bash
# Run Vitest automated test suite
npm test

# Run TypeScript strict type verification
npm run typecheck

# Run production build
npm run build
```

### Automated Test Coverage (49 Passing Tests across 9 Suites)
```
 ✓ src/__tests__/offlineSync.test.ts   (6 tests)  - Queueing, idempotent sync, retry count, conflict resolution
 ✓ src/__tests__/symptoms.test.ts      (8 tests)  - Deterministic rules, red-flag override, missing-answer escalation
 ✓ src/__tests__/i18n.test.ts          (4 tests)  - Localization across English, Hindi, Gujarati, speech fallback
 ✓ src/__tests__/community.test.ts     (6 tests)  - ASHA consent, blood donor privacy, small-cell suppression
 ✓ src/__tests__/healthRecord.test.ts  (4 tests)  - Provenance tagging, dose tracking, portable export, data wipe
 ✓ src/__tests__/sos.test.ts           (5 tests)  - SOS state machine, location fallback, truthful status tracker
 ✓ src/__tests__/admin.test.ts         (6 tests)  - RBAC boundaries, facility verification, incident audit privacy
 ✓ src/__tests__/facilities.test.ts    (5 tests)  - Facility search, offline caching, correction reporting
 ✓ src/__tests__/security.test.ts      (5 tests)  - Session derivation, RBAC escalation block, ASHA query restriction

Test Files  9 passed (9)
     Tests  49 passed (49)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/shyamchauhan-14/jeevansetu.git
cd jeevansetu

# Install dependencies
npm install

# Setup environment configuration
cp .env.example .env
```

### Environment Configuration (`.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_TRANSLATION_API_URL=https://api.mymemory.translated.net/get
VITE_TRANSLATION_API_KEY=
```
*(Note: JeevanSetu gracefully operates in offline/local storage mode when Supabase credentials are not provided.)*

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Supabase PostgreSQL Setup & RLS Migrations

The database migration script is version-controlled at [`supabase/migrations/20261121000000_jeevansetu_core_schema.sql`](supabase/migrations/20261121000000_jeevansetu_core_schema.sql).

It creates 10 core tables with Row Level Security (RLS) enabled and owner-isolated policies:
1. `public.profiles`: Patient medical demographics and preferred language.
2. `public.user_roles`: RBAC roles (`patient`, `community_worker`, `administrator`, `clinician_reviewer`).
3. `public.emergency_contacts`: Trusted emergency contacts.
4. `public.emergency_incidents`: Emergency audit logs and dispatch lifecycle.
5. `public.symptom_assessments`: Triage records and clinical rule version tracking.
6. `public.medicine_reminders`: Multi-slot medication schedules and dose adherence.
7. `public.health_records`: Clinical entries with provenance tracking.
8. `public.facilities`: Verified hospital and clinic directory with service tags.
9. `public.worker_assignments`: ASHA patient roster and explicit consent flags.
10. `public.audit_events`: Immutable security and access event logs.

---

## 🚢 Production Deployment

JeevanSetu is optimized for zero-configuration deployment to static edge networks such as Vercel, Netlify, or Cloudflare Pages.

### Deploy to Vercel
```bash
npx vercel
```
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Project Settings.

---

## 📄 License
MIT License. Built for community health impact.
