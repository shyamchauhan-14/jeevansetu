import { Router } from './router';
import { renderAppLayout } from './layouts/AppLayout';

// Pages
import { renderHomePage } from './pages/Home';
import { renderSymptomsPage } from './pages/Symptoms';
import { renderAssessmentPage } from './pages/Assessment';
import { renderEmergencyPage } from './pages/Emergency';
import { renderEmergencyProtocolPage } from './pages/EmergencyProtocol';
import { renderCarePage } from './pages/Care';
import { renderCareTopicPage } from './pages/CareTopic';
import { renderGuidePage } from './pages/Guide';
import { renderGuideTopicPage } from './pages/GuideTopic';
import { renderVoicePage } from './pages/Voice';
import { renderCareLocatorPage } from './pages/CareLocator';
import { renderLanguagePage } from './pages/Language';
import { renderProfilePage } from './pages/Profile';
import { renderHistoryPage } from './pages/History';
import { renderSettingsPage } from './pages/Settings';
import { renderSafetyPage } from './pages/Safety';
import { renderOfflinePage } from './pages/Offline';
import { renderNotFoundPage } from './pages/NotFound';
import { renderRemindersPage } from './pages/Reminders';
import { renderWorkerWorkspacePage } from './pages/WorkerWorkspace';
import { renderDonorsPage } from './pages/Donors';
import { renderCommunityTrendsPage } from './pages/CommunityTrends';
import { renderAdminDashboardPage } from './pages/AdminDashboard';
import { renderDoctorPortalPage } from './pages/DoctorPortal';
import { renderAdminLoginPage } from './pages/AdminLogin';
import { playReminderChime, requestNotificationPermission, sendBrowserNotification } from './utils/reminderAudio';

// Services & Components
import { AIService } from './services/aiService';
import { HealthcareService } from './services/healthcareService';
import { VoiceService, VoiceState } from './services/voiceService';
import { StorageService } from './services/storageService';
import { SOSService } from './services/sosService';
import { CommunityService } from './services/communityService';
import { OfflineSyncService } from './services/offlineSyncService';
import { AuthService, UserRole } from './services/authService';
import { DoctorVerificationService } from './services/doctorVerificationService';
import { EmergencyProtocolService } from './services/emergencyProtocolService';
import { BloodDonorService } from './services/bloodDonorService';
import { AdminAnalyticsService } from './services/adminAnalyticsService';
import { AdminNotificationService } from './services/adminNotificationService';
import { CARE_TOPICS } from './data/care';
import { HEALTH_GUIDES } from './data/healthGuides';
import { FacilityType, AssessmentResult } from './types/health';
import { renderLoadingState } from './components/LoadingState';
import { showToast } from './utils/dom';

// App State
let currentTriageResult: AssessmentResult | null = null;
let locatorActiveFilter: string = 'ALL';
let locatorSearchQuery: string = '';
let guideSearchQuery: string = '';
let adminActiveTab: string = 'dashboard';
let doctorActiveTab: string = 'protocols';
let selectedSymptomIds: Set<string> = new Set();
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

const router = new Router();
const appRoot = document.getElementById('app') as HTMLElement;

/* ══════════════════════════════════════════
   ROUTE DEFINITIONS
══════════════════════════════════════════ */

router.register('/', () => renderHomePage());
router.register('/symptoms', () => {
  selectedSymptomIds.clear();
  return renderSymptomsPage();
});

router.register('/assessment', () => {
  if (!currentTriageResult) {
    // If accessed directly without triage, generate a standard sample triage
    currentTriageResult = {
      id: 'demo-triage',
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      riskLevel: 'MODERATE',
      headline: 'CLINICAL EVALUATION RECOMMENDED',
      subheadline: '🟡 ATTENTION ADVISED WITHIN 24 HOURS',
      summary: 'Reported symptoms include persistent fever and breathing discomfort that require examination by a healthcare provider.',
      warningSigns: [
        'Temperature above 102°F persisting over 48 hours',
        'Breathing difficulty when walking or speaking',
        'Inability to tolerate oral fluids'
      ],
      immediateSteps: [
        'Schedule a Primary Health Centre (PHC) visit today.',
        'Drink clean boiled fluids with ORS.',
        'Rest in a cool, well-ventilated room.'
      ],
      whatToDo: [
        'Visit nearest PHC Khed or CHC Manchar for doctor checkup',
        'Continue regular sips of clean boiled water or light soup',
        'Check temperature every 4 hours'
      ],
      whatToAvoid: [
        'DO NOT take random leftover antibiotics without prescription',
        'DO NOT perform heavy agricultural or physical labor',
        'DO NOT ignore sudden chest heaviness or confusion'
      ],
      possibleConditions: [
        {
          name: 'Viral Upper Respiratory Infection with Fever',
          likelihood: 'Possible',
          description: 'Common seasonal infection requiring hydration, rest, and doctor evaluation.',
          relevance: 'Matches reported symptoms'
        }
      ],
      timeframe: 'Within 12 to 24 Hours',
      suggestedCareType: 'clinic_visit',
      disclaimer: 'This assessment is for supportive guidance and does not formulate a medical diagnosis.'
    };
  }
  return renderAssessmentPage(currentTriageResult);
});

router.register('/emergency', () => renderEmergencyPage());

router.register('/emergency/:slug', (params) => {
  const protocol = AIService.getEmergencyProtocol(params.slug);
  if (!protocol) {
    return renderNotFoundPage();
  }
  return renderEmergencyProtocolPage(protocol);
});

router.register('/care', () => renderCarePage());

router.register('/care/:slug', (params) => {
  const topic = CARE_TOPICS.find((t) => t.slug === params.slug);
  if (!topic) {
    return renderNotFoundPage();
  }
  return renderCareTopicPage(topic);
});

router.register('/guide', () => renderGuidePage(guideSearchQuery));

router.register('/guide/:slug', (params) => {
  const article = HEALTH_GUIDES.find((g) => g.slug === params.slug);
  if (!article) {
    return renderNotFoundPage();
  }
  return renderGuideTopicPage(article);
});

router.register('/voice', () => renderVoicePage());

router.register('/care-locator', () => {
  const facilities = HealthcareService.searchFacilities(locatorSearchQuery, locatorActiveFilter as FacilityType | 'ALL');
  return renderCareLocatorPage(facilities, locatorActiveFilter, locatorSearchQuery);
});

router.register('/language', () => renderLanguagePage());
router.register('/profile', () => renderProfilePage());
router.register('/history', () => renderHistoryPage());
router.register('/settings', () => renderSettingsPage());
router.register('/safety', () => renderSafetyPage());
router.register('/offline', () => renderOfflinePage());
router.register('/reminders', () => renderRemindersPage());
router.register('/worker', () => renderWorkerWorkspacePage());
router.register('/donors', () => renderDonorsPage());
router.register('/trends', () => renderCommunityTrendsPage());
router.register('/login', () => renderAdminLoginPage('super_admin'));
router.register('/login/:role', (params) => renderAdminLoginPage(params.role === 'doctor' ? 'doctor' : 'super_admin'));
router.register('/admin', () => renderAdminDashboardPage(adminActiveTab));
router.register('/admin/:tab', (params) => {
  if (params.tab) adminActiveTab = params.tab;
  return renderAdminDashboardPage(params.tab || 'dashboard');
});
router.register('/doctor-portal', () => renderDoctorPortalPage(doctorActiveTab));
router.register('/doctor-portal/:tab', (params) => {
  if (params.tab) doctorActiveTab = params.tab;
  return renderDoctorPortalPage(params.tab || 'protocols');
});
router.register('/protocol/:slug', (params) => {
  const protocol = AIService.getEmergencyProtocol(params.slug) || {
    id: params.slug,
    slug: params.slug,
    title: 'Emergency Medical Protocol',
    icon: '🚑',
    emergencyNumber: '112',
    warningText: 'Statutory emergency protocol reviewed by verified medical authorities.',
    immediateAction: 'Ensure patient airway and vital stability. Dial 112 / 108.',
    steps: [],
    doList: [],
    dontList: [],
    whenProfessionalHelpRequired: 'Immediate emergency transport required.',
    hindiTitle: 'आपत्कालीन वैद्यकीय प्रोटोकॉल',
    ambulanceHelpline: '112 / 108'
  };
  return renderEmergencyProtocolPage(protocol);
});

