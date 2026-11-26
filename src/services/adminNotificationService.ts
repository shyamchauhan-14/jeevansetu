import { AdminNotification } from '../types/health';
import { AuthService } from './authService';

const STORAGE_KEYS = {
  NOTIFICATIONS: 'jeevansetu_admin_notifications'
};

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    recipientUserId: 'admin-1',
    recipientRole: 'super_admin',
    title: 'New Doctor Verification Request',
    message: 'Dr. Suresh Deshmukh (Reg: MMC-2014-0892) has submitted credentials for verification.',
    category: 'DOCTOR_VERIFICATION',
    referenceId: 'doc-1',
    referenceType: 'doctor_verification',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-2',
    recipientUserId: 'admin-1',
    recipientRole: 'super_admin',
    title: 'New Protocol Submitted for Approval',
    message: 'Dr. Anita Joshi submitted "Acute Myocardial Infarction Rural First-Response".',
    category: 'PROTOCOL',
    referenceId: 'proto-cardiac-1',
    referenceType: 'emergency_protocol',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'notif-3',
    recipientUserId: 'admin-1',
    recipientRole: 'super_admin',
    title: 'New Blood Donor Registered',
    message: 'New voluntary donor (O Positive) registered in Khed Taluka.',
    category: 'DONOR',
    referenceId: 'donor-1',
    referenceType: 'blood_donor',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export class AdminNotificationService {
  public static getAll(): AdminNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  public static getForCurrentRole(): AdminNotification[] {
    const list = this.getAll();
    const isSuperAdmin = AuthService.isSuperAdmin();
    const isDoctor = AuthService.isVerifiedDoctor();

    if (isSuperAdmin) {
      return list;
    } else if (isDoctor) {
      return list.filter((n) => n.recipientRole === 'verified_doctor' || n.category === 'PROTOCOL' || n.category === 'DOCTOR_VERIFICATION');
    }
    return list.filter((n) => n.recipientRole === 'ALL' || n.category === 'DONOR');
  }

  public static getUnreadCount(): number {
    return this.getForCurrentRole().filter((n) => !n.isRead).length;
  }

  public static addNotification(notif: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>): AdminNotification {
    const newEntry: AdminNotification = {
      ...notif,
      id: 'notif-' + Date.now().toString(36),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const current = this.getAll();
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newEntry;
  }

  public static markAsRead(id: string): void {
    const list = this.getAll();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.isRead = true;
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      } catch {
        // ignore
      }
    }
  }

  public static markAllAsRead(): void {
    const list = this.getAll();
    list.forEach((n) => (n.isRead = true));
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}
