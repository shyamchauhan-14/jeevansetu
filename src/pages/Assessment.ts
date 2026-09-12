import { AssessmentResult } from '../types/health';
import { renderStatusCard } from '../components/StatusCard';
import { renderDoDontCard } from '../components/DoDontCard';
import { I18nService } from '../services/i18nService';
import { StorageService } from '../services/storageService';

export function renderAssessmentPage(result: AssessmentResult): string {
  const t = (key: string, def: string = '') => I18nService.t(key, def);
  const currentLang = StorageService.getLanguage() || 'en';
  const isHi = currentLang === 'hi';
  const isGu = currentLang === 'gu';

  // ════════════════════════════════════════════════════════════
  // 1. NON-HEALTH / INVALID INPUT VIEW
  // ════════════════════════════════════════════════════════════
  if (result.isValidHealthQuery === false) {
    const title = isHi
      ? 'अमान्य इनपुट: केवल बीमारी और स्वास्थ्य संबंधी प्रश्न समर्थित हैं'
      : isGu
      ? 'અમાન્ય ઇનપુટ: માત્ર બીમારી અને સ્વાસ્થ્ય સંબંધિત પ્રશ્નો સ્વીકાર્ય છે'
      : 'Invalid Input: Only Health & Disease Topics Supported';

    const subtitle = isHi
      ? 'जीवनसेतु एआई विशेष रूप से बीमारियों की जांच, असली घरेलू नुस्खों और चिकित्सा मार्गदर्शन के लिए समर्पित है।'
      : isGu
      ? 'જીવનસેતુ AI માત્ર રોગ નિવારણ, સાચા ઘરગથ્થુ ઉપચાર અને તબીબી માર્ગદર્શન માટે સમર્પિત છે.'
      : 'JeevanSetu AI is exclusively dedicated to symptom triage, authentic home remedies, and clinical guidance.';

    const examplesTitle = isHi ? 'उदाहरण के लिए ऐसे प्रश्न पूछें:' : isGu ? 'ઉદાહરણ તરીકે આવા પ્રશ્નો પૂછો:' : 'Sample Health Questions to Ask:';

    const sampleChips = isHi
      ? [
          'मुझे 2 दिन से तेज बुखार और सिरदर्द है',
          'गले में खराश और सूखी खांसी के घरेलू उपाय',
          'पेट में तेज जलन, गैस और एसिडिटी का इलाज',
          'उल्टी और दस्त रोकने के सुरक्षित उपाय',
          'माइग्रेन के सिरदर्द से तुरंत राहत'
        ]
      : isGu
      ? [
          'મને ૨ દિવસથી તીવ્ર તાવ અને માથાનો દુખાવો છે',
          'ગળાની બળતરા અને સૂકી ખાંસી માટે ઘરગથ્થુ ઉપચાર',
          'પેટમાં બળતરા, ગેસ અને એસિડિટીની સારવાર',
          'ઝાડા અને ઉલટી અટકાવવા માટેના સલામત ઉપાયો',
          'માઇગ્રેનના માથાના દુખાવામાં તાત્કાલિક રાહત'
        ]
      : [
          'Severe fever with chills for 2 days',
          'Real home remedies for dry cough & throat pain',
          'Medical cure and diet for acid reflux & GERD',
          'Safe hydration protocol for diarrhea & vomiting',
          'Immediate relief for migraine headache'
        ];

    return `
      <div class="page-content" style="background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%); min-height: 100vh;">
        <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 820px;">
          
          <!-- Language Toggle Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: var(--space-lg);">
            <div class="badge badge--black" style="padding: 4px 12px; font-weight: 700;">
              🛡️ HEALTHCARE FOCUS GUARDRAIL
            </div>
            <div style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; padding: 4px 10px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200);">
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-muted);">🌐 AI Language:</span>
              <button type="button" class="chip ${currentLang === 'en' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('en')">English</button>
              <button type="button" class="chip ${currentLang === 'hi' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('hi')">हिन्दी</button>
              <button type="button" class="chip ${currentLang === 'gu' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('gu')">ગુજરાતી</button>
            </div>
          </div>

          <!-- Invalid Notice Card -->
          <div class="card card--paper" style="border-radius: var(--radius-2xl); padding: var(--space-2xl); border-top: 5px solid #e11d48; box-shadow: var(--shadow-md); text-align: center;">
            <div style="width: 68px; height: 68px; border-radius: 50%; background: #ffe4e6; display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 16px;">
              🚫
            </div>
            
            <h2 class="text-h3" style="color: #9f1239; margin-bottom: 10px; line-height: 1.25;">
              ${title}
            </h2>
            
            <p style="font-size: var(--text-base); color: var(--color-text-muted); line-height: var(--leading-relaxed); max-width: 640px; margin: 0 auto 20px;">
              ${result.summary}
            </p>

            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius-lg); padding: 14px 18px; max-width: 640px; margin: 0 auto 24px; text-align: left;">
              <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #be123c; margin-bottom: 4px;">
                ${isHi ? 'चिकित्सा सुरक्षा नीति:' : isGu ? 'તબીબી સુરક્ષા નીતિ:' : 'Clinical Safety Policy:'}
              </div>
              <div style="font-size: var(--text-sm); color: #881337;">
                ${subtitle}
              </div>
            </div>

            <!-- Example Health Topics -->
            <div style="max-width: 640px; margin: 0 auto 28px; text-align: left;">
              <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 10px;">
                ${examplesTitle}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${sampleChips
                  .map(
                    (s) => `
                  <button 
                    type="button" 
                    class="chip" 
                    style="background: #ffffff; border: 1px solid var(--color-gray-300); font-size: 0.8rem; padding: 6px 12px; cursor: pointer; text-align: left;"
                    onclick="window.quickAnalyzeSymptom('${s.replace(/'/g, "\\'")}')"
                  >
                    🩺 ${s}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
              <a href="#/symptoms" class="btn btn--primary btn--lg">
                🩺 ${isHi ? 'बीमारी या लक्षण बताएं' : isGu ? 'બીમારી કે લક્ષણો જણાવો' : 'Describe Medical Symptoms'}
              </a>
              <a href="#/voice" class="btn btn--secondary btn--lg">
                🎙️ ${isHi ? 'आवाज में बोलकर पूछें' : isGu ? 'અવાજથી પૂછો' : 'Speak to Voice Assistant'}
              </a>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  // ════════════════════════════════════════════════════════════
  // 2. VALID HEALTH & DISEASE TRIAGE ASSESSMENT VIEW
  // ════════════════════════════════════════════════════════════
  const isCritical = result.riskLevel === 'CRITICAL';
  const isModerate = result.riskLevel === 'MODERATE';
  const hasRemedies = result.homeRemedies && result.homeRemedies.length > 0;
  const hasMedicalCure = result.medicalCure && result.medicalCure.length > 0;
  const hasDietaryCure = result.dietaryCure && result.dietaryCure.length > 0;

  const possibleConditionsHtml = result.possibleConditions
    .map(
      (c) => `
    <div class="card card--paper" style="margin-bottom: var(--space-sm); border-radius: var(--radius-md); border-left: 4px solid ${isCritical ? 'var(--color-danger)' : 'var(--color-primary)'};">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; gap: 6px;">
        <h4 style="font-size: var(--text-base); font-weight: var(--font-weight-bold);">${c.name}</h4>
        <span class="badge ${c.likelihood === 'Requires Investigation' ? 'badge--red' : c.likelihood === 'Likely' ? 'badge--green' : 'badge--blue'}">${c.likelihood}</span>
      </div>
      <p style="font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal);">${c.description}</p>
      <div style="font-size: var(--text-xs); color: var(--color-text-subtle); margin-top: 6px;">Clinical Context: ${c.relevance}</div>
    </div>
  `
    )
    .join('');

  const warningSignsHtml = result.warningSigns
    .map(
      (sign) => `
    <li style="display: flex; gap: 8px; align-items: flex-start; font-size: var(--text-sm); font-weight: 500; margin-bottom: 8px;">
      <span style="color: var(--color-danger); font-size: 1.1rem; flex-shrink: 0;">⚠️</span>
      <span>${sign}</span>
    </li>
  `
    )
    .join('');

  const homeRemediesHtml = hasRemedies
    ? (result.homeRemedies as string[])
        .map(
          (remedy) => `
    <li style="display: flex; gap: 10px; align-items: flex-start; font-size: var(--text-sm); font-weight: 500; margin-bottom: 10px; line-height: var(--leading-relaxed);">
      <span style="font-size: 1.1rem; flex-shrink: 0;">🌿</span>
      <span>${remedy}</span>
    </li>
  `
        )
        .join('')
    : '';

  const medicalCureHtml = hasMedicalCure
    ? (result.medicalCure as string[])
        .map(
          (item) => `
    <li style="display: flex; gap: 10px; align-items: flex-start; font-size: var(--text-sm); font-weight: 500; margin-bottom: 10px; line-height: var(--leading-relaxed);">
      <span style="font-size: 1.1rem; flex-shrink: 0;">💊</span>
      <span>${item}</span>
    </li>
  `
        )
        .join('')
    : '';

  const dietaryCureHtml = hasDietaryCure
    ? (result.dietaryCure as string[])
        .map(
          (item) => `
    <li style="display: flex; gap: 10px; align-items: flex-start; font-size: var(--text-sm); font-weight: 500; margin-bottom: 10px; line-height: var(--leading-relaxed);">
      <span style="font-size: 1.1rem; flex-shrink: 0;">🥗</span>
      <span>${item}</span>
    </li>
  `
        )
        .join('')
    : '';

  // Page background
  const pageBg = isCritical
    ? `background: linear-gradient(160deg, #fff1f2 0%, #fee2e2 60%, #fecaca 100%); min-height: 100vh;`
    : isModerate
    ? `background: linear-gradient(160deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%); min-height: 100vh;`
    : `background: linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 60%, #d1fae5 100%); min-height: 100vh;`;

  return `
    <div class="page-content" style="${pageBg}">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 900px;">
        
        <!-- Header Controls with Live AI Language Switcher -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: var(--space-md);">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-full); padding: 5px 14px; font-size: var(--text-xs); font-weight: var(--font-weight-bold); letter-spacing: var(--tracking-wider); color: var(--color-text-muted);">
            ✨ CLINICAL DISEASE TRIAGE & HOME CURES
          </div>

          <!-- Instant Language Toggle for AI Answer -->
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.9); padding: 4px 10px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200);">
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-muted);">🌐 AI Language:</span>
            <button type="button" class="chip ${currentLang === 'en' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('en')">English</button>
            <button type="button" class="chip ${currentLang === 'hi' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('hi')">हिन्दी</button>
            <button type="button" class="chip ${currentLang === 'gu' ? 'selected' : ''}" style="padding: 2px 8px; font-size: 0.74rem;" onclick="window.changeAssessmentLanguage('gu')">ગુજરાતી</button>
          </div>
        </div>

        <!-- Disease Identification Badge (if available) -->
        ${
          result.identifiedDisease
            ? `
          <div style="background: rgba(255,255,255,0.92); border: 1.5px solid var(--color-primary); border-radius: var(--radius-lg); padding: 12px 18px; margin-bottom: var(--space-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: var(--shadow-xs);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">🎯</span>
              <div>
                <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: var(--color-primary-dark); letter-spacing: 0.05em;">
                  ${isHi ? 'पहचानी गई बीमारी / स्थिति' : isGu ? 'ઓળખાયેલ બીમારી / સ્થિતિ' : 'IDENTIFIED DISEASE / CONDITION'}
                </div>
                <div style="font-size: 1.05rem; font-weight: 700; color: var(--color-text-main);">
                  ${result.identifiedDisease}
                </div>
              </div>
            </div>
            <span class="badge ${isCritical ? 'badge--red' : isModerate ? 'badge--blue' : 'badge--green'}">
              ${isCritical ? 'CRITICAL EMERGENCY' : isModerate ? 'DOCTOR VISIT NEEDED' : 'MANAGEABLE AT HOME'}
            </span>
          </div>
        `
            : ''
        }

        <!-- CRITICAL full-page emergency alert -->
        ${
          isCritical
            ? `
          <div style="background: linear-gradient(135deg, #b91c1c, #dc2626); border-radius: var(--radius-2xl); padding: var(--space-xl); margin-bottom: var(--space-lg); box-shadow: 0 12px 30px rgba(220, 38, 38, 0.4); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; animation: pulse-alert 2s ease-in-out infinite;">
            <div>
              <div style="font-size: var(--text-h4); font-weight: var(--font-weight-xbold); color: #ffffff; margin-bottom: 6px;">${t('assessment.critical.title', '🚨 CRITICAL MEDICAL EMERGENCY')}</div>
              <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.9); max-width: 480px;">
                ${t('assessment.critical.sub', 'Do not attempt home remedies. Call 108 ambulance immediately or transport the patient directly to the nearest emergency hospital.')}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="tel:108" class="btn btn--emergency btn--lg" style="background: #ffffff; color: #b91c1c; font-weight: var(--font-weight-xbold); font-size: var(--text-lg);">
                ${t('common.call108', '📞 CALL 108 NOW')}
              </a>
              <a href="tel:102" class="btn btn--outline btn--sm" style="border-color: rgba(255,255,255,0.5); color: #ffffff; text-align: center;">
                ${t('common.call102', '🤱 Call 102 (Maternal)')}
              </a>
            </div>
          </div>
        `
            : ''
        }

        <!-- Moderate advisory banner -->
        ${
          isModerate
            ? `
          <div style="background: linear-gradient(135deg, #b45309, #d97706); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-xl); margin-bottom: var(--space-lg); box-shadow: 0 8px 20px rgba(217, 119, 6, 0.25); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: #ffffff; margin-bottom: 4px;">${t('assessment.moderate.title', '⚕️ Doctor Visit Recommended')}</div>
              <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.9);">
                ${t('assessment.moderate.sub', 'Not an emergency, but you should see a doctor within 24 hours.')}
              </div>
            </div>
            <a href="#/care-locator" class="btn btn--secondary btn--sm">
              ${t('common.findPHC', '🏥 Find Nearest PHC →')}
            </a>
          </div>
        `
            : ''
        }

        <!-- Status Card -->
        <div style="margin-bottom: var(--space-lg);">
          ${renderStatusCard(result.riskLevel, result.headline, result.subheadline, result.timeframe)}
        </div>

        <!-- Assessment Summary -->
        <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl);">
          <div class="section-label">${t('assessment.summary', 'ASSESSMENT SUMMARY')}</div>
          <p class="text-lg" style="font-weight: 500; line-height: var(--leading-relaxed); margin-bottom: var(--space-md);">
            ${result.summary}
          </p>

          <div style="background: var(--color-canvas); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--color-gray-200);">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 8px; color: var(--color-text-muted);">
              ${t('assessment.warningSigns', 'Key Warning Signs To Watch:')}
            </div>
            <ul style="list-style: none;">
              ${warningSignsHtml}
            </ul>
          </div>
        </div>

        <!-- DOs and DON'Ts (Grid) -->
        <div class="grid grid--2" style="margin-bottom: var(--space-lg);">
          <div>
            ${renderDoDontCard('do', isHi ? 'क्या करें' : isGu ? 'શું કરવું' : 'What To Do', result.whatToDo)}
          </div>
          <div>
            ${renderDoDontCard('dont', isHi ? 'क्या न करें' : isGu ? 'શું ન કરવું' : 'What To Avoid', result.whatToAvoid)}
          </div>
        </div>

        <!-- REAL HOME REMEDIES SECTION — Only for NON-CRITICAL -->
        ${
          !isCritical && hasRemedies
            ? `
          <div class="card" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.12);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-md);">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">🌿</div>
              <div>
                <div class="section-label" style="margin-bottom: 2px;">
                  ${isHi ? 'असली घरेलू नुस्खे' : isGu ? 'સાચા ઘરગથ્થુ ઉપચારો' : 'AUTHENTIC HOME REMEDIES'}
                </div>
                <h3 class="text-h4" style="color: var(--color-primary-dark);">
                  ${isHi ? 'सुरक्षित प्राकृतिक उपचार और राहत' : isGu ? 'સુરક્ષિત કુદરતી ઉપચાર અને રાહત' : 'Evidence-Based Home Remedies'}
                </h3>
              </div>
              <span class="badge badge--green" style="margin-left: auto;">${isModerate ? 'MODERATE' : 'MILD'} ILLNESS</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); padding: var(--space-sm) var(--space-md); background: rgba(255,255,255,0.6); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
              ${
                isHi
                  ? 'ये घरेलू नुस्खे आपकी बताई गई बीमारी के लिए वैज्ञानिक और पारंपरिक रूप से सुरक्षित हैं। यदि 48 घंटे में सुधार न हो तो डॉक्टर से अवश्य मिलें।'
                  : isGu
                  ? 'આ ઘરગથ્થુ ઉપચારો તમારી જણાવેલ બીમારી માટે સલામત છે. ૪૮ કલાકમાં રાહત ન થાય તો ડોક્ટરને મળવું.'
                  : 'These home remedies are clinically validated for temporary relief and support. Always consult a doctor if symptoms worsen or do not improve within 48 hours.'
              }
            </p>
            <ul style="list-style: none;">
              ${homeRemediesHtml}
            </ul>
          </div>
        `
            : isCritical && hasRemedies
            ? `
          <div class="card card--red" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); border: 1.5px solid #fecaca;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-sm);">
              <span style="font-size: 1.8rem;">🚫</span>
              <div>
                <div class="section-label" style="color: var(--color-danger-dark);">HOME REMEDIES</div>
                <h3 class="text-h4" style="color: var(--color-danger-dark);">${t('assessment.noRemedy.title', 'No Home Remedy Is Safe')}</h3>
              </div>
            </div>
            <p style="font-size: var(--text-base); font-weight: var(--font-weight-semi); color: var(--color-danger-dark); line-height: var(--leading-relaxed);">
              ${(result.homeRemedies as string[])[0]}
            </p>
          </div>
        `
            : ''
        }

        <!-- REAL MEDICAL CURE & CLINICAL TREATMENT SECTION -->
        ${
          !isCritical && hasMedicalCure
            ? `
          <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); border-left: 5px solid #0284c7; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-sm);">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                💊
              </div>
              <div>
                <div class="section-label" style="color: #0369a1; margin-bottom: 2px;">
                  ${isHi ? 'डॉक्टरी इलाज और दवाएं' : isGu ? 'તબીબી સારવાર અને દવાઓ' : 'REAL CLINICAL CURE & MEDICAL PROTOCOL'}
                </div>
                <h3 class="text-h4" style="color: #0f172a;">
                  ${isHi ? 'इस बीमारी का स्थायी मेडिकल इलाज' : isGu ? 'આ બીમારીનો સાચો તબીબી ઈલાજ' : 'Definitive Clinical Treatment & Medical Tests'}
                </h3>
              </div>
            </div>
            <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-md);">
              ${isHi ? 'डॉक्टर द्वारा दी जाने वाली मानक दवाएं और जांचें:' : isGu ? 'ડોક્ટર દ્વારા અપાતી પ્રમાણિત દવાઓ અને ટેસ્ટ:' : 'Standard clinical treatment, diagnostic tests, and doctor prescription pathways:'}
            </p>
            <ul style="list-style: none;">
              ${medicalCureHtml}
            </ul>
          </div>
        `
            : ''
        }

        <!-- THERAPEUTIC DIETARY CURE SECTION -->
        ${
          !isCritical && hasDietaryCure
            ? `
          <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); border-left: 5px solid #d97706; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-sm);">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                🥗
              </div>
              <div>
                <div class="section-label" style="color: #b45309; margin-bottom: 2px;">
                  ${isHi ? 'खान-पान और परहेज' : isGu ? 'ખોરાક અને પરેજી' : 'THERAPEUTIC DIET & HEALING FOODS'}
                </div>
                <h3 class="text-h4" style="color: #0f172a;">
                  ${isHi ? 'बीमारी को जल्दी ठीक करने वाला आहार' : isGu ? 'બીમારી ઝડપથી મટાડતો આહાર' : 'Dietary Recovery Protocol'}
                </h3>
              </div>
            </div>
            <ul style="list-style: none; margin-top: 10px;">
              ${dietaryCureHtml}
            </ul>
          </div>
        `
            : ''
        }

        <!-- Possible Conditions -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <div>
              <div class="section-label">${t('common.aiContext', 'AI CLINICAL CONTEXT')}</div>
              <h3 class="text-h4">${t('common.possibleConditions', 'Possible Conditions (Educational)')}</h3>
            </div>
            <span class="badge badge--paper">${t('common.notADiagnosis', 'NOT A DIAGNOSIS')}</span>
          </div>

          <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md);">
            ${t('common.possibleNote', 'These possibilities are analyzed by JeevanSetu AI to guide your doctor consultation.')} <em>Only a qualified medical professional can determine the actual diagnosis.</em>
          </p>

          <div>
            ${possibleConditionsHtml}
          </div>
        </div>

        <!-- Actions CTA Card -->
        <div style="background: ${isCritical ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' : 'var(--color-gray-900)'}; border-radius: var(--radius-xl); padding: var(--space-xl); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md); box-shadow: ${isCritical ? '0 12px 30px rgba(153, 27, 27, 0.5)' : 'var(--shadow-lg)'};">
          <div>
            <div style="color: ${isCritical ? '#fca5a5' : 'var(--color-primary)'}; font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 4px;">
              NEXT RECOMMENDED STEP
            </div>
            <div style="color: var(--color-white); font-size: var(--text-h5); font-weight: var(--font-weight-bold);">
              ${isCritical ? t('assessment.cta.critical', 'Call 108 or Reach Emergency Department Now') : isModerate ? t('assessment.cta.moderate', 'Locate Nearest Primary Health Centre') : t('assessment.cta.low', 'Follow Home Remedies & Rest')}
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${
              isCritical
                ? `
              <a href="tel:108" class="btn btn--emergency btn--lg">
                🚨 CALL 108
              </a>
              <a href="#/care-locator" class="btn btn--secondary btn--sm">
                🏥 Find Hospital
              </a>
            `
                : isModerate
                ? `
              <a href="#/care-locator" class="btn btn--primary btn--lg">
                🏥 Find Nearest PHC / CHC →
              </a>
              <a href="#/care" class="btn btn--ghost" style="color: var(--color-white);">
                🌿 Home Care Tips
              </a>
            `
                : `
              <a href="#/care" class="btn btn--primary btn--lg">
                🛡️ Safe Temporary Care →
              </a>
            `
            }
            <a href="#/symptoms" class="btn btn--ghost" style="color: var(--color-white); border: 1px solid rgba(255,255,255,0.2);">
              ${t('common.newSymptoms', '↩ Check New Symptoms')}
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
