# 🌱 JeevanSetu — Right Care. Right Now.
### AI-Powered Rural Healthcare Triage, Emergency Protocols & Medicine Reminders

[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **JeevanSetu** bridges the healthcare divide for rural and underserved communities in India. Designed for low bandwidth and intermittent connectivity, it provides instant AI symptom triage, verified life-saving emergency first-aid protocols, offline healthcare facility routing, and bilingual medicine reminders.
> 
> 📄 **Product Requirements Document (PRD)**: [JeevanSetu_PRD.docx](https://github.com/user-attachments/files/32094947/JeevanSetu_PRD.docx)

---

## 🌟 Key Features

- **🩺 Intelligent Symptom Triage**: Fast, structured risk-level assessment (Low, Moderate, Critical) with actionable advice and red-flag warnings.
- **🚨 24/7 Rapid Emergency First Aid**: Step-by-step verified emergency workflows for snakebites, chest pain/heart attacks, severe bleeding, heatstroke, burns, and fractures.
- **💊 Medicine Reminders & Adherence Tracker**:
  - Organized by morning, afternoon, and night slots.
  - Native Web Audio chime alert and browser notifications.
  - Quick presets for common rural prescriptions (Paracetamol, ORS, BP tablets, etc.).
  - **Live Supabase Cloud Sync** with seamless offline fallback.
- **📍 Rural Care Locator**: Find nearest Primary Health Centres (PHC), Community Health Centres (CHC), and 24/7 pharmacies with 1-click GPS navigation.
- **🎙️ Multilingual Voice Assistant**: Natural voice interaction in Hindi, Gujarati, Marathi, and English.
- **📶 100% Offline-First Architecture**: Core first aid, emergency protocols, and local medicine tracking continue to function without internet connectivity.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Vanilla TypeScript + Vite (Lightning-fast load times, zero framework bloat)
- **Styling**: Tailored design system with bento-grid cards and high-contrast typography
- **State & Storage**: Dual-tier storage (`localStorage` + `Supabase`)
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Audio & Alerts**: Native Web Audio API synthesis (zero audio downloads needed) + Web Notification API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/shyamchauhan-14/jeevansetu.git
cd jeevansetu

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Environment Configuration (`.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_TRANSLATION_API_URL=https://api.mymemory.translated.net/get
VITE_TRANSLATION_API_KEY=
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

---

## ☁️ Supabase Setup & Migrations

Database migrations and secure Row Level Security (RLS) policies are version-controlled in [`supabase/migrations/20261121000000_jeevansetu_core_schema.sql`](supabase/migrations/20261121000000_jeevansetu_core_schema.sql).

All user health records, symptom logs, emergency contacts, and medicine reminders enforce strict owner-isolated RLS:
```sql
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reminders"
    ON public.medicine_reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
    ON public.medicine_reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```
See [`docs/DATABASE_AND_RLS.md`](docs/DATABASE_AND_RLS.md) for full schema definitions and role model.

---

## 🚢 Deploy to Vercel

### Method 1: Using Vercel CLI
```bash
npx vercel
```

### Method 2: Import via Vercel Dashboard
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add the Environment Variables from your `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. Click **Deploy**!

---

## 📄 License
MIT License. Built for community health impact.
