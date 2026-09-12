import { Symptom, SymptomQuestion, SymptomInput, AssessmentResult } from '../types/health';
import { StorageService } from '../services/storageService';

export const COMMON_SYMPTOMS: Symptom[] = [
  { id: 'fever', name: 'High Fever', category: 'general', icon: '🌡️' },
  { id: 'chest-pain', name: 'Chest Pain / Pressure', category: 'cardiac', icon: '💔', isRedFlag: true },
  { id: 'breathing-difficulty', name: 'Breathing Difficulty', category: 'respiratory', icon: '🫁', isRedFlag: true },
  { id: 'cough', name: 'Severe Cough', category: 'respiratory', icon: '😮‍💨' },
  { id: 'headache', name: 'Severe Headache', category: 'neurological', icon: '🤕' },
  { id: 'vomiting', name: 'Persistent Vomiting', category: 'digestive', icon: '🤢' },
  { id: 'stomach-pain', name: 'Abdominal / Stomach Pain', category: 'digestive', icon: '⚡' },
  { id: 'dizziness', name: 'Dizziness / Fainting', category: 'neurological', icon: '😵' },
  { id: 'weakness', name: 'Sudden Weakness / Numbness', category: 'neurological', icon: '⚡', isRedFlag: true },
  { id: 'snake-bite', name: 'Bite / Insect / Snake Sting', category: 'trauma', icon: '🐍', isRedFlag: true },
  { id: 'bleeding', name: 'Heavy Bleeding / Cut', category: 'trauma', icon: '🩸', isRedFlag: true },
  { id: 'burns', name: 'Burns / Scalds', category: 'trauma', icon: '🔥' },
  { id: 'rash', name: 'Skin Rash / Allergic Swelling', category: 'general', icon: '🔴' },
  { id: 'pregnancy-pain', name: 'Pregnancy Pain / Bleeding', category: 'maternal', icon: '🤰', isRedFlag: true },
  { id: 'child-lethargy', name: 'Child Lethargy / Refusal to Drink', category: 'pediatric', icon: '👶', isRedFlag: true },
  { id: 'seizures', name: 'Seizures / Convulsions', category: 'neurological', icon: '🫨', isRedFlag: true }
];

export const FOLLOW_UP_QUESTIONS: Record<string, SymptomQuestion> = {
  duration: {
    id: 'duration',
    question: 'When did the symptoms begin?',
    subtext: 'Knowing when it started helps determine whether this is an acute emergency or developing condition.',
    options: [
      { label: 'Within the last few hours (Sudden)', value: 'hours', riskWeight: 2 },
      { label: 'Today (Past 24 hours)', value: 'today', riskWeight: 1 },
      { label: '2 to 3 days ago', value: 'few-days', riskWeight: 1 },
      { label: 'More than a week ago', value: 'week-plus', riskWeight: 0 }
    ]
  },
  severity: {
    id: 'severity',
    question: 'How severe is the discomfort right now?',
    subtext: 'Pick the rating that matches the person’s current distress.',
    options: [
      { label: 'Mild — Able to talk and do daily work', value: 'mild', riskWeight: 0 },
      { label: 'Moderate — Noticeable discomfort, resting', value: 'moderate', riskWeight: 1 },
      { label: 'Severe / Unbearable — Cannot stand, talk, or rest', value: 'severe', riskWeight: 3 }
    ]
  },
  redFlags: {
    id: 'redFlags',
    question: 'Are any of these dangerous warning signs present?',
    subtext: 'Look closely at the person. Check all that you notice.',
    options: [
      { label: 'Bluish lips or face / struggling for breath', value: 'blue-lips', triggersEmergency: true },
      { label: 'Sudden slurred speech or one-sided facial drooping', value: 'fast-stroke', triggersEmergency: true },
      { label: 'Continuous chest squeezing radiating to left arm/jaw', value: 'cardiac-pain', triggersEmergency: true },
      { label: 'Uncontrolled spurting blood or deep laceration', value: 'hemorrhage', triggersEmergency: true },
      { label: 'Snake bite, pesticide ingestion, or electric shock', value: 'acute-toxin', triggersEmergency: true },
      { label: 'None of these danger signs are present', value: 'none', triggersEmergency: false }
    ]
  }
};

export const SYMPTOM_FLOW_QUESTIONS = FOLLOW_UP_QUESTIONS;

