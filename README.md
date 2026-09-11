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

---

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

<div align="center">
  Made with ❤️ for rural India | JeevanSetu — जीवन सेतु
</div>
