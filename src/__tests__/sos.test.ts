import { describe, it, expect, beforeEach } from 'vitest';
import { SOSService } from '../services/sosService';

describe('Phase 4 — Smart SOS Workflow & Emergency Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    SOSService.cancelIncident('Reset for test');
  });

  it('Creates an emergency incident with truthful initial status "preparing"', () => {
    const incident = SOSService.createIncident('Pune Rural District');
    expect(incident).toBeDefined();
    expect(incident.status).toBe('preparing');
    expect(incident.locality).toBe('Pune Rural District');
    expect(incident.resolvedAt).toBeUndefined();
  });

  it('Truthful status tracking: updates state to "call_opened" when dialer is engaged and never claims false dispatch', () => {
    SOSService.createIncident('Khed');
    const updated = SOSService.updateIncidentStatus('call_opened', 'Emergency phone dialer opened for 108');
    
    expect(updated?.status).toBe('call_opened');
    expect(updated?.alertStatus).toContain('Emergency phone dialer opened');
    expect(updated?.status).not.toBe('ambulance_dispatched');
  });

  it('Location fallback: returns manual or fallback locality when GPS is denied or unavailable', async () => {
    const manualResult = await SOSService.requestLocationWithFallback('Manchar Village');
    expect(manualResult.source).toBe('manual_fallback');
    expect(manualResult.locality).toBe('Manchar Village');

    // Without explicit location, gracefully falls back without throwing error
    const autoFallback = await SOSService.requestLocationWithFallback();
    expect(autoFallback.locality).toBeDefined();
    expect(autoFallback.source).toMatch(/manual_fallback|gps|denied/);
  });

  it('Allows user to cancel false alarms cleanly and clears active incident', () => {
    SOSService.createIncident('Test Area');
    expect(SOSService.getActiveIncident()).not.toBeNull();

    const cancelled = SOSService.cancelIncident('False Alarm');
    expect(cancelled?.status).toBe('cancelled');
    expect(cancelled?.resolvedAt).toBeDefined();
    expect(SOSService.getActiveIncident()).toBeNull();
  });

  it('Trusted contacts management: allows adding, listing and removing emergency contacts', () => {
    const initialContacts = SOSService.getTrustedContacts();
    expect(Array.isArray(initialContacts)).toBe(true);

    const added = SOSService.saveTrustedContact({
      name: 'Anil Patil (Brother)',
      phone: '+91 98220 99887',
      relationship: 'Brother',
      consentStatus: 'granted'
    });

    expect(added.id).toBeDefined();
    expect(added.name).toBe('Anil Patil (Brother)');

    const currentContacts = SOSService.getTrustedContacts();
    expect(currentContacts.some((c) => c.id === added.id)).toBe(true);

    SOSService.deleteTrustedContact(added.id);
    const afterDelete = SOSService.getTrustedContacts();
    expect(afterDelete.some((c) => c.id === added.id)).toBe(false);
  });
});
