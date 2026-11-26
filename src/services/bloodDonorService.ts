import { FullBloodDonor, DonorAvailabilityStatus, DonorVerificationStatus } from '../types/health';
import { AuthService } from './authService';
import { AdminNotificationService } from './adminNotificationService';

const STORAGE_KEYS = {
  FULL_DONORS: 'jeevansetu_full_blood_donors',
  DONOR_AUDIT: 'jeevansetu_donor_audit_logs'
};

export interface DonorFilters {
  bloodGroup?: string;
  city?: string;
  district?: string;
  state?: string;
  availability?: string;
  verificationStatus?: string;
  searchQuery?: string;
}

export interface DonorStatistics {
  totalDonors: number;
  activeDonors: number;
  inactiveDonors: number;
  temporarilyUnavailableDonors: number;
  pendingVerificationDonors: number;
  verifiedDonors: number;
  bloodGroupBreakdown: Record<string, number>;
  cityBreakdown: Record<string, number>;
}

const DEFAULT_FULL_DONORS: FullBloodDonor[] = [
  {
    id: 'donor-full-1',
    userId: 'user-donor-99',
    fullName: 'Sachin Ramesh Tendulkar',
    phone: '+91 98220 14890',
    email: 'sachin.t@donor.org',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    rhFactor: 'POSITIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Khed',
    pincode: '410501',
    area: 'Rajgurunagar Sector 3',
    lastDonationDate: '2026-05-10',
    availabilityStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    preferredContactMethod: 'IN_APP',
    emergencyContact: '+91 98220 14891',
    consentToContact: true,
    createdAt: '2026-04-12T10:00:00.000Z',
    updatedAt: '2026-10-15T09:20:00.000Z'
  },
  {
    id: 'donor-full-2',
    userId: 'user-donor-88',
    fullName: 'Pooja Anand Shinde',
    phone: '+91 94220 77312',
    email: 'pooja.shinde@ruralhealth.org',
    age: 27,
    gender: 'Female',
    bloodGroup: 'B+',
    rhFactor: 'POSITIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Manchar',
    pincode: '410503',
    area: 'Near CHC Hospital, Manchar Bypass',
    lastDonationDate: '2026-07-22',
    availabilityStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    preferredContactMethod: 'MASKED_PHONE',
    emergencyContact: '+91 94220 77300',
    consentToContact: true,
    createdAt: '2026-06-01T14:30:00.000Z',
    updatedAt: '2026-09-10T11:45:00.000Z'
  },
  {
    id: 'donor-full-3',
    userId: 'user-donor-77',
    fullName: 'Ganesh Vitthal Pawar',
    phone: '+91 98233 89201',
    email: 'ganesh.pawar@mail.com',
    age: 38,
    gender: 'Male',
    bloodGroup: 'A+',
    rhFactor: 'POSITIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Junnar',
    pincode: '410502',
    area: 'Shivneri Foothills Road',
    lastDonationDate: '2026-08-01',
    availabilityStatus: 'TEMPORARILY_UNAVAILABLE',
    verificationStatus: 'VERIFIED',
    preferredContactMethod: 'IN_APP',
    consentToContact: true,
    createdAt: '2026-07-15T08:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z'
  },
  {
    id: 'donor-full-4',
    userId: 'user-donor-66',
    fullName: 'Sneha Deepak Kadam',
    phone: '+91 99211 44556',
    email: 'sneha.kadam@donornet.in',
    age: 24,
    gender: 'Female',
    bloodGroup: 'O-',
    rhFactor: 'NEGATIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Ambegaon',
    pincode: '410515',
    area: 'Ghodegaon Market Road',
    lastDonationDate: '2026-03-14',
    availabilityStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    preferredContactMethod: 'MASKED_PHONE',
    emergencyContact: '+91 99211 44500',
    consentToContact: true,
    createdAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-10-20T10:15:00.000Z'
  },
  {
    id: 'donor-full-5',
    userId: 'user-donor-55',
    fullName: 'Mahesh Babanrao Patil',
    phone: '+91 97654 32109',
    email: 'mahesh.patil@ruralpune.org',
    age: 41,
    gender: 'Male',
    bloodGroup: 'AB+',
    rhFactor: 'POSITIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Shirur',
    pincode: '412210',
    area: 'MIDC Residential Colony',
    lastDonationDate: '2025-11-20',
    availabilityStatus: 'PENDING_VERIFICATION',
    verificationStatus: 'UNVERIFIED',
    preferredContactMethod: 'EMAIL',
    consentToContact: true,
    createdAt: '2026-10-24T09:00:00.000Z',
    updatedAt: '2026-10-24T09:00:00.000Z'
  },
  {
    id: 'donor-full-6',
    userId: 'user-donor-44',
    fullName: 'Anjali Vasant Gokhale',
    phone: '+91 91234 56789',
    email: 'anjali.gokhale@gmail.com',
    age: 29,
    gender: 'Female',
    bloodGroup: 'AB-',
    rhFactor: 'NEGATIVE',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    pincode: '411004',
    area: 'Shivajinagar',
    lastDonationDate: '2026-01-18',
    availabilityStatus: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    preferredContactMethod: 'IN_APP',
    consentToContact: true,
    createdAt: '2026-09-05T15:20:00.000Z',
    updatedAt: '2026-09-05T15:20:00.000Z'
  }
];

