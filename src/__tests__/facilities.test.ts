import { describe, it, expect, beforeEach } from 'vitest';
import { HealthcareService } from '../services/healthcareService';

describe('Phase 6 — Healthcare Facility Finder Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('All healthcare facilities contain verified source and verification date disclosures', () => {
    const facilities = HealthcareService.getAllFacilities();
    expect(facilities.length).toBeGreaterThan(0);

    facilities.forEach((f) => {
      expect(f.source).toBeDefined();
      expect(f.source?.length).toBeGreaterThan(3);
      expect(f.verifiedDate).toBeDefined();
      expect(f.isVerified).toBe(true);
      expect(f.phone).toBeDefined();
    });
  });

  it('Filters facilities correctly by type (PHC, CHC, 24/7 Pharmacy)', () => {
    const phcs = HealthcareService.searchFacilities('', 'Primary Health Centre (PHC)');
    expect(phcs.every((f) => f.type === 'Primary Health Centre (PHC)')).toBe(true);

    const pharmacies = HealthcareService.searchFacilities('', '24/7 Pharmacy');
    expect(pharmacies.every((f) => f.type === '24/7 Pharmacy')).toBe(true);
  });

  it('Locality fallback search works accurately without requiring GPS', () => {
    const results = HealthcareService.searchFacilities('Manchar');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((f) => f.name.includes('Manchar'))).toBe(true);

    const serviceResults = HealthcareService.searchFacilities('Snake');
    expect(serviceResults.length).toBeGreaterThan(0);
  });

  it('Correction reporting: allows users to flag outdated information without blocking search', () => {
    const initialReports = HealthcareService.getCorrectionReports();
    expect(initialReports.length).toBe(0);

    const report = HealthcareService.submitCorrectionReport(
      'phc-khed',
      'Primary Health Centre (PHC) Khed',
      'wrong_phone',
      'Primary landline changed to +91 2135 222999'
    );

    expect(report.id).toBeDefined();
    expect(report.reportedAt).toBeDefined();
    expect(report.issueType).toBe('wrong_phone');

    const updated = HealthcareService.getCorrectionReports();
    expect(updated.length).toBe(1);
    expect(updated[0].details).toContain('Primary landline changed');
  });

  it('Offline cache: records recently viewed facility with timestamp', () => {
    const facility = HealthcareService.getAllFacilities()[0];
    HealthcareService.cacheRecentlyViewedFacility(facility);

    const cached = HealthcareService.getRecentlyViewedFacilities();
    expect(cached.length).toBe(1);
    expect(cached[0].id).toBe(facility.id);
    expect(cached[0].cachedAt).toBeDefined();
  });
});
