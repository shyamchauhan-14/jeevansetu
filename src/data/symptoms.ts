import { Symptom, SymptomQuestion, AssessmentResult, SymptomInput } from '../types/health';

export const CLINICAL_RULES_METADATA = {
  version: '2.0.0-clinical-core',
  reviewer: 'Rural Emergency Healthcare Advisory Board (ICMR & WHO Protocols)',
  reviewDate: '2026-10-15',
  guidelineReference: 'WHO Emergency Triage Assessment and Treatment (ETAT) & ICMR Standard Treatment Guidelines'
};

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

export const RED_FLAG_SYMPTOM_IDS = new Set([
  'chest-pain',
  'breathing-difficulty',
  'weakness',
  'snake-bite',
  'bleeding',
  'pregnancy-pain',
  'child-lethargy',
  'seizures'
]);

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

/**
 * Deterministic clinical triage evaluator.
 * Rule: Emergency red flags ALWAYS override low or moderate risk scores.
 * Generative AI models are strictly prohibited from lowering red-flag emergency urgencies.
 */
export function evaluateDeterministicTriage(input: SymptomInput): AssessmentResult {
  const hasDirectRedFlagSymptom = input.symptoms.some((s) => RED_FLAG_SYMPTOM_IDS.has(s));
  const hasTriggeringDangerSign = Boolean(
    input.associatedSigns && input.associatedSigns.some((sign) => sign !== 'none')
  );
  const isSevereDiscomfort = input.severity === 'severe';

  const isCritical = hasDirectRedFlagSymptom || hasTriggeringDangerSign || isSevereDiscomfort;

  // Check incomplete answers
  const hasMissingDuration = !input.duration;
  const hasMissingSeverity = !input.severity;
  const hasMissingAnswers = hasMissingDuration || hasMissingSeverity;

  const isModerate =
    !isCritical &&
    (input.severity === 'moderate' ||
      input.symptoms.length >= 2 ||
      input.duration === 'few-days' ||
      hasMissingAnswers); // Incomplete answers conservatively elevate to prompt evaluation

  const timestamp = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const ruleDisclaimer =
    'Clinical Safety Disclaimer: JeevanSetu provides supportive rural triage guidance (Rule version ' +
    CLINICAL_RULES_METADATA.version +
    '). It does not formulate medical diagnoses, alter dosages, or prescribe medications. In any medical emergency, immediately dial 108 or proceed to the nearest hospital.';

  if (isCritical) {
    return {
      id: `triage-${Date.now()}`,
      timestamp,
      riskLevel: 'CRITICAL',
      headline: 'Emergency Help Now',
      subheadline: '🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED',
      summary:
        'Reported symptoms include critical red-flag warning signs that require immediate in-person hospital evaluation. High risk of clinical deterioration without urgent care.',
      warningSigns: [
        'Acute distress or difficulty maintaining normal airway and breathing',
        'Potential cardiac, neurological, toxic, or uncontrolled hemorrhagic signs',
        'High risk of rapid complication without emergency hospital intervention'
      ],
      immediateSteps: [
        'Call 108 Emergency Ambulance immediately or arrange urgent direct transport.',
        'Keep the person calm, in a safe resting posture, and continuously observed.',
        'Do NOT give solid foods, unverified home concoctions, or sedatives.'
      ],
      whatToDo: [
        'Keep the patient sitting upright or in recovery position depending on condition',
        'Ensure open ventilation and loosen tight clothing around the neck and chest',
        'Gather any current medical reports, ANC cards, or medicine wrappers to carry along',
        'Proceed to nearest Sub-District Hospital, CHC, or Trauma Emergency Unit'
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
          likelihood: 'Requires Urgent Investigation',
          description: 'Symptoms overlap with conditions requiring hospital monitoring, oxygen, or emergency care.',
          relevance: 'Triggered by deterministic red-flag priority rule'
        }
      ],
      timeframe: 'IMMEDIATELY (Within 30–60 minutes)',
      suggestedCareType: 'emergency_hospital',
      disclaimer: ruleDisclaimer
    };
  }

  if (isModerate) {
    return {
      id: `triage-${Date.now()}`,
      timestamp,
      riskLevel: 'MODERATE',
      headline: 'Seek Medical Advice Promptly',
      subheadline: '🟡 CLINICAL EVALUATION ADVISED WITHIN 24 HOURS',
      summary:
        'Your symptoms suggest an illness that warrants examination by a qualified doctor, Community Health Officer (CHO), or PHC medical officer.',
      warningSigns: [
        'Symptoms persisting beyond 48 hours without relief',
        'Moderate discomfort impacting normal food intake or daily activity',
        'Possibility of secondary infection if left unmonitored'
      ],
      immediateSteps: [
        'Visit your nearest Primary Health Centre (PHC) or Community Health Centre (CHC) today.',
        'Maintain oral hydration with clean boiled fluids or ORS.',
        'Rest adequately and monitor body temperature every 4 hours.'
      ],
      whatToDo: [
        'Visit a local clinic or consult an ASHA/ANM health worker for assessment',
        'Drink plenty of clean boiled water or light soup',
        'Keep a record of temperature readings and symptom timing'
      ],
      whatToAvoid: [
        'DO NOT take random leftover antibiotics without a doctor’s prescription',
        'DO NOT ignore sudden spikes in fever, severe neck stiffness, or breathing change',
        'DO NOT undertake strenuous physical labor in direct sun or dust'
      ],
      possibleConditions: [
        {
          name: 'Developing Seasonal Viral or Bacterial Illness',
          likelihood: 'Possible',
          description: 'Common regional infection requiring professional in-person medical evaluation.',
          relevance: 'Based on reported duration and symptom profile'
        }
      ],
      timeframe: 'Within 12 to 24 Hours',
      suggestedCareType: 'clinic_visit',
      disclaimer: ruleDisclaimer
    };
  }

  // LOW RISK / ROUTINE SELF-CARE
  return {
    id: `triage-${Date.now()}`,
    timestamp,
    riskLevel: 'LOW',
    headline: 'Self-Care Information May Be Appropriate',
    subheadline: '🟢 ROUTINE MILD DISCOMFORT — MONITOR AT HOME',
    summary:
      'Reported symptoms appear mild and non-critical. Supportive home care, hydration, and rest are recommended while closely monitoring for any changes.',
    warningSigns: [
      'Sudden increase in body temperature above 101°F',
      'Emergence of breathing difficulty or severe headache',
      'Inability to retain liquids or fluids'
    ],
    immediateSteps: [
      'Rest in a cool, well-ventilated room.',
      'Sip clean boiled water, ORS, or nourishing home soups.',
      'Seek clinical review at your PHC if symptoms persist past 3 days.'
    ],
    whatToDo: [
      'Continue drinking safe clean fluids throughout the day',
      'Rest adequately and eat light, easily digestible home foods',
      'Consult your village ASHA worker if you have questions'
    ],
    whatToAvoid: [
      'DO NOT purchase unprescribed strong painkillers or antibiotics',
      'DO NOT exert yourself with strenuous agricultural work',
      'DO NOT ignore any emerging red flags such as chest pain or breathing difficulty'
    ],
    possibleConditions: [
      {
        name: 'Mild Seasonal Discomfort',
        likelihood: 'Probable',
        description: 'Mild viral irritation or fatigue managed with hydration and rest.',
        relevance: 'Mild discomfort without danger signs'
      }
    ],
    timeframe: 'Self-monitoring over next 48–72 hours',
    suggestedCareType: 'home_support',
    disclaimer: ruleDisclaimer
  };
}

export function generateMockAssessment(input: SymptomInput): AssessmentResult {
  return evaluateDeterministicTriage(input);
}
