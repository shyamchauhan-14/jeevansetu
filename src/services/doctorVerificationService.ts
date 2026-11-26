import { DoctorVerification, DoctorVerificationStatus } from '../types/health';
import { AuthService } from './authService';
import { AdminNotificationService } from './adminNotificationService';

const STORAGE_KEYS = {
  DOCTOR_VERIFICATIONS: 'jeevansetu_doctor_verifications'
};

const DEFAULT_DOCTORS: DoctorVerification[] = [
  {
    id: 'doc-1',
    userId: 'user-doc-1',
    fullName: 'Dr. Rajesh Kulkarni',
    email: 'dr.rajesh.kulkarni@jeevansetu.med',
    phone: '+91 98220 11223',
    registrationNumber: 'MMC-2008-041289',
    registrationAuthority: 'Maharashtra Medical Council',
    state: 'Maharashtra',
    qualification: 'MBBS, MD (Emergency Medicine)',
    specialization: 'Emergency Medicine & Critical Care',
    hospitalName: 'District Sub-Hospital Junnar / Manchar CHC',
    experienceYears: 16,
    professionalAddress: 'Civil Lines Road, Junnar, Pune Rural 410502',
    certificateUrl: 'https://jeevansetu.org/docs/certs/MMC-2008-041289.pdf',
    supportingDocuments: 'NMC Identity Verification Card, State Medical Council Annual Renewal Receipt',
    status: 'VERIFIED',
    adminNotes: 'Credentials cross-checked with Maharashtra Medical Council live registry on 12-Oct-2026. Verified active license.',
    verifiedBy: 'Super Admin',
    verifiedAt: '2026-10-12T10:30:00.000Z',
    createdAt: '2026-10-10T08:15:00.000Z',
    updatedAt: '2026-10-12T10:30:00.000Z'
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    fullName: 'Dr. Suresh Deshmukh',
    email: 'dr.suresh.deshmukh@ruralhealth.org',
    phone: '+91 94220 88776',
    registrationNumber: 'MMC-2014-098231',
    registrationAuthority: 'Maharashtra Medical Council',
    state: 'Maharashtra',
    qualification: 'MBBS, MS (General Surgery)',
    specialization: 'Trauma & General Surgery',
    hospitalName: 'Khed Primary Health Centre & Trauma Care',
    experienceYears: 10,
    professionalAddress: 'Taluka Road, Near Gram Panchayat, Khed 410501',
    certificateUrl: 'https://jeevansetu.org/docs/certs/MMC-2014-098231.pdf',
    supportingDocuments: 'State Medical Council Certificate, Hospital Employment Letter',
    status: 'PENDING',
    adminNotes: 'Application submitted via doctor portal. Awaiting medical registry verification.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    fullName: 'Dr. Anita Joshi',
    email: 'dr.anita.joshi@cardio-care.in',
    phone: '+91 98233 44551',
    registrationNumber: 'MCI-2016-114092',
    registrationAuthority: 'National Medical Commission (MCI)',
    state: 'Maharashtra',
    qualification: 'MBBS, DNB (Cardiology)',
    specialization: 'Cardiology',
    hospitalName: 'Pune Rural Cardiac Outreach Unit',
    experienceYears: 8,
    professionalAddress: 'State Highway 50, Ambegaon Taluka 410503',
    certificateUrl: 'https://jeevansetu.org/docs/certs/MCI-2016-114092.pdf',
    supportingDocuments: 'National Medical Commission Registry Entry & Degree Transcript',
    status: 'UNDER_REVIEW',
    adminNotes: 'Assigned to reviewer for verification against NMC online database.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export class DoctorVerificationService {
  public static getAll(): DoctorVerification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCTOR_VERIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_DOCTORS;
    } catch {
      return DEFAULT_DOCTORS;
    }
  }

  public static getById(id: string): DoctorVerification | undefined {
    return this.getAll().find((d) => d.id === id);
  }

  public static getByUserId(userId: string): DoctorVerification | undefined {
    return this.getAll().find((d) => d.userId === userId);
  }

  public static getVerifiedDoctors(): DoctorVerification[] {
    return this.getAll().filter((d) => d.status === 'VERIFIED');
  }

  public static submitApplication(data: Omit<DoctorVerification, 'id' | 'status' | 'createdAt' | 'updatedAt'>): DoctorVerification {
    const list = this.getAll();
    const existingIdx = list.findIndex((d) => d.userId === data.userId || d.registrationNumber === data.registrationNumber);

    const record: DoctorVerification = {
      ...data,
      id: existingIdx >= 0 ? list[existingIdx].id : 'doc-' + Date.now().toString(36),
      status: 'PENDING',
      createdAt: existingIdx >= 0 ? list[existingIdx].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      list[existingIdx] = record;
    } else {
      list.unshift(record);
    }

    this.saveList(list);

    // Dispatch Notification to Super Admins
    AdminNotificationService.addNotification({
      recipientUserId: 'admin-broadcast',
      recipientRole: 'super_admin',
      title: 'New Doctor Verification Submitted',
      message: `${record.fullName} (${record.qualification}) applied for medical authority verification. Registration: ${record.registrationNumber}.`,
      category: 'DOCTOR_VERIFICATION',
      referenceId: record.id,
      referenceType: 'doctor_verification'
    });

    return record;
  }

  public static updateStatus(
    id: string,
    status: DoctorVerificationStatus,
    adminNotes?: string,
    rejectionReason?: string
  ): DoctorVerification | null {
    const list = this.getAll();
    const doctor = list.find((d) => d.id === id);
    if (!doctor) return null;

    doctor.status = status;
    doctor.updatedAt = new Date().toISOString();
    if (adminNotes !== undefined) doctor.adminNotes = adminNotes;
    if (rejectionReason !== undefined) doctor.rejectionReason = rejectionReason;

    if (status === 'VERIFIED') {
      doctor.verifiedAt = new Date().toISOString();
      doctor.verifiedBy = AuthService.getCurrentUser().displayName || 'Super Admin';
      
      // Elevate user role if user matches
      if (AuthService.getCurrentUser().id === doctor.userId) {
        AuthService.setRoleForTesting('verified_doctor');
      }

      AdminNotificationService.addNotification({
        recipientUserId: doctor.userId,
        recipientRole: 'verified_doctor',
        title: 'Medical Authority Verified ✓',
        message: `Congratulations Dr. ${doctor.fullName}. Your credentials have been officially verified by the Super Admin. You can now author and publish emergency medical protocols.`,
        category: 'DOCTOR_VERIFICATION',
        referenceId: doctor.id,
        referenceType: 'doctor_verification'
      });
    } else if (status === 'REJECTED') {
      AdminNotificationService.addNotification({
        recipientUserId: doctor.userId,
        recipientRole: 'patient',
        title: 'Doctor Verification Application Rejected',
        message: `Your medical verification request was reviewed and could not be verified. Reason: ${rejectionReason || 'Incomplete registration documents'}.`,
        category: 'DOCTOR_VERIFICATION',
        referenceId: doctor.id,
        referenceType: 'doctor_verification'
      });
    }

    this.saveList(list);
    return doctor;
  }

  public static verifyDoctor(id: string, adminNotes?: string): DoctorVerification | null {
    return this.updateStatus(id, 'VERIFIED', adminNotes);
  }

  public static rejectDoctor(id: string, reason: string, adminNotes?: string): DoctorVerification | null {
    return this.updateStatus(id, 'REJECTED', adminNotes, reason);
  }

  public static setUnderReview(id: string, adminNotes?: string): DoctorVerification | null {
    return this.updateStatus(id, 'UNDER_REVIEW', adminNotes);
  }

  public static filterDoctors(
    statusFilter?: string,
    searchQuery?: string
  ): DoctorVerification[] {
    let list = this.getAll();

    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((d) => d.status === statusFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.registrationNumber.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q)
      );
    }

    return list;
  }

  private static saveList(list: DoctorVerification[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTOR_VERIFICATIONS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}
