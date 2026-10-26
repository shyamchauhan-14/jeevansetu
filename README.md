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
git clone https://github.com/rohit2008-bit/hackathon.git
cd hackathon

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

## ☁️ Supabase Setup

The `medicine_reminders` table schema:
```sql
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'default_user',
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'night')),
    time TEXT NOT NULL,
    meal_instruction TEXT NOT NULL CHECK (meal_instruction IN ('before_meal', 'after_meal', 'with_meal')),
    last_taken_date TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read medicine_reminders" ON public.medicine_reminders FOR SELECT USING (true);
CREATE POLICY "Allow public insert medicine_reminders" ON public.medicine_reminders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update medicine_reminders" ON public.medicine_reminders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete medicine_reminders" ON public.medicine_reminders FOR DELETE USING (true);
```

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