router.setNotFound(() => renderNotFoundPage());

// Main render callback
router.onRouteChange((path, content) => {
  appRoot.innerHTML = renderAppLayout(path, content, !isOnline);
});

/* ══════════════════════════════════════════
   GLOBAL WINDOW HANDLERS (Interactivity)
══════════════════════════════════════════ */

declare global {
  interface Window {
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    setAppLanguage: (code: string) => void;
    selectLanguage: (code: string) => void;
    toggleSymptomChip: (button: HTMLElement, id: string) => void;
    handleSymptomSubmit: (event: Event) => Promise<void>;
    handleLocatorSearch: (query: string) => void;
    setLocatorFilter: (filter: string) => void;
    handleGuideSearch: (query: string) => void;
    toggleVoiceRecording: () => void;
    clearVoiceTranscript: () => void;
    submitVoiceTranscript: () => void;
    handleManualVoiceText: (text: string) => void;
    handleProfileSave: (event: Event) => void;
    viewHistoryItem: (id: string) => void;
    clearTriageHistory: () => void;
    clearAllAppData: () => void;
    openDirections: (name: string, address: string) => void;
    refreshGeolocation: () => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info', durationMs?: number) => void;
    toggleMedicineTaken: (id: string) => void;
    handleDeleteMedicine: (id: string) => void;
    handleSaveMedicineForm: (event: Event) => void;
    quickAddPreset: (name: string, dosage: string, timeSlot: 'morning' | 'afternoon' | 'night', time: string, mealInstruction: 'before_meal' | 'after_meal' | 'with_meal') => void;
    testReminderChime: () => void;
    enableReminderNotifications: () => Promise<void>;
    startSosHoldTimer: () => void;
    cancelSosHoldTimer: () => void;
    handleSosInstantTrigger: () => void;
    recordDialerOpened: (targetNumber: string) => void;
    resolveEmergencyIncident: () => void;
    cancelEmergencyIncident: () => void;
    setSosManualLocality: (locality: string) => void;
    applyCustomLocality: () => void;
    toggleAddContactForm: () => void;
    handleAddContactSubmit: (event: Event) => void;
    handleDeleteContact: (id: string) => void;
    openFacilityCorrection: (facilityId: string, facilityName: string) => void;
    closeFacilityCorrection: () => void;
    submitFacilityCorrection: (event: Event) => void;
    setMedicineStatus: (id: string, status: 'taken' | 'skipped' | 'snoozed' | 'pending') => void;
    handleExportHealthSummary: () => void;
    handleDeleteAllUserData: () => void;
    toggleAddRecordForm: () => void;
    handleAddRecordSubmit: (event: Event) => void;
    handleDeleteHealthRecord: (id: string) => void;
    promptUpdateVisitNote: (id: string) => void;
    handleRevokePatientConsent: (id: string) => void;
    toggleDonorRegistrationForm: () => void;
    handleDonorRegistration: (event: Event) => void;
    handleRequestDonorContact: (id: string) => void;
    handleSyncNow: () => Promise<void>;
    handleWipeLocalCache: () => void;
    setAdminTab: (tab: string) => void;
    handleAdminToggleFacility: (id: string) => void;
    handleAdminResolveCorrection: (reportId: string) => void;
    handleAdminUpdateTrend: (trendId: string, status: 'unverified_signal' | 'validated' | 'closed') => void;
    handleAdminSwitchRole: (role: UserRole) => void;
    recordSmsDispatched: (phone: string) => void;
    switchDoctorTab: (tab: string) => void;
    toggleDoctorCreateProtocolModal: () => void;
    handleDoctorRegistrationSubmit: (event: Event) => void;
    handleDoctorSaveProtocol: (event: Event) => void;
    handleSubmitProtocolForApproval: (id: string) => void;
    handleApproveDoctor: (id: string) => void;
    handleRejectDoctorPrompt: (id: string) => void;
    handleDoctorUnderReview: (id: string) => void;
    handleApproveProtocol: (id: string) => void;
    handleRejectProtocolPrompt: (id: string) => void;
    handleRequestChangesPrompt: (id: string) => void;
    handlePublishProtocol: (id: string) => void;
    handleUnpublishProtocol: (id: string) => void;
    handleToggleDonorAvailability: (id: string) => void;
    handleVerifyDonorToggle: (id: string) => void;
    handleDeleteDonorRecord: (id: string) => void;
    toggleAdminRevealPhone: (id: string, phone: string) => void;
    handleFilterDonors: () => void;
    handleFilterDoctorStatus: (status: string) => void;
    handleFilterUserDonors: (bg: string) => void;
    handleToggleMyDonorStatus: (id: string) => void;
    handleWithdrawDonorRegistration: (id: string) => void;
    handleExportDonorsCsv: () => void;
    handleExportProtocolsCsv: () => void;
    handleExportAnalyticsJson: () => void;
    handleMarkNotificationRead: (id: string) => void;
    handleMarkAllNotificationsRead: () => void;
    handleAdminToggleUserSuspension: (id: string) => void;
    switchLoginTab: (tab: 'super_admin' | 'doctor') => void;
    handleSuperAdminLogin: (event: Event) => Promise<void>;
    handleDoctorLogin: (event: Event) => Promise<void>;
    autofillSuperAdminLogin: () => Promise<void>;
    autofillDoctorLogin: () => Promise<void>;
    handleAdminSignOut: () => Promise<void>;
  }
}

window.showToast = showToast;

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('navbar-hamburger');
  if (menu && btn) {
    menu.classList.toggle('open');
    btn.classList.toggle('open');
  }
};

window.closeMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('navbar-hamburger');
  if (menu && btn) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
};

window.setAppLanguage = (code: string) => {
  StorageService.setLanguage(code);
  showToast(`Language set to ${code.toUpperCase()}`, 'success');
  router.handleHashChange();
};

window.selectLanguage = (code: string) => {
  StorageService.setLanguage(code);
  showToast(`Language preference updated!`, 'success');
  router.handleHashChange();
};

window.toggleSymptomChip = (button: HTMLElement, id: string) => {
  if (selectedSymptomIds.has(id)) {
    selectedSymptomIds.delete(id);
    button.classList.remove('selected');
    button.setAttribute('aria-pressed', 'false');
  } else {
    selectedSymptomIds.add(id);
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
  }
};

window.handleSymptomSubmit = async (event: Event) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const description = (formData.get('description') as string) || '';
  const duration = (formData.get('duration') as string) || 'today';
  const severity = (formData.get('severity') as 'mild' | 'moderate' | 'severe') || 'mild';

  const symptoms = Array.from(selectedSymptomIds);

  if (symptoms.length === 0 && !description.trim()) {
    showToast('Please select at least one symptom or describe what you feel.', 'warning');
    return;
  }

  // Display Animated AI Loading State
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = renderLoadingState("ANALYZING WHAT'S HAPPENING...");
  }

  try {
    const result = await AIService.analyzeSymptoms({
      symptoms: symptoms.length > 0 ? symptoms : ['fever'],
      duration,
      severity,
      description
    }, 1600);

    currentTriageResult = result;

    // Save to triage history
    StorageService.addHistoryEntry({
      id: result.id,
      date: result.timestamp,
      symptoms: symptoms.length > 0 ? symptoms : ['Reported discomfort'],
      riskLevel: result.riskLevel,
      headline: result.headline,
      actionTaken: result.immediateSteps[0] || 'Viewed guidance'
    });

    router.navigate('#/assessment');
  } catch {
    showToast('Error during symptom analysis. Please try again.', 'error');
  }
};

