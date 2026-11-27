import os
import re

def simplify_report():
    input_path = r'd:\jeevansetu\docs\JeevanSetu_Technical_Report.md'
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Chapter 1 Mermaid Flowchart (Lines ~39-48)
    flow_old_pattern = r'```mermaid\s*\nflowchart LR\s*\n[\s\S]*?```'
    flow_new = """| User / Entity | Primary Action & Input | System Processing & Clinical Safeguard | Resulting Healthcare Outcome |
| :--- | :--- | :--- | :--- |
| **Rural Citizen / Patient** | Long-presses Emergency SOS (2 seconds) | Native mobile SMS protocol composed with GPS coordinates | Real-world SMS opened on cellular network without cloud delay |
| **Symptom Inquirer** | Speaks or types symptoms in local language | Dual-stage AI NLP + deterministic red-flag emergency override | Immediate emergency guidance or verified care recommendations |
| **Medical Professional** | Submits credentials & statutory council ID | Super Admin manual verification against state medical councils | Verified Doctor status & Clinical Protocol authoring access |
| **Verified Doctor** | Authors first-aid protocols in clinical studio | Editorial review pipeline (Draft → Pending → Review) | Peer-reviewed life-saving emergency medical protocols |
| **Voluntary Blood Donor** | Enrolls with blood group & district | Contact masking algorithm (`+91 98220 •••• 90`) | Privacy-protected donor registry accessible in life-threatening needs |"""

    content = re.sub(flow_old_pattern, flow_new, content, count=1)

    # 2. Replace Chapter 2 Mermaid Architecture (Lines ~73-103)
    arch_old_pattern = r'```mermaid\s*\nflowchart TD\s*\n[\s\S]*?```'
    arch_new = """| Architectural Tier | Component Modules | Core Technologies | Primary Operational Responsibilities |
| :--- | :--- | :--- | :--- |
| **Tier 1: Presentation & User Experience** | `Navbar`, `Footer`, `AdminDashboard`, `DoctorPortal`, `AdminLogin`, `Donors`, `EmergencyProtocol` | HTML5, CSS3 Custom Properties (Design System), TypeScript DOM Engine | Responsive rendering across desktop, tablet, and low-end mobile browsers with sub-650KB bundle footprint and instant navigation. |
| **Tier 2: Business Logic & Clinical Security** | `authService`, `sosService`, `aiService`, `doctorVerificationService`, `emergencyProtocolService`, `bloodDonorService` | TypeScript 5.2, Web Speech API, Geolocation API, Cellular SMS Protocol | Role-based authorization, 2-second SOS hold logic, clinical triage safety overrides, phone masking, and protocol lifecycle enforcement. |
| **Tier 3: Persistence & Synchronized Storage** | `supabaseClient`, Supabase PostgreSQL 15, Browser LocalStorage Cache | PostgreSQL Relational Database, Row-Level Security (RLS), IndexedDB/LocalStorage | Multi-tier persistence ensuring immediate offline capability for rural users while maintaining server-side statutory audit trails. |"""

    content = re.sub(arch_old_pattern, arch_new, content, count=1)

    # 3. Replace Chapter 3 Class Diagram (The User's Uploaded Screenshot!)
    class_old_pattern = r'```mermaid\s*\nclassDiagram\s*\n[\s\S]*?```'
    class_new = """| Functional Capability & Feature | Super Administrator | Verified Doctor | Normal User / Citizen | Clinical Governance & Security Purpose |
| :--- | :---: | :---: | :---: | :--- |
| **Access Admin Dashboard & Analytics** | **Full Access** | Restricted | Restricted | Dedicated administrative interface for authority governance. |
| **Approve / Reject Doctor Verification** | **Authorized** | No Access | No Access | Prevents unaccredited individuals from practicing as doctors. |
| **Access Doctor Clinical Studio** | Restricted | **Full Access** | Restricted | Dedicated clinical workspace for protocol draft authoring. |
| **Author & Save Protocol Drafts** | Restricted | **Authorized** | No Access | Ensures only qualified medical professionals submit medical advice. |
| **Publish Emergency Protocols** | **Authorized** | Requires Admin Review | No Access | Dual-party sign-off preventing automated or unverified publications. |
| **View Unmasked Blood Donor Phone Numbers** | **Authorized (Audited)** | Restricted | Masked Only | Protects donor privacy (`+91 98220 •••• 90`) to prevent harassment. |
| **Trigger 2-Second Hold SOS Emergency** | Supported | Supported | **Full Access** | High-reliability emergency response available to every citizen. |
| **Access AI Symptom Triage with Overrides** | Supported | Supported | **Full Access** | Instant emergency identification with deterministic clinical overrides. |
| **User Role Management & Account Suspension** | **Authorized** | No Access | No Access | Immediate containment of suspicious accounts or fraudulent registrations. |"""

    content = re.sub(class_old_pattern, class_new, content, count=1)

    # 4. Replace Chapter 3 Database ER Diagram
    er_old_pattern = r'```mermaid\s*\nerDiagram\s*\n[\s\S]*?```'
    er_new = """| Entity (Table Name) | Primary Key | Foreign Keys & Relationships | Cardinality | Business Purpose & Integrity Rule |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | `id` (UUID) | None (Root Entity) | 1 : N with all tables | Master authentication and identity record storing email, role, and status. |
| **`doctor_applications`** | `id` (UUID) | `user_id` → `users.id` | 1 : 1 (Per Application) | Stores statutory council registration numbers, credentials, and review status. |
| **`emergency_protocols`** | `id` (UUID) | `author_id` → `users.id` | N : 1 (To Author) | Clinical protocols authored by verified doctors and published by administrators. |
| **`protocol_versions`** | `id` (UUID) | `protocol_id` → `emergency_protocols.id` | N : 1 (To Protocol) | Complete audit history tracking every editorial revision and change. |
| **`blood_donors`** | `id` (UUID) | `user_id` → `users.id` (Optional) | 1 : 1 (Per Donor) | Voluntary donor roster containing blood group, location, and privacy flags. |
| **`emergency_incidents`** | `id` (UUID) | `user_id` → `users.id` (Optional) | N : 1 (To User) | Immutable event log capturing SOS dispatches and dialer engagements. |
| **`admin_audit_logs`** | `id` (UUID) | `admin_id` → `users.id` | N : 1 (To Admin) | Non-repudiable audit trail of administrative approvals, rejections, and edits. |"""

    content = re.sub(er_old_pattern, er_new, content, count=1)

    # 5. Replace Chapter 4 ASCII Box Authority Portal Wireframe
    ascii_login_old = r'```\s*\n\s*┌─*┐\s*\n[\s\S]*?🛡️ JEEVANSETU AUTHORITY PORTAL[\s\S]*?└─*┘\s*\n```'
    login_new = """| UI Screen Component | Visual Layout & Position | User Inputs & Action Controls | Authentication Flow & Security Enforcement |
| :--- | :--- | :--- | :--- |
| **Role Selector Tabs** | Prominent pill selector at card header (`Super Admin` vs. `Verified Doctor`) | 1-click tab switching dynamically toggling field requirements | Distinct input validation logic matching user role credential requirements. |
| **Super Admin Authentication Tab** | Left tab (Active default on `#/login/admin`) | Email (`admin@jeevansetu.med`), Password (`Admin@123`), 1-Click Autofill Demo button | Authenticates against administrative role, generates secure session, redirects to `#/admin`. |
| **Doctor Authentication Tab** | Right tab (Active default on `#/login/doctor`) | Statutory Medical Council Reg No (e.g. `MMC-2008-041289`) or Email, Password (`Doctor@123`) | Verifies doctor accreditation status (`VERIFIED`), redirects to `#/doctor-portal`. |
| **Unregistered Doctor Link** | Bottom footer callout | "Not registered yet? Submit Medical Verification" link | Deep-links unverified doctors directly to the statutory credentialing registration form. |"""

    content = re.sub(ascii_login_old, login_new, content, count=1)

    # 6. Replace Chapter 5 SOS State Machine (stateDiagram-v2)
    sos_state_old = r'```mermaid\s*\nstateDiagram-v2\s*\n[\s\S]*?```'
    sos_state_new = """| State | Trigger Condition | Visual & Haptic Feedback | Safety Mechanism & Transition |
| :--- | :--- | :--- | :--- |
| **1. Idle / Standby** | User opens emergency view | Glowing pulsing red shield button labeled "Hold for 2s for SOS" | System monitors touch start and pointer down events; no alert sent. |
| **2. Holding (0.0s – 1.9s)** | User touches and holds button | Real-time circular progress sweep (0% to 100%) + haptic vibration (`[40, 60, 40]ms`) | If released before 2.0s, timer aborts instantly, preventing accidental false alarms. |
| **3. Hold Completed (2.0s)** | Continuous hold reaches 2000ms | Progress bar flashes green; distinct confirmation pulse | Triggers emergency dispatch sequence; locks button against duplicate taps. |
| **4. Location & Payload Assembly** | Immediate post-activation | "Acquiring GPS..." status badge | Queries browser Geolocation API with high accuracy; formats emergency SMS payload. |
| **5. Cellular SMS Launch** | Payload ready | System redirects to `sms:?body=...` | Opens native phone SMS app with pre-filled text and emergency contact number. |
| **6. Incident Logged** | Native app opened | Incident logged as `call_opened` / `sms_composed` | Truthful status recorded in audit trail; user returned to safety guidance screen. |"""

    content = re.sub(sos_state_old, sos_state_new, content, count=1)

    # 7. Replace Chapter 5 TypeScript SMS URI Code Snippet
    sms_ts_old = r'```typescript\s*\n// Verified implementation[\s\S]*?```'
    sms_ts_new = """- **Standardized URI Schema**: `sms:[RecipientNumber]?body=[URLEncodedPayload]`
- **Recipient Routing**: Defaults to the user's primary registered emergency contact number, with automatic fallback to national emergency dispatch (`112`).
- **Emergency Message Format**:
  `🚨 JEEVANSETU EMERGENCY SOS! Location: [Latitude, Longitude] (https://maps.google.com/?q=[Lat],[Lng]). Need immediate medical help. Dispatched at: [Timestamp].`
- **Native OS Execution**: Dispatched directly via browser window location navigation, launching the mobile operating system's native SMS messaging client without requiring internet connectivity or third-party paid SMS gateway subscriptions."""

    content = re.sub(sms_ts_old, sms_ts_new, content, count=1)

    # 8. Replace Chapter 6 Mermaid AI Triage Flowchart
    triage_old = r'```mermaid\s*\nflowchart TD\s*\n[\s\S]*?```'
    triage_new = """| Triage Stage | Analysis Mechanism | Input Conditions | Decision / Safety Action |
| :--- | :--- | :--- | :--- |
| **Stage 1: Deterministic Red-Flag Check** | Hardcoded medical rule engine (instant, offline-capable) | Symptoms containing chest pain, severe breathlessness, facial droop, unilateral arm weakness, heavy hemorrhage | **Immediate Emergency Override**: Flags as `EMERGENT`. Bypasses AI model entirely. Displays red emergency banner with 1-tap call to `112/108`. |
| **Stage 2: Clinical AI Assessment** | Multilingual NLP triage engine | General symptoms (fever, rash, mild headache, cough, minor injury) without red flags | **Structured Clinical Guidance**: Analyzes symptom duration and severity, categorizes as `MODERATE` or `ROUTINE`, and recommends appropriate local medical facilities. |
| **Multilingual Voice Support** | Web Speech API integration | Spoken inputs in Hindi, Marathi, Gujarati, and Indian English | Transcribes speech locally, normalizes colloquial terminology into standard clinical keywords before triage. |"""

    content = re.sub(triage_old, triage_new, content, count=1)

    # 9. Replace Chapter 7 Sequence Diagram Doctor Verification
    doc_seq_old = r'```mermaid\s*\nsequenceDiagram\s*\n[\s\S]*?```'
    doc_seq_new = """1. **Application Submission**: Doctor navigates to `#/doctor-portal`, completes statutory registration form with State Medical Council Name, Registration Number, Specialization, and qualification documents.
2. **Initial Status Assigned**: System records application in `doctor_applications` with status set to `PENDING`. Application is locked from authoring protocols.
3. **Administrative Discovery**: Super Administrator accesses Admin Dashboard (`#/admin`), reviews pending applications with document previews and council details.
4. **Independent Statutory Vetting**: Administrator verifies registration credentials against respective State Medical Council registries (e.g. Maharashtra Medical Council, Delhi Medical Council, or National Medical Commission).
5. **Decision & Notification**:
   - **Approved**: Status upgraded to `VERIFIED`. Doctor account role elevated to `verified_doctor`. Doctor gains full access to Clinical Protocol Studio.
   - **Changes Requested**: Status set to `UNDER_REVIEW`. Admin notes specifying required clarifications sent to doctor.
   - **Rejected**: Status set to `REJECTED` with specific rejection reason logged in audit trail."""

    content = re.sub(doc_seq_old, doc_seq_new, content, count=1)

    # 10. Replace Chapter 8 ASCII Box Clinical Protocol Studio
    ascii_studio_old = r'```\s*\n\s*┌─*┐\s*\n[\s\S]*?STRUCTURED CLINICAL PROTOCOL AUTHORING STUDIO[\s\S]*?└─*┘\s*\n```'
    studio_new = """| Studio Section | Clinical Fields Included | Mandatory / Optional | Medical Safety Purpose |
| :--- | :--- | :---: | :--- |
| **Section 1: Clinical Identification** | Protocol Title, Emergency Category (Cardiac, Stroke, Burns, Trauma, etc.), Short Summary | Mandatory | Categorizes protocol for rapid keyword search and emergency indexing. |
| **Section 2: Identification & Signs** | Warning Signs, Emergency Symptoms, High-Risk Vulnerabilities | Mandatory | Assists first responders in accurately identifying the medical crisis. |
| **Section 3: Emergency Action Steps** | Immediate Safety Measures, Step-by-Step Response (Numbered), Required First-Aid Supplies | Mandatory | Provides clear, non-technical instructions for laypersons during crisis. |
| **Section 4: Contraindications ("Do NOT")** | Dangerous Actions, Common Folklore Myths, Prohibited Interventions | Mandatory | Prevents harmful traditional practices (e.g., placing objects in seizure patient's mouth). |
| **Section 5: Professional Escalation** | When to Call Emergency (112), Target Audience, Supporting Literature / Clinical References | Mandatory | Clearly marks boundary between first aid and mandatory hospital treatment. |"""

    content = re.sub(ascii_studio_old, studio_new, content, count=1)

    # 11. Replace Chapter 9 Blood Donor Privacy Flowchart
    donor_flow_old = r'```mermaid\s*\nflowchart LR\s*\n[\s\S]*?```'
    donor_flow_new = """| User Identity / Role | Displayed Phone Number Format | Displayed Address | Access Permission Level | Privacy Protection Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **General Public / Normal User** | `+91 98220 •••• 90` *(Fuzzed)* | City, District & Pincode Only | Search & Masked View | Middle 4 digits cryptographically masked to eliminate spam and harassment. |
| **Emergency Requester (With Consent)** | Masked until emergency request confirmed | Area & City Only | Authorized Request | Direct contact requires two-party emergency consent confirmation. |
| **Super Administrator** | Unmasked (Full 10 digits via `👁 Reveal`) | Full Registered Address | Audited Administrative Access | Every reveal action logged with timestamp and admin ID in `admin_audit_logs`. |
| **Registered Donor (Self)** | Full unmasked view of own profile | Full Address (Self Only) | Self-Service Update | Donors can update availability status or withdraw registration at any time. |"""

    content = re.sub(donor_flow_old, donor_flow_new, content, count=1)

    # 12. Replace Chapter 10 Vitest Bash Terminal Dump
    bash_old = r'```bash\s*\n> jeevansetu@1.0.0 test[\s\S]*?```'
    bash_new = """| Test Suite (#) | Target Module & Domain | Scenarios Tested | Execution Time | Verification Status |
| :---: | :--- | :--- | :---: | :---: |
| **Suite 1** | `offlineSync.test.ts` | Local queueing, offline storage, bi-directional sync | 36 ms | **PASSED (6/6)** |
| **Suite 2** | `symptoms.test.ts` | Multilingual triage, red-flag emergency overrides | 234 ms | **PASSED (8/8)** |
| **Suite 3** | `healthRecord.test.ts` | Local health record encryption, patient privacy | 82 ms | **PASSED (4/4)** |
| **Suite 4** | `community.test.ts` | Community health worker sync, field records | 109 ms | **PASSED (6/6)** |
| **Suite 5** | `sos.test.ts` | 2s hold timer, cellular SMS dispatch, dialer states | 736 ms | **PASSED (6/6)** |
| **Suite 6** | `admin.test.ts` | Administrative audit trail, incident logging, privacy | 418 ms | **PASSED (6/6)** |
| **Suite 7** | `facilities.test.ts` | Facility locator, offline caching, distance sort | 45 ms | **PASSED (5/5)** |
| **Suite 8** | `adminMedicalManagement.test.ts` | Super admin login, doctor verification, protocol governance | 743 ms | **PASSED (18/18)** |
| **Suite 9** | `i18n.test.ts` | Localization (Hi, Mr, Gu, En), emergency phrasing | 25 ms | **PASSED (4/4)** |
| **Suite 10** | `security.test.ts` | XSS sanitization, RLS policies, phone number masking | 19 ms | **PASSED (5/5)** |
| **TOTAL** | **10 Test Suites** | **Comprehensive Full-System Verification** | **2.45 s** | **PASSED (68/68 - 100%)** |"""

    content = re.sub(bash_old, bash_new, content, count=1)

    # Save to both target locations
    targets = [
        r'd:\jeevansetu\docs\JeevanSetu_Technical_Report.md',
        r'C:\Users\krish\.gemini\antigravity\brain\b48e624f-a3a4-421d-b252-3f8a9bc45581\JeevanSetu_Technical_Report.md'
    ]
    for t in targets:
        with open(t, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {t}")

if __name__ == '__main__':
    simplify_report()
