import { HealthcareFacility, FacilityType, FacilityCorrectionReport } from '../types/health';
import { HEALTHCARE_FACILITIES } from '../data/healthcare';

const STORAGE_KEYS = {
  CACHED_FACILITIES: 'jeevansetu_cached_viewed_facilities',
  CORRECTION_REPORTS: 'jeevansetu_facility_corrections'
};

export class HealthcareService {
  public static getAllFacilities(): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES;
  }

  public static searchFacilities(
    query: string,
    filterType?: FacilityType | 'ALL',
    userCoordinates?: { lat: number; lng: number }
  ): HealthcareFacility[] {
    let list = [...HEALTHCARE_FACILITIES];

    if (filterType && filterType !== 'ALL') {
      list = list.filter((f) => f.type === filterType);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.locationName.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q) ||
          (f.services && f.services.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Sort by distance if userCoordinates are provided or default distance
    if (userCoordinates) {
      // Keep verified distance order
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  }

  public static getFacilityById(id: string): HealthcareFacility | undefined {
    return HEALTHCARE_FACILITIES.find((f) => f.id === id);
  }

  /**
   * Caches recently viewed facility for offline reference with visible timestamp
   */
  public static cacheRecentlyViewedFacility(facility: HealthcareFacility): void {
    try {
      const existing = this.getRecentlyViewedFacilities();
      const filtered = existing.filter((f) => f.id !== facility.id);
      const updated = [{ ...facility, cachedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.CACHED_FACILITIES, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public static getRecentlyViewedFacilities(): Array<HealthcareFacility & { cachedAt?: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_FACILITIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Report correction workflow for outdated phone numbers or closed facilities
   */
  public static submitCorrectionReport(
    facilityId: string,
    facilityName: string,
    issueType: FacilityCorrectionReport['issueType'],
    details: string
  ): FacilityCorrectionReport {
    const report: FacilityCorrectionReport = {
      id: 'rep-' + Date.now().toString(36),
      facilityId,
      facilityName,
      issueType,
      details,
      reportedAt: new Date().toISOString()
    };

    try {
      const existing = this.getCorrectionReports();
      localStorage.setItem(STORAGE_KEYS.CORRECTION_REPORTS, JSON.stringify([report, ...existing]));
    } catch {
      // ignore
    }

    return report;
  }

  public static getCorrectionReports(): FacilityCorrectionReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CORRECTION_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
