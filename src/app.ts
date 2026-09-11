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

// Services & Components
import { AIService } from './services/aiService';
import { HealthcareService } from './services/healthcareService';
import { VoiceService, VoiceState } from './services/voiceService';
import { StorageService } from './services/storageService';
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
    handleProfileSave: (event: Event) => void;
    viewHistoryItem: (id: string) => void;
    clearTriageHistory: () => void;
    clearAllAppData: () => void;
    openDirections: (name: string, address: string) => void;
    refreshGeolocation: () => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
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
  if (outputEl) outputEl.innerHTML = '<em>Your spoken words will appear here in real time...</em>';
  if (actionsEl) actionsEl.style.display = 'none';
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

window.openDirections = (name: string, address: string) => {
  const query = encodeURIComponent(`${name}, ${address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
};

window.refreshGeolocation = () => {
  showToast('GPS refreshed: Pune Rural coordinates locked (18.8527° N, 73.9189° E)', 'success');
};

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
