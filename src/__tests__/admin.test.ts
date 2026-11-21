import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';
import { HealthcareService } from '../services/healthcareService';
import { SOSService } from '../services/sosService';
import { CommunityService } from '../services/communityService';

describe('Phase 10: Admin Governance & Auditing Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    AuthService.setRoleForTesting('patient');
  });

  it('denies admin access to patient and community worker roles', () => {
    AuthService.setRoleForTesting('patient');
    expect(AuthService.canAccessAdmin()).toBe(false);

    AuthService.setRoleForTesting('community_worker');
    expect(AuthService.canAccessAdmin()).toBe(false);
  });

  it('grants admin access to administrator and clinician_reviewer roles', () => {
    AuthService.setRoleForTesting('administrator');
    expect(AuthService.canAccessAdmin()).toBe(true);

    AuthService.setRoleForTesting('clinician_reviewer');
    expect(AuthService.canAccessAdmin()).toBe(true);
  });

  it('allows clinician/administrator to toggle facility verification status', () => {
    const facilities = HealthcareService.getAllFacilities();
    expect(facilities.length).toBeGreaterThan(0);

    const target = facilities[0];
    const initialStatus = !!target.isVerified;

    const newStatus = HealthcareService.toggleFacilityVerification(target.id);
    expect(newStatus).toBe(!initialStatus);
    expect(target.verifiedDate).toBe(new Date().toISOString().split('T')[0]);

    // Toggle back
    const revertedStatus = HealthcareService.toggleFacilityVerification(target.id);
    expect(revertedStatus).toBe(initialStatus);
  });

  it('allows administrator to resolve crowdsourced facility correction reports', () => {
    const report = HealthcareService.submitCorrectionReport(
      'fac-1',
      'PHC Khed Rural Hospital',
      'wrong_phone',
      'Phone changed to 02135-222333'
    );

    let reports = HealthcareService.getCorrectionReports();
    expect(reports.some((r) => r.id === report.id)).toBe(true);

    HealthcareService.resolveCorrectionReport(report.id);
    reports = HealthcareService.getCorrectionReports();
    expect(reports.some((r) => r.id === report.id)).toBe(false);
  });

  it('maintains emergency incident audit trail with privacy protection (redacted precise GPS)', () => {
    const incident = SOSService.createIncident('Khed Taluka, Pune Sector', 'acute_chest_pain');
    SOSService.updateIncidentStatus('call_opened', 'Dialer 108 launched');

    const auditTrail = SOSService.getIncidentAuditTrail();
    expect(auditTrail.length).toBeGreaterThan(0);

    const audited = auditTrail.find((i) => i.id === incident.id);
    expect(audited).toBeDefined();
    expect(audited?.status).toBe('call_opened');
    expect(audited?.locality).toContain('Khed Taluka');
    // Verify precise coordinates are not attached to public audit summaries
    expect(audited?.latitude).toBeUndefined();
    expect(audited?.longitude).toBeUndefined();
  });

  it('allows public health trend cluster status updates', () => {
    const trends = CommunityService.getHealthTrends();
    expect(trends.length).toBeGreaterThan(0);

    const target = trends[0];
    const updated = CommunityService.updateTrendStatus(target.id, 'validated');
    expect(updated).toBe(true);

    const reloaded = CommunityService.getHealthTrends();
    const match = reloaded.find((t) => t.id === target.id);
    expect(match?.reviewedStatus).toBe('validated');
  });
});
