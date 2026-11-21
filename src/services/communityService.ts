import { WorkerAssignment, BloodDonorProfile, CommunityHealthTrend } from '../types/health';
import { AuthService } from './authService';

const STORAGE_KEYS = {
  WORKER_ASSIGNMENTS: 'jeevansetu_worker_assignments',
  DONORS: 'jeevansetu_blood_donors',
  TRENDS: 'jeevansetu_health_trends'
};

const DEFAULT_ASSIGNMENTS: WorkerAssignment[] = [
  {
    id: 'asgn-1',
    workerUserId: 'asha-worker-101',
    patientUserId: 'patient-401',
    patientName: 'Kavita Shinde (ANC Month 7)',
    consentGranted: true,
    status: 'active',
    lastVisitDate: '2026-10-12',
    notes: 'ANC blood pressure normal (118/76). Prescribed IFA tablets supplied.'
  },
  {
    id: 'asgn-2',
    workerUserId: 'asha-worker-101',
    patientUserId: 'patient-402',
    patientName: 'Ganpat Jadhav (Elderly Hypertension)',
    consentGranted: true,
    status: 'active',
    lastVisitDate: '2026-10-14',
    notes: 'Morning amlodipine adherence reviewed. No dizziness reported.'
  }
];

const DEFAULT_DONORS: BloodDonorProfile[] = [
  {
    id: 'donor-1',
    userId: 'user-donor-99',
    bloodGroup: 'O+',
    broadArea: 'Khed Taluka (Rural)',
    isAvailable: true,
    contactPreference: 'in_app',
    lastDonationDate: '2026-05-10'
  },
  {
    id: 'donor-2',
    userId: 'user-donor-88',
    bloodGroup: 'B+',
    broadArea: 'Manchar CHC Area',
    isAvailable: true,
    contactPreference: 'masked_phone',
    lastDonationDate: '2026-07-22'
  },
  {
    id: 'donor-3',
    userId: 'user-donor-77',
    bloodGroup: 'A+',
    broadArea: 'Junnar Sub-District',
    isAvailable: false, // Currently paused
    contactPreference: 'in_app',
    lastDonationDate: '2026-08-01'
  }
];

const DEFAULT_TRENDS: CommunityHealthTrend[] = [
  {
    id: 'trend-1',
    areaCode: 'Taluka Khed (Zone 4)',
    period: 'Oct 2026 (Past 14 Days)',
    category: 'Seasonal Acute Respiratory / Fever',
    countBucket: '15–20 self-reported cases', // Bucketed to prevent re-identification
    reviewedStatus: 'unverified_signal',
    dataSource: 'Aggregated self-reported community triage logs',
    limitations: 'Self-reported community signals. Not a verified outbreak or clinical diagnosis.'
  },
  {
    id: 'trend-2',
    areaCode: 'Manchar Rural Sector',
    period: 'Oct 2026 (Past 14 Days)',
    category: 'Acute Gastrointestinal / Diarrhea',
    countBucket: '5–10 self-reported cases',
    reviewedStatus: 'validated',
    dataSource: 'PHC sentinel reporting & triage counts',
    limitations: 'Not a verified outbreak. Requires water source inspection by block health officer.'
  }
];

export class CommunityService {
  /* ── ASHA WORKER ASSIGNMENTS ── */

  public static getWorkerAssignments(workerId = 'asha-worker-101'): WorkerAssignment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKER_ASSIGNMENTS);
      const list: WorkerAssignment[] = data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
      // Filter strictly by assigned worker
      return list.filter((a) => a.workerUserId === workerId);
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  }

  public static updateVisitNote(assignmentId: string, visitNote: string): boolean {
    const data = localStorage.getItem(STORAGE_KEYS.WORKER_ASSIGNMENTS);
    const list: WorkerAssignment[] = data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
    const item = list.find((a) => a.id === assignmentId);
    if (!item) return false;

    item.notes = visitNote;
    item.lastVisitDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.WORKER_ASSIGNMENTS, JSON.stringify(list));
    return true;
  }

  public static revokeConsent(assignmentId: string): boolean {
    const data = localStorage.getItem(STORAGE_KEYS.WORKER_ASSIGNMENTS);
    const list: WorkerAssignment[] = data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
    const item = list.find((a) => a.id === assignmentId);
    if (!item) return false;

    item.consentGranted = false;
    item.status = 'revoked';
    localStorage.setItem(STORAGE_KEYS.WORKER_ASSIGNMENTS, JSON.stringify(list));
    return true;
  }

  /* ── BLOOD DONOR DIRECTORY (PRIVACY PROTECTED) ── */

  public static getActiveDonors(filterBloodGroup?: string): BloodDonorProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DONORS);
      let list: BloodDonorProfile[] = data ? JSON.parse(data) : DEFAULT_DONORS;
      if (filterBloodGroup && filterBloodGroup !== 'ALL') {
        list = list.filter((d) => d.bloodGroup === filterBloodGroup);
      }
      return list;
    } catch {
      return DEFAULT_DONORS;
    }
  }

  public static registerDonor(donor: Omit<BloodDonorProfile, 'id' | 'userId'>): BloodDonorProfile {
    const user = AuthService.getCurrentUser();
    const newDonor: BloodDonorProfile = {
      ...donor,
      id: 'donor-' + Date.now().toString(36),
      userId: user.id
    };

    const current = this.getActiveDonors();
    const updated = [newDonor, ...current];
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(updated));
    return newDonor;
  }

  public static toggleDonorAvailability(id: string): boolean {
    const current = this.getActiveDonors();
    const donor = current.find((d) => d.id === id);
    if (!donor) return false;

    donor.isAvailable = !donor.isAvailable;
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(current));
    return donor.isAvailable;
  }

  public static withdrawDonorListing(id: string): void {
    const current = this.getActiveDonors();
    const updated = current.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(updated));
  }

  /* ── AGGREGATED HEALTH TREND SIGNALS ── */

  public static getHealthTrends(): CommunityHealthTrend[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRENDS);
      return data ? JSON.parse(data) : DEFAULT_TRENDS;
    } catch {
      return DEFAULT_TRENDS;
    }
  }
}
