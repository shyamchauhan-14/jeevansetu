import { StorageService } from './storageService';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.triage': 'Triage AI',
    'nav.emergency': 'Emergency SOS',
    'nav.care': 'Safe Care',
    'nav.reminders': 'Reminders',
    'nav.guide': 'Guides',
    'nav.locator': 'Find Care',
    'nav.profile': 'Profile',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    'nav.directHelp': '🚨 108 Direct',
    'nav.allLanguages': '🌐 Languages',
    'nav.workerWorkspace': 'ASHA Workspace',
    'nav.adminDashboard': 'Admin Console',

    // Home
    'home.heroTitle': 'Right Care. Right When You Need It.',
    'home.heroSubtitle': 'Empowering rural communities with instant symptom triage, life-saving emergency first aid, and direct routing to nearest verified health centers.',
    'home.checkSymptoms': '🩺 Check Symptoms →',
    'home.medicineReminders': '💊 Medicine Reminders',
    'home.voiceAssistant': '🎙️ Voice Assistant',
    'home.emergencyNeedHelp': 'Need Emergency Help Right Now?',
    'home.call108': '📞 Call 108 Ambulance',
    'home.openEmergencyGuides': '🚨 Open Emergency Guides →',

    // SOS & Emergency
    'sos.badge': '24/7 RAPID EMERGENCY SOS',
    'sos.title': 'Emergency Assistance & Smart SOS',
    'sos.subtext': 'Direct one-tap ambulance dialing, verified first-aid instructions, and instant trusted contact alert.',
    'sos.holdToActivate': 'HOLD FOR 2 SECONDS TO ACTIVATE SOS',
    'sos.activating': 'Activating Emergency Alert in 2s...',
    'sos.activated': '🚨 Emergency Mode Active',
    'sos.status': 'Incident Status',
    'sos.statePreparing': 'Preparing emergency alert...',
    'sos.stateCallOpened': 'Dialer opened (Call in progress)',
    'sos.stateQueued': 'Alert queued locally / in sync',
    'sos.stateSent': 'Alert sent to trusted contacts (Demo/Gateway)',
    'sos.stateResolved': 'Emergency resolved safely',
    'sos.falseAlarm': 'Cancel / Mark False Alarm',
    'sos.locationConsent': 'Location Access Required for SOS',
    'sos.locationDenied': 'GPS unavailable or denied. Using manual locality selection.',
    'sos.manualLocation': 'Select Your Village / Taluka',
    'sos.trustedContacts': 'Trusted Family Contacts',
    'sos.noContacts': 'No trusted contacts saved yet. Add below to notify family in emergency.',
    'sos.addContact': 'Add Trusted Contact',

    // Symptom Triage
    'triage.badge': 'CLINICAL SYMPTOM TRIAGE (v2.0)',
    'triage.title': 'What symptoms are you experiencing?',
    'triage.subtitle': 'Answer guided questions to evaluate urgency. Red flags trigger immediate emergency routing.',
    'triage.redFlagWarning': 'CRITICAL RED FLAG DETECTED',
    'triage.redFlagSubtext': 'Do not wait for further questions. Seek immediate in-person medical attention or dial 108.',
    'triage.analyzeBtn': 'Analyze Urgency & Guidance →',
    'triage.disclaimer': 'Notice: JeevanSetu provides supportive health triage and does not replace professional clinical diagnosis or prescriptions.',

    // Care Locator
    'locator.badge': 'HEALTHCARE FACILITY FINDER',
    'locator.title': 'Find Verified Healthcare Centers',
    'locator.subtitle': 'Locate nearest PHCs, CHCs, sub-district hospitals, and 24/7 pharmacies with verified phone numbers.',
    'locator.searchPlaceholder': 'Search by Village, Taluka, Town, PIN Code, or Hospital name...',
    'locator.reportCorrection': 'Flag Outdated Info / Closed Facility',
    'locator.verifiedDate': 'Verified',
    'locator.source': 'Source',

    // Medicine Reminders
    'reminders.badge': 'MEDICINE SCHEDULE & ADHERENCE',
    'reminders.title': 'Daily Medicine Reminders',
    'reminders.subtitle': 'Track your prescribed doses offline with status logging. Not a dosage calculator.',
    'reminders.taken': 'Taken',
    'reminders.skipped': 'Skipped',
    'reminders.snoozed': 'Snoozed',
    'reminders.testChime': '🔊 Test Chime',
    'reminders.enableAlerts': '🔔 Enable Notifications',
    'reminders.addMedicine': 'Add Medicine Reminder',

    // General
    'general.offlineBanner': 'OFFLINE MODE: Emergency first-aid guides and cached facility data remain fully accessible.',
    'general.backHome': '← Return to Home',
    'general.save': 'Save',
    'general.cancel': 'Cancel'
  },

  hi: {
    // Navigation
    'nav.home': 'मुख्य पृष्ठ',
    'nav.triage': 'लक्षण जांच',
    'nav.emergency': 'आपातकालीन SOS',
    'nav.care': 'सुरक्षित देखभाल',
    'nav.reminders': 'दवा रिमाइंडर',
    'nav.guide': 'मार्गदर्शिका',
    'nav.locator': 'अस्पताल खोजें',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.history': 'इतिहास',
    'nav.settings': 'सेटिंग्स',
    'nav.directHelp': '🚨 108 सीधा कॉल',
    'nav.allLanguages': '🌐 भाषाएं',
    'nav.workerWorkspace': 'आशा कार्यकर्ता वर्कस्पेस',
    'nav.adminDashboard': 'एडमिन डैशबोर्ड',

    // Home
    'home.heroTitle': 'सही देखभाल। सही समय पर।',
    'home.heroSubtitle': 'ग्रामीण समुदायों के लिए तुरंत लक्षण जांच, जीवन रक्षक प्राथमिक उपचार, और नजदीकी सत्यापित स्वास्थ्य केंद्रों का सीधा रास्ता।',
    'home.checkSymptoms': '🩺 लक्षण जांचें →',
    'home.medicineReminders': '💊 दवा रिमाइंडर',
    'home.voiceAssistant': '🎙️ आवाज से बोलें',
    'home.emergencyNeedHelp': 'क्या आपको तुरंत आपातकालीन सहायता चाहिए?',
    'home.call108': '📞 108 एम्बुलेंस को कॉल करें',
    'home.openEmergencyGuides': '🚨 आपातकालीन गाइड खोलें →',

    // SOS & Emergency
    'sos.badge': '24/7 त्वरित आपातकालीन SOS',
    'sos.title': 'आपातकालीन सहायता और स्मार्ट SOS',
    'sos.subtext': 'एक टैप में 108 एम्बुलेंस कॉलिंग, सत्यापित प्राथमिक उपचार, और परिजनों को तुरंत संदेश।',
    'sos.holdToActivate': 'SOS शुरू करने के लिए 2 सेकंड दबाकर रखें',
    'sos.activating': '2 सेकंड में आपातकालीन अलर्ट सक्रिय हो रहा है...',
    'sos.activated': '🚨 आपातकालीन मोड सक्रिय',
    'sos.status': 'घटना स्थिति',
    'sos.statePreparing': 'आपातकालीन अलर्ट तैयार हो रहा है...',
    'sos.stateCallOpened': 'डायल पैड खुला (कॉल जारी है)',
    'sos.stateQueued': 'अलर्ट स्थानीय कतार में है',
    'sos.stateSent': 'विश्वसनीय संपर्कों को अलर्ट भेज दिया गया (डेमो/गेटवे)',
    'sos.stateResolved': 'आपातकाल सुरक्षित रूप से समाप्त हुआ',
    'sos.falseAlarm': 'रद्द करें / गलत अलार्म चिह्नित करें',
    'sos.locationConsent': 'SOS के लिए लोकेशन अनुमति आवश्यक है',
    'sos.locationDenied': 'GPS उपलब्ध नहीं है। कृपया अपना गांव या तालुका चुनें।',
    'sos.manualLocation': 'अपना गांव / तालुका चुनें',
    'sos.trustedContacts': 'विश्वसनीय पारिवारिक संपर्क',
    'sos.noContacts': 'अभी तक कोई संपर्क नहीं जोड़ा गया। नीचे जोड़ें।',
    'sos.addContact': 'नया संपर्क जोड़ें',

    // Symptom Triage
    'triage.badge': 'नैदानिक लक्षण ट्राइएज (v2.0)',
    'triage.title': 'आपको या मरीज को क्या लक्षण महसूस हो रहे हैं?',
    'triage.subtitle': 'गंभीरता जांचने के लिए प्रश्नों के उत्तर दें। खतरे के लक्षण तुरंत आपातकालीन सहायता दिखाते हैं।',
    'triage.redFlagWarning': '🚨 गंभीर खतरे का लक्षण पाया गया',
    'triage.redFlagSubtext': 'आगे के प्रश्नों की प्रतीक्षा न करें। तुरंत 108 पर कॉल करें या नजदीकी अस्पताल जाएं।',
    'triage.analyzeBtn': 'लक्षणों का विश्लेषण करें →',
    'triage.disclaimer': 'सूचना: जीवनसेतु केवल सहायक मार्गदर्शन प्रदान करता है, यह डॉक्टर का निदान या दवा पर्ची नहीं है।',

    // Care Locator
    'locator.badge': 'स्वास्थ्य केंद्र खोजक',
    'locator.title': 'सत्यापित नजदीकी स्वास्थ्य केंद्र खोजें',
    'locator.subtitle': 'प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक केंद्र (CHC), और 24/7 फार्मेसियों के सत्यापित फोन नंबर प्राप्त करें।',
    'locator.searchPlaceholder': 'गांव, तालुका, शहर, पिन कोड या अस्पताल का नाम खोजें...',
    'locator.reportCorrection': 'पुरानी या गलत जानकारी की रिपोर्ट करें',
    'locator.verifiedDate': 'सत्यापित तिथि',
    'locator.source': 'स्रोत',

    // Medicine Reminders
    'reminders.badge': 'दवा कार्यक्रम और ट्रैकर',
    'reminders.title': 'दैनिक दवा रिमाइंडर',
    'reminders.subtitle': 'अपनी निर्धारित दवाओं को बिना इंटरनेट ट्रैक करें। यह दवा की खुराक तय नहीं करता।',
    'reminders.taken': 'दवा ले ली',
    'reminders.skipped': 'छोड़ दी',
    'reminders.snoozed': 'बाद में याद दिलाएं',
    'reminders.testChime': '🔊 घंटी की आवाज जांचें',
    'reminders.enableAlerts': '🔔 सूचनाएं चालू करें',
    'reminders.addMedicine': 'दवा रिमाइंडर जोड़ें',

    // General
    'general.offlineBanner': 'ऑफलाइन मोड: आपातकालीन प्राथमिक उपचार और सहेजे गए अस्पताल बिना इंटरनेट उपलब्ध हैं।',
    'general.backHome': '← मुख्य पृष्ठ पर लौटें',
    'general.save': 'सहेजें',
    'general.cancel': 'रद्द करें'
  },

  gu: {
    // Navigation
    'nav.home': 'મુખ્ય પૃષ્ઠ',
    'nav.triage': 'લક્ષણ તપાસ',
    'nav.emergency': 'ઇમરજન્સી SOS',
    'nav.care': 'સુરક્ષિત સંભાળ',
    'nav.reminders': 'દવા રીમાઇન્ડર',
    'nav.guide': 'માર્ગદર્શિકા',
    'nav.locator': 'હોસ્પિટલ શોધો',
    'nav.profile': 'પ્રોફાઇલ',
    'nav.history': 'ઇતિહાસ',
    'nav.settings': 'સેટિંગ્સ',
    'nav.directHelp': '🚨 108 સીધો કૉલ',
    'nav.allLanguages': '🌐 ભાષાઓ',
    'nav.workerWorkspace': 'આશા કાર્યકર વર્કસ્પેસ',
    'nav.adminDashboard': 'એડમિન પેનલ',

    // Home
    'home.heroTitle': 'સાચી સંભાળ. સાચા સમયે.',
    'home.heroSubtitle': 'ગ્રામીણ સમુદાયો માટે તાત્કાલિક લક્ષણ મૂલ્યાંકન, જીવનરક્ષક પ્રાથમિક સારવાર અને ચકાસાયેલ આરોગ્ય કેન્દ્રોની માહિતી.',
    'home.checkSymptoms': '🩺 લક્ષણો તપાસો →',
    'home.medicineReminders': '💊 દવા રીમાઇન્ડર',
    'home.voiceAssistant': '🎙️ અવાજથી બોલો',
    'home.emergencyNeedHelp': 'શું તમને તાત્કાલિક ઇમરજન્સી સહાય જોઈએ છે?',
    'home.call108': '📞 108 એમ્બ્યુલન્સને કૉલ કરો',
    'home.openEmergencyGuides': '🚨 ઇમરજન્સી ગાઈડ ખોલો →',

    // SOS & Emergency
    'sos.badge': '24/7 ઇમરજન્સી SOS',
    'sos.title': 'ઇમરજન્સી સહાય અને સ્માર્ટ SOS',
    'sos.subtext': 'એક ક્લિકમાં 108 કૉલ, ચકાસાયેલ પ્રાથમિક સારવાર અને પરિવારજનોને તાત્કાલિક જાણ.',
    'sos.holdToActivate': 'SOS શરૂ કરવા 2 સેકન્ડ દબાવી રાખો',
    'sos.activating': '2 સેકન્ડમાં ઇમરજન્સી એલર્ટ શરૂ થઈ રહ્યું છે...',
    'sos.activated': '🚨 ઇમરજન્સી મોડ સક્રિય',
    'sos.status': 'ઘટના સ્થિતિ',
    'sos.statePreparing': 'ઇમરજન્સી એલર્ટ તૈયાર થઈ રહ્યું છે...',
    'sos.stateCallOpened': 'ડાયલર ખૂલ્યું (કૉલ ચાલુ છે)',
    'sos.stateQueued': 'સ્થાનિક કતારમાં એલર્ટ છે',
    'sos.stateSent': 'વિશ્વાસુ સંપર્કોને એલર્ટ મોકલાઈ ગયું (ડેમો/ગેટવે)',
    'sos.stateResolved': 'ઇમરજન્સી સુરક્ષિત પૂર્ણ થઈ',
    'sos.falseAlarm': 'રદ કરો / ખોટો એલાર્મ ચિહ્નિત કરો',
    'sos.locationConsent': 'SOS માટે લોકેશન પરવાનગી જરૂરી છે',
    'sos.locationDenied': 'GPS ઉપલબ્ધ નથી. કૃપા કરીને તમારું ગામ અથવા તાલુકો પસંદ કરો.',
    'sos.manualLocation': 'તમારું ગામ / તાલુકો પસંદ કરો',
    'sos.trustedContacts': 'વિશ્વાસુ કૌટુંબિક સંપર્કો',
    'sos.noContacts': 'હજુ સુધી કોઈ સંપર્ક ઉમેરાયો નથી. નીચે ઉમેરો.',
    'sos.addContact': 'નવો સંપર્ક ઉમેરો',

    // Symptom Triage
    'triage.badge': 'ક્લિનિકલ લક્ષણ ટ્રાયેજ (v2.0)',
    'triage.title': 'તમને કે દર્દીને કયા લક્ષણો જણાય છે?',
    'triage.subtitle': 'તાકીદ ચકાસવા પ્રશ્નોના ઉત્તર આપો. ભયજનક લક્ષણો તાત્કાલિક ઇમરજન્સી સહાય દર્શાવે છે.',
    'triage.redFlagWarning': '🚨 ગંભીર જોખમી લક્ષણ મળ્યું',
    'triage.redFlagSubtext': 'વધુ પ્રશ્નોની રાહ જોશો નહીં. તાત્કાલિક 108 પર કૉલ કરો અથવા હોસ્પિટલ પહોંચો.',
    'triage.analyzeBtn': 'લક્ષણોનું વિશ્લેષણ કરો →',
    'triage.disclaimer': 'નોંધ: જીવનસેતુ માત્ર સહાયક માર્ગદર્શન પૂરું પાડે છે, તે ડૉક્ટરનું નિદાન કે દવા નથી.',

    // Care Locator
    'locator.badge': 'આરોગ્ય કેન્દ્ર શોધક',
    'locator.title': 'ચકાસાયેલ નજીકના આરોગ્ય કેન્દ્રો શોધો',
    'locator.subtitle': 'PHC, CHC અને 24/7 દવાની દુકાનોના ચકાસાયેલ ફોન નંબર મેળવો.',
    'locator.searchPlaceholder': 'ગામ, તાલુકો, શહેર, પિન કોડ અથવા હોસ્પિટલનું નામ શોધો...',
    'locator.reportCorrection': 'જૂની કે ખોટી માહિતીની જાણ કરો',
    'locator.verifiedDate': 'ચકાસણી તારીખ',
    'locator.source': 'સ્ત્રોત',

    // Medicine Reminders
    'reminders.badge': 'દવા શેડ્યૂલ અને ટ્રેકર',
    'reminders.title': 'દૈનિક દવા રીમાઇન્ડર',
    'reminders.subtitle': 'તમારા ડૉક્ટરની સૂચના મુજબ દવાઓ ઑફલાઇન ટ્રૅક કરો. આ ડોઝ ગણતરી કરતું નથી.',
    'reminders.taken': 'દવા લઈ લીધી',
    'reminders.skipped': 'છોડી દીધી',
    'reminders.snoozed': 'પછી યાદ અપાવો',
    'reminders.testChime': '🔊 ઘંટડી ચકાસો',
    'reminders.enableAlerts': '🔔 સૂચનાઓ ચાલુ કરો',
    'reminders.addMedicine': 'દવા રીમાઇન્ડર ઉમેરો',

    // General
    'general.offlineBanner': 'ઑફલાઇન મોડ: ઇમરજન્સી પ્રાથમિક સારવાર અને સંગ્રહિત હોસ્પિટલો ઇન્ટરનેટ વિના ઉપલબ્ધ છે.',
    'general.backHome': '← મુખ્ય પૃષ્ઠ પર પાછા જાઓ',
    'general.save': 'સાચવો',
    'general.cancel': 'રદ કરો'
  }
};

export class I18nService {
  public static getCurrentLanguage(): SupportedLanguage {
    const lang = StorageService.getLanguage();
    if (lang === 'hi' || lang === 'gu') {
      return lang;
    }
    return 'en';
  }

  public static t(key: string, fallback?: string): string {
    const lang = this.getCurrentLanguage();
    const translation = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key];
    return translation || fallback || key;
  }

  public static setLanguage(code: SupportedLanguage): void {
    StorageService.setLanguage(code);
  }
}