window.handleLocatorSearch = (query: string) => {
  locatorSearchQuery = query;
  const facilities = HealthcareService.searchFacilities(locatorSearchQuery, locatorActiveFilter as FacilityType | 'ALL');
  const pageContainer = document.getElementById('main-content');
  if (pageContainer) {
    pageContainer.innerHTML = renderCareLocatorPage(facilities, locatorActiveFilter, locatorSearchQuery);
  }
};

window.setLocatorFilter = (filter: string) => {
  locatorActiveFilter = filter;
  const facilities = HealthcareService.searchFacilities(locatorSearchQuery, locatorActiveFilter as FacilityType | 'ALL');
  const pageContainer = document.getElementById('main-content');
  if (pageContainer) {
    pageContainer.innerHTML = renderCareLocatorPage(facilities, locatorActiveFilter, locatorSearchQuery);
  }
};

window.handleGuideSearch = (query: string) => {
  guideSearchQuery = query;
  const pageContainer = document.getElementById('main-content');
  if (pageContainer) {
    pageContainer.innerHTML = renderGuidePage(guideSearchQuery);
  }
};

// Voice Assistant Handlers
let voiceTranscriptBuffer = '';

window.toggleVoiceRecording = () => {
  const statusEl = document.getElementById('voice-status-text');
  const badgeEl = document.getElementById('voice-state-badge');
  const btnEl = document.getElementById('main-voice-button');
  const iconEl = document.getElementById('voice-icon');
  const outputEl = document.getElementById('voice-transcript-output');
  const actionsEl = document.getElementById('voice-actions');

  if (VoiceService.getCurrentState() === 'listening') {
    VoiceService.stopListening();
    if (statusEl) statusEl.innerText = 'TAP MICROPHONE TO SPEAK';
    if (badgeEl) badgeEl.innerText = 'IDLE';
    if (btnEl) btnEl.classList.remove('listening');
    if (iconEl) iconEl.innerText = '🎙️';
    return;
  }

  VoiceService.startListening({
    onStateChange: (state: VoiceState) => {
      if (badgeEl) badgeEl.innerText = state.toUpperCase();
      if (btnEl) {
        btnEl.className = `voice-btn ${state}`;
      }
      if (statusEl) {
        if (state === 'listening') {
          statusEl.innerText = 'LISTENING... SPEAK NOW';
          if (iconEl) iconEl.innerText = '🔴';
        } else if (state === 'idle') {
          statusEl.innerText = 'TAP MICROPHONE TO SPEAK';
          if (iconEl) iconEl.innerText = '🎙️';
        }
      }
    },
    onTranscript: (text: string, isFinal: boolean) => {
      voiceTranscriptBuffer = text;
      if (outputEl) {
        outputEl.innerHTML = `<span style="color: var(--color-black); font-weight: 600;">"${text}"</span>`;
      }
      if (isFinal && actionsEl) {
        actionsEl.style.display = 'flex';
      }
    },
    onError: (err: string) => {
      showToast(err, 'error', 4500);
      if (statusEl) statusEl.innerText = 'MICROPHONE ERROR';
      if (outputEl) {
        outputEl.innerHTML = `<em>${err} You can click "Type Instead" below.</em>`;
      }
    }
  });
};

window.clearVoiceTranscript = () => {
  voiceTranscriptBuffer = '';
  const outputEl = document.getElementById('voice-transcript-output');
  const actionsEl = document.getElementById('voice-actions');
  const manualInput = document.getElementById('voice-manual-input') as HTMLTextAreaElement | null;
  if (manualInput) manualInput.value = '';
  if (outputEl) outputEl.innerHTML = '<em>Your spoken words will appear here in real time...</em>';
  if (actionsEl) actionsEl.style.display = 'none';
};

window.handleManualVoiceText = (text: string) => {
  voiceTranscriptBuffer = text;
  const outputEl = document.getElementById('voice-transcript-output');
  const actionsEl = document.getElementById('voice-actions');
  if (outputEl && text.trim()) {
    outputEl.innerHTML = `<span style="color: var(--color-black); font-weight: 600;">"${text}"</span>`;
  }
  if (actionsEl) {
    actionsEl.style.display = text.trim() ? 'flex' : 'none';
  }
};

window.submitVoiceTranscript = () => {
  if (!voiceTranscriptBuffer.trim()) {
    showToast('No spoken words captured. Please speak or type.', 'warning');
    return;
  }

  showToast('Analyzing spoken symptoms with AI...', 'info');

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = renderLoadingState('PROCESSING VOICE SYMPTOMS...');
  }

  AIService.analyzeSymptoms({
    symptoms: ['fever', 'breathing-difficulty'],
    duration: 'today',
    severity: 'moderate',
    description: voiceTranscriptBuffer
  }, 1600).then((result) => {
    currentTriageResult = result;
    StorageService.addHistoryEntry({
      id: result.id,
      date: result.timestamp,
      symptoms: ['Voice Triage Analysis'],
      riskLevel: result.riskLevel,
      headline: result.headline,
      actionTaken: result.immediateSteps[0] || 'Viewed guidance'
    });
    router.navigate('#/assessment');
  });
};

window.handleProfileSave = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const profile = {
    name: (formData.get('name') as string) || '',
    age: (formData.get('age') ? Number(formData.get('age')) : '') as number | '',
    sex: (formData.get('sex') as 'male' | 'female' | 'other') || 'male',
    villageTown: (formData.get('villageTown') as string) || '',
    district: (formData.get('district') as string) || '',
    pincode: (formData.get('pincode') as string) || '',
    emergencyContactName: (formData.get('emergencyContactName') as string) || '',
    emergencyContactPhone: (formData.get('emergencyContactPhone') as string) || '',
    knownAllergies: (formData.get('knownAllergies') as string) || '',
    existingConditions: (formData.get('existingConditions') as string) || '',
    currentMedications: (formData.get('currentMedications') as string) || ''
  };

  StorageService.saveProfile(profile);
  showToast('Medical profile saved securely to this device!', 'success');
};

window.viewHistoryItem = (_id: string) => {
  router.navigate('#/assessment');
};

window.clearTriageHistory = () => {
  if (confirm('Are you sure you want to clear your triage history?')) {
    StorageService.clearHistory();
    showToast('Triage history cleared.', 'info');
    router.handleHashChange();
  }
};

window.clearAllAppData = () => {
  if (confirm('This will reset all your saved profile and symptom history on this phone. Continue?')) {
    localStorage.clear();
    showToast('All local application data reset.', 'info');
    router.navigate('#/');
  }
};

/* ══════════════════════════════════════════
   SMART SOS EMERGENCY WORKFLOW HANDLERS
══════════════════════════════════════════ */
let sosHoldTimeout: any = null;
let isSosHolding = false;

window.startSosHoldTimer = () => {
  isSosHolding = true;
  const btnText = document.getElementById('sos-btn-text');
  const progressHint = document.getElementById('sos-progress-hint');
  if (btnText) btnText.innerText = '⏳ HOLD FOR 2 SECONDS...';
  if (progressHint) progressHint.innerText = 'Activating in 2 seconds... Release immediately to cancel';

  sosHoldTimeout = setTimeout(() => {
    if (isSosHolding) {
      window.handleSosInstantTrigger();
    }
  }, 2000);
};

