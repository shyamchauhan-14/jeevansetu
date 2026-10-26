import { AssessmentResult } from '../types/health';
import { renderStatusCard } from '../components/StatusCard';
import { renderDoDontCard } from '../components/DoDontCard';

export function renderAssessmentPage(result: AssessmentResult): string {
  const isCritical = result.riskLevel === 'CRITICAL';
  const isModerate = result.riskLevel === 'MODERATE';

  const possibleConditionsHtml = result.possibleConditions
    .map(
      (c) => `
    <div class="card card--paper" style="margin-bottom: var(--space-sm); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; gap: 6px;">
        <h4 style="font-size: var(--text-base); font-weight: var(--font-weight-bold);">${c.name}</h4>
        <span class="badge ${c.likelihood === 'Requires Investigation' ? 'badge--red' : 'badge--blue'}">${c.likelihood}</span>
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
      <span style="color: var(--color-danger); font-size: 1.1rem;">⚠️</span>
      <span>${sign}</span>
    </li>
  `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 900px;">
        
        <!-- Emergency alert banner if critical -->
        ${
          isCritical
            ? `
          <div class="card card--red" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="font-weight: var(--font-weight-xbold); font-size: var(--text-h4); color: var(--color-danger-dark); margin-bottom: 4px;">🚨 Immediate Medical Attention Required</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-body);">Do not wait. Call 108 ambulance or proceed to nearest hospital immediately.</div>
            </div>
            <a href="tel:108" class="btn btn--emergency btn--lg">
              📞 Call 108 Now
            </a>
          </div>
        `
            : ''
        }

        <!-- Status Card -->
        <div style="margin-bottom: var(--space-lg);">
          ${renderStatusCard(result.riskLevel, result.headline, result.subheadline, result.timeframe)}
        </div>

        <!-- Summary text -->
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
        <div class="grid grid--2" style="margin-bottom: var(--space-xl);">
          <div>
            ${renderDoDontCard('do', 'Immediate Steps', result.whatToDo)}
          </div>
          <div>
            ${renderDoDontCard('dont', 'Dangerous Actions', result.whatToAvoid)}
          </div>
        </div>

        <!-- Possible Conditions (Educational Only) -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <div>
              <div class="section-label">CLINICAL CONTEXT</div>
              <h3 class="text-h4">Possible Causes (Educational)</h3>
            </div>
            <span class="badge badge--paper">NOT A DIAGNOSIS</span>
          </div>

          <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md);">
            These possibilities are generated to guide discussions with your physician. <em>Only a qualified doctor or healthcare practitioner can determine the actual diagnosis.</em>
          </p>

          <div>
            ${possibleConditionsHtml}
          </div>
        </div>

        <!-- Actions / Navigation Bar Bento Card -->
        <div class="card card--black" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md); border-radius: var(--radius-xl);">
          <div>
            <div style="color: var(--color-primary); font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 2px;">
              NEXT RECOMMENDED STEP
            </div>
            <div style="color: var(--color-white); font-size: var(--text-h5); font-weight: var(--font-weight-bold);">
              ${isCritical ? 'Call 108 or Reach Emergency Department' : isModerate ? 'Locate Nearest Primary Health Centre' : 'View Safe Home Supportive Care'}
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${
              isCritical
                ? `
              <a href="tel:108" class="btn btn--emergency">
                🚨 CALL 108
              </a>
              <a href="#/care-locator" class="btn btn--primary">
                🏥 Find Hospital →
              </a>
            `
                : isModerate
                ? `
              <a href="#/care-locator" class="btn btn--primary btn--lg">
                🏥 Find Nearest PHC / CHC →
              </a>
            `
                : `
              <a href="#/care" class="btn btn--primary btn--lg">
                🌱 Safe Temporary Care →
              </a>
            `
            }
            <a href="#/symptoms" class="btn btn--ghost" style="color: var(--color-white);">
              Check New Symptoms
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
