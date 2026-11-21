export type RiskLevel = 'CRITICAL' | 'MODERATE' | 'LOW';

export type FacilityType =
  | 'Primary Health Centre (PHC)'
  | 'Community Health Centre (CHC)'
  | 'District Hospital'
  | 'Private Clinic'
  | '24/7 Pharmacy'
  | 'Emergency Care';

export type CareSuggestion = 'emergency_hospital' | 'clinic_visit' | 'home_support';

export interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: string;
  isRedFlag?: boolean;
}

export interface SymptomQuestionOption {
  label: string;
  value: string;
  riskWeight?: number;
  triggersEmergency?: boolean;
}

export interface SymptomQuestion {
  id: string;
  question: string;
  subtext: string;
  options: SymptomQuestionOption[];
}

export interface SymptomInput {
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
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
  possibleConditions: PossibleCondition[];
  timeframe: string;
  suggestedCareType: CareSuggestion;
  disclaimer: string;
}

export interface AssessmentHistoryEntry {
  id: string;
  date: string;
  symptoms: string[];
  riskLevel: RiskLevel;
  headline: string;
  actionTaken: string;
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
  hindiTitle: string;
  icon: string;
  warningText: string;
  immediateAction: string;
  doList: string[];
  dontList: string[];
  steps: EmergencyStep[];
  whenProfessionalHelpRequired: string;
  emergencyNumber: string;
  ambulanceHelpline: string;
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
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  subtext: string;
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

export type TimeSlot = 'morning' | 'afternoon' | 'night';
export type MealInstruction = 'before_meal' | 'after_meal' | 'with_meal';
export type ReminderStatus = 'pending' | 'taken' | 'skipped' | 'snoozed';

export interface MedicineReminder {
  id: string;
  userId?: string;
  name: string;
  dosage: string;
  timeSlot: TimeSlot;
  time: string; // "HH:MM" e.g., "08:00"
  mealInstruction: MealInstruction;
  status?: ReminderStatus;
  lastTakenDate?: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt?: string;
}

export type EmergencyIncidentStatus = 
  | 'not_started' 
  | 'preparing' 
  | 'call_opened' 
  | 'alert_queued' 
  | 'sent' 
  | 'failed' 
  | 'resolved' 
  | 'cancelled';

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  consentStatus: 'pending' | 'granted' | 'revoked';
  createdAt?: string;
}

export interface EmergencyIncident {
  id: string;
  userId?: string;
  status: EmergencyIncidentStatus;
  locality?: string;
  latitude?: number;
  longitude?: number;
  emergencyType: string;
  alertStatus: string;
  createdAt: string;
  resolvedAt?: string;
}

export type RecordProvenance = 'patient_entered' | 'worker_entered' | 'clinician_verified' | 'provider_imported';

export interface HealthRecord {
  id: string;
  userId: string;
  recordType: 'allergy' | 'condition' | 'medication' | 'visit_note' | 'assessment_summary';
  title: string;
  content: Record<string, any>;
  provenance: RecordProvenance;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkerAssignment {
  id: string;
  workerUserId: string;
  patientUserId: string;
  patientName: string;
  consentGranted: boolean;
  status: 'active' | 'revoked' | 'completed';
  lastVisitDate?: string;
  notes?: string;
}

export interface BloodDonorProfile {
  id: string;
  userId: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  broadArea: string;
  isAvailable: boolean;
  contactPreference: 'in_app' | 'masked_phone';
  lastDonationDate?: string;
}

export interface CommunityHealthTrend {
  id: string;
  areaCode: string;
  period: string;
  category: string;
  countBucket: string; // e.g. "5-10 cases" to suppress small numbers and avoid re-identification
  reviewedStatus: 'unverified_signal' | 'validated' | 'closed';
  dataSource: string;
  limitations: string;
}