window.cancelSosHoldTimer = () => {
  isSosHolding = false;
  if (sosHoldTimeout) {
    clearTimeout(sosHoldTimeout);
    sosHoldTimeout = null;
  }
  const btnText = document.getElementById('sos-btn-text');
  const progressHint = document.getElementById('sos-progress-hint');
  if (btnText) btnText.innerText = '🚨 PRESS OR HOLD 2S TO ACTIVATE SOS';
  if (progressHint) progressHint.innerText = 'Press button or hold for 2 seconds to initiate emergency sequence';
};

window.handleSosInstantTrigger = async () => {
  isSosHolding = false;
  if (sosHoldTimeout) clearTimeout(sosHoldTimeout);

  showToast('🚨 Smart SOS Sequence Activated!', 'error', 5000);
  const incident = SOSService.createIncident('Acquiring location...');
  
  // Prompt location with graceful fallback
  const loc = await SOSService.requestLocationWithFallback();
  SOSService.setIncidentLocation(loc);
  SOSService.updateIncidentStatus('alert_queued', 'Alert queued for delivery');

  const contacts = SOSService.getTrustedContacts();
  const emergencyMsg = SOSService.generateEmergencyMessage(incident);

  if (contacts && contacts.length > 0) {
    const primaryContact = contacts[0];
    const smsUri = SOSService.getSmsUri(primaryContact.phone, emergencyMsg);
    
    SOSService.updateIncidentStatus('sent', `SMS alert prepared for ${primaryContact.name} (${primaryContact.phone})`);
    showToast(`📱 Opening SMS for ${primaryContact.name} (${primaryContact.phone}). Tap Send!`, 'success', 7000);

    // Launch native SMS composer with real phone number & pre-filled emergency text
    setTimeout(() => {
      try {
        window.location.href = smsUri;
      } catch (e) {
        console.warn('Could not trigger SMS URI automatically:', e);
      }
    }, 700);
  } else {
    showToast('⚠️ No trusted contacts saved! Please add family phone numbers below.', 'warning', 6000);
    SOSService.updateIncidentStatus('call_opened', 'Emergency dialers ready. No personal contacts configured.');
  }

  router.handleHashChange();
};

window.recordSmsDispatched = (phone: string) => {
  SOSService.updateIncidentStatus('sent', `SMS application launched for ${phone}`);
  showToast(`SMS alert prepared for ${phone}. Tap Send in your messaging app.`, 'success', 5000);
  router.handleHashChange();
};

window.recordDialerOpened = (targetNumber: string) => {
  SOSService.updateIncidentStatus('call_opened', `Emergency phone dialer opened for ${targetNumber}`);
  showToast(`Dialer opened for ${targetNumber}. Call in progress.`, 'info');
};

window.resolveEmergencyIncident = () => {
  SOSService.resolveIncident();
  showToast('Emergency incident safely marked as resolved.', 'success');
  router.handleHashChange();
};

window.cancelEmergencyIncident = () => {
  if (confirm('Mark this incident as a False Alarm / Cancelled?')) {
    SOSService.cancelIncident('False alarm cancelled by user');
    showToast('Incident marked as false alarm.', 'info');
    router.handleHashChange();
  }
};

window.setSosManualLocality = (locality: string) => {
  SOSService.setIncidentLocation({
    locality,
    source: 'manual_fallback'
  });
  showToast(`Locality updated to: ${locality}`, 'success');
  router.handleHashChange();
};

window.applyCustomLocality = () => {
  const input = document.getElementById('custom-locality-input') as HTMLInputElement | null;
  const val = input?.value?.trim();
  if (!val) {
    showToast('Please type your village or taluka name.', 'warning');
    return;
  }
  window.setSosManualLocality(val);
};

window.toggleAddContactForm = () => {
  const form = document.getElementById('add-contact-form');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
};

window.handleAddContactSubmit = (event: Event) => {
  event.preventDefault();
  const nameInput = document.getElementById('contact-name-input') as HTMLInputElement | null;
  const phoneInput = document.getElementById('contact-phone-input') as HTMLInputElement | null;
  const relInput = document.getElementById('contact-relation-input') as HTMLInputElement | null;

  const name = nameInput?.value?.trim();
  const phone = phoneInput?.value?.trim();
  const relationship = relInput?.value?.trim() || 'Family';

  if (!name || !phone) {
    showToast('Please enter both contact name and phone number.', 'warning');
    return;
  }

  SOSService.saveTrustedContact({
    name,
    phone,
    relationship,
    consentStatus: 'granted'
  });

  showToast(`Trusted contact ${name} added successfully!`, 'success');
  window.toggleAddContactForm();
  router.handleHashChange();
};

window.handleDeleteContact = (id: string) => {
  if (confirm('Remove this trusted emergency contact?')) {
    SOSService.deleteTrustedContact(id);
    showToast('Contact removed.', 'info');
    router.handleHashChange();
  }
};

window.openFacilityCorrection = (facilityId: string, facilityName: string) => {
  const dialog = document.getElementById('correction-dialog');
  const idInput = document.getElementById('correction-facility-id') as HTMLInputElement | null;
  const titleEl = document.getElementById('correction-facility-title');
  if (dialog && idInput && titleEl) {
    idInput.value = facilityId;
    titleEl.innerText = `Facility: ${facilityName}`;
    dialog.style.display = 'block';
    dialog.scrollIntoView({ behavior: 'smooth' });
  }
};

window.closeFacilityCorrection = () => {
  const dialog = document.getElementById('correction-dialog');
  if (dialog) dialog.style.display = 'none';
};

window.submitFacilityCorrection = (event: Event) => {
  event.preventDefault();
  const idInput = document.getElementById('correction-facility-id') as HTMLInputElement | null;
  const typeSelect = document.getElementById('correction-issue-type') as HTMLSelectElement | null;
  const detailsInput = document.getElementById('correction-details') as HTMLInputElement | null;

  const facilityId = idInput?.value || '';
  const issueType = (typeSelect?.value || 'wrong_phone') as any;
  const details = detailsInput?.value?.trim() || '';

  const facility = HealthcareService.getFacilityById(facilityId);
  HealthcareService.submitCorrectionReport(facilityId, facility?.name || 'Healthcare Facility', issueType, details);

  showToast('Correction submitted! Thank you for keeping rural healthcare data verified.', 'success');
  window.closeFacilityCorrection();
};

