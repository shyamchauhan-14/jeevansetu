<div align="center">

<img src="public/logo.svg" alt="JeevanSetu Logo" width="120" />

# 🌿 JeevanSetu — AI-Powered Rural Health Companion

### Bridging the healthcare gap for rural India

**Right Care. Right Now.**

[Features](#-features) •
[Tech Stack](#️-tech-stack) •
[Getting Started](#-getting-started) •
[AI Integration](#-ai-integration) •
[Project Structure](#-project-structure) •
[Contributing](#-contributing)

</div>

---

## 🚀 What is JeevanSetu?

**JeevanSetu** (जीवन सेतु — "Health Bridge" in Hindi) is an AI-powered, mobile-first web application designed to help people in rural India assess their health symptoms and get actionable guidance — even with limited healthcare access.

It uses the **NVIDIA NIM AI platform** (`meta/llama-3.2-11b-vision-instruct`) to perform intelligent clinical triage, suggest safe home remedies for non-critical conditions, and direct patients with critical symptoms to emergency services immediately.

JeevanSetu guides a user from **describing symptoms** (text or voice) → **AI-driven triage** → a **clear action plan**: safe self-care, nearby facility discovery, or an emergency protocol. It is explicit about its limits — it **supports and informs**, but never replaces a doctor, diagnosis, or emergency service.

## ✨ Features

- 🤖 **AI-Powered Symptom Triage** — NVIDIA Llama AI analyzes symptoms for clinical risk
- 🚨 **Critical Emergency Detection** — red UI + 108/102 emergency call for life-threatening conditions
- 🌿 **Smart Home Remedies** — AI suggests safe, culturally appropriate home remedies for mild/moderate illness
- 🗺️ **PHC/CHC Locator** — find the nearest Primary/Community Health Centers
- 🌐 **Multilingual Support** — Hindi + English (i18n ready)
- 📱 **Mobile-First Design** — built for low-bandwidth, rural environments
- 🔒 **Privacy-First** — no personal data stored or transmitted
- 🎙️ **Voice Assistant** — voice-first, hands-free symptom entry with live transcription
- 📖 **Health Guide** — searchable, rural-focused health education library
- 🕒 **Health History** — track past assessments and results locally
- ♿ **Accessible by Design** — large tap targets, adjustable text size, offline-capable core screens

## 🧭 App Structure (13 Core Screens)

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Home Page | Landing screen, quick actions, emergency shortcut |
| 2 | Symptom Checker | Text/voice symptom entry with guided questions |
| 3 | AI Assessment | Processing/analysis state |
| 4 | Assessment Result | Urgency tier + guidance + next steps |
| 5 | Emergency Center | Grid of emergency protocols |
| 6 | Emergency Protocol | DO/DON'T steps for a specific emergency |
| 7 | Safe Temporary Care | Self-care guidance for minor issues |
| 8 | Health Guide | Educational health content library |
| 9 | Find Healthcare | Nearby facility search (list + map) |
| 10 | Voice Assistant | Voice-first symptom entry |
| 11 | Language Selection | Choose preferred regional language |
| 12 | Settings | Language, text size, privacy, permissions |
| 13 | Safety & Disclaimer | What the app is / is not, safety guidelines |

Full requirements and acceptance criteria for every screen are documented in [`docs/PRD.md`](docs/PRD.md) (or `docs/JeevanSetu_PRD.docx`).

## 🧠 AI Integration

JeevanSetu uses the **NVIDIA NIM API** with the `meta/llama-3.2-11b-vision-instruct` model for:

1. **Clinical triage** — determines whether symptoms indicate a CRITICAL, MODERATE, or LOW risk condition
2. **Home remedy generation** — suggests evidence-based home remedies for non-critical conditions
3. **Condition analysis** — lists possible conditions for doctor-consultation context

### Risk Levels

| Level | UI | Action |
|-------|-----|--------|
| 🔴 CRITICAL | Red emergency UI | Call 108 ambulance immediately |
| 🟡 MODERATE | Amber advisory | See a doctor within 24 hours |
| 🟢 LOW | Green wellness | Home remedies + rest |

### Critical Condition Keywords

Conditions such as **heart attack, stroke, snake bite, severe burns, drowning, spinal injury, meningitis, anaphylaxis, and eclampsia** are automatically flagged as CRITICAL regardless of the AI's own response.

## 🎨 Design System

| Role | Color | Usage |
|------|-------|-------|
| Ink | `#0F172A` | Top nav, footer, dark cards |
| Primary Green | `#16A34A` | Primary CTAs (Check Symptoms, Save, Next) |
| Teal | `#0D9488` | AI Assistant / voice features |
| Purple | `#7C3AED` | AI Assessment |
| Red | `#DC2626` | Emergency actions & alerts |
| Orange | `#EA580C` | Emergency Protocol |
| Amber | `#D97706` | Moderate urgency states |
| Pink | `#DB2777` | Safe Temporary Care |
| Blue | `#2563EB` | Find Healthcare, links, map markers |

**Typography:** a humanist sans-serif with strong Indic-script support (e.g., Noto Sans family), generous line height (1.4–1.6×), and a user-adjustable base size.

**Principles:** clarity over density, color-coded urgency (never color alone — always paired with icon + text), large touch targets, consistent per-category templates, calm non-clinical tone.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | TypeScript + Vite |
| Styling | Tailwind CSS with design tokens |
| Routing | Hash-based SPA routing |
| i18n | Custom lightweight i18n |
| AI | NVIDIA NIM API (`meta/llama-3.2-11b-vision-instruct`) |

## 🏁 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/shyamchauhan-14/jeevansetu.git
cd jeevansetu

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your NVIDIA API key

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure

```
jeevansetu/
├── src/
│   ├── components/       # Reusable UI components
│   ├── data/             # Symptom database & triage logic
│   ├── layouts/          # App shell layouts
│   ├── pages/             # Page components (Home, Assessment, Care, etc.)
│   ├── services/          # AI service (NVIDIA NIM integration)
│   ├── styles/            # CSS design system (tokens, animations)
│   ├── types/             # TypeScript interfaces
│   └── utils/             # i18n, helpers
├── public/                # Static assets
├── .env.example           # Environment variable template
├── index.html
└── vite.config.ts
```

## 🌍 Localization

JeevanSetu is designed for full app-wide localization (not just UI labels), starting with Hindi and English, selectable on first launch and any time from Settings.

## ♿ Accessibility

- WCAG 2.1 AA color contrast
- Adjustable text size, propagated app-wide
- Voice input/output as a first-class interaction mode
- Minimum 44×44pt tap targets
- Emergency Center and cached Health Guide content work fully offline

## ⚠️ Disclaimer

JeevanSetu provides educational and triage **guidance** only. It does **not** replace a doctor, diagnosis, or emergency medical service. If you or someone near you is experiencing a medical emergency, seek emergency care immediately.

## 🗺️ Roadmap

- [ ] Phase 1 — Foundation (Home, Language, Symptom Checker, Emergency Center)
- [ ] Phase 2 — Core Intelligence (AI Assessment, Assessment Result, Health History)
- [ ] Phase 3 — Reach & Access (Find Healthcare, Health Guide)
- [ ] Phase 4 — Accessibility & Voice (Voice Assistant, offline PWA hardening)
- [ ] Phase 5 — Future (teleconsultation, community health worker tools)

## 🤝 Contributing

Contributions are welcome! This is a hackathon project aimed at solving real healthcare access problems in rural India.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- **NVIDIA NIM** for providing the AI inference infrastructure
- **National Health Mission (India)** for PHC/CHC location data
- Rural health workers who inspired this project

## 👤 Authors

- **Chauhan Shyam** — Computer Engineering, Academic Major Project
- **Suthar Vaibhav** — Computer Engineering, Academic Major Project
- **Rohit Pawar** — Computer Engineering, Academic Major Project
- **Dhairya Parmar** — Computer Engineering, Academic Major Project
- **Abhay Joshi** — Computer Engineering, Academic Major Project

---

<div align="center">

Accessible Healthcare · Empowered Communities · Smarter Care · Healthier Tomorrow

Made with ❤️ for rural India | JeevanSetu — जीवन सेतु

</div>
