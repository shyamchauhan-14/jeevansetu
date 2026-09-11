import { AssessmentResult } from '../types/health';
import { renderStatusCard } from '../components/StatusCard';
import { renderDoDontCard } from '../components/DoDontCard';

export function renderAssessmentPage(result: AssessmentResult): string {
  const isCritical = result.riskLevel === 'CRITICAL';
  const isModerate = result.riskLevel === 'MODERATE';
  const isLow = result.riskLevel === 'LOW';
  const hasRemedies = result.homeRemedies && result.homeRemedies.length > 0;

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

  // Page background changes to red for CRITICAL
  const pageBg = isCritical
    ? `background: linear-gradient(160deg, #fff1f2 0%, #fee2e2 60%, #fecaca 100%); min-height: 100vh;`
    : isModerate
    ? `background: linear-gradient(160deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%); min-height: 100vh;`
    : `background: linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 60%, #d1fae5 100%); min-height: 100vh;`;

  const aiPoweredBadge = `
    <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-full); padding: 4px 12px; font-size: var(--text-xs); font-weight: var(--font-weight-bold); letter-spacing: var(--tracking-wider); margin-bottom: var(--space-md); color: var(--color-text-muted);">
      ✨ AI-POWERED TRIAGE ASSESSMENT
    </div>
  `;

  return `
    <div class="page-content" style="${pageBg}">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 900px;">
        
        ${aiPoweredBadge}

        <!-- CRITICAL full-page emergency alert -->
        ${
          isCritical
            ? `
          <div style="background: linear-gradient(135deg, #b91c1c, #dc2626); border-radius: var(--radius-2xl); padding: var(--space-xl); margin-bottom: var(--space-lg); box-shadow: 0 12px 30px rgba(220, 38, 38, 0.4); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; animation: pulse-alert 2s ease-in-out infinite;">
            <div>
              <div style="font-size: var(--text-h4); font-weight: var(--font-weight-xbold); color: #ffffff; margin-bottom: 6px;">🚨 CRITICAL MEDICAL EMERGENCY</div>
              <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.9); max-width: 480px;">
                Do not attempt home remedies. Call 108 ambulance immediately or transport the patient directly to the nearest emergency hospital.
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="tel:108" class="btn btn--emergency btn--lg" style="background: #ffffff; color: #b91c1c; font-weight: var(--font-weight-xbold); font-size: var(--text-lg);">
                📞 CALL 108 NOW
              </a>
              <a href="tel:102" class="btn btn--outline btn--sm" style="border-color: rgba(255,255,255,0.5); color: #ffffff; text-align: center;">
                🤱 Call 102 (Maternal)
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
              <div style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: #ffffff; margin-bottom: 4px;">⚕️ Doctor Visit Recommended</div>
              <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.9);">
                Not an emergency, but you should see a doctor within 24 hours.
              </div>
            </div>
            <a href="#/care-locator" class="btn btn--secondary btn--sm">
              🏥 Find Nearest PHC →
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
          <div class="section-label">ASSESSMENT SUMMARY</div>
          <p class="text-lg" style="font-weight: 500; line-height: var(--leading-relaxed); margin-bottom: var(--space-md);">
            ${result.summary}
          </p>

          <div style="background: var(--color-canvas); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--color-gray-200);">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 8px; color: var(--color-text-muted);">
              Key Warning Signs To Watch:
            </div>
            <ul style="list-style: none;">
              ${warningSignsHtml}
            </ul>
          </div>
        </div>

        <!-- DOs and DON'Ts (Grid) -->
        <div class="grid grid--2" style="margin-bottom: var(--space-lg);">
          <div>
            ${renderDoDontCard('do', 'What To Do', result.whatToDo)}
          </div>
          <div>
            ${renderDoDontCard('dont', 'What To Avoid', result.whatToAvoid)}
          </div>
        </div>

        <!-- Home Remedies Section — Only for NON-CRITICAL -->
        ${
          !isCritical && hasRemedies
            ? `
          <div class="card" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.12);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-md);">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">🌿</div>
              <div>
                <div class="section-label" style="margin-bottom: 2px;">AI-SUGGESTED REMEDIES</div>
                <h3 class="text-h4" style="color: var(--color-primary-dark);">Safe Home Remedies</h3>
              </div>
              <span class="badge badge--green" style="margin-left: auto;">FOR ${isModerate ? 'MODERATE' : 'MILD'} ILLNESS</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); padding: var(--space-sm) var(--space-md); background: rgba(255,255,255,0.6); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
              These home remedies are suggested by the NVIDIA-powered JeevanSetu AI specifically for your reported symptoms. 
              Always consult a doctor if symptoms worsen or do not improve within 48 hours.
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
                <h3 class="text-h4" style="color: var(--color-danger-dark);">No Home Remedy Is Safe</h3>
              </div>
            </div>
            <p style="font-size: var(--text-base); font-weight: var(--font-weight-semi); color: var(--color-danger-dark); line-height: var(--leading-relaxed);">
              ${(result.homeRemedies as string[])[0]}
            </p>
          </div>
        `
            : ''
        }

        <!-- Possible Conditions -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <div>
              <div class="section-label">AI CLINICAL CONTEXT</div>
              <h3 class="text-h4">Possible Conditions (Educational)</h3>
            </div>
            <span class="badge badge--paper">NOT A DIAGNOSIS</span>
          </div>

          <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md);">
            These possibilities are analyzed by JeevanSetu AI to guide your doctor consultation. <em>Only a qualified medical professional can determine the actual diagnosis.</em>
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
              ${isCritical ? 'Call 108 or Reach Emergency Department Now' : isModerate ? 'Locate Nearest Primary Health Centre' : 'Follow Home Remedies & Rest'}
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
                🌱 Safe Temporary Care →
              </a>
            `
            }
            <a href="#/symptoms" class="btn btn--ghost" style="color: var(--color-white); border: 1px solid rgba(255,255,255,0.2);">
              ↩ Check New Symptoms
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
