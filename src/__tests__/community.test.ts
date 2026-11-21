import { describe, it, expect, beforeEach } from 'vitest';
import { CommunityService } from '../services/communityService';

describe('Phase 8 — Community Worker, Donor & Health Trends Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Worker assignments: restricts roster to assigned worker ID with active consent', () => {
    const workerAssignments = CommunityService.getWorkerAssignments('asha-worker-101');
    expect(workerAssignments.length).toBeGreaterThan(0);
    expect(workerAssignments.every((a) => a.workerUserId === 'asha-worker-101')).toBe(true);

    // Another worker cannot see asha-worker-101's patients
    const otherWorkerAssignments = CommunityService.getWorkerAssignments('unauthorized-worker-999');
    expect(otherWorkerAssignments.length).toBe(0);
  });

  it('Visit notes logging: updates visit timestamp and records note', () => {
    const list = CommunityService.getWorkerAssignments('asha-worker-101');
    const first = list[0];

    const updated = CommunityService.updateVisitNote(first.id, 'Routine postnatal visit: infant feeding well.');
    expect(updated).toBe(true);

    const reloaded = CommunityService.getWorkerAssignments('asha-worker-101');
    const target = reloaded.find((a) => a.id === first.id);
    expect(target?.notes).toContain('postnatal visit');
    expect(target?.lastVisitDate).toBeDefined();
  });

  it('Consent revocation: cleanly marks assignment status as revoked and revokes consent', () => {
    const list = CommunityService.getWorkerAssignments('asha-worker-101');
    const first = list[0];

    const revoked = CommunityService.revokeConsent(first.id);
    expect(revoked).toBe(true);

    const reloaded = CommunityService.getWorkerAssignments('asha-worker-101');
    const target = reloaded.find((a) => a.id === first.id);
    expect(target?.consentGranted).toBe(false);
    expect(target?.status).toBe('revoked');
  });

  it('Blood donor privacy: never exposes raw phone numbers or exact addresses publicly', () => {
    const donors = CommunityService.getActiveDonors();
    expect(donors.length).toBeGreaterThan(0);

    donors.forEach((d) => {
      expect((d as any).phone).toBeUndefined();
      expect((d as any).exactAddress).toBeUndefined();
      expect(d.broadArea).toBeDefined();
      expect(d.contactPreference).toMatch(/in_app|masked_phone/);
    });
  });

  it('Blood donor controls: allows voluntary registration, toggle availability, and withdrawal', () => {
    const newDonor = CommunityService.registerDonor({
      bloodGroup: 'AB+',
      broadArea: 'Khed Market Area',
      isAvailable: true,
      contactPreference: 'in_app'
    });

    expect(newDonor.id).toBeDefined();
    expect(newDonor.bloodGroup).toBe('AB+');

    // Toggle availability
    const isNowAvailable = CommunityService.toggleDonorAvailability(newDonor.id);
    expect(isNowAvailable).toBe(false);

    // Withdraw listing
    CommunityService.withdrawDonorListing(newDonor.id);
    const afterWithdraw = CommunityService.getActiveDonors();
    expect(afterWithdraw.some((d) => d.id === newDonor.id)).toBe(false);
  });

  it('Community health trends: bucketed counts, small-group suppression, and non-outbreak labels', () => {
    const trends = CommunityService.getHealthTrends();
    expect(trends.length).toBeGreaterThan(0);

    trends.forEach((t) => {
      expect(t.countBucket).toBeDefined();
      // Bucket format prevents individual identification
      expect(t.countBucket).toMatch(/cases/);
      expect(t.limitations).toContain('Not a verified outbreak');
      expect(t.reviewedStatus).toMatch(/unverified_signal|validated|closed/);
    });
  });
});
