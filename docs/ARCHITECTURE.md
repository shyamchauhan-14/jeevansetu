# JeevanSetu 2.0 — Architecture & System Overview

## 1. System Vision & Context
JeevanSetu is a rural healthcare assistance platform designed for low-bandwidth, intermittent connectivity, and multilingual rural contexts in India. It assists patients, family caregivers, community health workers (ASHAs), and local healthcare facilities without replacing qualified medical professionals or claiming automated emergency dispatch.

## 2. Technical Stack
- **Frontend Core**: Vanilla TypeScript (5.3.3) + Vite (5.1.0) for zero-framework bloat, rapid boot time, and resilience on low-power mobile devices.
- **Client Routing**: Hash-based single page client-side router (`#/` paths) ensuring zero server route dependencies and full compatibility with static hosting (Vercel, GitHub Pages) and offline PWA service workers.
- **Design System & Styling**: Custom responsive CSS design system (`global.css`, `components.css`, `responsive.css`, `variables.css`) featuring high-contrast typography, bento-style card layouts, large accessible touch targets, and ARIA screen-reader labels.
- **Persistence & Cloud Sync**:
  - Dual-tier storage architecture: Client storage (IndexedDB / localStorage) + Supabase PostgreSQL.
  - Offline-first cache for static first-aid emergency protocols, healthcare facilities, and local symptom logs.
  - Versioned sync queue for offline edits with status states (`Local only`, `Pending sync`, `Synced`, `Sync failed`).
- **Identity & Security**:
  - Supabase Auth (JWT session management).
  - PostgreSQL Row Level Security (RLS) enforcing strict owner isolation (`auth.uid() = user_id`) and role-based access control (RBAC).
- **Speech & Multilingual**:
  - Web Speech API (Recognition + Synthesis) with seamless text-input fallbacks.
  - Review-validated clinical dictionaries in English, Hindi, and Gujarati.
- **Audio & Alerts**:
  - Native Web Audio API synthesis for chimes without network dependencies.
  - HTML5 Web Notification API for medicine reminders.

## 3. Module Architecture
1. **Core Navigation & App Canvas (`src/app.ts`, `src/layouts/AppLayout.ts`)**:
   Global shell, top navbar, bottom navigation bar, offline status banner, and global router.
2. **Symptom Triage Engine (`src/data/symptoms.ts`, `src/services/aiService.ts`, `src/pages/Symptoms.ts`, `src/pages/Assessment.ts`)**:
   Deterministic rule-based clinical decision matrix with immediate red-flag interruption, severity weighting, and clear medical disclaimers.
3. **Smart SOS Workflow (`src/pages/Emergency.ts`, `src/services/sosService.ts`)**:
   Intentional hold-to-activate emergency trigger, explicit location permission consent with manual fallback, truthful alert state machine, and trusted contacts management.
4. **Care Locator & Facility Finder (`src/data/healthcare.ts`, `src/services/healthcareService.ts`, `src/pages/CareLocator.ts`)**:
   Directory of PHCs, CHCs, sub-district hospitals, and pharmacies with verification timestamps, GPS distance sorting, locality search fallback, and user correction reporting.
5. **Digital Health Record & Reminders (`src/services/storageService.ts`, `src/pages/Profile.ts`, `src/pages/Reminders.ts`)**:
   Patient health summaries with provenance tagging, printable/PDF export, multi-slot medication schedules with taken/skipped/snooze statuses.
6. **Community Health Worker (ASHA) & Admin Workspace (`src/pages/WorkerWorkspace.ts`, `src/pages/AdminDashboard.ts`)**:
   Role-segregated workflows for patient registration, visit logs, consent management, facility verification, and anonymized aggregate signals.

