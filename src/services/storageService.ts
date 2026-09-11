import { UserProfile, AssessmentHistoryEntry } from '../types/health';

const STORAGE_KEYS = {
  PROFILE: 'jeevansetu_user_profile',
  HISTORY: 'jeevansetu_assessment_history',
  LANGUAGE: 'jeevansetu_selected_lang',
  SETTINGS: 'jeevansetu_app_settings'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Ramesh Patil',
  age: 48,
  sex: 'male',
  villageTown: 'Khed',
  district: 'Pune',
  pincode: '410501',
  emergencyContactName: 'Sunita Patil (Wife)',
  emergencyContactPhone: '+91 98221 44556',
  knownAllergies: 'Penicillin, Dust allergy',
  existingConditions: 'Hypertension (Mild)',
  currentMedications: 'Amlodipine 5mg OD'
};

const DEFAULT_HISTORY: AssessmentHistoryEntry[] = [
  {
    id: 'hist-1',
    date: '12 Sep 2026, 10:30 AM',
    symptoms: ['High Fever', 'Severe Cough'],
    riskLevel: 'LOW',
    headline: 'Low Urgency — Seasonal Viral Discomfort',
    actionTaken: 'Home hydration & paracetamol support advised'
  },
  {
    id: 'hist-2',
    date: '28 Aug 2026, 04:15 PM',
    symptoms: ['Chest Pain / Pressure', 'Dizziness / Fainting'],
    riskLevel: 'CRITICAL',
    headline: 'Possible Cardiac Distress — Emergency Care',
    actionTaken: 'Ambulance 108 summoned to CHC Manchar'
  },
  {
    id: 'hist-3',
    date: '14 Jul 2026, 09:00 AM',
    symptoms: ['Persistent Vomiting', 'Abdominal Pain'],
    riskLevel: 'MODERATE',
    headline: 'Clinical Evaluation Advised Within 24h',
    actionTaken: 'Visited PHC Khed for rehydration evaluation'
  }
];

export class StorageService {
  public static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  public static getHistory(): AssessmentHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  }

  public static addHistoryEntry(entry: AssessmentHistoryEntry): void {
    try {
      const current = this.getHistory();
      const updated = [entry, ...current];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }

  public static getLanguage(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch {
      return 'en';
    }
  }

  public static setLanguage(code: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    } catch {
      // ignore
    }
  }
}
