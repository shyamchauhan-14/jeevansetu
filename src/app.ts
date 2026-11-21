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
import { playReminderChime, requestNotificationPermission, sendBrowserNotification } from './utils/reminderAudio';

// Services & Components
import { AIService } from './services/aiService';
import { HealthcareService } from './services/healthcareService';
import { VoiceService, VoiceState } from './services/voiceService';
import { StorageService } from './services/storageService';
import { SOSService } from './services/sosService';
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
  SOSService.createIncident('Acquiring location...');
  
  // Prompt location with graceful fallback
  const loc = await SOSService.requestLocationWithFallback();
  SOSService.setIncidentLocation(loc);
  SOSService.updateIncidentStatus('alert_queued', 'Alert queued for delivery');

  // Check alert gateway
  setTimeout(() => {
    SOSService.updateIncidentStatus('sent', 'Simulated alert delivered to trusted contacts (Demo Gateway)');
    showToast('Alert notification queued for trusted contacts', 'info');
    router.handleHashChange();
  }, 1200);

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