export function generateMockAssessment(input: SymptomInput, lang?: string): AssessmentResult {
  const currentLang = lang || StorageService.getLanguage() || 'en';
  const textDesc = (input.description || '').toLowerCase();
  const criticalKeywords = ['snake', 'venom', 'heart attack', 'chest crush', 'stroke', 'unconscious', 'poison', 'hemorrhage', 'choking', 'सांप', 'दौरा', 'बेहोश', 'હૃદય', 'ઝેર'];
  const hasCriticalKeyword = criticalKeywords.some((k) => textDesc.includes(k));

  const hasCriticalSign = Boolean(
    input.associatedSigns &&
      input.associatedSigns.some((sign) => ['blue-lips', 'fast-stroke', 'cardiac-pain', 'hemorrhage', 'acute-toxin'].includes(sign))
  );

  const hasCriticalSymptom =
    input.symptoms.some((s) => ['snake-bite', 'seizures'].includes(s)) ||
    (input.symptoms.includes('chest-pain') && (hasCriticalSign || input.symptoms.includes('breathing-difficulty') || textDesc.includes('crush') || textDesc.includes('radiat')));

  const isCritical = hasCriticalSymptom || hasCriticalSign || hasCriticalKeyword;

  // ─────────────── 1. CRITICAL ASSESSMENT ───────────────
  if (isCritical) {
    if (currentLang === 'hi') {
      return {
        id: `triage-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskLevel: 'CRITICAL',
        headline: 'तत्काल आपातकालीन चिकित्सा देखभाल आवश्यक है',
        subheadline: '🚨 अत्यंत गंभीर खतरे के लक्षण पाए गए',
        summary: 'बताए गए लक्षणों में आपातकालीन चेतावनी संकेत शामिल हैं, जिसके लिए नजदीकी अस्पताल या ट्रॉमा सेंटर में तुरंत जांच की आवश्यकता है।',
        warningSigns: [
          'सांस लेने में अत्यधिक कठिनाई या ऑक्सीजन की भारी कमी',
          'दिल का दौरा, स्ट्रोक, जहरीला डंक या भारी रक्तस्राव का खतरा',
          'बिना डॉक्टर के तुरंत हस्तक्षेप के स्थिति तेजी से बिगड़ने की संभावना'
        ],
        immediateSteps: [
          'तुरंत 108 एम्बुलेंस पर कॉल करें या सीधे नजदीकी अस्पताल पहुंचें।',
          'मरीज को शांत रखें, सुरक्षित स्थिति में लिटाएं और लगातार निगरानी रखें।',
          'मरीज को खाने-पीने के लिए कुछ न दें और कोई घरेलू नुस्खा न आजमाएं।'
        ],
        whatToDo: [
          'रोगी को आराम से बैठाएं या करवट दिलाकर लिटाएं',
          'गले और छाती के आसपास के कपड़े ढीले कर दें ताकि सांस लेने में आसानी हो',
          'यदि कोई पिछली मेडिकल पर्ची या दवाई हो तो साथ लेकर अस्पताल जाएं',
          'बिना देरी किए नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC), CHC या जिला अस्पताल पहुंचें'
        ],
        whatToAvoid: [
          'किसी भी प्रकार के घरेलू नुस्खे या जड़ी-बूटी से इलाज का प्रयास न करें',
          'रोगी को चलने, गाड़ी चलाने या श्रम करने की अनुमति न दें',
          'झाड़-फूंक, चीरा लगाने या अंगूठा बांधने जैसी गलत परंपराओं से बचें',
          'रोगी को कभी भी अकेला न छोड़ें'
        ],
        homeRemedies: [
          'इस गंभीर आपातकालीन स्थिति के लिए कोई भी घरेलू उपाय सुरक्षित या पर्याप्त नहीं है। 108 एम्बुलेंस के माध्यम से तुरंत अस्पताल जाना अनिवार्य है।'
        ],
        possibleConditions: [
          {
            name: 'गंभीर कार्डियोरेस्पिरेटरी या आपातकालीन विषाक्त स्थिति',
            likelihood: 'Requires Investigation',
            description: 'लक्षण गंभीर आपात स्थिति से मेल खाते हैं जिसके लिए अस्पताल में ऑक्सीजन और आपातकालीन दवाओं की जरूरत होती है।',
            relevance: 'उच्च नैदानिक तात्कालिकता और खतरे के संकेतों पर आधारित'
          }
        ],
        timeframe: 'तुरंत (30 से 60 मिनट के भीतर)',
        suggestedCareType: 'emergency_hospital',
        disclaimer: 'यह जीवनसेतु एआई द्वारा प्राथमिक मार्गदर्शन है। यह अंतिम निदान नहीं है और तुरंत डॉक्टर की जांच जरूरी है।'
      };
    }

    if (currentLang === 'gu') {
      return {
        id: `triage-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskLevel: 'CRITICAL',
        headline: 'તાત્કાલિક કટોકટીની તબીબી સંભાળ આવશ્યક છે',
        subheadline: '🚨 ગંભીર જોખમના લક્ષણો જણાયા છે',
        summary: 'જણાવેલા લક્ષણોમાં ગંભીર ચેતવણી સંકેતો છે, જેના માટે નજીકના હોસ્પિટલ અથવા ટ્રોમા સેન્ટરમાં તાત્કાલિક મૂલ્યાંકનની જરૂર છે.',
        warningSigns: [
          'શ્વાસ લેવામાં તીવ્ર તકલીફ અથવા ઓક્સિજનની અછત',
          'હાર્ટ એટેક, સ્ટ્રોક, ઝેરી ડંખ અથવા રક્તસ્ત્રાવની કટોકટી',
          'ડોક્ટરની તાત્કાલિક સારવાર વિના સ્થિતિ બગડવાની શક્યતા'
        ],
        immediateSteps: [
          'તરત જ ૧૦૮ એમ્બ્યુલન્સ પર કૉલ કરો અથવા દર્દીને હોસ્પિટલ લઈ જાઓ.',
          'દર્દીને શાંત રાખો, આરામદાયક સ્થિતિમાં સુવડાવો અને ધ્યાન રાખો.',
          'દર્દીને ખાવા-પીવાનું કશું ન આપો અને કોઈ ઘરગથ્થુ નુસખા ન કરો.'
        ],
        whatToDo: [
          'દર્દીને આરામદાયક સ્થિતિમાં બેસાડો અથવા પડખાભેર સુવડાવો',
          'શ્વાસ સરળતાથી લઈ શકાય તે માટે ગળા અને છાતીના કપડાં ઢીલા કરો',
          'અગાઉના રિપોર્ટ કે દવાઓ હોય તો સાથે રાખીને હોસ્પિટલ પહોંચો',
          'નજીકના પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) કે સબ-ડિસ્ટ્રિક્ટ હોસ્પિટલ પહોંચો'
        ],
        whatToAvoid: [
          'કોઈપણ અપ્રમાણિત ઘરગથ્થુ ઉપચાર કરવાનો પ્રયાસ ન કરો',
          'દર્દીને ચાલવા, શ્રમ કરવા કે વાહન ચલાવવા ન દો',
          'ચીરા મૂકવા કે બાંધવા જેવી જોખમી પ્રથાઓથી દૂર રહો',
          'દર્દીને ક્યારેય એકલા ન છોડો'
        ],
        homeRemedies: [
          'આ ગંભીર કટોકટી માટે કોઈ પણ ઘરેલું ઉપાય સલામત નથી. ૧૦૮ એમ્બ્યુલન્સ દ્વારા તાત્કાલિક હોસ્પિટલ પહોંચવું જરૂરી છે.'
        ],
        possibleConditions: [
          {
            name: 'ગંભીર કાર્ડિયોવેસ્ક્યુલર અથવા ઈમરજન્સી સ્થિતિ',
            likelihood: 'Requires Investigation',
            description: 'લક્ષણો ગંભીર કટોકટી સાથે સુસંગત છે જેના માટે ઓક્સિજન અને વિશેષ સારવાર અનિવાર્ય છે.',
            relevance: 'કટોકટીના જોખમી સંકેતો પર આધારિત'
          }
        ],
        timeframe: 'તાત્કાલિક (૩૦ થી ૬૦ મિનિટમાં)',
        suggestedCareType: 'emergency_hospital',
        disclaimer: 'આ જીવનસેતુ AI દ્વારા શિક્ષણ અને સલાહ માટે છે. આ કોઈ આખરી નિદાન નથી.'
      };
    }

    // Default English
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'CRITICAL',
      headline: 'IMMEDIATE EMERGENCY MEDICAL CARE REQUIRED',
      subheadline: '🚨 CRITICAL DANGER SIGNS DETECTED',
      summary: 'The symptoms described include critical warning signs that require immediate emergency evaluation at the nearest hospital or trauma care centre.',
      warningSigns: [
        'Acute distress or difficulty maintaining normal airway and oxygenation',
        'Potential cardiac, neurological, toxic, or uncontrolled hemorrhagic emergency',
        'High risk of rapid clinical deterioration without in-person emergency intervention'
      ],
      immediateSteps: [
        'Call 108 Emergency Ambulance immediately or arrange urgent direct transit.',
        'Keep the person calm, in a safe resting posture, and continuously observed.',
        'Do NOT give heavy oral fluids, solid foods, or traditional home mixtures.'
      ],
      whatToDo: [
        'Keep the patient resting upright or in recovery position depending on condition',
        'Ensure continuous ventilation and loosen tight clothing around neck and chest',
        'Gather any current medical reports, prescription slips, or medicine wrappers to carry along',
        'Rush directly to the nearest Primary Health Centre (PHC), CHC, or District Hospital'
      ],
      whatToAvoid: [
        'DO NOT attempt unverified home remedies or delay hospital transport',
        'DO NOT allow the person to walk, exert themselves, or drive',
        'DO NOT administer traditional cuts, herbal pastes, or oral alcohol/lotions',
        'DO NOT leave the person unattended'
      ],
      homeRemedies: [
        'No home remedy is safe or sufficient for this critical medical emergency. Immediate hospital care via 108 ambulance is necessary.'
      ],
      possibleConditions: [
        {
          name: 'Critical Cardiorespiratory, Neurological, or Toxic Emergency',
          likelihood: 'Requires Investigation',
          description: 'Symptoms overlap with acute emergency conditions requiring hospital monitoring, oxygen, or specialized medications.',
          relevance: 'Based on high clinical urgency and acute critical indicators'
        }
      ],
      timeframe: 'IMMEDIATELY (Within 30–60 minutes)',
      suggestedCareType: 'emergency_hospital',
      disclaimer: 'This is an AI-assisted triage assessment for emergency guidance. It is not a definitive diagnosis and cannot replace hospital emergency personnel.'
    };
  }

  // ─────────────── DERIVE REMEDIES (NON-CRITICAL) ───────────────
  const s = input.symptoms || [];
  const remediesEn: string[] = [];
  const remediesHi: string[] = [];
  const remediesGu: string[] = [];

  if (s.includes('fever') || textDesc.includes('fever') || textDesc.includes('बुखार') || textDesc.includes('તાવ')) {
    remediesEn.push('Drink plenty of boiled and cooled water, fresh coconut water, or thin mung dal soup to maintain hydration.');
    remediesEn.push('Sponge the forehead, neck, and arms with lukewarm tap water (not cold water) to gently disperse excess heat.');
    remediesEn.push('Rest in a well-ventilated, shaded room wearing lightweight, breathable cotton clothing.');

    remediesHi.push('उबला हुआ गुनगुना पानी, ताजा नारियल पानी या पतली मूंग दाल का सूप पिएं ताकि शरीर में पानी की कमी न हो।');
    remediesHi.push('माथे, गर्दन और हाथों पर गुनगुने पानी की पट्टी रखें (बर्फ या ठंडे पानी का उपयोग न करें)।');
    remediesHi.push('हवादार और छायादार कमरे में आराम करें तथा ढीले और आरामदायक सूती कपड़े पहनें।');

    remediesGu.push('શરીરમાં પાણીનું પ્રમાણ જળવાઈ રહે તે માટે ઉકાળેલું નવશેકું પાણી, નાળિયેર પાણી કે મગનું પાતળું પાણી પીવો.');
    remediesGu.push('ગરમી ઓછી કરવા માટે કપાળ, ગરદન અને હાથ પર સામાન્ય પાણીના પોતા મૂકો (બરફનું પાણી ન વાપરો).');
    remediesGu.push('હવાઉજાસવાળા ઓરડામાં આરામ કરો અને હળવા સુતરાઉ કપડાં પહેરો.');
  }

  if (s.includes('cough') || s.includes('breathing-difficulty') || textDesc.includes('cough') || textDesc.includes('खांसी') || textDesc.includes('ખાંસી')) {
    remediesEn.push('Gargle with warm salt water (1/2 teaspoon salt in a glass of warm water) 3 to 4 times daily to soothe throat irritation.');
    remediesEn.push('Drink warm herbal decoction prepared with fresh tulsi leaves, crushed ginger, and a teaspoon of honey.');
    remediesEn.push('Inhale gentle warm water steam for 5 minutes twice daily to loosen congested nasal passages.');

    remediesHi.push('गले की खराश कम करने के लिए दिन में 3 से 4 बार हल्के गुनगुने नमक के पानी से गरारे करें।');
    remediesHi.push('तुलसी के पत्ते, पिसा हुआ अदरक और थोड़ा शहद मिलाकर तैयार किया गया काढ़ा पिएं।');
    remediesHi.push('बंद नाक और सीने की जकड़न खोलने के लिए दिन में दो बार 5 मिनट तक सादे गर्म पानी की भाप लें।');

    remediesGu.push('ગળાની બળતરામાં રાહત મેળવવા દિવસમાં ૩-૪ વખત નવશેકા મીઠાવાળા પાણીના કોગળા કરો.');
    remediesGu.push('તુલસી, આદું અને મધ સાથે બનાવેલો હળવો ઉકાળો પીવો.');
    remediesGu.push('નાક અને ગળાની કફ-જકડન દૂર કરવા દિવસમાં બે વાર સાદી વરાળ (બાફ) લો.');
  }

  if (s.includes('vomiting') || s.includes('stomach-pain') || textDesc.includes('vomit') || textDesc.includes('उल्टी') || textDesc.includes('ઝાડા')) {
    remediesEn.push('Sip Oral Rehydration Salt (ORS) solution or clean electrolyte water slowly after each episode.');
    remediesEn.push('Consume gentle, binding foods such as fresh buttermilk with roasted cumin, soft khichdi, or ripe bananas.');
    remediesEn.push('Avoid fried, oily, heavily spiced foods, raw salads, and dairy milk until digestion recovers.');

    remediesHi.push('ओआरएस (ORS) का घोल या नमक-चीनी का पानी घूंट-घूंट करके धीरे-धीरे पिएं।');
    remediesHi.push('भुने जीरे वाली ताजी छाछ, पतली मूंग दाल की खिचड़ी या पके केले का सेवन करें।');
    remediesHi.push('तला-भुना, अधिक मसालेदार भोजन, बासी खाना और भारी दूध का सेवन पूरी तरह बंद रखें।');

    remediesGu.push('દરેક ઉલટી કે ઝાડા પછી ORS (ઓઆરએસ) નું દ્રાવણ ધીમે-ધીમે ઘૂંટડે-ઘૂંટડે પીવો.');
    remediesGu.push('શેકેલું જીરું નાખેલી તાજી છાશ, હળવી મગની ખીચડી અથવા પાકા કેળાં ખાઓ.');
    remediesGu.push('તળેલું, તેલ-મસાલાવાળું, ભારે ભોજન અને દૂધ પાચન સુધરે ત્યાં સુધી ન લો.');
  }

  if (remediesEn.length === 0) {
    remediesEn.push('Drink 8 to 10 glasses of clean boiled drinking water throughout the day to aid recovery.');
    remediesEn.push('Get 8 to 9 hours of uninterrupted restful sleep in a calm, well-ventilated environment.');
    remediesEn.push('Consume freshly prepared, warm, light meals like vegetable dalia, porridge, and clear broths.');

    remediesHi.push('दिनभर में 8 से 10 गिलास साफ उबला हुआ पानी पिएं ताकि शरीर स्वस्थ रहे।');
    remediesHi.push('शांत और स्वच्छ वातावरण में 8 से 9 घंटे की अच्छी नींद लें।');
    remediesHi.push('ताजा, हल्का और पौष्टिक भोजन जैसे दलिया, मूंग की खिचड़ी और सूप लें।');

    remediesGu.push('આખો દિવસ ૮ થી ૧૦ ગ્લાસ સ્વચ્છ ઉકાળેલું પાણી પીવો જેથી શરીર હાઈડ્રેટેડ રહે.');
    remediesGu.push('શાંત અને સ્વચ્છ વાતાવરણમાં પૂરતો આરામ અને ઊંઘ લો.');
    remediesGu.push('તાજો, સુપાચ્ય અને ગરમ ખોરાક જેમ કે દાળિયા, ખીચડી અને શાકભાજીનો સૂપ લો.');
  }

  const selectedRemedies = currentLang === 'hi' ? remediesHi : currentLang === 'gu' ? remediesGu : remediesEn;

  const isModerate =
    input.severity === 'moderate' ||
    input.severity === 'severe' ||
    input.symptoms.length >= 2 ||
    input.duration === 'few-days' ||
    input.duration === 'week-plus';

  // ─────────────── 2. MODERATE ASSESSMENT ───────────────
  if (isModerate) {
    if (currentLang === 'hi') {
      return {
        id: `triage-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskLevel: 'MODERATE',
        headline: 'डॉक्टर से परामर्श की सलाह दी जाती है',
        subheadline: '🟡 24 घंटे के भीतर डॉक्टर को दिखाना उचित होगा',
        summary: 'आपके लक्षण सामान्य से अधिक हैं। हालांकि यह तत्काल जीवन के लिए खतरा नहीं है, परंतु नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या डॉक्टर से जांच कराना आवश्यक है।',
        warningSigns: [
          'लक्षण 48 घंटे से अधिक समय तक बने रहना और कोई सुधार न होना',
          'घरेलू उपाय के बाद भी बुखार 101°F से अधिक बना रहना',
          'पानी या तरल पदार्थ पीने में असमर्थता या अत्यधिक कमजोरी'
        ],
        immediateSteps: [
          'अगले 24 घंटे के भीतर नजदीकी पीएचसी (PHC) या डॉक्टर के पास जाने की योजना बनाएं।',
          'आराम पाने के लिए नीचे दिए गए सुरक्षित घरेलू नुस्खों का पालन करें।',
          'भरपूर पानी पिएं और धूप या भारी शारीरिक श्रम से बचें।'
        ],
        whatToDo: [
          'अपने नजदीकी सरकारी स्वास्थ्य केंद्र या आशा/एएनएम कार्यकर्ता से परामर्श लें',
          'पर्याप्त तरल पदार्थ पिएं और हल्का, आसानी से पचने वाला भोजन खाएं',
          'हर 4 घंटे में शरीर का तापमान और सामान्य स्थिति नोट करें'
        ],
        whatToAvoid: [
          'बिना डॉक्टर की पर्ची के मेडिकल स्टोर से एंटीबायोटिक या तेज दवाएं न लें',
          'कड़ी धूप में भारी खेती या मेहनत का काम न करें',
          'सांस फूलने या सीने में जकड़न जैसे नए लक्षणों को नजरअंदाज न करें'
        ],
        homeRemedies: selectedRemedies,
        isValidHealthQuery: true,
        identifiedDisease: 'मौसमी वायरल या श्वसन/पाचन संक्रमण',
        medicalCure: [
          'दर्द और बुखार निवारण: पीएचसी डॉक्टर के परामर्श से पैरासिटामोल (Paracetamol 500-650mg) दिन में 2-3 बार',
          'इलेक्ट्रोलाइट संतुलन: डिहाइड्रेशन रोकने के लिए ओआरएस (ORS) का घोल दिनभर धीरे-धीरे पिएं',
          'क्लिनिकल जांच: 48 घंटे में आराम न आने पर रक्त जांच (CBC / विडाल टेस्ट) अवश्य कराएं'
        ],
        dietaryCure: [
          'सुपाच्य आहार: मूंग दाल की खिचड़ी, ताजा दलिया, उबली सब्जियां और पके केले',
          'रोगप्रतिरोधक पेय: हल्का गुनगुना पानी, तुलसी-अदरक का काढ़ा और भुने जीरे की पतली छाछ',
          'परहेज: ज्यादा तला-भुना, बासी खाना, खट्टे या तीखे मसाले और कोल्ड ड्रिंक्स बंद रखें'
        ],
        possibleConditions: [
          {
            name: 'मौसमी वायरल या श्वसन/पाचन संक्रमण',
            likelihood: 'Possible',
            description: 'सामान्य मौसमी संक्रमण जिसके लिए आराम, पानी और डॉक्टर की जांच की आवश्यकता है।',
            relevance: 'बताए गए लक्षणों और अवधि पर आधारित'
          }
        ],
        timeframe: '12 से 24 घंटे के भीतर',
        suggestedCareType: 'clinic_visit',
        disclaimer: 'जीवनसेतु एआई केवल प्राथमिक मार्गदर्शन प्रदान करता है। पूर्ण उपचार के लिए डॉक्टर से मिलें।'
      };
    }

    if (currentLang === 'gu') {
      return {
        id: `triage-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        riskLevel: 'MODERATE',
        headline: 'તબીબી તપાસની સલાહ આપવામાં આવે છે',
        subheadline: '🟡 ૨૪ કલાકમાં ડોક્ટરની મુલાકાત લેવી યોગ્ય રહેશે',
        summary: 'તમારા લક્ષણો દર્શાવે છે કે આ કોઈ ગંભીર કટોકટી નથી, પરંતુ યોગ્ય રિકવરી માટે પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) ના ડોક્ટર પાસે તપાસ કરાવવી જરૂરી છે.',
        warningSigns: [
          'લક્ષણો ૪૮ કલાકથી વધુ સમય સુધી ચાલુ રહેવા',
          'તાવ ૧૦૧°F થી વધુ સતત જળવાઈ રહેવો',
          'શરીરમાં ભારે નબળાઈ કે ખોરાક-પાણી ન ટકવું'
        ],
        immediateSteps: [
          '૨૪ કલાકમાં નજીકના PHC કે દવાખાને જવાનું આયોજન કરો.',
          'રાહત માટે નીચે જણાવેલા ઘરગથ્થુ ઉપચારો અપનાવો.',
          'પૂરતું પાણી પીવો અને વધુ પડતા શ્રમથી બચો.'
        ],
        whatToDo: [
          'સ્થાનિક આરોગ્ય કેન્દ્ર અથવા આશા વર્કરનો સંપર્ક કરો',
          'સ્વચ્છ પાણી પીવો અને પચવામાં હળવો ખોરાક લો',
          'શરીરના તાપમાન અને લક્ષણો પર નજર રાખો'
        ],
        whatToAvoid: [
          'ડોક્ટરની સલાહ વગર જાતે ભારે એન્ટીબાયોટિક દવાઓ ન લો',
          'તડકામાં કે ખેતરમાં ભારે શ્રમ ન કરો',
          'શ્વાસની તકલીફ કે છાતીમાં દુખાવા જેવા લક્ષણોની અવગણના ન કરો'
        ],
        homeRemedies: selectedRemedies,
        isValidHealthQuery: true,
        identifiedDisease: 'મોસમી વાયરલ અથવા પાચન સંબંધિત બીમારી',
        medicalCure: [
          'તાવ અને દુખાવો નિવારણ: PHC તબીબની સલાહ મુજબ પેરાસિટામોલ (Paracetamol 500-650mg)',
          'ઇલેક્ટ્રોલાઇટ સંતુલન: ડીહાઇડ્રેશન રોકવા ORS નું દ્રાવણ વારંવાર થોડું થોડું પીવો',
          'ક્લિનિકલ ટેસ્ટ: ૪૮ કલાકમાં તાવ ન ઉતરે તો રક્ત પરીક્ષણ (CBC) કરાવો'
        ],
        dietaryCure: [
          'હળવો આહાર: મગની દાળની ખીચડી, દાળિયા, બાફેલી શાકભાજી અને પાકા કેળાં',
          'સ્વાસ્થ્યવર્ધક પ્રવાહી: નવશેકું પાણી, તુલસી-આદુંનો ઉકાળો અને જીરાવાળી છાશ',
          'પરેજી: તળેલું, ભારે મસાલેદાર, ઠંડા પીણાં અને વાસી ભોજન બંધ રાખવું'
        ],
        possibleConditions: [
          {
            name: 'મોસમી વાયરલ અથવા પાચન સંબંધિત બીમારી',
            likelihood: 'Possible',
            description: 'સામાન્ય મોસમી ઈન્ફેક્શન જેના માટે આરામ અને તબીબી તપાસ જરૂરી છે.',
            relevance: 'જણાવેલા લક્ષણો અને સમયગાળા અનુસાર'
          }
        ],
        timeframe: '૧૨ થી ૨૪ કલાકમાં',
        suggestedCareType: 'clinic_visit',
        disclaimer: 'જીવનસેતુ પ્રારંભિક સલાહ આપે છે. ચોક્કસ નિદાન માટે ડોક્ટરને રૂબરૂ મળો.'
      };
    }

    // English Moderate
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'MODERATE',
      isValidHealthQuery: true,
      identifiedDisease: 'Acute Seasonal Viral Infection & Discomfort',
      headline: 'CLINICAL EVALUATION ADVISED',
      subheadline: '🟡 DOCTOR REVIEW RECOMMENDED WITHIN 24 HOURS',
      summary: 'Your symptoms indicate a developing illness that is not an immediate life threat but requires examination by a doctor or Primary Health Centre (PHC) officer.',
      warningSigns: [
        'Symptoms persisting beyond 48 hours without noticeable improvement',
        'Temperature remaining above 101°F despite supportive care',
        'Inability to keep oral fluids or light meals down'
      ],
      immediateSteps: [
        'Plan a visit to your nearest Primary Health Centre (PHC) or clinic within 24 hours.',
        'Follow safe home remedies below to stay comfortable while arranging care.',
        'Keep well-hydrated and avoid strenuous physical outdoor work.'
      ],
      whatToDo: [
        'Visit your local PHC/CHC or consult an ASHA / ANM community health worker',
        'Drink plenty of clean fluids and eat light, easily digestible food',
        'Monitor temperature, pulse, and energy levels every 4 hours'
      ],
      whatToAvoid: [
        'DO NOT take random leftover antibiotics without prescription',
        'DO NOT undertake strenuous agricultural or physical labor in direct sun',
        'DO NOT ignore sudden shortness of breath, severe chest tightness, or confusion'
      ],
      homeRemedies: selectedRemedies,
      medicalCure: [
        'Antipyretic & Pain Relief: Paracetamol (500mg–650mg as prescribed by PHC doctor) every 6–8 hours for fever and body ache',
        'Hydration Management: WHO-formula Oral Rehydration Salts (ORS) sips to prevent dehydration',
        'Clinical Pathology: Complete Blood Count (CBC) and Malarial Smear if fever persists beyond 48 hours',
        'Doctor Examination: Chest auscultation and pharynx exam at local health sub-centre'
      ],
      dietaryCure: [
        'Therapeutic Nutrition: Steamed rice with yellow moong dal (khichdi), soft porridge, and clear vegetable broth',
        'Hydrating Fluids: Boiled lukewarm drinking water, fresh coconut water, and diluted buttermilk with roasted cumin',
        'Avoid: Deep-fried oily snacks, strong hot chillies, carbonated cold sodas, and heavy dairy creams'
      ],
      possibleConditions: [
        {
          name: 'Seasonal Viral / Bacterial Respiratory or Digestive Illness',
          likelihood: 'Possible',
          description: 'Common seasonal infection requiring hydration, rest, and doctor evaluation.',
          relevance: 'Matches reported symptoms and moderate duration'
        }
      ],
      timeframe: 'Within 12 to 24 Hours',
      suggestedCareType: 'clinic_visit',
      disclaimer: 'JeevanSetu provides preliminary triage assistance. Only a licensed physician can provide a definitive medical diagnosis.'
    };
  }

  // ─────────────── 3. LOW RISK ASSESSMENT ───────────────
  if (currentLang === 'hi') {
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'LOW',
      headline: 'कम जोखिम — सुरक्षित घरेलू देखभाल',
      subheadline: '🟢 खतरे का कोई संकेत नहीं मिला',
      summary: 'आपके बताए गए लक्षणों में कोई गंभीर चेतावनी संकेत नहीं है। आप नीचे दिए गए घरेलू उपायों और आराम से घर पर ही सुरक्षित सुधार कर सकते हैं।',
      warningSigns: [
        'यदि बुखार अचानक 102°F से ऊपर चला जाए या 3 दिन से अधिक रहे',
        'यदि सांस लेने में भारीपन या सीने में दर्द महसूस हो',
        'यदि गंभीर चक्कर आएं या लगातार उल्टियां हों'
      ],
      immediateSteps: [
        'घर पर हवादार कमरे में आराम से विश्राम करें।',
        'नीचे दिए गए सुरक्षित घरेलू उपायों का उपयोग करें।',
        'साफ उबला पानी और पौष्टिक सूप पीकर शरीर में नमी बनाए रखें।'
      ],
      whatToDo: [
        'रोग प्रतिरोधक क्षमता बढ़ाने के लिए भरपूर आराम और नींद लें',
        'दिन भर में 8-10 गिलास साफ उबला या छना हुआ पानी पिएं',
        'दलिया, खिचड़ी और फल जैसा हल्का पौष्टिक भोजन खाएं',
        'साबुन से बार-बार हाथ धोएं और स्वच्छता बनाए रखें'
      ],
      whatToAvoid: [
        'बिना सलाह के मेडिकल स्टोर से तेज अंग्रेजी दवाएं न खरीदें',
        'कच्चा दूध, खुला या बासी भोजन न खाएं',
        'पूरी तरह ठीक होने तक भारी शारीरिक श्रम न करें'
      ],
      homeRemedies: selectedRemedies,
      possibleConditions: [
        {
          name: 'हल्की मौसमी थकान या सामान्य असुविधा',
          likelihood: 'Likely',
          description: 'हल्की मौसमी स्थिति जो आराम, पर्याप्त पानी और पोषण से स्वतः ठीक हो जाती है।',
          relevance: 'हल्के लक्षणों और खतरे के संकेतों के अभाव के अनुरूप'
        }
      ],
      timeframe: 'घर पर निगरानी रखें (48 घंटे में सुधार न होने पर डॉक्टर को दिखाएं)',
      suggestedCareType: 'home_support',
      disclaimer: 'यह मूल्यांकन केवल मार्गदर्शन के लिए है। यदि लक्षण बढ़ें तो अवश्य डॉक्टर से परामर्श लें।'
    };
  }

  if (currentLang === 'gu') {
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'LOW',
      headline: 'ઓછું જોખમ — સલામત ઘરેલું સંભાળ',
      subheadline: '🟢 કોઈ કટોકટીના સંકેતો નથી',
      summary: 'તમે જણાવેલા લક્ષણો અનુસાર કોઈ કટોકટીના સંકેતો નથી. તમે નીચે જણાવેલા સરળ ઘરગથ્થુ ઉપચારો અને આરામથી સાજા થઈ શકો છો.',
      warningSigns: [
        'જો તાવ ૧૦૨°F થી વધી જાય અથવા ૩ દિવસથી વધુ રહે',
        'જો શ્વાસ લેવામાં અચાનક તકલીફ થાય કે છાતીમાં દુખાવો ઉપડે',
        'જો ચક્કર આવે અથવા સતત ઉલટી થવા લાગે'
      ],
      immediateSteps: [
        'ઘરે હવાદાર ઓરડામાં પૂરતો આરામ કરો.',
        'નીચે જણાવેલા સુરક્ષિત ઘરગથ્થુ નુસખાનો ઉપયોગ કરો.',
        'સ્વચ્છ પાણી અને પ્રવાહી ખોરાક લઈ શરીરમાં જળસ્તર જાળવો.'
      ],
      whatToDo: [
        'શરીરની કુદરતી રોગપ્રતિકારક શક્તિ વધારવા પૂરતી ઊંઘ લો',
        'આખો દિવસ ૮-૧૦ ગ્લાસ સ્વચ્છ પાણી પીવો',
        'દાળિયા, ખીચડી અને ફળો જેવો પૌષ્ટિક આહાર લો',
        'સ્વચ્છતા જાળવો અને વારંવાર હાથ ધુઓ'
      ],
      whatToAvoid: [
        'મેડિકલ સ્ટોર પરથી પૂછ્યા વગર જાતે દવાઓ ન ખરીદો',
        'વાસી ખોરાક કે દૂષિત પાણીનું સેવન ન કરો',
        'સંપૂર્ણ આરામ ન થાય ત્યાં સુધી ભારે પરિશ્રમ ન કરો'
      ],
      homeRemedies: selectedRemedies,
      possibleConditions: [
        {
          name: 'હળવી મોસમી અસ્વસ્થતા અથવા સામાન્ય થાક',
          likelihood: 'Likely',
          description: 'સામાન્ય મોસમી સ્થિતિ જે પૂરતા આરામ અને સારા ખોરાકથી ઝડપથી મટી જાય છે.',
          relevance: 'હળવા લક્ષણો અને જોખમી સંકેતોના સંપૂર્ણ અભાવ અનુસાર'
        }
      ],
      timeframe: 'ઘરે દેખરેખ રાખો (૪૮ કલાકમાં રાહત ન થાય તો ડોક્ટર પાસે જવું)',
      suggestedCareType: 'home_support',
      disclaimer: 'આ મૂલ્યાંકન માત્ર મદદરૂપ શિક્ષણ માટે છે. લક્ષણો વધે તો આરોગ્ય કેન્દ્રની મુલાકાત લો.'
    };
  }

  // English Low
  return {
    id: `triage-${Date.now()}`,
    timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    riskLevel: 'LOW',
    headline: 'LOW URGENCY — SAFE HOME CARE',
    subheadline: '🟢 NO CRITICAL SIGNS DETECTED',
    summary: 'Based on your reported symptoms, there are no emergency red flags. You can safely manage your recovery with supportive home remedies.',
    warningSigns: [
      'If fever rises sharply above 102°F or lasts more than 3 days',
      'If breathing becomes fast, heavy, or accompanied by chest pain',
      'If you experience severe dizziness or continuous vomiting'
    ],
    immediateSteps: [
      'Rest comfortably at home in a well-ventilated room.',
      'Prepare and use the safe home remedies listed below.',
      'Stay well-hydrated with safe drinking water and nourishing soups.'
    ],
    whatToDo: [
      'Rest and sleep to assist the body’s natural immune recovery',
      'Drink 8–10 glasses of clean boiled/filtered water throughout the day',
      'Consume light, nutritious foods like dalia, khichdi, and fresh fruits',
      'Wash hands frequently with soap and maintain good personal hygiene'
    ],
    whatToAvoid: [
      'DO NOT purchase over-the-counter strong medicines without consultation',
      'DO NOT consume unpasteurized milk, stale food, or untreated water',
      'DO NOT overexert yourself physically until feeling completely restored'
    ],
    homeRemedies: selectedRemedies,
    possibleConditions: [
      {
        name: 'Mild Seasonal Discomfort or Viral Fatigue',
        likelihood: 'Likely',
        description: 'Benign self-limiting condition that typically resolves with hydration, nutrition, and home care.',
        relevance: 'Consistent with mild symptoms and complete absence of danger signs'
      }
    ],
    timeframe: 'Monitor at home (Consult doctor if no improvement in 48h)',
    suggestedCareType: 'home_support',
    disclaimer: 'This assessment is for supportive education only. If your symptoms worsen or you feel uncertain, always visit a healthcare facility.'
  };
}
