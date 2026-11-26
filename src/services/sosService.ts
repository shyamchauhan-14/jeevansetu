import { EmergencyContact, EmergencyIncident, EmergencyIncidentStatus } from '../types/health';
import { SupabaseService } from './supabaseClient';
import { AuthService } from './authService';

const STORAGE_KEYS = {
  TRUSTED_CONTACTS: 'jeevansetu_emergency_contacts',
  ACTIVE_INCIDENT: 'jeevansetu_active_emergency_incident',
  INCIDENT_HISTORY: 'jeevansetu_emergency_incident_history'
};

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-demo-1',
    userId: 'default_user',
    name: 'Sunita Patil (Wife)',
    phone: '+91 98221 44556',
    relationship: 'Spouse',
    consentStatus: 'granted'
  }
];

const DEFAULT_INCIDENT_AUDIT: EmergencyIncident[] = [
  {
    id: 'inc-demo-101',
    status: 'resolved',
    locality: 'Khed Taluka, Pune Sector',
    emergencyType: 'acute_chest_pain',
    alertStatus: 'Ambulance 108 dispatched to CHC Manchar',
    createdAt: '2026-10-15T09:30:00.000Z',
    resolvedAt: '2026-10-15T10:45:00.000Z'
  },
  {
    id: 'inc-demo-102',
    status: 'call_opened',
    locality: 'Manchar Village Hub',
    emergencyType: 'snake_bite',
    alertStatus: 'Dialer 108 launched by user',
    createdAt: '2026-11-02T14:12:00.000Z'
  }
];

export interface LocationConsentResult {
  latitude?: number;
  longitude?: number;
  locality: string;
  source: 'gps' | 'manual_fallback' | 'denied';
  accuracyMeters?: number;
}

export class SOSService {
  private static activeIncident: EmergencyIncident | null = null;
  private static listeners: Array<(incident: EmergencyIncident | null) => void> = [];

