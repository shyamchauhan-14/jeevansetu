import { SymptomInput, AssessmentResult, EmergencyProtocol } from '../types/health';
import { generateMockAssessment } from '../data/symptoms';
import { EMERGENCY_PROTOCOLS } from '../data/emergencies';
import { StorageService } from './storageService';

const NVIDIA_API_KEY =
  (import.meta.env && import.meta.env.VITE_NVIDIA_API_KEY) ||
  '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';

const NVIDIA_MODEL =
  (import.meta.env && import.meta.env.VITE_NVIDIA_MODEL) ||
  'meta/llama-3.2-11b-vision-instruct';

const NVIDIA_ENDPOINT =
  (import.meta.env && import.meta.env.VITE_NVIDIA_ENDPOINT) ||
  'https://integrate.api.nvidia.com/v1/chat/completions';

// Non-health domain keywords for local filtering
const NON_HEALTH_KEYWORDS = [
  'cricket', 'football', 'match', 'score', 'movie', 'cinema', 'song', 'music', 'dance',
  'python', 'javascript', 'code', 'programming', 'software', 'bug', 'github', 'algorithm',
  'capital of', 'president', 'prime minister', 'election', 'politics', 'bitcoin', 'crypto',
  'stock market', 'car', 'bike', 'weather tomorrow', 'cake recipe', 'joke', 'story',
  'who is', 'what is the capital', 'recipe', 'game', 'play'
];

// Health/Disease keywords for positive confirmation
const HEALTH_DISEASE_KEYWORDS = [
  'fever', 'cold', 'cough', 'headache', 'pain', 'vomit', 'nausea', 'diarrhea', 'loose motion',
  'stomach', 'chest', 'throat', 'breath', 'dizzy', 'weak', 'rash', 'allergy', 'infection',
  'dengue', 'malaria', 'typhoid', 'cholera', 'jaundice', 'pneumonia', 'bronchitis', 'asthma',
  'migraine', 'acidity', 'gas', 'constipation', 'ulcer', 'hypertension', 'bp', 'sugar',
  'diabetes', 'stone', 'kidney', 'liver', 'heart', 'stroke', 'paralysis', 'fracture', 'sprain',
  'wound', 'cut', 'bleed', 'burn', 'snake', 'bite', 'sting', 'poison', 'seizure', 'convulsion',
  'pregnancy', 'maternal', 'baby', 'child', 'infant', 'swelling', 'chills', 'flu', 'sore',
  // Hindi keywords
  'बुखार', 'खांसी', 'जुकाम', 'सिरदर्द', 'दर्द', 'उल्टी', 'दस्त', 'पेट', 'छाती', 'गला', 'सांस',
  'चक्कर', 'कमजोरी', 'एलर्जी', 'संक्रमण', 'डेंगू', 'मलेरिया', 'टाइफाइड', 'पीलिया', 'दमा',
  'एसिडिटी', 'कब्ज', 'पथरी', 'घाव', 'चोट', 'जलन', 'सांप', 'डंक', 'जहर', 'दौरा', 'सूजन',
  // Gujarati keywords
  'તાવ', 'ખાંસી', 'શરદી', 'માથાનો દુખાવો', 'દુખાવો', 'ઉલટી', 'ઝાડા', 'પેટ', 'છાતી', 'ગળું',
  'શ્વાસ', 'ચક્કર', 'નબળાઈ', 'ચેપ', 'ડેન્ગ્યુ', 'મેલેરિયા', 'કમળો', 'દમ', 'એસિડિટી',
  'પથરી', 'ઘા', 'ઈજા', 'બળતરા', 'સાપ', 'ઝેર', 'ખેંચ', 'સોજો'
];

