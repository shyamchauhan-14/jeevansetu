import { HealthcareFacility } from '../types/health';

export const HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  {
    id: 'phc-khed',
    name: 'Primary Health Centre (PHC) Khed',
    type: 'Primary Health Centre (PHC)',
    distanceKm: 2.4,
    locationName: 'Khed Village, Taluka Road',
    phone: '+91 2135 222108',
    isOpen24x7: false,
    hasAmbulance: true,
    hasEmergencyBed: true,
    address: 'Near Gram Panchayat Office, Khed 410501'
  },
  {
    id: 'chc-manchar',
    name: 'Community Health Centre (CHC) Manchar',
    type: 'Community Health Centre (CHC)',
    distanceKm: 8.5,
    locationName: 'Manchar Main Hospital Complex',
    phone: '+91 2133 223400',
    isOpen24x7: true,
    hasAmbulance: true,
    hasEmergencyBed: true,
    address: 'State Highway 50, Manchar Rural Hospital, Pune District 410503'
  },
  {
    id: 'district-hospital-junnar',
    name: 'Sub-District General Hospital Junnar',
    type: 'District Hospital',
    distanceKm: 18.2,
    locationName: 'Junnar Civil Lines',
    phone: '+91 2132 242200',
    isOpen24x7: true,
    hasAmbulance: true,
    hasEmergencyBed: true,
    address: 'Near Old Bus Stand, Junnar 410502 (Full Surgery, CT Scan, ICU, Snake Venom)'
  },
  {
    id: 'sevatrust-clinic',
    name: 'Sanjeevani Charitable Rural Clinic',
    type: 'Private Clinic',
    distanceKm: 4.1,
    locationName: 'Alandi Rural Sector',
    phone: '+91 98220 11223',
    isOpen24x7: false,
    hasAmbulance: false,
    hasEmergencyBed: false,
    address: 'Opposite Milk Cooperative Society, Alandi Phata 412105'
  },
  {
    id: 'jan-aushadhi-khed',
    name: 'Pradhan Mantri Jan Aushadhi Kendra',
    type: '24/7 Pharmacy',
    distanceKm: 2.1,
    locationName: 'Market Yard, Khed',
    phone: '+91 94220 55678',
    isOpen24x7: true,
    hasAmbulance: false,
    hasEmergencyBed: false,
    address: 'Shop No 4, Market Complex, Opp Bus Depot, Khed 410501'
  },
  {
    id: 'district-emergency-apex',
    name: 'District Trauma & Emergency Centre',
    type: 'Emergency Care',
    distanceKm: 26.0,
    locationName: 'District Headquarters Medical Hub',
    phone: '108 / +91 20 2612 7000',
    isOpen24x7: true,
    hasAmbulance: true,
    hasEmergencyBed: true,
    address: 'Sassoon General Hospital & Trauma Centre, Pune 411001'
  }
];