  public static getTrustedContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRUSTED_CONTACTS);
      return data ? JSON.parse(data) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  }

  public static saveTrustedContact(contact: Omit<EmergencyContact, 'id' | 'userId'>): EmergencyContact {
    const user = AuthService.getCurrentUser();
    const contacts = this.getTrustedContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: 'contact-' + Date.now().toString(36),
      userId: user.id
    };

    const updated = [newContact, ...contacts];
    try {
      localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newContact;
  }

  public static deleteTrustedContact(id: string): void {
    const contacts = this.getTrustedContacts().filter((c) => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(contacts));
    } catch {
      // ignore
    }
  }

  public static getActiveIncident(): EmergencyIncident | null {
    if (this.activeIncident) return this.activeIncident;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_INCIDENT);
      if (data) {
        this.activeIncident = JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return this.activeIncident;
  }

  public static createIncident(locality = 'Locating...', emergencyType = 'general'): EmergencyIncident {
    const user = AuthService.getCurrentUser();
    const incident: EmergencyIncident = {
      id: 'inc-' + Date.now().toString(36),
      userId: user.isGuest ? undefined : user.id,
      status: 'preparing',
      locality,
      emergencyType,
      alertStatus: 'preparing',
      createdAt: new Date().toISOString()
    };

    this.activeIncident = incident;
    this.persistActiveIncident(incident);
    this.appendIncidentToHistory(incident);
    this.notifyListeners(incident);
    return incident;
  }

  public static updateIncidentStatus(status: EmergencyIncidentStatus, alertStatus = 'in_progress'): EmergencyIncident | null {
    if (!this.activeIncident) {
      this.getActiveIncident();
    }
    if (!this.activeIncident) return null;

    this.activeIncident.status = status;
    this.activeIncident.alertStatus = alertStatus;
    if (status === 'resolved' || status === 'cancelled') {
      this.activeIncident.resolvedAt = new Date().toISOString();
    }

    this.persistActiveIncident(this.activeIncident);
    this.appendIncidentToHistory(this.activeIncident);
    this.notifyListeners(this.activeIncident);

    // Sync to Supabase in background
    SupabaseService.saveIncident({
      id: this.activeIncident.id,
      status: this.activeIncident.status,
      locality: this.activeIncident.locality,
      latitude: this.activeIncident.latitude,
      longitude: this.activeIncident.longitude,
      emergencyType: this.activeIncident.emergencyType,
      alertStatus: this.activeIncident.alertStatus
    }).catch(() => {});

    return this.activeIncident;
  }

  public static setIncidentLocation(location: LocationConsentResult): void {
    if (!this.activeIncident) return;
    this.activeIncident.locality = location.locality;
    this.activeIncident.latitude = location.latitude;
    this.activeIncident.longitude = location.longitude;
    this.persistActiveIncident(this.activeIncident);
    this.notifyListeners(this.activeIncident);
  }

  public static cancelIncident(reason = 'Cancelled by user / False Alarm'): EmergencyIncident | null {
    const updated = this.updateIncidentStatus('cancelled', reason);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_INCIDENT);
    this.activeIncident = null;
    this.notifyListeners(null);
    return updated;
  }

  public static resolveIncident(): EmergencyIncident | null {
    const updated = this.updateIncidentStatus('resolved', 'Assistance received / Resolved');
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_INCIDENT);
    this.activeIncident = null;
    this.notifyListeners(null);
    return updated;
  }

  public static async requestLocationWithFallback(manualLocality?: string): Promise<LocationConsentResult> {
    if (manualLocality) {
      return {
        locality: manualLocality,
        source: 'manual_fallback'
      };
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        locality: 'Pune Rural District (Manual Fallback)',
        source: 'manual_fallback'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: pos.coords.accuracy,
            locality: `GPS Locked (Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)})`,
            source: 'gps'
          });
        },
        () => {
          // Denied or timed out -> safe manual fallback
          resolve({
            locality: 'Khed / Manchar Sector (GPS Denied Fallback)',
            source: 'denied'
          });
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }

  public static onIncidentChange(callback: (incident: EmergencyIncident | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notifyListeners(incident: EmergencyIncident | null): void {
    this.listeners.forEach((cb) => {
      try {
        cb(incident);
      } catch (e) {
        console.error('[SOSService] Listener error:', e);
      }
    });
  }

  public static getIncidentAuditTrail(): EmergencyIncident[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INCIDENT_HISTORY);
      const list: EmergencyIncident[] = data ? JSON.parse(data) : DEFAULT_INCIDENT_AUDIT;
      return list;
    } catch {
      return DEFAULT_INCIDENT_AUDIT;
    }
  }

  public static appendIncidentToHistory(incident: EmergencyIncident): void {
    try {
      const current = this.getIncidentAuditTrail();
      const existingIdx = current.findIndex((i) => i.id === incident.id);
      if (existingIdx >= 0) {
        current[existingIdx] = incident;
      } else {
        current.unshift(incident);
      }
      localStorage.setItem(STORAGE_KEYS.INCIDENT_HISTORY, JSON.stringify(current));
    } catch {
      // ignore
    }
  }

  public static generateEmergencyMessage(incident?: EmergencyIncident): string {
    const inc = incident || this.getActiveIncident();
    const locality = inc?.locality || 'Location pending';
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    let mapsLink = '';
    if (inc?.latitude && inc?.longitude) {
      mapsLink = `\nMap: https://maps.google.com/?q=${inc.latitude.toFixed(5)},${inc.longitude.toFixed(5)}`;
    }
    return `🚨 EMERGENCY SOS ALERT!\nI need urgent medical help.\nLocality: ${locality}${mapsLink}\nTime: ${time}\n(Sent via JeevanSetu Rural Emergency Network)`;
  }

  public static getSmsUri(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encoded = encodeURIComponent(message);
    return `sms:${cleanPhone}?&body=${encoded}`;
  }

  public static getWhatsAppUri(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }

  private static persistActiveIncident(incident: EmergencyIncident): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_INCIDENT, JSON.stringify(incident));
    } catch {
      // ignore
    }
  }
}