export class BloodDonorService {
  /**
   * Masks a phone number for public privacy. e.g. "+91 98220 14890" -> "+91 98220 •••90"
   */
  public static maskPhone(phone: string): string {
    if (!phone) return 'Protected';
    const cleaned = phone.trim();
    if (cleaned.length < 8) return '••••••••';
    // Show first 6 chars and last 2 chars, mask middle
    const start = cleaned.slice(0, 7);
    const end = cleaned.slice(-2);
    return `${start} •••• ${end}`;
  }

  /**
   * Retrieve all full donor records (Admin only).
   */
  public static getAll(filters?: DonorFilters): FullBloodDonor[] {
    let list: FullBloodDonor[] = [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FULL_DONORS);
      list = data ? JSON.parse(data) : DEFAULT_FULL_DONORS;
    } catch {
      list = DEFAULT_FULL_DONORS;
    }

    if (!filters) return list;

    return list.filter((d) => {
      if (filters.bloodGroup && filters.bloodGroup !== 'ALL' && d.bloodGroup !== filters.bloodGroup) return false;
      if (filters.city && filters.city !== 'ALL' && d.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.district && filters.district !== 'ALL' && d.district.toLowerCase() !== filters.district.toLowerCase()) return false;
      if (filters.state && filters.state !== 'ALL' && d.state.toLowerCase() !== filters.state.toLowerCase()) return false;
      if (filters.availability && filters.availability !== 'ALL' && d.availabilityStatus !== filters.availability) return false;
      if (filters.verificationStatus && filters.verificationStatus !== 'ALL' && d.verificationStatus !== filters.verificationStatus) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matches =
          d.fullName.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q) ||
          d.pincode.includes(q) ||
          d.bloodGroup.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  /**
   * Retrieve public donor directory with privacy masking applied.
   * Only ACTIVE and verified/consenting donors are returned. Exact address and full phone are redacted.
   */
  public static getPublicDonors(filters?: DonorFilters): Array<Partial<FullBloodDonor> & { maskedPhone: string; broadLocality: string }> {
    const isSuperAdmin = AuthService.isSuperAdmin();
    const all = this.getAll(filters);

    // If user is not super admin, only show ACTIVE donors who gave consent
    const eligible = isSuperAdmin ? all : all.filter((d) => d.availabilityStatus === 'ACTIVE' && d.consentToContact);

    return eligible.map((d) => ({
      id: d.id,
      fullName: isSuperAdmin ? d.fullName : d.fullName.split(' ')[0] + ' ' + (d.fullName.split(' ')[1] ? d.fullName.split(' ')[1][0] + '.' : ''),
      bloodGroup: d.bloodGroup,
      rhFactor: d.rhFactor,
      city: d.city,
      district: d.district,
      state: d.state,
      broadLocality: `${d.city}, ${d.district}`,
      maskedPhone: isSuperAdmin ? d.phone : this.maskPhone(d.phone),
      availabilityStatus: d.availabilityStatus,
      verificationStatus: d.verificationStatus,
      preferredContactMethod: d.preferredContactMethod,
      lastDonationDate: d.lastDonationDate,
      createdAt: d.createdAt
    }));
  }

  public static getById(id: string): FullBloodDonor | undefined {
    return this.getAll().find((d) => d.id === id);
  }

  public static getByUserId(userId: string): FullBloodDonor | undefined {
    return this.getAll().find((d) => d.userId === userId);
  }

  /**
   * Register a new donor (with validation & duplicate checks).
   */
  public static addDonor(donorData: Omit<FullBloodDonor, 'id' | 'createdAt' | 'updatedAt'>): FullBloodDonor {
    const list = this.getAll();

    // Check duplicate phone or user ID
    if (donorData.phone) {
      const existingPhone = list.find((d) => d.phone.replace(/\D/g, '') === donorData.phone.replace(/\D/g, ''));
      if (existingPhone) {
        throw new Error('A donor with this mobile number is already registered in the registry.');
      }
    }
    if (donorData.userId) {
      const existingUser = list.find((d) => d.userId === donorData.userId);
      if (existingUser) {
        throw new Error('You already have a registered donor profile. Please update your existing record.');
      }
    }

    const newDonor: FullBloodDonor = {
      ...donorData,
      id: 'donor-full-' + Date.now().toString(36),
      availabilityStatus: donorData.availabilityStatus || 'ACTIVE',
      verificationStatus: donorData.verificationStatus || 'UNVERIFIED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newDonor, ...list];
    this.saveList(updated);

    // Notify Super Admins of new donor
    AdminNotificationService.addNotification({
      recipientUserId: 'admin-all',
      recipientRole: 'super_admin',
      title: 'New Blood Donor Registered',
      message: `${newDonor.fullName} (${newDonor.bloodGroup}) registered in ${newDonor.city}, ${newDonor.district}.`,
      category: 'DONOR',
      referenceId: newDonor.id,
      referenceType: 'blood_donor'
    });

    return newDonor;
  }

  /**
   * Update donor record.
   */
  public static updateDonor(id: string, updates: Partial<FullBloodDonor>): FullBloodDonor {
    const list = this.getAll();
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Donor with id ${id} not found.`);

    // If updating phone, check duplicates
    if (updates.phone) {
      const dup = list.find((d) => d.id !== id && d.phone.replace(/\D/g, '') === updates.phone!.replace(/\D/g, ''));
      if (dup) throw new Error('Another donor with this mobile number already exists.');
    }

    const updatedDonor: FullBloodDonor = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    list[idx] = updatedDonor;
    this.saveList(list);
    return updatedDonor;
  }

  /**
   * Change donor availability status (e.g. ACTIVE, INACTIVE, TEMPORARILY_UNAVAILABLE).
   */
  public static setAvailability(id: string, status: DonorAvailabilityStatus): FullBloodDonor {
    return this.updateDonor(id, { availabilityStatus: status });
  }

  /**
   * Verify or reject donor credentials.
   */
  public static verifyDonor(id: string, status: DonorVerificationStatus): FullBloodDonor {
    if (!AuthService.isSuperAdmin()) {
      throw new Error('Unauthorized: Only Super Administrators can verify blood donors.');
    }
    return this.updateDonor(id, { verificationStatus: status });
  }

  /**
   * Delete or permanently withdraw donor profile.
   */
  public static deleteDonor(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((d) => d.id !== id);
    if (filtered.length === list.length) return false;
    this.saveList(filtered);
    return true;
  }

  /**
   * Compute comprehensive donor statistics for Admin Dashboard.
   */
  public static getStatistics(): DonorStatistics {
    const donors = this.getAll();

    const stats: DonorStatistics = {
      totalDonors: donors.length,
      activeDonors: 0,
      inactiveDonors: 0,
      temporarilyUnavailableDonors: 0,
      pendingVerificationDonors: 0,
      verifiedDonors: 0,
      bloodGroupBreakdown: {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
      },
      cityBreakdown: {}
    };

    for (const d of donors) {
      if (d.availabilityStatus === 'ACTIVE') stats.activeDonors++;
      else if (d.availabilityStatus === 'INACTIVE') stats.inactiveDonors++;
      else if (d.availabilityStatus === 'TEMPORARILY_UNAVAILABLE') stats.temporarilyUnavailableDonors++;
      else if (d.availabilityStatus === 'PENDING_VERIFICATION') stats.pendingVerificationDonors++;

      if (d.verificationStatus === 'VERIFIED') stats.verifiedDonors++;

      if (stats.bloodGroupBreakdown[d.bloodGroup] !== undefined) {
        stats.bloodGroupBreakdown[d.bloodGroup]++;
      } else {
        stats.bloodGroupBreakdown[d.bloodGroup] = 1;
      }

      const city = d.city || 'Other';
      stats.cityBreakdown[city] = (stats.cityBreakdown[city] || 0) + 1;
    }

    return stats;
  }

  private static saveList(list: FullBloodDonor[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FULL_DONORS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}
