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

// Services, Components & Utilities
import { AIService } from './services/aiService';
import { HealthcareService } from './services/healthcareService';
import { VoiceService, VoiceState } from './services/voiceService';
import { StorageService } from './services/storageService';
import { fetchGPSLocation, fetchIPLocation, GeoLocation } from './services/geoService';
import { PDFExportService } from './services/pdfExportService';
import { CARE_TOPICS } from './data/care';
import { HEALTH_GUIDES } from './data/healthGuides';
import { FacilityType, AssessmentResult } from './types/health';
import { renderLoadingState } from './components/LoadingState';
import { renderHospitalCard } from './components/HospitalCard';
import { showToast } from './utils/dom';
import { MapManager } from './utils/mapManager';

// App State
let currentTriageResult: AssessmentResult | null = null;
let locatorActiveFilter: string = 'ALL';
let locatorSearchQuery: string = '';
let guideSearchQuery: string = '';
let selectedSymptomIds: Set<string> = new Set();
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let userGeoLocation: GeoLocation | null = null;
let hasLocationPermissionBeenPrompted = false;
let isAIFetchingFacilities = false;
let locationBadgeLabel = '📍 GPS: Click to Enable';

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
    const currentLang = StorageService.getLanguage() || 'en';
    if (currentLang === 'hi') {
      currentTriageResult = {
        id: 'demo-triage-hi',
        timestamp: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        riskLevel: 'MODERATE',
        headline: 'डॉक्टर से परामर्श की सलाह दी जाती है',
        subheadline: '🟡 24 घंटे के भीतर डॉक्टर को दिखाना उचित होगा',
        summary: 'बताए गए लक्षणों में तेज बुखार और सांस की तकलीफ शामिल है जिसके लिए डॉक्टर से जांच आवश्यक है।',
        warningSigns: [
          '48 घंटे से अधिक समय तक 102°F से अधिक बुखार रहना',
          'चलने या बोलने में सांस फूलना',
          'पानी या तरल पदार्थ न पच पाना'
        ],
        immediateSteps: [
          'आज ही नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं।',
          'उबला हुआ गुनगुना पानी और ओआरएस (ORS) पिएं।',
          'हवादार और शांत कमरे में आराम करें।'
        ],
        whatToDo: [
          'पीएचसी खेड़ या सीएचसी मंचर में डॉक्टर से जांच कराएं',
          'नियमित रूप से हल्का गुनगुना पानी या मूंग दाल का सूप लें',
          'हर 4 घंटे में शरीर का तापमान मापें'
        ],
        whatToAvoid: [
          'बिना डॉक्टर की सलाह के कोई तेज एंटीबायोटिक न लें',
          'धूप में भारी खेती या मेहनत का काम न करें',
          'सीने में भारीपन या चक्कर आने पर अनदेखा न करें'
        ],
        homeRemedies: [
          'तुलसी के पत्ते और अदरक का गुनगुना काढ़ा दिन में दो बार पिएं।',
          'माथे और हाथों पर सामान्य पानी की पट्टी रखें।',
          'हल्की मूंग की खिचड़ी और ताजा छाछ का सेवन करें।'
        ],
        possibleConditions: [
          {
            name: 'मौसमी वायरल या श्वसन संक्रमण',
            likelihood: 'Possible',
            description: 'सामान्य मौसमी संक्रमण जिसके लिए आराम और डॉक्टर की जांच की जरूरत है।',
            relevance: 'लक्षणों और अवधि के आधार पर'
          }
        ],
        timeframe: '12 से 24 घंटे के भीतर',
        suggestedCareType: 'clinic_visit',
        disclaimer: 'जीवनसेतु एआई केवल प्राथमिक मार्गदर्शन प्रदान करता है। पूर्ण उपचार के लिए डॉक्टर से मिलें।'
      };
    } else if (currentLang === 'gu') {
      currentTriageResult = {
        id: 'demo-triage-gu',
        timestamp: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        riskLevel: 'MODERATE',
        headline: 'તબીબી તપાસની સલાહ આપવામાં આવે છે',
        subheadline: '🟡 ૨૪ કલાકમાં ડોક્ટરની મુલાકાત લેવી યોગ્ય રહેશે',
        summary: 'જણાવેલા લક્ષણોમાં સતત તાવ અને શ્વાસ લેવામાં અસ્વસ્થતા છે જેની ડોક્ટર પાસે તપાસ જરૂરી છે.',
        warningSigns: [
          'તાવ ૧૦૨°F થી વધુ ૪૮ કલાક સુધી જળવાઈ રહેવો',
          'ચાલતી વખતે કે બોલતી વખતે શ્વાસ ચડવો',
          'પ્રવાહી કે ખોરાક ન ટકવો'
        ],
        immediateSteps: [
          'આજે જ નજીકના પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) ની મુલાકાત લો.',
          'ઉકાળેલું નવશેકું પાણી અને ORS પીવો.',
          'હવાઉજાસવાળા ઓરડામાં પૂરતો આરામ કરો.'
        ],
        whatToDo: [
          'નજીકના PHC ખેડ અથવા CHC મંચર ખાતે તપાસ કરાવો',
          'નિયમિત અંતરે નવશેકું પાણી કે મગનું સૂપ પીવો',
          'દર ૪ કલાકે શરીરનું તાપમાન તપાસો'
        ],
        whatToAvoid: [
          'ડોક્ટરની સલાહ વગર જાતે ભારે દવાઓ ન લો',
          'તડકામાં કે ખેતરમાં ભારે શ્રમ ન કરો',
          'છાતીમાં દુખાવો કે અસ્વસ્થતાની અવગણના ન કરો'
        ],
        homeRemedies: [
          'તુલસી, આદું અને મધ સાથે બનાવેલો હળવો ઉકાળો પીવો.',
          'ગરમી ઓછી કરવા માટે કપાળ પર સામાન્ય પાણીના પોતા મૂકો.',
          'હળવી મગની ખીચડી અને શેકેલા જીરાવાળી છાશ લો.'
        ],
        possibleConditions: [
          {
            name: 'મોસમી વાયરલ અથવા શ્વાસ સંબંધિત ઈન્ફેક્શન',
            likelihood: 'Possible',
            description: 'સામાન્ય મોસમી ઈન્ફેક્શન જેના માટે આરામ અને તબીબી તપાસ જરૂરી છે.',
            relevance: 'લક્ષણો અને સમયગાળા અનુસાર'
          }
        ],
        timeframe: '૧૨ થી ૨૪ કલાકમાં',
        suggestedCareType: 'clinic_visit',
        disclaimer: 'જીવનસેતુ પ્રારંભિક સલાહ આપે છે. ચોક્કસ નિદાન માટે ડોક્ટરને રૂબરૂ મળો.'
      };
    } else {
      currentTriageResult = {
        id: 'demo-triage-en',
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
        homeRemedies: [
          'Drink warm herbal decoction with tulsi leaves and crushed ginger twice daily.',
          'Sponge forehead and arms with lukewarm tap water to gently reduce fever.',
          'Consume soft mung dal khichdi and fresh buttermilk with roasted cumin.'
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
  const showPermissionModal = !hasLocationPermissionBeenPrompted;
  return renderCareLocatorPage(
    facilities,
    locatorActiveFilter,
    locatorSearchQuery,
    locationBadgeLabel,
    showPermissionModal,
    isAIFetchingFacilities
  );
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

  // Post-render lifecycle: Initialize interactive Leaflet map when on care-locator
  if (path === '#/care-locator' || path.startsWith('#/care-locator')) {
    setTimeout(() => {
      const facilities = HealthcareService.searchFacilities(
        locatorSearchQuery,
        locatorActiveFilter as FacilityType | 'ALL'
      );
      MapManager.initMap('care-map', facilities);
    }, 60);
  }
});

/* ══════════════════════════════════════════
   GLOBAL WINDOW HANDLERS (Interactivity)
══════════════════════════════════════════ */

declare global {
  interface Window {
    L: any;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    setAppLanguage: (code: string) => Promise<void>;
    selectLanguage: (code: string) => Promise<void>;
    changeAssessmentLanguage: (code: string) => Promise<void>;
    toggleSymptomChip: (button: HTMLElement, id: string) => void;
    handleSymptomSubmit: (event: Event) => Promise<void>;
    handleLocatorSearch: (query: string) => void;
    clearLocatorSearch: () => void;
    setLocatorFilter: (filter: string) => void;
    focusFacilityOnMap: (facilityId: string) => void;
    fitAllMapMarkers: () => void;
    filterOnly24x7: () => void;
    switchLocatorView: (view: 'list' | 'map') => void;
    handleGuideSearch: (query: string) => void;
    toggleVoiceRecording: () => void;
    clearVoiceTranscript: () => void;
    submitVoiceTranscript: () => void;
    handleProfileSave: (event: Event) => void;
    viewHistoryItem: (id: string) => void;
    clearTriageHistory: () => void;
    clearAllAppData: () => void;
    openDirections: (name: string, address: string) => void;
    refreshGeolocation: () => Promise<void>;
    grantLocationPermission: () => Promise<void>;
    useIPLocationFallback: () => Promise<void>;
    downloadOfflinePDF: () => void;
    quickAnalyzeSymptom: (text: string) => Promise<void>;
    showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  }
}

window.showToast = showToast;
window.downloadOfflinePDF = () => {
  showToast('Preparing PDF manual for download...', 'info');
  PDFExportService.downloadMedicalGuidePDF();
};

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

const LANG_NAMES: Record<string, string> = {
  en: '🇬🇧 English',
  hi: '🇮🇳 हिन्दी',
  gu: '🇮🇳 ગુજરાતી'
};

window.setAppLanguage = async (code: string) => {
  StorageService.setLanguage(code);
  showToast(`${LANG_NAMES[code] || code} selected`, 'success');

  if (currentTriageResult) {
    try {
      const translated = await AIService.translateAssessment(currentTriageResult, code);
      currentTriageResult = translated;
    } catch (e) {
      console.warn('Language change assessment translation failed:', e);
    }
  }

  router.handleHashChange();
};

window.selectLanguage = async (code: string) => {
  await window.setAppLanguage(code);
};

window.changeAssessmentLanguage = async (code: string) => {
  StorageService.setLanguage(code);
  showToast(`Translating AI answer to ${LANG_NAMES[code] || code}...`, 'info', 1800);

  if (currentTriageResult) {
    try {
      const translated = await AIService.translateAssessment(currentTriageResult, code);
      currentTriageResult = translated;
    } catch (e) {
      console.warn('Translation error:', e);
    }
  }

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

  const currentLang = StorageService.getLanguage() || 'en';
  const loadingLabel =
    currentLang === 'hi'
      ? 'लक्षणों का एआई विश्लेषण किया जा रहा है...'
      : currentLang === 'gu'
      ? 'લક્ષણોનું AI વિશ્લેષણ થઈ રહ્યું છે...'
      : "ANALYZING WHAT'S HAPPENING...";

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = renderLoadingState(loadingLabel);
  }

  try {
    const result = await AIService.analyzeSymptoms(
      {
        symptoms: symptoms.length > 0 ? symptoms : ['fever'],
        duration,
        severity,
        description
      },
      1600,
      currentLang
    );

    currentTriageResult = result;

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

/* ══════════════════════════════════════════
   FIND CARE LOCATOR & MAP HANDLERS
══════════════════════════════════════════ */

window.handleLocatorSearch = (query: string) => {
  locatorSearchQuery = query;
  const facilities = HealthcareService.searchFacilities(
    locatorSearchQuery,
    locatorActiveFilter as FacilityType | 'ALL'
  );

  const container = document.getElementById('locator-facility-list');
  if (container) {
    container.innerHTML =
      facilities.length > 0
        ? facilities.map((facility) => renderHospitalCard(facility)).join('')
        : `
          <div class="card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🏥</div>
            <h3 class="text-h4">No facilities match "${query}"</h3>
            <p class="text-muted" style="margin-top: 6px; font-size: var(--text-sm);">
              Try searching by village name, pincode (e.g. 410501), or filter by "All Centers".
            </p>
            <button type="button" class="btn btn--primary btn--sm" style="margin-top: 14px;" onclick="window.clearLocatorSearch()">
              Clear Search & Show All
            </button>
          </div>
        `;
  }

  const countEl = document.getElementById('locator-count');
  if (countEl) {
    countEl.innerText = `${facilities.length} Verified Facilities Located Nearby`;
  }
  const tabCount = document.getElementById('tab-count');
  if (tabCount) {
    tabCount.innerText = `${facilities.length}`;
  }

  MapManager.updateVisibleFacilities(facilities);
};

window.clearLocatorSearch = () => {
  const input = document.getElementById('locator-search-input') as HTMLInputElement | null;
  if (input) {
    input.value = '';
  }
  window.handleLocatorSearch('');
};

window.setLocatorFilter = (filter: string) => {
  locatorActiveFilter = filter;

  document.querySelectorAll('.chip-group .chip').forEach((btn) => {
    const b = btn as HTMLButtonElement;
    if (b.getAttribute('data-filter') === filter || b.getAttribute('onclick')?.includes(`'${filter}'`)) {
      b.classList.add('selected');
      b.setAttribute('aria-pressed', 'true');
    } else {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    }
  });

  const facilities = HealthcareService.searchFacilities(
    locatorSearchQuery,
    locatorActiveFilter as FacilityType | 'ALL'
  );

  const container = document.getElementById('locator-facility-list');
  if (container) {
    container.innerHTML =
      facilities.length > 0
        ? facilities.map((facility) => renderHospitalCard(facility)).join('')
        : `
          <div class="card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🏥</div>
            <h3 class="text-h4">No facilities in this category</h3>
            <p class="text-muted" style="margin-top: 6px; font-size: var(--text-sm);">Try selecting "All Centers".</p>
          </div>
        `;
  }

  const countEl = document.getElementById('locator-count');
  if (countEl) {
    countEl.innerText = `${facilities.length} Verified Facilities Located Nearby`;
  }
  const tabCount = document.getElementById('tab-count');
  if (tabCount) {
    tabCount.innerText = `${facilities.length}`;
  }

  MapManager.updateVisibleFacilities(facilities);
};

window.focusFacilityOnMap = (facilityId: string) => {
  MapManager.focusFacility(facilityId);

  if (window.innerWidth <= 768) {
    window.switchLocatorView('map');
  }

  const mapEl = document.getElementById('care-map');
  if (mapEl) {
    mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

window.fitAllMapMarkers = () => {
  MapManager.fitAll();
  showToast('Map centered on all regional medical centers', 'info', 2000);
};

window.filterOnly24x7 = () => {
  const input = document.getElementById('locator-search-input') as HTMLInputElement | null;
  if (locatorSearchQuery === '24/7') {
    if (input) input.value = '';
    window.handleLocatorSearch('');
    showToast('Showing all centers', 'info');
  } else {
    if (input) input.value = '24/7';
    window.handleLocatorSearch('24/7');
    showToast('Filtered to 24/7 medical centers', 'success');
  }
};

window.switchLocatorView = (view: 'list' | 'map') => {
  const listCol = document.getElementById('facility-list-column');
  const mapCol = document.getElementById('facility-map-column');
  const btnList = document.getElementById('btn-show-list');
  const btnMap = document.getElementById('btn-show-map');

  if (view === 'list') {
    if (listCol) listCol.style.display = 'flex';
    if (mapCol) mapCol.style.display = 'none';
    if (btnList) btnList.className = 'btn btn--primary btn--sm';
    if (btnMap) btnMap.className = 'btn btn--secondary btn--sm';
  } else {
    if (listCol) listCol.style.display = 'none';
    if (mapCol) mapCol.style.display = 'flex';
    if (btnList) btnList.className = 'btn btn--secondary btn--sm';
    if (btnMap) btnMap.className = 'btn btn--primary btn--sm';
    MapManager.invalidateSize();
  }
};

async function executeAIFacilityFetch(locationName: string): Promise<void> {
  isAIFetchingFacilities = true;
  router.handleHashChange(); // Show AI loading state

  try {
    showToast(`🤖 AI fetching nearby facilities for ${locationName}...`, 'info');
    const aiFacilities = await AIService.fetchNearbyFacilities(locationName);
    HealthcareService.setFacilities(aiFacilities);
    showToast(`AI loaded ${aiFacilities.length} nearby medical centers!`, 'success');
  } catch (err) {
    console.warn('Error during AI facility fetch:', err);
  } finally {
    isAIFetchingFacilities = false;
    router.handleHashChange(); // Render facilities
  }
}

window.grantLocationPermission = async () => {
  hasLocationPermissionBeenPrompted = true;
  showToast('Acquiring high-accuracy GPS location...', 'info');

  try {
    userGeoLocation = await fetchGPSLocation();
    locationBadgeLabel = `📍 GPS: ${userGeoLocation.displayName}`;
    await executeAIFacilityFetch(userGeoLocation.displayName);
  } catch (err) {
    console.warn('GPS failed/denied, falling back to IP location:', err);
    try {
      userGeoLocation = await fetchIPLocation();
      locationBadgeLabel = `🌐 IP: ${userGeoLocation.displayName}`;
      await executeAIFacilityFetch(userGeoLocation.displayName);
    } catch {
      locationBadgeLabel = '📍 Location: Gandhidham, Gujarat';
      await executeAIFacilityFetch('Gandhidham, Gujarat');
    }
  }
};

window.useIPLocationFallback = async () => {
  hasLocationPermissionBeenPrompted = true;

  try {
    userGeoLocation = await fetchIPLocation();
    locationBadgeLabel = `🌐 Location: ${userGeoLocation.displayName}`;
    await executeAIFacilityFetch(userGeoLocation.displayName);
  } catch {
    locationBadgeLabel = '🌐 Location: Gandhidham, Gujarat';
    await executeAIFacilityFetch('Gandhidham, Gujarat');
  }
};

window.refreshGeolocation = async () => {
  hasLocationPermissionBeenPrompted = true;
  const badge = document.getElementById('locator-gps-badge');
  if (badge) badge.innerHTML = '⏳ Acquiring GPS...';
  showToast('Acquiring GPS location & AI facilities...', 'info');

  try {
    userGeoLocation = await fetchGPSLocation();
    locationBadgeLabel = `📍 GPS: ${userGeoLocation.displayName}`;
    if (badge) badge.innerHTML = locationBadgeLabel;
    await executeAIFacilityFetch(userGeoLocation.displayName);
  } catch {
    try {
      userGeoLocation = await fetchIPLocation();
      locationBadgeLabel = `🌐 IP: ${userGeoLocation.displayName}`;
      if (badge) badge.innerHTML = locationBadgeLabel;
      await executeAIFacilityFetch(userGeoLocation.displayName);
    } catch {
      if (badge) badge.innerHTML = '📍 Gandhidham, Gujarat';
      await executeAIFacilityFetch('Gandhidham, Gujarat');
    }
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

window.submitVoiceTranscript = async () => {
  if (!voiceTranscriptBuffer.trim()) {
    showToast('No spoken words captured. Please speak or type.', 'warning');
    return;
  }

  const currentLang = StorageService.getLanguage() || 'en';
  showToast('Analyzing spoken health symptoms with AI...', 'info');

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = renderLoadingState('PROCESSING SPOKEN SYMPTOMS...');
  }

  try {
    const result = await AIService.analyzeSymptoms(
      {
        symptoms: [],
        duration: 'today',
        severity: 'moderate',
        description: voiceTranscriptBuffer
      },
      1500,
      currentLang
    );

    currentTriageResult = result;

    if (result.isValidHealthQuery !== false) {
      StorageService.addHistoryEntry({
        id: result.id,
        date: result.timestamp,
        symptoms: [result.identifiedDisease || 'Voice Symptom Analysis'],
        riskLevel: result.riskLevel,
        headline: result.headline,
        actionTaken: result.immediateSteps[0] || 'Viewed guidance'
      });
    } else {
      showToast('Input not related to disease or health.', 'warning', 3500);
    }

    router.navigate('#/assessment');
  } catch {
    showToast('Error analyzing spoken symptoms. Please try again.', 'error');
  }
};

window.quickAnalyzeSymptom = async (text: string) => {
  const currentLang = StorageService.getLanguage() || 'en';
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = renderLoadingState("ANALYZING CLINICAL SYMPTOMS...");
  }

  try {
    const result = await AIService.analyzeSymptoms(
      {
        symptoms: [],
        duration: 'few-days',
        severity: 'moderate',
        description: text
      },
      1400,
      currentLang
    );

    currentTriageResult = result;

    if (result.isValidHealthQuery !== false) {
      StorageService.addHistoryEntry({
        id: result.id,
        date: result.timestamp,
        symptoms: [result.identifiedDisease || 'Symptom Triage'],
        riskLevel: result.riskLevel,
        headline: result.headline,
        actionTaken: result.immediateSteps[0] || 'Viewed guidance'
      });
    }

    router.navigate('#/assessment');
  } catch {
    showToast('Error analyzing symptoms.', 'error');
  }
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
