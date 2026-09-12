export type RiskLevel = 'CRITICAL' | 'MODERATE' | 'LOW';

export type FacilityType =
  | 'Primary Health Centre (PHC)'
  | 'Community Health Centre (CHC)'
  | 'District Hospital'
  | 'Private Clinic'
  | '24/7 Pharmacy'
  | 'Emergency Care';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: FacilityType;
  distanceKm: number;
  locationName: string;
  phone: string;
  isOpen24x7: boolean;
  hasAmbulance: boolean;
  hasEmergencyBed: boolean;
  address: string;
  lat: number;
  lng: number;
  estimatedDriveTimeMin?: number;
  specialties?: string[];
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  subtext: string;
}

export interface CareTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  whatMayHelp: string[];
  whatToAvoid: string[];
  whenToSeeDoctor: string[];
  warningSigns: string[];
}

export interface EmergencyStep {
  number: string;
  title: string;
  detail: string;
}

export interface EmergencyProtocol {
  id: string;
  slug: string;
  title: string;
  hindiTitle?: string;
  icon: string;
  warningText: string;
  immediateAction: string;
  doList: string[];
  dontList: string[];
  steps: EmergencyStep[];
  whenProfessionalHelpRequired: string;
  emergencyNumber: string;
  ambulanceHelpline?: string;
}

export interface HealthGuideArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  excerpt: string;
  readTime: string;
  keyPoints: string[];
  fullContent: string[];
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: string;
  isRedFlag?: boolean;
}

export interface SymptomOption {
  label: string;
  value: string;
  riskWeight?: number;
  triggersEmergency?: boolean;
}

export interface SymptomQuestion {
  id: string;
  question: string;
  subtext: string;
  options: SymptomOption[];
}

export interface SymptomInput {
  symptoms: string[];
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  description?: string;
  associatedSigns?: string[];
}

export interface PossibleCondition {
  name: string;
  likelihood: string;
  description: string;
  relevance: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  headline: string;
  subheadline: string;
  summary: string;
  warningSigns: string[];
  immediateSteps: string[];
  whatToDo: string[];
  whatToAvoid: string[];
  homeRemedies?: string[];
  possibleConditions: PossibleCondition[];
  timeframe: string;
  suggestedCareType: 'emergency_hospital' | 'clinic_visit' | 'home_support' | string;
  disclaimer: string;
  isValidHealthQuery?: boolean;
  invalidReason?: string;
  identifiedDisease?: string;
  medicalCure?: string[];
  dietaryCure?: string[];
}

export interface UserProfile {
  name: string;
  age: number | '';
  sex: 'male' | 'female' | 'other';
  villageTown: string;
  district: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  knownAllergies: string;
  existingConditions: string;
  currentMedications: string;
}

export interface AssessmentHistoryEntry {
  id: string;
  date: string;
  symptoms: string[];
  riskLevel: RiskLevel;
  headline: string;
  actionTaken: string;
}