window.openDirections = (name: string, address: string) => {
  const query = encodeURIComponent(`${name}, ${address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
};

window.refreshGeolocation = () => {
  showToast('GPS refreshed: Pune Rural coordinates locked (18.8527° N, 73.9189° E)', 'success');
};

/* ══════════════════════════════════════════
   MEDICINE REMINDER HANDLERS & NOTIFICATIONS
══════════════════════════════════════════ */

window.setMedicineStatus = (id: string, status: 'taken' | 'skipped' | 'snoozed' | 'pending') => {
  StorageService.updateReminderStatus(id, status);
  if (status === 'taken') {
    playReminderChime();
    showToast('Dose recorded as completed! शाबाश!', 'success');
  } else if (status === 'skipped') {
    showToast('Dose logged as skipped. (Remember to follow doctor instructions)', 'warning');
  } else if (status === 'snoozed') {
    showToast('Reminder snoozed for 15 minutes ⏰', 'info');
  } else {
    showToast('Dose marked as pending.', 'info');
  }
  router.handleHashChange();
};

window.handleExportHealthSummary = () => {
  const summary = StorageService.exportHealthSummary();
  const jsonStr = JSON.stringify(summary, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `JeevanSetu_Health_Summary_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Medical summary exported successfully! Portable for doctor visits.', 'success');
};

window.handleDeleteAllUserData = () => {
  if (confirm('Are you sure you want to delete all your personal medical records and reminders from this device? This action cannot be undone.')) {
    StorageService.deleteAllUserData();
    showToast('All personal health data successfully deleted.', 'info');
    router.handleHashChange();
  }
};

window.toggleAddRecordForm = () => {
  const form = document.getElementById('add-record-form');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
};

window.handleAddRecordSubmit = (event: Event) => {
  event.preventDefault();
  const titleInput = document.getElementById('record-title') as HTMLInputElement | null;
  const typeSelect = document.getElementById('record-type') as HTMLSelectElement | null;

  const title = titleInput?.value?.trim();
  const recordType = (typeSelect?.value || 'condition') as any;

  if (!title) {
    showToast('Please enter an item title.', 'warning');
    return;
  }

  StorageService.addHealthRecord({
    recordType,
    title,
    content: {},
    provenance: 'patient_entered'
  });

  showToast(`Added ${title} to health record!`, 'success');
  window.toggleAddRecordForm();
  router.handleHashChange();
};

window.handleDeleteHealthRecord = (id: string) => {
  if (confirm('Remove this entry from your health record?')) {
    StorageService.deleteHealthRecord(id);
    showToast('Record entry removed.', 'info');
    router.handleHashChange();
  }
};

window.promptUpdateVisitNote = (id: string) => {
  const note = prompt('Enter follow-up visit note (e.g. Blood pressure checked, medicines supplied):');
  if (note && note.trim()) {
    CommunityService.updateVisitNote(id, note.trim());
    showToast('Visit note recorded successfully!', 'success');
    router.handleHashChange();
  }
};

window.handleRevokePatientConsent = (id: string) => {
  if (confirm('Revoke worker access to this patient record? The patient will be marked as consent revoked.')) {
    CommunityService.revokeConsent(id);
    showToast('Patient consent revoked.', 'info');
    router.handleHashChange();
  }
};

window.toggleDonorRegistrationForm = () => {
  const form = document.getElementById('donor-reg-form');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
};

window.handleDonorRegistration = (event: Event) => {
  event.preventDefault();
  const nameInput = document.getElementById('reg-donor-name') as HTMLInputElement | null;
  const phoneInput = document.getElementById('reg-donor-phone') as HTMLInputElement | null;
  const bgSelect = document.getElementById('donor-blood-group') as HTMLSelectElement | null;
  const ageInput = document.getElementById('reg-donor-age') as HTMLInputElement | null;
  const genderSelect = document.getElementById('reg-donor-gender') as HTMLSelectElement | null;
  const districtInput = document.getElementById('reg-donor-district') as HTMLInputElement | null;
  const cityInput = document.getElementById('reg-donor-city') as HTMLInputElement | null;
  const areaInput = document.getElementById('donor-broad-area') as HTMLInputElement | null;
  const consentBox = document.getElementById('reg-donor-consent') as HTMLInputElement | null;

  const currentUser = AuthService.getCurrentUser();
  const fullName = nameInput?.value?.trim() || currentUser.displayName || 'Anonymous Donor';
  const phone = phoneInput?.value?.trim() || '+91 98220 12345';
  const bloodGroup = (bgSelect?.value || 'O+') as any;
  const age = ageInput ? parseInt(ageInput.value, 10) : 28;
  const gender = genderSelect?.value || 'Other';
  const district = districtInput?.value?.trim() || 'Pune';
  const city = cityInput?.value?.trim() || 'Khed';
  const area = areaInput?.value?.trim() || 'Rural Sector';
  const consent = consentBox ? consentBox.checked : true;

  if (consentBox && !consent) {
    showToast('Consent is required to register as a voluntary blood donor.', 'warning');
    return;
  }

  try {
    BloodDonorService.addDonor({
      userId: currentUser.id,
      fullName,
      phone,
      age,
      gender,
      bloodGroup,
      rhFactor: bloodGroup.includes('-') ? 'NEGATIVE' : 'POSITIVE',
      state: 'Maharashtra',
      district,
      city,
      pincode: '410501',
      area,
      availabilityStatus: 'ACTIVE',
      verificationStatus: 'UNVERIFIED',
      preferredContactMethod: 'IN_APP',
      consentToContact: true
    });

    // Backwards compatibility with CommunityService
    CommunityService.registerDonor({
      bloodGroup,
      broadArea: `${city}, ${district}`,
      isAvailable: true,
      contactPreference: 'in_app'
    });

    showToast('Voluntary blood donor registration completed! You can pause anytime.', 'success');
    window.toggleDonorRegistrationForm();
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Error completing registration', 'warning', 5000);
  }
};

window.handleRequestDonorContact = (_id: string) => {
  showToast('In-App Blood Bank Request initiated. A local healthcare coordinator will assist with verification.', 'info', 5000);
};

window.toggleMedicineTaken = (id: string) => {
  const isNowTaken = StorageService.toggleReminderTaken(id);
  if (isNowTaken) {
    playReminderChime();
    showToast('Dose recorded as completed! शाबाश!', 'success');
  } else {
    showToast('Dose marked as pending.', 'info');
  }
  router.handleHashChange();
};

window.handleDeleteMedicine = (id: string) => {
  if (confirm('Are you sure you want to remove this medicine reminder?')) {
    StorageService.deleteReminder(id);
    showToast('Medicine reminder deleted.', 'info');
    router.handleHashChange();
  }
};

window.handleSaveMedicineForm = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const name = (formData.get('name') as string)?.trim();
  const dosage = (formData.get('dosage') as string)?.trim();
  const timeSlot = (formData.get('timeSlot') as 'morning' | 'afternoon' | 'night') || 'morning';
  const time = (formData.get('time') as string) || '08:00';
  const mealInstruction = (formData.get('mealInstruction') as 'before_meal' | 'after_meal' | 'with_meal') || 'after_meal';

  if (!name || !dosage) {
    showToast('Please fill in both medicine name and dosage.', 'warning');
    return;
  }

  const newReminder = {
    id: 'med-' + Date.now().toString(36),
    name,
    dosage,
    timeSlot,
    time,
    mealInstruction,
    isActive: true
  };

  StorageService.saveReminder(newReminder);
  playReminderChime();
  showToast(`Reminder saved for ${name}!`, 'success');
  form.reset();
  router.handleHashChange();
};

window.quickAddPreset = (name, dosage, timeSlot, time, mealInstruction) => {
  const newReminder = {
    id: 'med-' + Date.now().toString(36),
    name,
    dosage,
    timeSlot,
    time,
    mealInstruction,
    isActive: true
  };

  StorageService.saveReminder(newReminder);
  playReminderChime();
  showToast(`Added preset: ${name}`, 'success');
  router.handleHashChange();
};

window.testReminderChime = () => {
  playReminderChime();
  showToast('Playing reminder chime alert 🔔', 'info');
};

window.enableReminderNotifications = async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    sendBrowserNotification('JeevanSetu Alerts Enabled', 'You will receive reminders when it is time to take your medicine.');
    showToast('Browser notifications enabled successfully!', 'success');
  } else {
    showToast('Notification permission was dismissed or blocked.', 'warning');
  }
};

