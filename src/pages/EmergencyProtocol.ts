import { EmergencyProtocol } from '../types/health';
import { renderDoDontCard } from '../components/DoDontCard';
import { renderStepCard } from '../components/StepCard';

export function renderEmergencyProtocolPage(protocol: EmergencyProtocol): string {
  const stepsHtml = protocol.steps
    .map((step) => renderStepCard(step.number, step.title, step.detail))
    .join('');

  return `
    <div class="page-content">
      
      <!-- Top Emergency Warning Header -->
      <section style="background: var(--grad-bento-red); padding: var(--space-xl) 0; border-bottom: 1px solid rgba(239, 68, 68, 0.2);">
        <div class="container">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md);">
            <div style="max-width: 700px;">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: var(--space-xs);">
                <span class="badge badge--red">🚨 EMERGENCY PROTOCOL</span>
                <span class="badge badge--paper">DIAL ${protocol.emergencyNumber}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 16px; margin: 12px 0;">
                <span style="font-size: clamp(2.5rem, 5vw, 3.5rem); line-height: 1;">${protocol.icon}</span>
                <div>
                  <h1 class="text-h2" style="color: var(--color-danger-dark); line-height: 1.15;">
                    ${protocol.title}
                  </h1>
                  ${protocol.hindiTitle ? `<div style="font-size: var(--text-base); color: var(--color-primary-dark); font-weight: 700; margin-top: 2px;">${protocol.hindiTitle}</div>` : ''}
                </div>
              </div>

              <div class="card card--paper" style="padding: 12px 16px; border-radius: var(--radius-md); border-left: 4px solid var(--color-danger); color: var(--color-danger-dark); font-weight: var(--font-weight-semi); font-size: var(--text-sm);">
                ⚠️ ${protocol.warningText}
              </div>
            </div>

            <!-- Hotline Action Box -->
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 220px;">
              <a href="tel:${protocol.emergencyNumber.replace(/[^0-9]/g, '')}" class="btn btn--emergency btn--lg">
                📞 Call ${protocol.emergencyNumber} Ambulance
              </a>
              <a href="#/care-locator" class="btn btn--outline btn--sm">
                🏥 Nearest Hospital →
              </a>
            </div>
          </div>

        </div>
      </section>

      <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 960px;">
        
        <!-- Immediate Action Strip -->
        <div class="card card--red" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="font-size: var(--text-xs); font-weight: 800; color: var(--color-danger-dark); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 6px;">
            IMMEDIATE FIRST-AID PRIORITY
          </div>
          <p style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-text-main); line-height: var(--leading-relaxed);">
            ${protocol.immediateAction}
          </p>
        </div>

        <!-- DO THIS vs DO NOT DO THIS -->
        <div class="grid grid--2" style="margin-bottom: var(--space-2xl);">
          <div>
            ${renderDoDontCard('do', protocol.title, protocol.doList)}
          </div>
          <div>
            ${renderDoDontCard('dont', protocol.title, protocol.dontList)}
          </div>
        </div>

        <!-- While Help is Coming (Step by Step) -->
        <div style="margin-bottom: var(--space-2xl);">
          <div class="section-label">STEP-BY-STEP ACTIONS</div>
          <h2 class="text-h3" style="margin-bottom: var(--space-md);">
            While Help is on the Way
          </h2>

          <div class="grid grid--2">
            ${stepsHtml}
          </div>
        </div>

        <!-- When Professional Help is Required -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); border-left: 6px solid var(--color-danger);">
          <div class="section-label">HOSPITAL HANDOVER</div>
          <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 6px;">When Professional Hospital Care is Needed</h3>
          <p class="text-base text-body" style="line-height: var(--leading-relaxed);">
            ${protocol.whenProfessionalHelpRequired}
          </p>
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <a href="#/emergency" class="btn btn--ghost">
            ← Back to Emergency Center
          </a>
          <a href="#/care-locator" class="btn btn--primary btn--lg">
            Find Hospital With Emergency Facility →
          </a>
        </div>

      </div>
    </div>
  `;
}