export class AIService {
  /**
   * Evaluates symptoms using the NVIDIA NIM AI Agent.
   * - Validates disease relevance (rejects non-health inputs).
   * - Provides genuine home remedies and real clinical cures.
   * - Respects target language (Hindi, Gujarati, English).
   */
  public static async analyzeSymptoms(
    input: SymptomInput,
    fallbackDelayMs = 1500,
    lang?: string
  ): Promise<AssessmentResult> {
    const targetLang = lang || StorageService.getLanguage() || 'en';

    // 1. Local Guardrail Pre-Check
    const localRelevance = this.checkHealthRelevance(input);
    if (!localRelevance.isHealthRelated) {
      return this.createInvalidInputResult(targetLang, input.description || '');
    }

    // 2. Call NVIDIA Live Agent
    if (NVIDIA_API_KEY && typeof fetch !== 'undefined') {
      try {
        const liveResult = await this.callNvidiaAgent(input, targetLang);
        if (liveResult) {
          return liveResult;
        }
      } catch (err) {
        console.warn('NVIDIA AI API call failed or timed out, using local clinical fallback:', err);
      }
    }

    // 3. Fallback local clinical inference with localized strings
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = generateMockAssessment(input, targetLang);
        resolve(result);
      }, fallbackDelayMs);
    });
  }

  /**
   * Determines if input is genuinely related to human health, disease, or medical symptoms
   */
  public static checkHealthRelevance(input: SymptomInput): { isHealthRelated: boolean; reason?: string } {
    const desc = (input.description || '').trim().toLowerCase();
    const hasSymptomsList = input.symptoms && input.symptoms.length > 0 && !input.symptoms.includes('none');

    // If no description and no symptoms selected
    if (!desc && !hasSymptomsList) {
      return { isHealthRelated: false, reason: 'No symptoms or health concern provided.' };
    }

    // If description matches explicit non-health topics
    if (desc) {
      const hasNonHealth = NON_HEALTH_KEYWORDS.some((word) => desc.includes(word));
      const hasHealthKeyword = HEALTH_DISEASE_KEYWORDS.some((word) => desc.includes(word));

      if (hasNonHealth && !hasHealthKeyword) {
        return {
          isHealthRelated: false,
          reason: 'Input is unrelated to health, symptoms, or disease.'
        };
      }

      // Check random gibberish or very short non-word
      if (desc.length > 4 && !desc.includes(' ') && !hasHealthKeyword) {
        // e.g. "asdfghjkl"
        const vowels = (desc.match(/[aeiou]/gi) || []).length;
        if (vowels === 0 || desc.length > 15) {
          return { isHealthRelated: false, reason: 'Input appears to be invalid or unreadable text.' };
        }
      }
    }

    return { isHealthRelated: true };
  }

  /**
   * Generates a clear, informative rejection response for non-health queries
   */
  public static createInvalidInputResult(lang: string, userInput: string): AssessmentResult {
    const isHi = lang === 'hi';
    const isGu = lang === 'gu';

    const headline = isHi
      ? 'अमान्य इनपुट: केवल बीमारी और स्वास्थ्य संबंधी प्रश्न समर्थित हैं'
      : isGu
      ? 'અમાન્ય ઇનપુટ: માત્ર બીમારી અને સ્વાસ્થ્ય સંબંધિત પ્રશ્નો સ્વીકાર્ય છે'
      : 'INVALID INPUT: ONLY HEALTH & DISEASE TOPICS SUPPORTED';

    const subheadline = isHi
      ? 'ℹ️ जीवनसेतु केवल स्वास्थ्य और चिकित्सा मार्गदर्शन के लिए है'
      : isGu
      ? 'ℹ️ જીવનસેતુ માત્ર સ્વાસ્થ્ય અને તબીબી માર્ગદર્શન માટે છે'
      : 'ℹ️ JEEVANSETU IS DEDICATED TO HEALTHCARE GUIDANCE';

    const summary = isHi
      ? `आपने जो इनपुट दिया ("${userInput.slice(0, 60)}..."), वह किसी बीमारी, शारीरिक दर्द या स्वास्थ्य समस्या से संबंधित नहीं है। जीवनसेतु एआई केवल बीमारियों की पहचान, असली घरेलू उपचार, दवाइयों और आपातकालीन मार्गदर्शन के लिए बनाया गया है। कृपया अपनी बीमारी या लक्षणों का विवरण दें।`
      : isGu
      ? `તમે દાખલ કરેલ વિગત ("${userInput.slice(0, 60)}...") કોઈ રોગ કે શારીરિક સ્વાસ્થ્ય સમસ્યા સાથે સુસંગત નથી. જીવનસેતુ AI માત્ર રોગ નિવારણ, સાચા ઘરગથ્થુ ઉપચાર, દવાની માહિતી અને કટોકટી સહાય માટે સમર્પિત છે. કૃપા કરીને તમારી બીમારી કે લક્ષણો જણાવો.`
      : `The input provided ("${userInput.slice(0, 60)}...") is not related to a human illness, physical symptom, or health concern. JeevanSetu is strictly a clinical triage assistant that provides real home remedies, medical cures, and healthcare navigation. Please describe your symptoms or medical concern.`;

    const whatToDo = isHi
      ? [
          'अपनी बीमारी या परेशानी का नाम बताएं (जैसे: बुखार, जुकाम, खांसी, सिरदर्द, पेट में मरोड़)',
          'लक्षण कब से शुरू हुए और कितने गंभीर हैं, यह स्पष्ट रूप से लिखें या बोलें',
          'यदि कोई विशेष समस्या हो (जैसे उल्टी, दस्त, एसिडिटी, चोट), तो उसका उल्लेख करें'
        ]
      : isGu
      ? [
          'તમારી બીમારી કે તકલીફનું નામ જણાવો (જેમ કે: તાવ, શરદી, ખાંસી, માથાનો દુખાવો, ઝાડા)',
          'લક્ષણો ક્યારથી શરૂ થયા છે અને દુખાવો કેવો છે તે સ્પષ્ટ રીતે જણાવો',
          'જો ચોક્કસ સમસ્યા હોય (જેમ કે ઉલટી, પેટમાં ગેસ, એસિડિટી, ઈજા), તો તેનો ઉલ્લેખ કરો'
        ]
      : [
          'Describe specific physical symptoms (e.g. fever, dry cough, abdominal pain, migraine, acid reflux)',
          'Mention how long you have felt uncomfortable and the pain severity',
          'Tap any of the common visual condition chips to start your symptom check'
        ];

    const whatToAvoid = isHi
      ? [
          'खेलकूद, राजनीति, मनोरंजन या कोडिंग जैसे गैर-स्वास्थ्य विषयों के प्रश्न न पूछें',
          'बिना मतलब के अक्षर या परीक्षण शब्द टाइप न करें'
        ]
      : isGu
      ? [
          'રમતગમત, રાજકારણ કે મનોરંજન જેવા બિન-આરોગ્ય વિષયોના પ્રશ્નો ન પૂછો',
          'અર્થહીન અક્ષરો કે પરીક્ષણ શબ્દો દાખલ ન કરો'
        ]
      : [
          'Do NOT ask questions about sports, movies, coding, politics, or general trivia',
          'Avoid entering random keyboard spam or non-medical queries'
        ];

    return {
      id: `invalid-${Date.now()}`,
      timestamp: new Date().toLocaleDateString(isHi ? 'hi-IN' : isGu ? 'gu-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      riskLevel: 'LOW',
      isValidHealthQuery: false,
      invalidReason: isHi
        ? 'दर्ज किया गया विषय स्वास्थ्य या बीमारी से संबंधित नहीं है।'
        : isGu
        ? 'દાખલ કરેલ વિષય આરોગ્ય કે રોગ સાથે સંબંધિત નથી.'
        : 'Entered topic is not related to healthcare, illness, or symptoms.',
      headline,
      subheadline,
      summary,
      warningSigns: [],
      immediateSteps: isHi
        ? ['कृपया वापस जाएं और अपनी बीमारी अथवा लक्षणों का विवरण दर्ज करें।']
        : isGu
        ? ['કૃપા કરીને પાછા જાઓ અને તમારી બીમારી કે લક્ષણોની વિગતો આપો.']
        : ['Please return and enter details of your health symptoms or condition.'],
      whatToDo,
      whatToAvoid,
      homeRemedies: [],
      possibleConditions: [],
      timeframe: isHi ? 'किसी भी समय नया स्वास्थ्य प्रश्न पूछें' : isGu ? 'કોઈપણ સમયે નવો પ્રશ્ન પૂછો' : 'Ask anytime',
      suggestedCareType: 'home_support',
      disclaimer: isHi
        ? 'जीवनसेतु एआई केवल स्वास्थ्य मार्गदर्शन और प्राथमिक जांच के लिए है।'
        : isGu
        ? 'જીવનસેતુ AI માત્ર સ્વાસ્થ્ય માર્ગદર્શન માટે છે.'
        : 'JeevanSetu AI is exclusively dedicated to healthcare and disease triage.'
    };
  }

  /**
   * Translates or adapts an existing assessment into the new target language.
   */
  public static async translateAssessment(
    result: AssessmentResult,
    targetLang: string
  ): Promise<AssessmentResult> {
    if (!result.isValidHealthQuery && result.isValidHealthQuery !== undefined) {
      return this.createInvalidInputResult(targetLang, result.summary);
    }

    if (NVIDIA_API_KEY && typeof fetch !== 'undefined') {
      try {
        const translated = await this.callNvidiaTranslation(result, targetLang);
        if (translated) {
          return translated;
        }
      } catch (err) {
        console.warn('AI live translation failed, using localized rule adaptation:', err);
      }
    }

    const adapted = generateMockAssessment(
      {
        symptoms: result.riskLevel === 'CRITICAL' ? ['chest-pain', 'breathing-difficulty'] : ['fever'],
        duration: 'today',
        severity: result.riskLevel === 'CRITICAL' ? 'severe' : result.riskLevel === 'MODERATE' ? 'moderate' : 'mild',
        description: result.summary
      },
      targetLang
    );

    return {
      ...adapted,
      id: result.id,
      riskLevel: result.riskLevel,
      suggestedCareType: result.suggestedCareType,
      identifiedDisease: result.identifiedDisease,
      medicalCure: result.medicalCure,
      dietaryCure: result.dietaryCure,
      isValidHealthQuery: true
    };
  }

  /**
   * Invokes NVIDIA NIM Chat Completions API with a clinical triage prompt in the requested language
   */
  private static async callNvidiaAgent(input: SymptomInput, lang: string): Promise<AssessmentResult | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const langInstruction =
      lang === 'hi'
        ? `MANDATORY LANGUAGE REQUIREMENT:
You MUST respond ENTIRELY in fluent, caring HINDI (हिन्दी, Devanagari script).
Every single string value in the JSON (headline, subheadline, summary, warningSigns, immediateSteps, whatToDo, whatToAvoid, homeRemedies, identifiedDisease, medicalCure, dietaryCure, possibleConditions, disclaimer) MUST be in Hindi.
DO NOT use English sentences for Hindi mode. The JSON keys MUST remain in English.`
        : lang === 'gu'
        ? `MANDATORY LANGUAGE REQUIREMENT:
You MUST respond ENTIRELY in fluent, caring GUJARATI (ગુજરાતી, Gujarati script).
Every single string value in the JSON MUST be in Gujarati.
DO NOT use English sentences for Gujarati mode. The JSON keys MUST remain in English.`
        : `MANDATORY LANGUAGE REQUIREMENT: All output strings must be written in clear, simple English.`;

    const systemPrompt = `You are JeevanSetu's Clinical Triage, Disease Identification & Health Guidance AI Agent, specialized in evidence-based community healthcare.

${langInstruction}

HEALTHCARE & DISEASE RELEVANCE GUARDRAIL:
1. FIRST, determine if the patient's input (symptoms, description) is genuinely related to human health, illness, medical symptoms, physical distress, disease, injury, or medicine.
2. IF THE INPUT IS NOT HEALTH-RELATED (e.g. sports, movies, coding, politics, weather, recipes, jokes, trivia, gaming, or meaningless text):
   You MUST return:
   {
     "isValidHealthQuery": false,
     "invalidReason": "Brief explanation that JeevanSetu only supports healthcare and disease queries",
     "riskLevel": "LOW",
     "headline": "Invalid Input: Only Health & Disease Topics Supported",
     "subheadline": "Please describe your medical symptoms or condition",
     "summary": "This query is not related to health or disease. Please enter your physical symptoms or medical condition.",
     "warningSigns": [],
     "immediateSteps": ["Please enter symptoms or diseases like fever, cough, stomach ache, acidity, headache, etc."],
     "whatToDo": ["Describe your illness or symptoms"],
     "whatToAvoid": ["Avoid entering non-health topics"],
     "homeRemedies": [],
     "possibleConditions": [],
     "timeframe": "Anytime",
     "suggestedCareType": "home_support",
     "disclaimer": "JeevanSetu is exclusively an AI healthcare assistant."
   }

3. IF THE INPUT IS HEALTH-RELATED:
   Set "isValidHealthQuery": true
   Set "identifiedDisease": Specific name of the suspected illness or condition (e.g. Acute Viral Pharyngitis, Acid Peptic Disease/GERD, Acute Gastroenteritis, Tension Migraine, Dengue Viral Fever, Bronchitis).

CRITICAL TRIAGE RULE:
- Set riskLevel to "CRITICAL" ONLY when a truly life-threatening emergency disease is present (e.g. Acute heart attack, stroke, snakebite envenomation, severe respiratory asphyxia, massive bleeding, acute poison ingestion, seizures).
- For non-life-threatening conditions (cold, cough, mild seasonal fever, headache, acidity, sprain, mild food poisoning), set riskLevel to "LOW" or "MODERATE".

AUTHENTIC HOME REMEDIES & REAL MEDICAL CURE:
- "homeRemedies": Provide 3 to 5 REAL, scientifically valid home remedies with EXACT preparation, ingredients, and dosages (e.g. fresh ginger and tulsi tea, lukewarm saltwater gargle, cumin buttermilk, ORS hydration, steam inhalation, lukewarm forehead sponge).
- "medicalCure": Provide 3 to 4 REAL medical and clinical curative treatment steps that doctors prescribe for this exact disease (e.g. clinical diagnosis tests like CBC/Widal, typical OTC or Rx medicine classes like Antacids/PPIs, Paracetamol, Antihistamines, Oral Rehydration, and when antibiotic or physician care is needed).
- "dietaryCure": Provide 3 to 4 real therapeutic dietary instructions (foods that heal this disease vs foods that aggravate it).

Output MUST be ONLY a valid JSON object matching this schema without markdown fences:
{
  "isValidHealthQuery": true | false,
  "invalidReason": "string (optional)",
  "identifiedDisease": "string",
  "riskLevel": "CRITICAL" | "MODERATE" | "LOW",
  "headline": "string",
  "subheadline": "string with emoji",
  "summary": "string (2-3 sentences explaining the disease and cause)",
  "warningSigns": ["string", "string"],
  "immediateSteps": ["string", "string"],
  "whatToDo": ["string", "string"],
  "whatToAvoid": ["string", "string"],
  "homeRemedies": ["string", "string", "string"],
  "medicalCure": ["string", "string", "string"],
  "dietaryCure": ["string", "string", "string"],
  "possibleConditions": [
    {
      "name": "string",
      "likelihood": "Likely" | "Possible" | "Requires Investigation",
      "description": "string",
      "relevance": "string"
    }
  ],
  "timeframe": "string",
  "suggestedCareType": "emergency_hospital" | "clinic_visit" | "home_support",
  "disclaimer": "string"
}`;

    const symptomsList = input.symptoms && input.symptoms.length > 0 ? input.symptoms.join(', ') : 'None selected';
    const userPrompt = `Target Language: ${lang.toUpperCase()}
Patient Input Data:
- Symptoms: ${symptomsList}
- Duration: ${input.duration || 'Not specified'}
- Severity: ${input.severity || 'mild'}
- Patient Description: "${input.description || ''}"
- Associated Signs: ${input.associatedSigns ? input.associatedSigns.join(', ') : 'None'}

Evaluate disease relevance. If health-related, identify the disease and provide real home remedies, medical cures, and dietary treatment strictly in ${lang === 'hi' ? 'HINDI (हिन्दी)' : lang === 'gu' ? 'GUJARATI (ગુજરાતી)' : 'ENGLISH'} in the exact JSON format.`;

    try {
      const response = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.15,
          max_tokens: 1400
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`NVIDIA API HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // If AI flagged it as non-health query
      if (parsed.isValidHealthQuery === false) {
        return this.createInvalidInputResult(lang, input.description || 'Non-health input');
      }

      // Normalize fields
      const riskLevel =
        parsed.riskLevel === 'CRITICAL' ? 'CRITICAL' : parsed.riskLevel === 'MODERATE' ? 'MODERATE' : 'LOW';

      const result: AssessmentResult = {
        id: `triage-ai-${Date.now()}`,
        timestamp: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        riskLevel,
        isValidHealthQuery: true,
        identifiedDisease: parsed.identifiedDisease || undefined,
        headline: parsed.headline || (riskLevel === 'CRITICAL' ? 'CRITICAL MEDICAL ATTENTION REQUIRED' : 'CLINICAL GUIDANCE'),
        subheadline: parsed.subheadline || (riskLevel === 'CRITICAL' ? '🚨 POSSIBLE EMERGENCY DETECTED' : 'SAFE SUPPORTIVE ADVICE'),
        summary: parsed.summary || 'Assessment evaluated based on your reported symptoms.',
        warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : ['Difficulty breathing', 'High persistent fever'],
        immediateSteps: Array.isArray(parsed.immediateSteps) ? parsed.immediateSteps : ['Rest in a well-ventilated area'],
        whatToDo: Array.isArray(parsed.whatToDo) ? parsed.whatToDo : ['Hydrate with clean boiled water'],
        whatToAvoid: Array.isArray(parsed.whatToAvoid) ? parsed.whatToAvoid : ['Do not take unprescribed strong medications'],
        homeRemedies: Array.isArray(parsed.homeRemedies) ? parsed.homeRemedies : [],
        medicalCure: Array.isArray(parsed.medicalCure) ? parsed.medicalCure : undefined,
        dietaryCure: Array.isArray(parsed.dietaryCure) ? parsed.dietaryCure : undefined,
        possibleConditions:
          Array.isArray(parsed.possibleConditions) && parsed.possibleConditions.length > 0
            ? parsed.possibleConditions
            : [{ name: parsed.identifiedDisease || 'Clinical Evaluation', likelihood: 'Possible', description: 'Requires in-person review', relevance: 'Based on reported symptoms' }],
        timeframe: parsed.timeframe || (riskLevel === 'CRITICAL' ? 'IMMEDIATELY (Within 30–60 minutes)' : 'Within 24–48 Hours'),
        suggestedCareType: parsed.suggestedCareType || (riskLevel === 'CRITICAL' ? 'emergency_hospital' : 'home_support'),
        disclaimer: parsed.disclaimer || 'This assessment is for supportive guidance and does not formulate a medical diagnosis.'
      };

      return result;
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  }

  /**
   * Translates assessment JSON via NVIDIA NIM
   */
  private static async callNvidiaTranslation(
    result: AssessmentResult,
    targetLang: string
  ): Promise<AssessmentResult | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const langName = targetLang === 'hi' ? 'Hindi (हिन्दी)' : targetLang === 'gu' ? 'Gujarati (ગુજરાતી)' : 'English';

    const systemPrompt = `You are a medical translator for JeevanSetu Healthcare. Translate the entire provided JSON object into natural, culturally respectful, and clinically accurate ${langName}.
Keep all JSON keys in English. Only translate the text values (headline, subheadline, summary, warningSigns, immediateSteps, whatToDo, whatToAvoid, homeRemedies, identifiedDisease, medicalCure, dietaryCure, possibleConditions name and description and relevance, timeframe, disclaimer).
Output strictly valid JSON with no markdown backticks.`;

    try {
      const response = await fetch(NVIDIA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(result) }
          ],
          temperature: 0.1,
          max_tokens: 1400
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!response.ok) return null;

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        ...parsed,
        id: result.id,
        riskLevel: result.riskLevel,
        suggestedCareType: result.suggestedCareType
      };
    } catch {
      clearTimeout(timeout);
      return null;
    }
  }

  /**
   * Fast emergency protocol lookup
   */
  public static getEmergencyProtocol(slugOrId: string): EmergencyProtocol | undefined {
    return EMERGENCY_PROTOCOLS.find(
      (p) => p.slug.toLowerCase() === slugOrId.toLowerCase() || p.id.toLowerCase() === slugOrId.toLowerCase()
    );
  }

  /**
   * All protocols list
   */
  public static getAllEmergencyProtocols(): EmergencyProtocol[] {
    return EMERGENCY_PROTOCOLS;
  }
}
