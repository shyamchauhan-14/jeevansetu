import { Symptom, SymptomQuestion, AssessmentResult, SymptomInput } from '../types/health';

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

export function generateMockAssessment(input: SymptomInput): AssessmentResult {
  const textDesc = (input.description || '').toLowerCase();
  const criticalKeywords = ['snake', 'venom', 'heart attack', 'chest crush', 'stroke', 'unconscious', 'poison', 'hemorrhage', 'choking'];
  const hasCriticalKeyword = criticalKeywords.some((k) => textDesc.includes(k));

  const hasCriticalSign = Boolean(
    input.associatedSigns &&
      input.associatedSigns.some((sign) => ['blue-lips', 'fast-stroke', 'cardiac-pain', 'hemorrhage', 'acute-toxin'].includes(sign))
  );

  const hasCriticalSymptom =
    input.symptoms.some((s) => ['snake-bite', 'seizures'].includes(s)) ||
    (input.symptoms.includes('chest-pain') && (hasCriticalSign || input.symptoms.includes('breathing-difficulty') || textDesc.includes('crush') || textDesc.includes('radiat')));

  const isCritical = hasCriticalSymptom || hasCriticalSign || hasCriticalKeyword;

  if (isCritical) {
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

  // Derive home remedies for non-critical illness
  const homeRemedies: string[] = [];
  const s = input.symptoms || [];

  if (s.includes('fever') || textDesc.includes('fever')) {
    homeRemedies.push('Drink plenty of boiled and cooled water, fresh coconut water, or thin mung dal soup to maintain hydration.');
    homeRemedies.push('Sponge the forehead, neck, and arms with lukewarm tap water (not cold water) to gently disperse excess heat.');
    homeRemedies.push('Rest in a well-ventilated, shaded room wearing lightweight, breathable cotton clothing.');
  }

  if (s.includes('cough') || s.includes('breathing-difficulty') || textDesc.includes('cough') || textDesc.includes('throat') || textDesc.includes('cold')) {
    homeRemedies.push('Gargle with warm salt water (1/2 teaspoon salt in a glass of warm water) 3 to 4 times daily to soothe throat irritation.');
    homeRemedies.push('Drink warm herbal decoction prepared with fresh tulsi leaves, crushed ginger, and a teaspoon of honey.');
    homeRemedies.push('Inhale gentle warm water steam for 5 minutes twice daily to loosen congested nasal passages.');
  }

  if (s.includes('vomiting') || s.includes('stomach-pain') || textDesc.includes('vomit') || textDesc.includes('stomach') || textDesc.includes('loose') || textDesc.includes('diarrhea')) {
    homeRemedies.push('Sip Oral Rehydration Salt (ORS) solution or clean electrolyte water slowly after each episode.');
    homeRemedies.push('Consume gentle, binding foods such as fresh buttermilk with roasted cumin, soft khichdi, or ripe bananas.');
    homeRemedies.push('Avoid fried, oily, heavily spiced foods, raw salads, and dairy milk until digestion recovers.');
  }

  if (s.includes('headache') || textDesc.includes('headache')) {
    homeRemedies.push('Rest in a quiet, darkened room away from glaring sun, loud noise, and mobile screens.');
    homeRemedies.push('Apply a cool, moist compress across the forehead and gently massage temples and neck.');
    homeRemedies.push('Drink 2 glasses of clean water immediately, as mild dehydration is a very common headache trigger.');
  }

  if (homeRemedies.length === 0) {
    homeRemedies.push('Drink 8 to 10 glasses of clean boiled drinking water throughout the day to aid recovery.');
    homeRemedies.push('Get 8 to 9 hours of uninterrupted restful sleep in a calm, well-ventilated environment.');
    homeRemedies.push('Consume freshly prepared, warm, light meals like vegetable dalia, porridge, and clear broths.');
  }

  const isModerate =
    input.severity === 'moderate' ||
    input.severity === 'severe' ||
    input.symptoms.length >= 2 ||
    input.duration === 'few-days' ||
    input.duration === 'week-plus';

  if (isModerate) {
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'MODERATE',
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
      homeRemedies,
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
    homeRemedies,
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
