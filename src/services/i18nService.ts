import { StorageService } from './storageService';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.triage': 'Triage AI',
    'nav.emergency': 'Emergency',
    'nav.care': 'Safe Care',
    'nav.guide': 'Guide',
    'nav.locator': 'Find Care',
    'nav.directHelp': '🚨 108 Direct Hotline',
    'nav.allLanguages': '🌐 All Languages',
    'nav.profile': '👤 Profile',
    'nav.history': '📋 History',
    'quick.voiceTitle': 'Voice Assistant',
    'home.heroSub': 'AI-assisted triage, emergency first-aid protocols, and evidence-based healthcare guidance for rural communities.',
    'common.disclaimerTitle': 'CLINICAL DISCLAIMER',
    'common.disclaimerText': 'JeevanSetu provides educational triage and first-response emergency guidance. It does not replace professional diagnosis by a qualified medical officer. In severe emergencies, call 108 immediately.'
  },
  hi: {
    'nav.home': 'होम',
    'nav.triage': 'लक्षण जाँच AI',
    'nav.emergency': 'आपातकाल',
    'nav.care': 'प्राथमिक देखभाल',
    'nav.guide': 'स्वास्थ्य गाइड',
    'nav.locator': 'अस्पताल खोजें',
    'nav.directHelp': '🚨 108 सीधी हेल्पलाइन',
    'nav.allLanguages': '🌐 सभी भाषाएं',
    'nav.profile': '👤 प्रोफ़ाइल',
    'nav.history': '📋 इतिहास',
    'quick.voiceTitle': 'आवाज़ सहायक',
    'home.heroSub': 'ग्रामीण समुदायों के लिए AI-संचालित प्राथमिक जाँच, आपातकालीन प्राथमिक उपचार प्रोटोकॉल और स्वास्थ्य मार्गदर्शन।',
    'common.disclaimerTitle': 'चिकित्सीय चेतावनी',
    'common.disclaimerText': 'जीवनसेतु शैक्षिक मार्गदर्शन व आपातकालीन सहायता प्रदान करता है। यह किसी प्रमाणित चिकित्सक के स्थान पर नहीं है। गंभीर स्थिति में तुरंत 108 पर कॉल करें।'
  },
  mr: {
    'nav.home': 'मुख्यपृष्ठ',
    'nav.triage': 'लक्षण तपासणी AI',
    'nav.emergency': 'तातडीची मदत',
    'nav.care': 'सुरक्षित काळजी',
    'nav.guide': 'आरोग्य मार्गदर्शक',
    'nav.locator': 'दवाखाना शोधा',
    'nav.directHelp': '🚨 108 थेट हेल्पलाइन',
    'nav.allLanguages': '🌐 सर्व भाषा',
    'nav.profile': '👤 प्रोफाइल',
    'nav.history': '📋 इतिहास',
    'quick.voiceTitle': 'आवाज सहाय्यक',
    'home.heroSub': 'ग्रामीण भागासाठी AI-आधारित आरोग्य मार्गदर्शन, प्रथमोपचार आणि आपत्कालीन सल्ला.',
    'common.disclaimerTitle': 'वैद्यकीय सूचना',
    'common.disclaimerText': 'जीवनसेतू प्राथमिक माहिती व आपत्कालीन मार्गदर्शनासाठी आहे. हे डॉक्टरांच्या सल्ल्याची जागा घेत नाही. गंभीर प्रसंगी लगेच 108 डायल करा.'
  }
};

export class I18nService {
  public static t(key: string, defaultText: string = ''): string {
    const lang = StorageService.getLanguage();
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  }
}
