# 🌿 JeevanSetu — AI-Powered Rural Health Companion

<div align="center">
  <img src="public/logo.svg" alt="JeevanSetu Logo" width="120" />
  <h3>Bridging the healthcare gap for rural India</h3>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#ai-integration">AI Integration</a>
  </p>
</div>




## 🚀 What is JeevanSetu?

**JeevanSetu** (meaning "Health Bridge" in Hindi) is an AI-powered mobile-first web application designed to help people in rural India assess their health symptoms and get actionable guidance — even with limited healthcare access.

It uses the **NVIDIA NIM AI platform** (Llama 3.2 Vision Instruct) to perform intelligent clinical triage, provide home remedies for non-critical conditions, and direct critical patients to emergency services immediately.

## ✨ Features

- 🤖 **AI-Powered Symptom Triage** — NVIDIA Llama AI analyzes symptoms for clinical risk
- 🚨 **Critical Emergency Detection** — Red UI + 108/102 emergency call for life-threatening conditions
- 🌿 **Smart Home Remedies** — AI suggests safe, culturally appropriate home remedies for mild/moderate illness
- 🗺️ **PHC/CHC Locator** — Find nearest Primary/Community Health Centers
- 🌐 **Multilingual Support** — Hindi + English (i18n ready)
- 📱 **Mobile-First Design** — Built for low-bandwidth, rural environments
- 🔒 **Privacy-First** — No personal data stored or transmitted

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | TypeScript + Vite |
| AI Engine | NVIDIA NIM (meta/llama-3.2-11b-vision-instruct) |
| Styling | Vanilla CSS with design tokens |
| Routing | Hash-based SPA routing |
| i18n | Custom lightweight i18n |

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- NVIDIA NIM API key (free at [build.nvidia.com](https://build.nvidia.com))

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

## 🧠 AI Integration

JeevanSetu uses **NVIDIA NIM API** with the `meta/llama-3.2-11b-vision-instruct` model for:

1. **Clinical triage** — Determines if symptoms indicate a CRITICAL, MODERATE, or LOW risk condition
2. **Home remedy generation** — Suggests evidence-based home remedies for non-critical conditions
3. **Condition analysis** — Lists possible conditions for doctor consultation context

### Risk Levels

| Level | UI | Action |
|-------|-----|--------|
| 🔴 CRITICAL | Red emergency UI | Call 108 ambulance immediately |
| 🟡 MODERATE | Amber advisory | See doctor within 24 hours |
| 🟢 LOW | Green wellness | Home remedies + rest |

### Critical Condition Keywords

Conditions like **heart attack, stroke, snake bite, severe burns, drowning, spinal injury, meningitis, anaphylaxis, eclampsia** are automatically flagged as CRITICAL regardless of AI response.

## 📁 Project Structure

```
jeevansetu/
├── src/
│   ├── components/       # Reusable UI components
│   ├── data/             # Symptom database & triage logic
│   ├── layouts/          # App shell layouts
│   ├── pages/            # Page components (Home, Assessment, Care, etc.)
│   ├── services/         # AI service (NVIDIA NIM integration)
│   ├── styles/           # CSS design system (tokens, animations)
│   ├── types/            # TypeScript interfaces
│   └── utils/            # i18n, helpers
├── public/               # Static assets
├── .env.example          # Environment variable template
├── index.html
└── vite.config.ts
```

## 🤝 Contributing

Contributions are welcome! This is a hackathon project aimed at solving real healthcare access problems in rural India.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgements

- **NVIDIA NIM** for providing the AI inference infrastructure
- **National Health Mission (India)** for PHC/CHC location data
- Rural health workers who inspired this project

---

<div align="center"># JeevanSetu 🩺🌿

**AI-Powered Healthcare Support for Rural Communities**
*Bridging the gap to healthcare — Right Care. Right Now.*

JeevanSetu is a web application that helps people in rural and low-connectivity areas understand their symptoms, get clear urgency-based guidance, and connect to the nearest real-world care — in their own language, with or without an internet connection.

---

## 📖 Overview

Rural communities often face long distances to the nearest clinic, inconsistent connectivity, low digital/health literacy, and a lack of health tools in regional languages. JeevanSetu addresses this by guiding a user from **describing symptoms** (text or voice) → **AI-driven triage** → a **clear action plan**: safe self-care, nearby facility discovery, or a direct emergency protocol.

The app is explicit about its limits — it **supports and informs**, but never replaces a doctor, diagnosis, or emergency service.

## ✨ Key Features

- **Symptom Checker** — free-text or voice symptom entry with quick-select chips and guided follow-up questions
- **AI Assessment** — triages symptoms into a three-tier urgency result: 🟢 Low · 🟠 Moderate · 🔴 Critical
- **Emergency Center** — one-tap, offline-available protocols for critical situations (heart attack, stroke, snake bite, burns, and more)
- **Safe Temporary Care** — supportive self-care guidance for minor, non-emergency issues
- **Health Guide** — searchable, rural-focused health education library
- **Find Healthcare** — location-based directory of hospitals, PHCs, clinics, and pharmacies with list + map view
- **Voice Assistant** — voice-first, hands-free symptom entry with live transcription
- **Multilingual UI** — full app localization across multiple Indian regional languages
- **Patient Profile & Health History** — optional local-first storage of personal info and past assessments
- **Accessible by design** — large tap targets, adjustable text size, and offline-capable core screens

## 🧭 App Structure (15 Core Screens)

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
| 12 | Patient Profile | Personal & emergency contact info |
| 13 | Health History | Past assessments and results |
| 14 | Settings | Language, text size, privacy, permissions |
| 15 | Safety & Disclaimer | What the app is / is not, safety guidelines |

Full requirements and acceptance criteria for every screen are documented in [`docs/PRD.md`](docs/PRD.md) (or `docs/JeevanSetu_PRD.docx`).

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

See [`docs/PRD.md`](docs/PRD.md) §9 for the full UI/UX theme specification.

## 🏗️ Tech Stack

> _Update this section to match your actual implementation._

- **Frontend:** `<React / Next.js / etc.>`
- **Styling:** `<Tailwind CSS / etc.>`
- **AI/Triage Engine:** `<rules engine / LLM API / etc.>`
- **Voice:** `<Web Speech API / etc.>`
- **Maps & Location:** `<Google Maps / OpenStreetMap / etc.>`
- **Offline Support:** PWA / service worker for offline-first core screens
- **Backend / Storage:** `<local-first storage / API / database>`

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-org>/jeevansetu.git
cd jeevansetu

# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open `http://localhost:3000` in your browser.

## 📁 Project Structure

```
jeevansetu/
├── docs/
│   └── PRD.md              # Full Product Requirements Document
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/               # App screens (Home, Symptom Checker, etc.)
│   ├── assets/               # Icons, illustrations
│   └── locales/              # Language translation files
├── public/
└── README.md
```

## 🌍 Localization

JeevanSetu is designed for full app-wide localization (not just UI labels) across multiple Indian regional languages, selectable on first launch and any time from Settings.

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

Contributions are welcome! Please open an issue to discuss major changes before submitting a pull request.

## 📄 License

`<Add your license here — e.g., MIT>`

## 👤 Author

**Vaibhav** — Computer Engineering, Academic Major Project

---

<p align="center">Accessible Healthcare · Empowered Communities · Smarter Care · Healthier Tomorrow</p>

  Made with ❤️ for rural India | JeevanSetu — जीवन सेतु
</div>
