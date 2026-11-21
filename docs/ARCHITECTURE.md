# JeevanSetu 2.0 — Architecture & System Overview

## 1. System Vision & Context
JeevanSetu is a high-reliability rural healthcare platform engineered specifically for low-bandwidth, intermittent connectivity, and multilingual rural communities across India. It empowers patients, family caregivers, community health workers (ASHAs), and local rural healthcare facilities with clinical decision support, first-aid emergency workflows, offline medicine adherence, and public health cluster surveillance without replacing qualified medical officers or fabricating automated emergency dispatch.

## 2. Technical Stack
- **Frontend Core**: Vanilla TypeScript (5.3.3) + Vite (5.1.0) delivering sub-500KB production bundle size, instantaneous boot time, and resilience on entry-level Android and KaiOS smartphones.
- **Client Router**: Zero-dependency client-side hash router (`#/` paths), enabling instantaneous offline transitions and zero server configuration dependencies on static CDNs (Vercel, GitHub Pages).
- **Design System**: High-contrast, accessibility-audited CSS design system with bento-grid card structures, large 48px+ touch targets, and ARIA screen-reader labels.
- **Offline & Service Worker**:
  - Service Worker (`public/sw.js`) caching app shell, styles, and static assets.
  - Offline transaction sync queue (`OfflineSyncService`) with optimistic client versioning, idempotent retry handling, and server conflict detection.
- **Persistence & Cloud Sync**:
  - Dual-tier storage: Browser `localStorage` / `IndexedDB` paired with Supabase PostgreSQL.
  - Automatic cloud synchronization whenever network connectivity is restored.
- **Identity & RBAC Security**:
  - Supabase Auth (JWT session management) strictly deriving user identity from verified tokens.
  - PostgreSQL Row Level Security (RLS) enforcing least-privilege role boundaries across 4 distinct roles:
    1. `patient`
    2. `community_worker` (ASHA)
    3. `clinician_reviewer`
    4. `administrator`
- **Speech & Multilingual**:
  - Web Speech API (Recognition + Synthesis) with seamless keyboard text-input fallbacks.
  - Review-validated clinical dictionaries across English (`en`), Hindi (`hi`), Gujarati (`gu`), and Marathi (`mr`).
- **Audio & Alerts**:
  - Native Web Audio API synthesis generating high-audibility reminder chimes with zero audio file downloads.
  - HTML5 Web Notification API for scheduled medication alerts.

## 3. Module & Directory Architecture
```
jeevansetu/
├── public/
│   ├── favicon.svg
│   └── sw.js                           # Offline Service Worker (App shell & protocol cache)
├── src/
│   ├── app.ts                          # Main application entry point & event wiring
│   ├── router.ts                       # Zero-dependency client-side hash router
│   ├── data/                           # Clinical rulesets, facilities & first-aid data
│   │   ├── emergencies.ts              # 13 verified emergency first-aid protocols
│   │   ├── symptoms.ts                 # Versioned clinical triage decision matrix
│   │   ├── healthcare.ts               # Verified PHCs, CHCs & Sub-district hospitals
│   │   ├── care.ts                     # Supportive home care & safe first-aid guides
│   │   └── healthGuides.ts             # Community preventive health articles
│   ├── services/                       # Core service engines
│   │   ├── authService.ts              # Supabase auth, RBAC roles & audit event logging
│   │   ├── supabaseClient.ts           # Supabase client & owner-isolated cloud operations
│   │   ├── i18nService.ts              # Clinically validated multilingual localization
│   │   ├── aiService.ts                # Deterministic triage & LLM prompt constraints
│   │   ├── sosService.ts               # Truthful Smart SOS state machine & emergency dialers
│   │   ├── healthcareService.ts        # Facility discovery, offline cache & correction reporting
│   │   ├── storageService.ts           # Health records, provenance tracking & reminders
│   │   ├── communityService.ts         # ASHA patient roster, blood donors & health trends
│   │   ├── offlineSyncService.ts       # Offline sync queue, retry counters & conflict detection
│   │   └── voiceService.ts             # Multilingual speech recognition with manual fallback
│   ├── pages/                          # Page view components
│   │   ├── Home.ts                     # Main portal & quick action bento
│   │   ├── Symptoms.ts                 # Interactive symptom questionnaire & red flags
│   │   ├── Assessment.ts               # Triage results, urgency tier & emergency pathway
│   │   ├── Emergency.ts                # Smart SOS trigger, dialers (108/102/112) & contacts
│   │   ├── EmergencyProtocol.ts        # Step-by-step first-aid protocol viewer
│   │   ├── CareLocator.ts              # Hospital directory, service filters & corrections
│   │   ├── Reminders.ts                # Medicine schedule, dose tracker & chime alerts
│   │   ├── Profile.ts                  # Patient health records, export & data erasure
│   │   ├── WorkerWorkspace.ts          # ASHA worker patient roster & visit logs
│   │   ├── Donors.ts                   # Privacy-protected voluntary blood donor directory
│   │   ├── CommunityTrends.ts          # Small-cell suppressed public health trend signals
│   │   ├── Offline.ts                  # Offline directory, sync queue & capability matrix
│   │   └── AdminDashboard.ts           # Governance console, facility audit & incident logs
│   ├── components/                     # Reusable UI widgets & layouts
│   ├── utils/                          # Audio chime, notifications, DOM & formatting utilities
│   └── __tests__/                      # 9 Vitest automated test suites (49 passing tests)
├── supabase/
│   └── migrations/
│       └── 20261121000000_jeevansetu_core_schema.sql # Core PostgreSQL schema with strict RLS
└── docs/                               # Engineering & architectural documentation
```

## 4. Data Flow & Security Model
1. **User Request / Symptom Input**: Evaluated against deterministic clinical rules. If a red flag is detected (e.g. chest pain, snakebite), the triage engine halts normal evaluation immediately and triggers the emergency pathway.
2. **Emergency Incident**: State machine transitions from `preparing` -> `alert_queued` -> `call_opened`. Device dialer launches `tel:108`. No fake external dispatch is reported.
3. **Storage & Sync**: Records are saved locally to `localStorage` immediately, and an item is enqueued in `OfflineSyncService`. When online, background sync synchronizes records with Supabase tables protected by PostgreSQL RLS.
4. **ASHA Access**: ASHA workers query only patient records where `worker_assignments.status = 'active'` and `consent_granted = true`. If a patient revokes consent, access is severed immediately.
5. **Admin Audits**: Administrators inspect emergency incident lifecycle and facility corrections. Precise GPS coordinates and raw clinical chat dialogues are redacted from audit screens to protect patient privacy (aligned with DISHA guidelines).
