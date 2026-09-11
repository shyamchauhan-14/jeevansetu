import { HealthcareFacility, FacilityType } from '../types/health';
import { HEALTHCARE_FACILITIES } from '../data/healthcare';

export class HealthcareService {
  public static getAllFacilities(): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES;
  }

  public static searchFacilities(query: string, filterType?: FacilityType | 'ALL'): HealthcareFacility[] {
    let list = HEALTHCARE_FACILITIES;

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
          f.type.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public static getFacilityById(id: string): HealthcareFacility | undefined {
    return HEALTHCARE_FACILITIES.find((f) => f.id === id);
  }
}