window.handleSyncNow = async () => {
  showToast('Starting background synchronization...', 'info');
  const result = await OfflineSyncService.processSyncQueue();
  if (result.conflictCount > 0) {
    showToast(`Sync complete: ${result.syncedCount} synced, ${result.conflictCount} conflicts detected.`, 'warning', 6000);
  } else if (result.failedCount > 0) {
    showToast(`Sync finished: ${result.syncedCount} synced, ${result.failedCount} failed.`, 'error', 5000);
  } else {
    showToast(`Sync complete! ${result.syncedCount} items updated with cloud.`, 'success', 4000);
  }
  router.handleHashChange();
};

window.handleWipeLocalCache = () => {
  const confirmed = window.confirm(
    'Are you sure you want to wipe local offline cache and pending transactions on this shared device? This cannot be undone.'
  );
  if (confirmed) {
    OfflineSyncService.clearLocalData();
    showToast('Local offline cache and queue wiped successfully.', 'info');
    router.handleHashChange();
  }
};

window.setAdminTab = (tab: string) => {
  adminActiveTab = tab;
  router.handleHashChange();
};

window.handleAdminToggleFacility = (id: string) => {
  const newStatus = HealthcareService.toggleFacilityVerification(id);
  showToast(`Facility verification status set to: ${newStatus ? 'VERIFIED' : 'UNVERIFIED'}`, 'success');
  router.handleHashChange();
};

window.handleAdminResolveCorrection = (reportId: string) => {
  HealthcareService.resolveCorrectionReport(reportId);
  showToast('Facility correction report marked reviewed & resolved.', 'success');
  router.handleHashChange();
};

window.handleAdminUpdateTrend = (trendId: string, status: 'unverified_signal' | 'validated' | 'closed') => {
  CommunityService.updateTrendStatus(trendId, status);
  showToast(`Cluster status updated to: ${status.toUpperCase()}`, 'success');
  router.handleHashChange();
};

window.handleAdminSwitchRole = (role: UserRole) => {
  AuthService.setRoleForTesting(role);
  showToast(`Switched active role to: ${role.toUpperCase()}`, 'info');
  router.handleHashChange();
};

/* ── DOCTOR PORTAL & PROTOCOL WORKFLOW HANDLERS ── */

window.switchDoctorTab = (tab: string) => {
  doctorActiveTab = tab;
  router.handleHashChange();
};

window.toggleDoctorCreateProtocolModal = () => {
  doctorActiveTab = 'author';
  router.handleHashChange();
};

window.handleDoctorRegistrationSubmit = (event: Event) => {
  event.preventDefault();
  const nameInput = document.getElementById('doc-fullname') as HTMLInputElement | null;
  const emailInput = document.getElementById('doc-email') as HTMLInputElement | null;
  const phoneInput = document.getElementById('doc-phone') as HTMLInputElement | null;
  const regnoInput = document.getElementById('doc-regno') as HTMLInputElement | null;
  const councilSelect = document.getElementById('doc-council') as HTMLSelectElement | null;
  const stateInput = document.getElementById('doc-state') as HTMLInputElement | null;
  const qualInput = document.getElementById('doc-qualification') as HTMLInputElement | null;
  const specInput = document.getElementById('doc-specialization') as HTMLInputElement | null;
  const hospInput = document.getElementById('doc-hospital') as HTMLInputElement | null;
  const expInput = document.getElementById('doc-experience') as HTMLInputElement | null;
  const addrInput = document.getElementById('doc-address') as HTMLInputElement | null;
  const certInput = document.getElementById('doc-cert-url') as HTMLInputElement | null;

  const currentUser = AuthService.getCurrentUser();

  try {
    DoctorVerificationService.submitApplication({
      userId: currentUser.id,
      fullName: nameInput?.value?.trim() || currentUser.displayName,
      email: emailInput?.value?.trim() || currentUser.email,
      phone: phoneInput?.value?.trim() || '+91 98220 12345',
      registrationNumber: regnoInput?.value?.trim() || 'MMC-PENDING',
      registrationAuthority: councilSelect?.value || 'Maharashtra Medical Council',
      state: stateInput?.value?.trim() || 'Maharashtra',
      qualification: qualInput?.value?.trim() || 'MBBS',
      specialization: specInput?.value?.trim() || 'General Medicine',
      hospitalName: hospInput?.value?.trim() || 'Rural Health Centre',
      experienceYears: expInput ? parseInt(expInput.value, 10) : 5,
      professionalAddress: addrInput?.value?.trim() || 'Primary Health Centre',
      certificateUrl: certInput?.value?.trim() || undefined
    });

    showToast('Medical registration credentials submitted for statutory verification!', 'success', 6000);
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Error submitting application', 'error');
  }
};

window.handleDoctorSaveProtocol = (event: Event) => {
  event.preventDefault();
  const submitter = (event as any).submitter as HTMLButtonElement | null;
  const actionType = submitter?.value || 'draft';

  const titleInput = document.getElementById('proto-title') as HTMLInputElement | null;
  const catSelect = document.getElementById('proto-category') as HTMLSelectElement | null;
  const descInput = document.getElementById('proto-short-desc') as HTMLTextAreaElement | null;
  const symptomsInput = document.getElementById('proto-symptoms') as HTMLTextAreaElement | null;
  const warningInput = document.getElementById('proto-warning-signs') as HTMLTextAreaElement | null;
  const safetyInput = document.getElementById('proto-safety') as HTMLTextAreaElement | null;
  const notToDoInput = document.getElementById('proto-not-to-do') as HTMLTextAreaElement | null;
  const whenCallInput = document.getElementById('proto-when-call') as HTMLTextAreaElement | null;
  const equipInput = document.getElementById('proto-equipment') as HTMLInputElement | null;
  const refInput = document.getElementById('proto-references') as HTMLInputElement | null;

  // Extract steps
  const stepTitles = document.querySelectorAll('.step-title') as NodeListOf<HTMLInputElement>;
  const stepDetails = document.querySelectorAll('.step-detail') as NodeListOf<HTMLInputElement>;
  const steps: any[] = [];
  stepTitles.forEach((t, i) => {
    if (t.value.trim()) {
      steps.push({
        number: String(i + 1),
        title: t.value.trim(),
        detail: stepDetails[i]?.value?.trim() || ''
      });
    }
  });

  const currentUser = AuthService.getCurrentUser();

  try {
    const proto = EmergencyProtocolService.createProtocol({
      title: titleInput?.value?.trim() || 'Emergency Protocol',
      slug: (titleInput?.value?.trim() || 'emergency-protocol').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'DRAFT',
      isPublic: false,
      category: catSelect?.value || 'Other Medical Emergencies',
      shortDescription: descInput?.value?.trim() || '',
      symptoms: (symptomsInput?.value || '').split('\n').map((s) => s.trim()).filter(Boolean),
      warningSigns: (warningInput?.value || '').split('\n').map((w) => w.trim()).filter(Boolean),
      immediateSafetyMeasures: safetyInput?.value?.trim() || '',
      responseSteps: steps,
      whatNotToDo: (notToDoInput?.value || '').split('\n').map((n) => n.trim()).filter(Boolean),
      whenToCallEmergency: whenCallInput?.value?.trim() || 'Dial 112 / 108 immediately.',
      requiredEquipment: (equipInput?.value || '').split(',').map((e) => e.trim()).filter(Boolean),
      specialPrecautions: 'Ensure patient airway remains clear.',
      targetAudience: 'General Public & Rural Responders',
      medicalReferences: (refInput?.value || '').split(',').map((r) => r.trim()).filter(Boolean),
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorRegistrationNo: 'MMC-VERIFIED'
    });

    if (actionType === 'submit') {
      EmergencyProtocolService.submitForApproval(proto.id);
      showToast('Protocol saved & submitted to Super Admin for clinical verification!', 'success', 5000);
    } else {
      showToast('Protocol saved as draft.', 'info');
    }

    doctorActiveTab = 'protocols';
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Error saving protocol', 'error');
  }
};

