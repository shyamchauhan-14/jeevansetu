# jeevansetu

PRODUCT REQUIREMENTS DOCUMENT
JeevanSetu
AI-Powered Healthcare Support for Rural Communities
Tagline: "Bridging the Gap to Healthcare"  |  "Right Care. Right Now."
Complete Web Application — UI/UX Structure, 15 Key Pages, Symptoms-to-Care Journey
Document Type	Product Requirements Document (PRD)
Product	JeevanSetu — Rural Healthcare Support Platform
Version	1.0 (Draft)
Date	September 11, 2026
Author / Owner	Vaibhav — Computer Engineering, Academic Major Project
Status	For Review
 
 
1. Executive Summary
JeevanSetu is an AI-powered healthcare support web application designed to bridge the healthcare gap for rural and low-connectivity communities. The platform guides a user from describing symptoms in plain language or voice, through an AI-driven triage assessment, to a clear urgency-based action plan — self-care guidance, nearest-facility discovery, or direct emergency protocols. The experience is built around simplicity, offline resilience, multilingual access, and trust: the app is explicit that it supports and informs, but never replaces a doctor, diagnosis, or emergency service.
This PRD documents the complete product scope across 15 core screens, functional and non-functional requirements, the visual design system observed in the reference UI structure, information architecture, key user flows, and success metrics, to guide design and engineering execution.
2. Problem Statement
•	Rural communities often lack easy access to timely medical guidance, with the nearest qualified facility frequently hours away.
•	Low digital and health literacy makes existing health apps — built for urban, English-first, high-bandwidth users — difficult to use.
•	Users struggle to judge the urgency of their symptoms, leading to either dangerous delays in emergencies or unnecessary travel for minor issues.
•	Network connectivity in rural areas is inconsistent, and most digital health tools assume constant connectivity.
•	Language is a major barrier: most health information and apps are not available in regional Indian languages.
3. Goals & Objectives
3.1 Product Goals
•	Give any user, in their own language, a fast and trustworthy first read on "how serious is this, and what should I do next."
•	Reduce delay in seeking care for genuine emergencies through a dedicated, always-accessible Emergency Center.
•	Reduce unnecessary travel/costs for minor ailments through safe, guided home-care advice.
•	Connect users to the nearest appropriate real-world healthcare facility.
•	Work reliably in low-literacy, low-bandwidth, multilingual, voice-preferred contexts.
3.2 Success Metrics (KPIs)
Metric	Target / Rationale
Symptom-check completion rate	> 80% of started checks reach a result screen
Time to Emergency Center from any screen	≤ 2 taps from anywhere in the app
Language coverage	≥ 6 Indian languages at launch
Offline usability	Core screens (Home, Emergency, cached Health Guide) usable with no network
User-perceived clarity	≥ 90% of test users correctly restate the recommended next action after seeing a result
Facility discovery success	≥ 75% of users find a relevant nearby facility within 30 seconds
4. Target Users & Personas
4.1 Primary Users
•	Rural residents with limited or no access to nearby clinics/hospitals.
•	Users with basic smartphone literacy but low comfort with English-only or text-heavy interfaces.
•	Caregivers (parents, family members) seeking guidance for a child, elderly relative, or dependent.
•	Community health workers who may use the app to support triage decisions in the field.
4.2 Representative Personas
Persona	Context	Core Need
Ramesh, 45, farmer	Village 18 km from nearest hospital, moderate literacy, Hindi speaker	Quickly know if chest discomfort needs a hospital visit tonight or can wait
Sita, 32, mother	Caring for a feverish child, intermittent 2G connectivity	Simple, safe home-care steps and warning signs to watch for
Community Health Worker	Supports multiple households, needs quick protocol reference	Fast access to standardized emergency DO/DON'T steps
5. Scope
5.1 In Scope (v1)
•	15 core pages as documented in Section 7.
•	Text- and voice-based symptom intake with guided follow-up questions.
•	Rule-based / AI-assisted triage producing a three-tier urgency result (Low, Moderate, Critical).
•	Static, versioned Emergency Protocol library (offline-cached).
•	Facility directory with search, filter, list + map view (real or mock data source).
•	Multi-language UI (Indian regional languages) with a first-run language selector.
•	Optional patient profile and health history, stored locally or in a lightweight backend.
•	Accessibility features: large tap targets, adjustable text size, voice input/output.
5.2 Out of Scope (v1)
•	Definitive medical diagnosis or prescription of medication dosages.
•	Direct teleconsultation / video calls with licensed doctors (candidate for v2).
•	Payment processing, insurance integration, or e-pharmacy ordering.
•	Electronic Health Record (EHR) integration with government/hospital systems (candidate for future phase).
6. Information Architecture
The app is organized around a single core journey — Symptoms → AI Assessment → Guided Action — with three always-reachable global destinations: Emergency Center, Find Healthcare, and Voice Assistant. Supporting utility screens (Profile, History, Settings, Language, Safety) sit under a persistent side/utility navigation.
Primary Navigation Group
•	Home → Symptom Checker → AI Assessment → Assessment Result → (Emergency Protocol | Safe Temporary Care | Find Healthcare)
Global Persistent Access (available from every screen)
•	Emergency Center (red, high-contrast entry point)
•	Talk to AI / Voice Assistant
•	Find Healthcare
Utility / Account Group
•	Language Selection → Patient Profile → Health History → Settings → Safety & Disclaimer
7. Page-by-Page Functional Requirements
The table below summarizes all 15 screens; detailed requirements for each follow.
#	Page	Purpose	Accent Color
1	Home Page	Landing screen with hero proposition, quick-action cards, emergency access shortcut, and a snapshot of how the platform works.	Green (primary) on Ink header
2	Symptom Checker	Free-text/voice symptom entry with quick-select common-symptom chips and guided follow-up questions.	Blue accents, Green CTA
3	AI Assessment (Processing)	Friendly loading/progress state while the AI analyzes symptoms, comparing them with medical knowledge.	Purple
4	Assessment Result	Presents urgency tier (Low / Moderate / Critical), what-to-do guidance, watch-for signs, and next-step actions.	Green (Low) / Amber (Moderate) / Red (Critical)
5	Emergency Center	Grid of one-tap emergency protocols (Heart Attack, Stroke, Snake Bite, Burns, etc.) for critical situations.	Red (Ink header)
6	Emergency Protocol (Detail)	Condition-specific DO / DON'T guidance, step-by-step first-aid instructions, and a direct Call Emergency action.	Orange / Red
7	Safe Temporary Care	Supportive self-care guidance for minor, non-emergency conditions while arranging medical advice.	Pink
8	Health Guide	Searchable educational library of rural-focused health topics: symptoms, first aid, prevention, nutrition, maternal & child health.	Teal
9	Find Healthcare	Location-based directory of hospitals, PHCs, clinics, and pharmacies with list + map view, filters, and call/directions actions.	Blue
10	Voice Assistant	Voice-first conversational entry point for describing symptoms hands-free, with live transcription and type-instead fallback.	Purple / Teal
11	Language Selection	First-run and settings-accessible screen to choose one of multiple Indian regional languages.	Blue
12	Patient Profile	Optional personal and emergency-contact information used to personalize assessments and enable quick emergency dialing.	Green
13	Health History	Chronological log of past symptom checks and assessments with urgency badges and detail drill-down.	Orange / Amber badges
14	Settings	Central control panel for language, text size, voice settings, permissions, privacy, and account/app info.	Ink / Neutral
15	Safety & Disclaimer	Transparent statement of what JeevanSetu is/is not, safety guidelines, privacy information, and emergency escalation reminder.	Red banner on Ink
7.1 Home Page
Functional Requirements
•	Hero section stating the value proposition ("Right Care. Right Now.") with a one-line explanation of the product.
•	Primary CTA: "Check Your Symptoms" (green, high-contrast, top of fold).
•	Secondary CTA: "Emergency Help" (red, always visible, no scroll required).
•	Quick-action icon row: Talk to AI, Find Healthcare, Safe Temporary Care, Health Guide.
•	"How it works" section (3–4 step visual explainer) for first-time users.
•	Persistent safety disclaimer footer/link.
•	Top bar: menu, app logo, search icon, notification/info icon — consistent across all pages.
Acceptance Criteria
•	Emergency Help is reachable within 1 tap from Home at all times.
•	Page renders and is usable on a 3G connection within 3 seconds (cached shell).
7.2 Symptom Checker
Functional Requirements
•	Free-text input field with placeholder example text ("I have fever and cough...").
•	Voice input toggle (microphone icon) as an alternate entry method.
•	Quick-select chips for common symptoms (Fever, Cough, Headache, Stomach pain, Breathing difficulty, Vomiting, Dizziness, Weakness, Rash, Injury).
•	Support for multi-select of symptom chips plus free text combined.
•	Guided follow-up questions triggered dynamically based on initial input (e.g., duration, severity, associated symptoms).
•	Progress indicator showing steps remaining.
•	"Next" primary action button, disabled until minimum required input is provided.
Acceptance Criteria
•	User can complete symptom entry using only chip taps (no typing required).
•	Follow-up questions are contextual to the selected symptom(s), not a fixed generic list.
7.3 AI Assessment (Processing State)
Functional Requirements
•	Friendly, non-technical loading animation communicating: analyzing symptoms → checking warning signs → comparing with medical knowledge → preparing guidance.
•	Step-by-step progress indicator (checklist style) so the wait feels transparent.
•	Processing must complete or gracefully time out within a bounded window (target ≤ 8 seconds); show a reassuring message if it runs long.
•	Must function acceptably on low-end devices (lightweight animation, no heavy media).
Acceptance Criteria
•	No dead-end: on failure/timeout, user is routed to a fallback (retry or Emergency Center if critical symptoms were flagged pre-processing).
7.4 Assessment Result
Functional Requirements
•	Clear urgency banner with one of three states: Low (green), Moderate (amber), Critical (red), each with an icon and one-line summary.
•	"What you can do" actionable checklist (e.g., rest, hydrate, monitor, OTC guidance where appropriate).
•	"Watch for these signs" list of escalation red flags specific to the reported symptoms.
•	Explicit statement that this is guidance, not a diagnosis.
•	Two primary actions: "Save Result" and "Find Nearby Care" (or "Get Emergency Help" when Critical).
•	Result is persisted to Health History automatically.
Acceptance Criteria
•	A Critical result must surface an emergency action as the visually dominant CTA and should deep-link directly into the relevant Emergency Protocol when identifiable.
•	Every result includes at least one monitoring/escalation cue, never a bare "you're fine."
7.5 Emergency Center
Functional Requirements
•	High-contrast, distraction-free layout headlined "Need Help Right Now?".
•	Grid of emergency categories with icons: Heart Attack, Stroke, Snake Bite, Breathing Problem, Severe Bleeding, Burns, Poisoning, Unconsciousness, Seizure (extensible list).
•	One tap from grid item to the corresponding Emergency Protocol detail page.
•	Fully available offline via cached content.
•	Reachable from a persistent global entry point on every screen of the app.
Acceptance Criteria
•	Screen loads and is interactive with zero network connectivity.
•	All tap targets meet a minimum size suitable for stressed/shaking-hand use (≥ 44x44pt).
7.6 Emergency Protocol (Detail)
Functional Requirements
•	Condition-specific header with severity color coding (e.g., Snake Bite — "Get Medical Help Immediately").
•	Two-column DO / DON'T list using consistent iconography (check / cross).
•	Numbered "While waiting for help" step sequence.
•	Primary red "Call Emergency" action (device dialer / local emergency number integration).
•	Secondary "Find Nearest Hospital" action linking to Find Healthcare pre-filtered to Hospitals.
•	Template must be reusable/consistent across all emergency types for predictability under stress.
Acceptance Criteria
•	Call Emergency initiates a native call flow (or clearly displays the number) with a single tap.
•	Content available offline for all listed emergency categories.
7.7 Safe Temporary Care
Functional Requirements
•	Condition header (e.g., Fever) with a reassuring, non-alarming tone.
•	"What may help" guidance list (rest, fluids, permitted OTC guidance, home comfort measures).
•	"What to avoid" list (e.g., don't overuse antibiotics, don't self-medicate long-term).
•	"When to see a doctor" escalation triggers, and a "Warning signs" callout distinct from routine guidance.
Acceptance Criteria
•	Every Safe Temporary Care page includes an explicit escalation path back into Assessment Result / Emergency Center if symptoms worsen.
7.8 Health Guide
Functional Requirements
•	Search bar for topics, symptoms, or questions.
•	Category shortcuts: Symptoms, First Aid, Prevention, Nutrition, Maternal Health, Child Health, Common Illnesses, Emergency Signs.
•	Article-style content cards with plain-language explanations, rural-context relevance.
•	Content is versioned and cacheable for offline reading.
•	Editorially expandable — new articles can be added without a UI redesign.
Acceptance Criteria
•	Search returns relevant results for both medical terms and lay symptom descriptions (e.g., "loose motion" maps to diarrhea content).
7.9 Find Healthcare
Functional Requirements
•	Search by location (village/town/PIN code) plus "use current location" option.
•	Facility-type filter chips: All, Hospital, PHC, Clinic, Pharmacy.
•	Combined list + map view with distance, open/closed status, and emergency-service availability badge.
•	Per-facility Call and Directions quick actions.
•	Must degrade gracefully to a cached/static facility list when map tiles or live location are unavailable.
Acceptance Criteria
•	Results are sorted by distance by default.
•	Facilities flagged "Emergency: Yes" are visually distinguished from those without emergency services.
7.10 Voice Assistant
Functional Requirements
•	Large, centered microphone control with a clear listening/active state indicator.
•	Real-time (or near-real-time) transcription of spoken input.
•	"Type instead" fallback always visible for users who prefer/need text.
•	Support for regional-language speech input matching the user's selected language.
•	Routes captured input into the same Symptom Checker / AI Assessment pipeline as text entry.
Acceptance Criteria
•	A user can complete an entire symptom check using voice only, with no required text input.
•	Clear visual and (where supported) audio feedback confirms when listening starts/stops.
7.11 Language Selection
Functional Requirements
•	Grid of large, tappable language cards showing language name in its own script (e.g., English, गुजराती, हिन्दी, मराठी, বাংলা, কন্নড, తెలుగు, ਪੰਜਾਬੀ).
•	Selection applies immediately app-wide (full i18n coverage, not just labels).
•	Accessible from both first-run onboarding and Settings at any time.
•	No mandatory account/sign-up gating this screen.
Acceptance Criteria
•	Switching language mid-session preserves the user's current place in any in-progress flow (e.g., an in-progress Symptom Checker).
7.12 Patient Profile
Functional Requirements
•	Optional fields: full name, age, gender, village/location.
•	Emergency contact name and phone number.
•	Known allergies and conditions (free text or tag-based).
•	"Save Profile" action; profile is optional and the app remains fully usable without one.
•	No mandatory sign-up required for basic app use.
Acceptance Criteria
•	All fields are optional except none are strictly required to save; an empty profile is a valid state.
7.13 Health History
Functional Requirements
•	Reverse-chronological list of past assessments: date, primary symptom(s), urgency badge (color-coded), "View" action.
•	Detail drill-down reproducing the original Assessment Result content.
•	Data stored locally by default, with optional sync if a backend/account exists.
•	History entries are automatically created from every completed Assessment Result.
Acceptance Criteria
•	Urgency badges use the same three-tier color coding as Assessment Result for consistency.
7.14 Settings
Functional Requirements
•	Language selector shortcut (links to Language Selection).
•	Text size control (at minimum: Small / Normal / Large).
•	Voice settings (input sensitivity / output on-off).
•	Location permission management.
•	Emergency contacts management (links to/extends Patient Profile).
•	Privacy & Data controls, including an option to clear local history.
•	Accessibility options and "About JeevanSetu" info link.
Acceptance Criteria
•	Text size changes apply globally and persist across sessions.
7.15 Safety & Disclaimer
Functional Requirements
•	"What JeevanSetu Is" and "What JeevanSetu Is Not" plain-language sections.
•	Prominent callout: if experiencing a medical emergency, seek emergency care immediately (independent of app guidance).
•	Privacy & Data summary and link to full policy.
•	Contact/support information.
•	Linked from Home footer, Settings, and shown contextually on first launch (onboarding acknowledgment).
Acceptance Criteria
•	First-time users must view or acknowledge this screen (or an equivalent onboarding summary) before completing their first Symptom Checker session.
8. Key User Flows
8.1 Primary Flow — Symptom to Guidance
Home → Symptom Checker → AI Assessment → Assessment Result → [Low: Safe Temporary Care | Moderate: Health Guide + Find Healthcare | Critical: Emergency Protocol]
8.2 Emergency-First Flow
Any Screen → Emergency Center → Emergency Protocol → Call Emergency / Find Nearest Hospital
8.3 Voice-First Flow
Home → Voice Assistant → (spoken symptoms transcribed) → AI Assessment → Assessment Result
8.4 Facility Discovery Flow
Home / Assessment Result → Find Healthcare → Filter by type → Select facility → Call or Get Directions
8.5 Onboarding Flow (First Launch)
Language Selection → Safety & Disclaimer (acknowledgment) → Home → (optional) Patient Profile
9. UI / UX Design Theme
The visual language is optimized for clarity, urgency-legibility, and trust in low-literacy and stress-prone contexts (a user checking symptoms may be anxious or in pain). Design principles below are derived directly from the reference UI structure.
9.1 Design Principles
•	Clarity over density: one primary action per screen, generous spacing, minimal text.
•	Color-coded urgency: color is used consistently as a semantic signal (green = safe/low, amber = caution/moderate, red = emergency/critical), never purely decorative.
•	Category color-coding: each major section of the app (Symptom Checker, AI Assessment, Emergency, Care, Guide, Find Healthcare, Voice) owns a distinct accent color so users build spatial/color memory of where they are.
•	High-contrast, large touch targets: designed for outdoor visibility, older users, and low-end device screens.
•	Iconography-first: icons paired with short labels reduce reliance on reading ability.
•	Consistent templates: Emergency Protocol, Safe Temporary Care, and Health Guide pages reuse the same structural template per category for predictability.
•	Calm, non-clinical tone: rounded cards, soft shadows, friendly micro-copy ("Tell me what's happening") rather than cold clinical language.
9.2 Color System
Role	Hex	Usage
Ink / Header-Footer	#0F172A	Top nav bar, footer, dark cards (Safety & Disclaimer, headings)
Primary Green	#16A34A	Primary CTAs — Check Symptoms, Save, Next, Call-to-action buttons
Teal	#0D9488	AI Assistant / Voice features, processing states, assistant accents
Purple	#7C3AED	AI Assessment category card, secondary AI touchpoints
Red	#DC2626	Emergency actions, high-urgency alerts, Call Emergency buttons
Orange	#EA580C	Emergency Protocol category, step-by-step warnings
Amber / Yellow	#D97706	Moderate urgency states, medical-advice badges
Pink	#DB2777	Safe Temporary Care category
Blue	#2563EB	Find Healthcare, links, map markers, informational icons
Neutral Gray	#334155 / #F1F5F9	Body text / card backgrounds and section fills
Success Green (light)	#DCFCE7	Low-urgency result banners, confirmation states
9.3 Typography
Role	Guidance
Primary typeface	A humanist sans-serif with strong multilingual/Indic-script support (e.g., Noto Sans / Noto Sans + regional Noto variants, or Inter for Latin script paired with Noto for Indic scripts)
Display / Hero	Bold, 28–36pt equivalent, high contrast against background
Section headings	Semi-bold, 18–22pt equivalent, brand ink or category accent color
Body text	Regular, 14–16pt equivalent minimum for readability; user-adjustable via Settings text-size control
Labels / captions	Medium weight, 12–13pt equivalent, used sparingly
Line height	Generous (1.4–1.6x) to support lower-literacy reading comfort
9.4 Component Library
•	Top App Bar: menu icon, logo/wordmark, search, info/notification icon — persistent across pages.
•	Primary Button: filled, category or semantic color, rounded corners, full-width on mobile.
•	Secondary / Outline Button: bordered, used for alternate or lower-priority actions.
•	Symptom / Category Chip: pill-shaped, tappable, multi-select capable, icon optional.
•	Status Banner: colored background (green/amber/red) with icon, title, and short description — used in Assessment Result.
•	DO / DON'T List Item: check-mark (green) or cross-mark (red) prefix with short instruction text.
•	Facility Card: name, distance, open/closed and emergency-availability badges, call and directions icon buttons.
•	Emergency Grid Tile: icon + label, red/orange accent, large tap area, used on Emergency Center.
•	Progress Indicator: dot or step-based, used in Symptom Checker and AI Assessment.
•	Voice Orb: large circular animated control indicating idle / listening / processing states.
9.5 Iconography & Imagery
•	Simple, universally recognizable line/duotone icons for symptoms, emergencies, and facility types.
•	Avoid culturally specific or ambiguous imagery; prefer widely understood medical/first-aid pictograms.
•	No photographic imagery of medical trauma; illustrative, non-graphic style throughout.
9.6 Layout & Responsiveness
•	Mobile-first single-column layouts; card-grid patterns collapse gracefully to a single column on narrow viewports.
•	Map + list views on Find Healthcare stack vertically on mobile, side-by-side on larger viewports.
•	Fixed/sticky primary CTA at the bottom of scrollable content-heavy screens (e.g., Health Guide articles).
9.7 Accessibility
•	WCAG 2.1 AA color contrast minimum across all semantic color states.
•	Adjustable text size (Settings) propagated across the entire app, not just select screens.
•	Full voice input/output support as a first-class interaction mode, not an afterthought.
•	Minimum 44x44pt tap targets; no interaction that requires precise multi-touch gestures.
•	All color-coded urgency states are paired with icon + text, never color alone.
10. Non-Functional Requirements
Category	Requirement
Performance	Core shell (Home, Emergency Center) interactive within 3s on 3G; cached assets served instantly offline
Offline Support	Emergency Center, Emergency Protocols, and previously viewed Health Guide content must work with no network connectivity
Localization	Full UI and content localization (not just labels) for ≥ 6 Indian languages at launch, extensible architecture for more
Accessibility	WCAG 2.1 AA; voice-first support; adjustable text size
Reliability	AI Assessment must fail safely — timeouts/errors never block access to Emergency Center
Privacy & Security	Health data encrypted at rest and in transit; local-first storage option; no mandatory account creation for core safety features
Scalability	Facility directory and Health Guide content must be manageable/updatable without app redeployment (CMS-backed or config-driven)
Device Support	Optimized for low-end Android devices and small/low-resolution screens common in target regions
Compliance	Clear, prominent medical disclaimer; guidance content reviewed for alignment with recognized public-health sources
11. Technical Considerations
•	AI Assessment engine: symptom-to-triage logic can start as a rules/decision-tree engine and evolve to an LLM-assisted model; critical-symptom keyword flags should short-circuit directly toward Emergency Center regardless of full assessment completion.
•	Offline-first architecture: service-worker/local caching (PWA) recommended so Emergency content and previously loaded Health Guide articles work without connectivity.
•	Voice pipeline: speech-to-text for input, with language selection driving the recognition locale; text-to-speech as a stretch goal for output accessibility.
•	Maps/location: Find Healthcare should tolerate missing/low-precision GPS and allow manual location entry (village/PIN) as the primary path in low-signal areas.
•	Data storage: local-first (on-device) storage for Profile and Health History by default, with optional cloud sync if/when accounts are introduced.
•	Content management: Health Guide and Emergency Protocol content should be structured/config-driven so medical content can be updated and reviewed without app releases.
12. Risks & Assumptions
12.1 Risks
•	Over-reliance risk: users may treat AI guidance as diagnosis; mitigated by persistent disclaimers and mandatory escalation cues on every result.
•	Content accuracy risk: incorrect or outdated medical guidance could cause harm; requires clinical review process for all Health Guide and Emergency Protocol content.
•	Connectivity risk: AI Assessment requiring network access may fail in low-signal areas; mitigated by offline Emergency Center and local fallback logic.
•	Language coverage risk: incomplete translation could exclude the very users the product targets; requires translation QA per language before launch.
12.2 Assumptions
•	Target users have access to a basic smartphone, even if intermittently connected.
•	A directory of real or representative nearby facilities can be sourced or approximated for the target rural regions.
•	Emergency calling can integrate with locally relevant emergency numbers (e.g., 108/112 in India) where applicable.
13. Roadmap / Milestones (Indicative)
Phase	Scope
Phase 1 — Foundation	Home, Language Selection, Safety & Disclaimer, Settings, Symptom Checker (text-only), Emergency Center + Protocols (static, offline)
Phase 2 — Core Intelligence	AI Assessment engine, Assessment Result, Safe Temporary Care, Health History, Patient Profile
Phase 3 — Reach & Access	Find Healthcare (list + map), Health Guide content library, additional language packs
Phase 4 — Accessibility & Voice	Voice Assistant, text-to-speech, expanded accessibility settings, offline PWA hardening
Phase 5 — Future (Post-v1)	Teleconsultation, community health worker tools, EHR/government system integration
14. Open Questions
•	Which specific Indian languages are prioritized for launch, in what order?
•	Will facility data be sourced from a live government/partner API, or curated/mock data for the initial release?
•	What is the intended AI Assessment backend (rules engine, third-party medical AI, or a fine-tuned LLM), and what clinical validation is required before launch?
•	Is user account creation planned for any future phase (for cross-device history sync), or does the product remain local-first indefinitely?
15. Appendix
15.1 Reference Source
This PRD is derived from the reference UI/UX structure mockup “JeevanSetu — AI-Powered Healthcare Support for Rural Communities,” covering all 15 key pages from Home Page through Safety & Disclaimer.
15.2 Brand Footer Values
•	Accessible Healthcare
•	Empowered Communities
•	Smarter Care
•	Healthier Tomorrow
