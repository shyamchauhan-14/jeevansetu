import { UserProfile, AssessmentHistoryEntry, MedicineReminder } from '../types/health';
import { SupabaseService } from './supabaseClient';

const STORAGE_KEYS = {
  PROFILE: 'jeevansetu_user_profile',
  HISTORY: 'jeevansetu_assessment_history',
  LANGUAGE: 'jeevansetu_selected_lang',
  SETTINGS: 'jeevansetu_app_settings',
  REMINDERS: 'jeevansetu_medicine_reminders'
};

const DEFAULT_REMINDERS: MedicineReminder[] = [
  {
    id: 'med-1',
    name: 'Amlodipine (Blood Pressure)',
    dosage: '5mg - 1 Tablet',
    timeSlot: 'morning',
    time: '08:30',
    mealInstruction: 'after_meal',
    isActive: true
  },
  {
    id: 'med-2',
    name: 'ORS / Hydration Salt',
    dosage: '1 Sachet with 1L Water',
    timeSlot: 'afternoon',
    time: '14:00',
    mealInstruction: 'with_meal',
    isActive: true
  },
  {
    id: 'med-3',
    name: 'Multivitamin / Iron',
    dosage: '1 Tablet',
    timeSlot: 'night',
    time: '20:30',
    mealInstruction: 'after_meal',
    isActive: true
  }
];

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

  /* ── MEDICINE REMINDERS & SUPABASE SYNC ── */

  public static getReminders(): MedicineReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with defaults if empty
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
      // Async background sync to Supabase for initial defaults
      this.syncDefaultsToSupabase(DEFAULT_REMINDERS);
      return DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  }

  public static saveReminder(reminder: MedicineReminder): void {
    try {
      const current = this.getReminders();
      const index = current.findIndex((r) => r.id === reminder.id);
      let updated: MedicineReminder[];

      if (index >= 0) {
        updated = [...current];
        updated[index] = reminder;
      } else {
        updated = [reminder, ...current];
      }

      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));

      // Async sync with Supabase
      SupabaseService.upsertReminder(reminder).catch(() => {});
    } catch {
      // ignore
    }
  }

  public static deleteReminder(id: string): void {
    try {
      const current = this.getReminders();
      const updated = current.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));

      // Async sync with Supabase
      SupabaseService.deleteReminder(id).catch(() => {});
    } catch {
      // ignore
    }
  }

  public static toggleReminderTaken(id: string): boolean {
    try {
      const current = this.getReminders();
      const reminder = current.find((r) => r.id === id);
      if (!reminder) return false;

      const todayStr = new Date().toISOString().split('T')[0];
      const wasTakenToday = reminder.lastTakenDate === todayStr;

      reminder.lastTakenDate = wasTakenToday ? undefined : todayStr;
      this.saveReminder(reminder);
      return !wasTakenToday;
    } catch {
      return false;
    }
  }

  public static async syncFromSupabase(): Promise<MedicineReminder[]> {
    try {
      const remote = await SupabaseService.fetchReminders();
      if (remote && remote.length > 0) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(remote));
        return remote;
      }
    } catch (err) {
      console.warn('[StorageService] Supabase sync failed, using local:', err);
    }
    return this.getReminders();
  }

  private static async syncDefaultsToSupabase(reminders: MedicineReminder[]): Promise<void> {
    for (const rem of reminders) {
      await SupabaseService.upsertReminder(rem);
    }
  }
}

