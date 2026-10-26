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
  const isCritical =
    input.symptoms.some((s) => ['chest-pain', 'breathing-difficulty', 'weakness', 'snake-bite', 'bleeding', 'seizures', 'child-lethargy', 'pregnancy-pain'].includes(s)) ||
    input.severity === 'severe' ||
    (input.associatedSigns && input.associatedSigns.some(sign => sign !== 'none'));

  const isModerate =
    !isCritical &&
    (input.severity === 'moderate' ||
      input.symptoms.length >= 2 ||
      input.duration === 'few-days');

  if (isCritical) {
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'CRITICAL',
      headline: 'GET MEDICAL HELP NOW',
      subheadline: '🚨 POSSIBLE EMERGENCY DETECTED',
      summary: 'The symptoms described include critical warning signs that require immediate in-person medical evaluation and emergency care.',
      warningSigns: [
        'Acute distress or difficulty maintaining normal airway and breathing',
        'Potential cardiac, neurological, toxic, or hemorrhagic signs identified',
        'High risk of rapid clinical deterioration without intervention'
      ],
      immediateSteps: [
        'Call 108 Emergency Ambulance or arrange immediate private transport.',
        'Keep the person calm, in a safe resting posture, and continuously observed.',
        'Do NOT give heavy oral fluids, solid foods, or unprescribed home mixtures.'
      ],
      whatToDo: [
        'Keep the patient sitting upright or in recovery position depending on condition',
        'Ensure open ventilation and loosen tight clothing around the neck and chest',
        'Gather any current medical reports, ANC cards, or medicine wrappers to carry along',
        'Call the nearest Primary Health Centre or District Emergency Room'
      ],
      whatToAvoid: [
        'DO NOT wait for hours hoping symptoms will subside automatically',
        'DO NOT allow the person to walk, exert themselves, or drive',
        'DO NOT administer unverified home remedies, cuts, or traditional pastes',
        'DO NOT leave the person alone or unsupervised'
      ],
      possibleConditions: [
        {
          name: 'Acute Cardiorespiratory or Neurological Event',
          likelihood: 'Requires Investigation',
          description: 'Symptoms overlap with conditions requiring hospital monitoring, oxygen, or emergency medication.',
          relevance: 'Based on high severity and acute onset'
        },
        {
          name: 'Severe Acute Infection or Complication',
          likelihood: 'Possible',
          description: 'Systemic inflammatory response or acute localized severe distress requiring intravenous medical care.',
          relevance: 'Reported severity and associated warning signs'
        }
      ],
      timeframe: 'IMMEDIATELY (Within 30–60 minutes)',
      suggestedCareType: 'emergency_hospital',
      disclaimer: 'This is an AI-assisted triage assessment for educational and emergency guidance. It is not a definitive diagnosis and cannot replace hospital emergency personnel.'
    };
  }

  if (isModerate) {
    return {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      riskLevel: 'MODERATE',
      headline: 'MEDICAL ADVICE RECOMMENDED',
      subheadline: '🟡 CLINICAL EVALUATION ADVISED WITHIN 24 HOURS',
      summary: 'Your symptoms suggest an illness that requires examination by a doctor, Community Health Officer (CHO), or PHC medical officer.',
      warningSigns: [
        'Symptoms persisting beyond 48 hours without relief',
        'Moderate discomfort impacting daily activity or normal food intake',
        'Possibility of secondary infection if left untreated'
      ],
      immediateSteps: [
        'Schedule a visit to your nearest Primary Health Centre (PHC) or clinic today.',
        'Maintain hydration with safe fluids (boiled water, ORS, clean broth).',
        'Rest adequately and monitor body temperature.'
      ],
      whatToDo: [
        'Visit a local clinic or consult an ASHA/ANM health worker for assessment',
        'Drink plenty of clean fluids and eat light, easily digestible food',
        'Monitor temperature, pulse, and energy levels every 4 hours',
        'Take only doctor-prescribed or standard fever-support medications'
      ],
      whatToAvoid: [
        'DO NOT take random leftover antibiotics without a doctor’s prescription',
        'DO NOT ignore sudden spikes in fever, severe neck stiffness, or breathing change',
        'DO NOT undertake strenuous physical labor in direct sun or dust'
      ],
      possibleConditions: [
        {
          name: 'Viral or Bacterial Upper Respiratory / Gastrointestinal Illness',
          likelihood: 'Possible',
          description: 'Common seasonal or communicable illness that responds well to supportive primary medical care.',
          relevance: 'Matches reported symptoms and moderate duration'
        },
        {
          name: 'Localized Inflammatory Response',
          likelihood: 'Less Likely',
          description: 'Mild localized inflammation or fatigue requiring clinical confirmation and simple symptom management.',
          relevance: 'Suggested by reported discomfort'
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
    headline: 'LOW URGENCY — SUPPORTIVE CARE',
    subheadline: '🟢 NO IMMEDIATE DANGER SIGNS DETECTED',
    summary: 'Based on the selected symptoms and answers, there are no immediate critical red flags. You can monitor progress with safe supportive care.',
    warningSigns: [
      'If fever rises sharply above 102°F or persists for more than 3 days',
      'If breathing becomes heavy, fast, or accompanied by chest tightness',
      'If you develop severe dizziness, inability to keep fluids down, or confusion'
    ],
    immediateSteps: [
      'Get ample rest in a quiet, comfortable environment.',
      'Stay well-hydrated with safe drinking water, lemonade, or oral rehydration fluids.',
      'Check our Safe Temporary Care section for safe supportive measures.'
    ],
    whatToDo: [
      'Rest and sleep to assist the body’s natural immune recovery',
      'Drink 8–10 glasses of clean boiled/filtered water throughout the day',
      'Consume light, nutritious foods like dalia, khichdi, and fresh fruits',
      'Wash hands frequently with soap to avoid spreading seasonal bugs'
    ],
    whatToAvoid: [
      'DO NOT purchase over-the-counter strong medicines without clinical consultation',
      'DO NOT consume unpasteurized milk, stale food, or untreated water',
      'DO NOT overexert yourself physically until feeling completely restored'
    ],
    possibleConditions: [
      {
        name: 'Mild Seasonal Discomfort or Muscle Fatigue',
        likelihood: 'Possible',
        description: 'Benign self-limiting condition that typically resolves with hydration, nutrition, and rest.',
        relevance: 'Consistent with mild symptoms and absence of danger signs'
      }
    ],
    timeframe: 'Monitor at home (Consult doctor if no improvement in 48h)',
    suggestedCareType: 'home_support',
    disclaimer: 'This assessment is for supportive education only. If your symptoms worsen or you feel uncertain, always visit a healthcare facility.'
  };
}
