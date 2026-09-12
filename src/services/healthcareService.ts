import { HealthcareFacility, FacilityType } from '../types/health';
import { HEALTHCARE_FACILITIES } from '../data/healthcare';

export class HealthcareService {
  private static activeFacilities: HealthcareFacility[] = HEALTHCARE_FACILITIES;

  public static setFacilities(facilities: HealthcareFacility[]): void {
    if (facilities && facilities.length > 0) {
      this.activeFacilities = facilities;
    }
  }

  public static getAllFacilities(): HealthcareFacility[] {
    return [...this.activeFacilities].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  public static searchFacilities(query: string, filterType?: FacilityType | 'ALL'): HealthcareFacility[] {
    let list = [...this.activeFacilities];

    if (filterType && filterType !== 'ALL') {
      list = list.filter((f) => f.type === filterType);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();

      list = list.filter((f) => {
        const matchesBasic =
          f.name.toLowerCase().includes(q) ||
          f.locationName.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q);

        if (matchesBasic) return true;

        // Check specialties
        if (f.specialties && f.specialties.some((s) => s.toLowerCase().includes(q))) {
          return true;
        }

        // Check convenience keywords
        if (q === '24/7' || q === '24x7' || q === 'open') {
          return f.isOpen24x7;
        }
        if (q === 'ambulance' || q === '108') {
          return f.hasAmbulance;
        }
        if (q === 'emergency' || q === 'bed' || q === 'icu') {
          return f.hasEmergencyBed;
        }

        return false;
      });
    }

    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  public static getFacilityById(id: string): HealthcareFacility | undefined {
    return this.activeFacilities.find((f) => f.id === id);
  }
}