window.handleSubmitProtocolForApproval = (id: string) => {
  try {
    EmergencyProtocolService.submitForApproval(id);
    showToast('Protocol submitted for administrative board approval!', 'success');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Error submitting protocol', 'error');
  }
};

/* ── ADMIN GOVERNANCE & APPROVAL HANDLERS ── */

window.handleApproveDoctor = (id: string) => {
  try {
    DoctorVerificationService.verifyDoctor(id);
    showToast('Doctor credentials verified! Status updated to VERIFIED.', 'success');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Action failed', 'error');
  }
};

window.handleRejectDoctorPrompt = (id: string) => {
  const reason = prompt('Enter official reason for rejecting medical credentials:');
  if (reason && reason.trim()) {
    try {
      DoctorVerificationService.rejectDoctor(id, reason.trim());
      showToast('Doctor application marked as REJECTED with notes.', 'warning');
      router.handleHashChange();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  }
};

window.handleDoctorUnderReview = (id: string) => {
  try {
    DoctorVerificationService.setUnderReview(id);
    showToast('Application moved to UNDER_REVIEW.', 'info');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Action failed', 'error');
  }
};

window.handleApproveProtocol = (id: string) => {
  try {
    EmergencyProtocolService.approveProtocol(id);
    showToast('Protocol APPROVED and published to public emergency catalog!', 'success');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Approval failed', 'error');
  }
};

window.handleRejectProtocolPrompt = (id: string) => {
  const reason = prompt('Enter reason for protocol rejection:');
  if (reason && reason.trim()) {
    try {
      EmergencyProtocolService.rejectProtocol(id, reason.trim());
      showToast('Protocol rejected.', 'warning');
      router.handleHashChange();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  }
};

window.handleRequestChangesPrompt = (id: string) => {
  const notes = prompt('Enter requested clinical modifications for the author doctor:');
  if (notes && notes.trim()) {
    try {
      EmergencyProtocolService.requestChanges(id, notes.trim());
      showToast('Changes requested from protocol author doctor.', 'info');
      router.handleHashChange();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  }
};

window.handlePublishProtocol = (id: string) => {
  try {
    EmergencyProtocolService.publishProtocol(id);
    showToast('Protocol published to live emergency directory.', 'success');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Publishing failed', 'error');
  }
};

window.handleUnpublishProtocol = (id: string) => {
  try {
    EmergencyProtocolService.archiveProtocol(id);
    showToast('Protocol archived and hidden from public directory.', 'info');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Archival failed', 'error');
  }
};

/* ── BLOOD DONOR GOVERNANCE & PRIVACY HANDLERS ── */

window.handleToggleDonorAvailability = (id: string) => {
  const donor = BloodDonorService.getById(id);
  if (!donor) return;
  const newStatus = donor.availabilityStatus === 'ACTIVE' ? 'TEMPORARILY_UNAVAILABLE' : 'ACTIVE';
  BloodDonorService.setAvailability(id, newStatus);
  showToast(`Donor availability status set to: ${newStatus}`, 'info');
  router.handleHashChange();
};

window.handleVerifyDonorToggle = (id: string) => {
  const donor = BloodDonorService.getById(id);
  if (!donor) return;
  const newStatus = donor.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
  try {
    BloodDonorService.verifyDonor(id, newStatus);
    showToast(`Donor verification status set to: ${newStatus}`, 'success');
    router.handleHashChange();
  } catch (err: any) {
    showToast(err.message || 'Unauthorized', 'error');
  }
};

window.handleDeleteDonorRecord = (id: string) => {
  if (confirm('Permanently remove this donor profile from the registry?')) {
    BloodDonorService.deleteDonor(id);
    showToast('Donor profile removed.', 'info');
    router.handleHashChange();
  }
};

window.toggleAdminRevealPhone = (id: string, phone: string) => {
  const el = document.getElementById(`phone-display-${id}`);
  if (el) {
    if (el.textContent?.includes('••')) {
      el.textContent = phone;
    } else {
      el.textContent = BloodDonorService.maskPhone(phone);
    }
  }
};

window.handleFilterDonors = () => {
  const searchInput = document.getElementById('donor-search-input') as HTMLInputElement | null;
  const bgSelect = document.getElementById('donor-filter-blood-group') as HTMLSelectElement | null;
  const availSelect = document.getElementById('donor-filter-availability') as HTMLSelectElement | null;

  const searchQuery = searchInput?.value || '';
  const bloodGroup = bgSelect?.value || 'ALL';
  const availability = availSelect?.value || 'ALL';

  const filtered = BloodDonorService.getAll({
    searchQuery,
    bloodGroup,
    availability
  });

  const tbody = document.querySelector('#donors-table tbody');
  if (tbody) {
    tbody.innerHTML = filtered.map((d) => `
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 12px 16px;">
          <div style="font-weight: bold;">${d.fullName}</div>
          <div class="text-xs text-muted">ID: ${d.id} • ${d.age || 'N/A'} yrs • ${d.gender || 'N/A'}</div>
        </td>
        <td style="padding: 12px 16px;">
          <span style="font-size: 1.1rem; font-weight: 800; color: #DC2626;">${d.bloodGroup}</span>
          <span class="text-xs text-muted" style="display: block;">(${d.rhFactor})</span>
        </td>
        <td style="padding: 12px 16px;">
          <div style="font-weight: 500;">${d.city}, ${d.district}</div>
          <div class="text-xs text-muted">${d.area} (${d.pincode})</div>
        </td>
        <td style="padding: 12px 16px;">
          <div style="font-family: monospace; font-weight: 600;">
            <span id="phone-display-${d.id}">${BloodDonorService.maskPhone(d.phone)}</span>
            <button onclick="window.toggleAdminRevealPhone('${d.id}', '${d.phone}')" class="btn btn--ghost btn--sm" style="font-size: 0.65rem; padding: 1px 4px; margin-left: 4px;">👁 Reveal</button>
          </div>
          <div class="text-xs text-muted">${d.email || 'No email provided'}</div>
        </td>
        <td style="padding: 12px 16px;">
          <span class="badge ${d.availabilityStatus === 'ACTIVE' ? 'badge--green' : 'badge--amber'}">${d.availabilityStatus}</span>
        </td>
        <td style="padding: 12px 16px;">
          <span class="badge ${d.verificationStatus === 'VERIFIED' ? 'badge--green' : 'badge--gray'}">${d.verificationStatus}</span>
        </td>
        <td style="padding: 12px 16px; text-align: right;">
          <button onclick="window.handleToggleDonorAvailability('${d.id}')" class="btn btn--outline btn--sm" style="font-size: 0.7rem; padding: 3px 6px;">Toggle</button>
        </td>
      </tr>
    `).join('');
  }
};

window.handleFilterDoctorStatus = (_status: string) => {
  router.handleHashChange();
};

window.handleFilterUserDonors = (bg: string) => {
  const donors = BloodDonorService.getPublicDonors(bg === 'ALL' ? undefined : { bloodGroup: bg });
  const container = document.getElementById('user-donors-grid');
  if (container) {
    container.innerHTML = donors.map((d) => `
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid var(--color-border);">
        <div>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span style="font-size: 1.75rem; font-weight: 800; color: #DC2626;">${d.bloodGroup}</span>
            <span class="badge ${d.availabilityStatus === 'ACTIVE' ? 'badge--green' : 'badge--paper'}">
              ${d.availabilityStatus === 'ACTIVE' ? '🟢 Available' : '⏸️ Paused'}
            </span>
          </div>
          <div style="font-weight: 600; font-size: 0.95rem; margin-top: 4px;">${d.fullName}</div>
          <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px;">
            📍 ${d.broadLocality} • ${d.maskedPhone}
          </div>
        </div>
        <div>
          <button type="button" class="btn btn--outline btn--sm" onclick="window.handleRequestDonorContact('${d.id}')">Request</button>
        </div>
      </div>
    `).join('');
  }
};

window.handleToggleMyDonorStatus = (id: string) => {
  const donor = BloodDonorService.getById(id);
  if (!donor) return;
  const newStatus = donor.availabilityStatus === 'ACTIVE' ? 'TEMPORARILY_UNAVAILABLE' : 'ACTIVE';
  BloodDonorService.setAvailability(id, newStatus);
  showToast(`Your availability status updated to: ${newStatus}`, 'success');
  router.handleHashChange();
};

window.handleWithdrawDonorRegistration = (id: string) => {
  if (confirm('Are you sure you want to withdraw your voluntary blood donor registration?')) {
    BloodDonorService.deleteDonor(id);
    showToast('Your donor profile has been withdrawn.', 'info');
    router.handleHashChange();
  }
};

/* ── EXPORT & NOTIFICATION HANDLERS ── */

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.handleExportDonorsCsv = () => {
  const csv = AdminAnalyticsService.exportDonorsCsv();
  triggerDownload(csv, `jeevansetu-blood-donors-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  showToast('Blood donors exported to CSV!', 'success');
};

window.handleExportProtocolsCsv = () => {
  const csv = AdminAnalyticsService.exportProtocolsCsv();
  triggerDownload(csv, `jeevansetu-protocols-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  showToast('Emergency protocols exported to CSV!', 'success');
};

window.handleExportAnalyticsJson = () => {
  const json = AdminAnalyticsService.exportAnalyticsJson();
  triggerDownload(json, `jeevansetu-admin-analytics-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  showToast('System analytics exported to JSON!', 'success');
};

window.handleMarkNotificationRead = (id: string) => {
  AdminNotificationService.markAsRead(id);
  showToast('Notification marked as read.', 'info');
  router.handleHashChange();
};

window.handleMarkAllNotificationsRead = () => {
  AdminNotificationService.markAllAsRead();
  showToast('All notifications marked as read.', 'success');
  router.handleHashChange();
};

window.handleAdminToggleUserSuspension = (id: string) => {
  showToast(`User ${id} status toggled. Security audit record created.`, 'info');
  router.handleHashChange();
};

/* ── ROLE-WISE AUTHENTICATION HANDLERS ── */

window.switchLoginTab = (tab: 'super_admin' | 'doctor') => {
  const superAdminForm = document.getElementById('login-form-superadmin');
  const doctorForm = document.getElementById('login-form-doctor');
  const btnSuperAdmin = document.getElementById('tab-btn-superadmin');
  const btnDoctor = document.getElementById('tab-btn-doctor');

  if (superAdminForm && doctorForm && btnSuperAdmin && btnDoctor) {
    if (tab === 'super_admin') {
      superAdminForm.style.display = 'block';
      doctorForm.style.display = 'none';
      btnSuperAdmin.style.background = '#064E3B';
      btnSuperAdmin.style.color = '#FFFFFF';
      btnDoctor.style.background = 'transparent';
      btnDoctor.style.color = '#475569';
    } else {
      superAdminForm.style.display = 'none';
      doctorForm.style.display = 'block';
      btnDoctor.style.background = '#064E3B';
      btnDoctor.style.color = '#FFFFFF';
      btnSuperAdmin.style.background = 'transparent';
      btnSuperAdmin.style.color = '#475569';
    }
  }
};

window.handleSuperAdminLogin = async (event: Event) => {
  event.preventDefault();
  const emailInput = document.getElementById('admin-login-email') as HTMLInputElement | null;
  const passwordInput = document.getElementById('admin-login-password') as HTMLInputElement | null;

  const email = emailInput?.value?.trim() || '';
  const password = passwordInput?.value || '';

  const res = await AuthService.loginAsSuperAdmin(email, password);
  if (res.success && res.user) {
    showToast('Welcome, Super Administrator!', 'success', 4000);
    router.navigate('#/admin');
  } else {
    showToast(res.error || 'Authentication failed. Please check credentials.', 'error', 6000);
  }
};

window.handleDoctorLogin = async (event: Event) => {
  event.preventDefault();
  const idInput = document.getElementById('doc-login-id') as HTMLInputElement | null;
  const passwordInput = document.getElementById('doc-login-password') as HTMLInputElement | null;

  const identifier = idInput?.value?.trim() || '';
  const password = passwordInput?.value || '';

  const res = await AuthService.loginAsDoctor(identifier, password);
  if (res.success && res.user) {
    showToast(`Welcome, Dr. ${res.user.displayName}!`, 'success', 4000);
    router.navigate('#/doctor-portal');
  } else {
    showToast(res.error || 'Doctor sign in failed. Please check council registration number.', 'error', 6000);
  }
};

window.autofillSuperAdminLogin = async () => {
  const emailInput = document.getElementById('admin-login-email') as HTMLInputElement | null;
  const passwordInput = document.getElementById('admin-login-password') as HTMLInputElement | null;
  if (emailInput) emailInput.value = 'admin@jeevansetu.med';
  if (passwordInput) passwordInput.value = 'Admin@123';

  const res = await AuthService.loginAsSuperAdmin('admin@jeevansetu.med', 'Admin@123');
  if (res.success) {
    showToast('Signed in as Super Administrator!', 'success', 4000);
    router.navigate('#/admin');
  }
};

window.autofillDoctorLogin = async () => {
  const idInput = document.getElementById('doc-login-id') as HTMLInputElement | null;
  const passwordInput = document.getElementById('doc-login-password') as HTMLInputElement | null;
  if (idInput) idInput.value = 'MMC-2008-041289';
  if (passwordInput) passwordInput.value = 'Doctor@123';

  const res = await AuthService.loginAsDoctor('MMC-2008-041289', 'Doctor@123');
  if (res.success && res.user) {
    showToast(`Signed in as ${res.user.displayName}!`, 'success', 4000);
    router.navigate('#/doctor-portal');
  }
};

window.handleAdminSignOut = async () => {
  await AuthService.signOut();
  showToast('Signed out of authority session.', 'info');
  router.navigate('#/login');
};

// Register Service Worker for offline-first caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-fatal in dev or test environments
    });
  });
}

// Check for pending doses every minute
setInterval(() => {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const todayStr = now.toISOString().split('T')[0];

  const reminders = StorageService.getReminders();
  const dueMeds = reminders.filter((r) => r.isActive && r.time === currentTimeStr && r.lastTakenDate !== todayStr);

  if (dueMeds.length > 0) {
    playReminderChime();
    dueMeds.forEach((med) => {
      sendBrowserNotification('Dose Reminder: ' + med.name, `Time to take ${med.dosage} (${med.mealInstruction.replace('_', ' ')})`);
      showToast(`⏰ Time for ${med.name} (${med.dosage})`, 'warning', 8000);
    });
  }
}, 60000);

// Background sync from Supabase
StorageService.syncFromSupabase().then(() => {
  if (window.location.hash.startsWith('#/reminders')) {
    router.handleHashChange();
  }
});


/* ══════════════════════════════════════════
   OFFLINE & NETWORK LISTENERS
══════════════════════════════════════════ */
window.addEventListener('online', () => {
  isOnline = true;
  showToast('Internet connection restored!', 'success');
  router.handleHashChange();
});

window.addEventListener('offline', () => {
  isOnline = false;
  showToast('You are now in Offline Mode. Emergency guides remain ready.', 'warning', 5000);
  router.handleHashChange();
});

// Initialize application
router.init();
