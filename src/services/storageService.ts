import { UserProfile, AssessmentHistoryEntry, MedicineReminder, HealthRecord, ReminderStatus } from '../types/health';
import { SupabaseService } from './supabaseClient';
import { AuthService } from './authService';

const STORAGE_KEYS = {
  PROFILE: 'jeevansetu_user_profile',
  HISTORY: 'jeevansetu_assessment_history',
  LANGUAGE: 'jeevansetu_selected_lang',
  SETTINGS: 'jeevansetu_app_settings',
  REMINDERS: 'jeevansetu_medicine_reminders',
  HEALTH_RECORDS: 'jeevansetu_health_records'
};

const DEFAULT_REMINDERS: MedicineReminder[] = [
  {
    id: 'med-1',
    name: 'Amlodipine (Blood Pressure)',
    dosage: '5mg - 1 Tablet',
    timeSlot: 'morning',
    time: '08:30',
    mealInstruction: 'after_meal',
    status: 'pending',
    isActive: true
  },
  {
    id: 'med-2',
    name: 'ORS / Hydration Salt',
    dosage: '1 Sachet with 1L Water',
    timeSlot: 'afternoon',
    time: '14:00',
    mealInstruction: 'with_meal',
    status: 'pending',
    isActive: true
  },
  {
    id: 'med-3',
    name: 'Multivitamin / Iron',
    dosage: '1 Tablet',
    timeSlot: 'night',
    time: '20:30',
    mealInstruction: 'after_meal',
    status: 'pending',
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

const DEFAULT_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec-1',
    userId: 'guest_local_user',
    recordType: 'allergy',
    title: 'Severe Penicillin Allergy',
    content: { reaction: 'Anaphylaxis / Hives', severe: true },
    provenance: 'patient_entered',
    createdAt: '2026-09-10T08:00:00Z'
  },
  {
    id: 'rec-2',
    userId: 'guest_local_user',
    recordType: 'condition',
    title: 'Hypertension (Stage 1)',
    content: { diagnosedBy: 'PHC Khed Medical Officer', reading: '138/88 mmHg' },
    provenance: 'clinician_verified',
    createdAt: '2026-08-20T10:30:00Z'
  }
];

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

  /* ── DIGITAL HEALTH RECORDS & PROVENANCE ── */

  public static getHealthRecords(): HealthRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS);
      return data ? JSON.parse(data) : DEFAULT_HEALTH_RECORDS;
    } catch {
      return DEFAULT_HEALTH_RECORDS;
    }
  }

  public static addHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt' | 'userId'>): HealthRecord {
    const user = AuthService.getCurrentUser();
    const newRecord: HealthRecord = {
      ...record,
      id: 'rec-' + Date.now().toString(36),
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const current = this.getHealthRecords();
    const updated = [newRecord, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newRecord;
  }

  public static deleteHealthRecord(id: string): void {
    const user = AuthService.getCurrentUser();
    const current = this.getHealthRecords();
    // Only delete if owner matches or local guest
    const updated = current.filter((r) => r.id !== id || (r.userId !== user.id && !user.isGuest));
    try {
      localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  /* ── MEDICINE REMINDERS & STATES ── */

  public static getReminders(): MedicineReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
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
      SupabaseService.deleteReminder(id).catch(() => {});
    } catch {
      // ignore
    }
  }

  public static updateReminderStatus(id: string, status: ReminderStatus): MedicineReminder | null {
    try {
      const current = this.getReminders();
      const reminder = current.find((r) => r.id === id);
      if (!reminder) return null;

      const todayStr = new Date().toISOString().split('T')[0];
      reminder.status = status;
      if (status === 'taken') {
        reminder.lastTakenDate = todayStr;
      }

      this.saveReminder(reminder);
      return reminder;
    } catch {
      return null;
    }
  }

  public static toggleReminderTaken(id: string): boolean {
    const reminders = this.getReminders();
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return false;

    const todayStr = new Date().toISOString().split('T')[0];
    const isTaken = reminder.status === 'taken' && reminder.lastTakenDate === todayStr;

    if (isTaken) {
      this.updateReminderStatus(id, 'pending');
      return false;
    } else {
      this.updateReminderStatus(id, 'taken');
      return true;
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

  /* ── DATA EXPORT & RIGHT-TO-BE-FORGOTTEN ── */

  public static exportHealthSummary() {
    const profile = this.getProfile();
    const reminders = this.getReminders();
    const records = this.getHealthRecords();
    const history = this.getHistory();

    return {
      exportedAt: new Date().toISOString(),
      disclaimer: 'Notice: This patient health summary is compiled from self-reported data and supportive triage records. It does not replace an official clinical health chart maintained by a healthcare provider.',
      patientProfile: profile,
      medicineSchedule: reminders.map((r) => ({
        name: r.name,
        dosage: r.dosage,
        schedule: r.timeSlot,
        time: r.time,
        instructions: r.mealInstruction,
        status: r.status || 'pending'
      })),
      verifiedHealthRecords: records,
      triageHistory: history
    };
  }

  public static deleteAllUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.HEALTH_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
}
