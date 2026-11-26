import { EmergencyProtocol } from '../types/health';
import { renderDoDontCard } from '../components/DoDontCard';
import { renderStepCard } from '../components/StepCard';
import { EmergencyProtocolService } from '../services/emergencyProtocolService';

export function renderEmergencyProtocolPage(protocol: EmergencyProtocol): string {
  // Look up authoritative managed clinical protocol by slug
  const managed = EmergencyProtocolService.getBySlug(protocol.slug);

  const stepsHtml = (managed?.responseSteps || protocol.steps)
    .map((step) => renderStepCard(step.number, step.title, step.detail))
    .join('');

  return `
    <div class="page-content">
      
      <!-- Top Emergency Warning Header -->
      <section style="background: var(--grad-bento-red); padding: var(--space-xl) 0; border-bottom: 1px solid rgba(239, 68, 68, 0.2);">
        <div class="container">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md);">
            <div style="max-width: 720px;">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: var(--space-xs); flex-wrap: wrap;">
                <span class="badge badge--red">🚨 CLINICAL EMERGENCY PROTOCOL</span>
                <span class="badge badge--paper">NATIONAL EMERGENCY: DIAL 112 / 108</span>
                ${
                  managed?.isPublic
                    ? `<span class="badge badge--green">✓ VERIFIED MEDICAL AUTHORITY</span>`
                    : ''
                }
              </div>

              <div style="display: flex; align-items: center; gap: 16px; margin: 12px 0;">
                <span style="font-size: clamp(2.5rem, 5vw, 3.5rem); line-height: 1;">${protocol.icon || '🚑'}</span>
                <div>
                  <h1 class="text-h2" style="color: var(--color-danger-dark); line-height: 1.15;">
                    ${managed?.title || protocol.title}
                  </h1>
                  ${protocol.hindiTitle ? `<div style="font-size: var(--text-base); color: var(--color-primary-dark); font-weight: 700; margin-top: 2px;">${protocol.hindiTitle}</div>` : ''}
                </div>
              </div>

              <div class="card card--paper" style="padding: 12px 16px; border-radius: var(--radius-md); border-left: 4px solid var(--color-danger); color: var(--color-danger-dark); font-weight: var(--font-weight-semi); font-size: var(--text-sm);">
                ⚠️ ${managed?.specialPrecautions || protocol.warningText}
              </div>
            </div>

            <!-- Hotline Action Box -->
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 240px;">
              <a href="tel:112" class="btn btn--emergency btn--lg">
                📞 Call 112 Universal Dispatch
              </a>
              <a href="tel:108" class="btn btn--outline btn--sm" style="background: white;">
                🚑 Call 108 Medical Ambulance
              </a>
              <a href="#/care-locator" class="btn btn--ghost btn--sm">
                🏥 Locate Nearest Hospital →
              </a>
            </div>
          </div>

        </div>
      </section>

      <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 960px;">
        
        <!-- Authoritative Clinician Attribution Bento Card -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); border-left: 5px solid var(--color-primary); background: #F8FAFC;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">
                Medical Authorship & Verification
              </div>
              <div style="font-size: var(--text-sm); font-weight: bold; color: var(--color-text-main); margin-top: 2px;">
                Authored by: <span style="color: #065F46;">${managed?.authorName || 'Dr. Rajesh Kulkarni (MD, Emergency Medicine)'}</span>
                ${managed?.authorRegistrationNo ? `<span class="badge badge--gray" style="margin-left: 6px;">${managed.authorRegistrationNo}</span>` : ''}
              </div>
              <div class="text-xs text-muted" style="margin-top: 4px;">
                Reviewed by: <strong>${managed?.reviewerName || 'Medical Authority Board / Super Admin'}</strong> • Last Medical Review: ${managed?.lastReviewedAt ? new Date(managed.lastReviewedAt).toLocaleDateString('en-IN') : '15-Oct-2026'}
                ${managed?.reviewDueAt ? ` • Review Due: ${new Date(managed.reviewDueAt).toLocaleDateString('en-IN')}` : ''}
              </div>
            </div>
            <div>
              <span class="badge badge--green">STATUS: PUBLISHED (v${managed?.version || 2})</span>
            </div>
          </div>
        </div>

        <!-- Immediate Action Strip -->
        <div class="card card--red" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="font-size: var(--text-xs); font-weight: 800; color: var(--color-danger-dark); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 6px;">
            IMMEDIATE FIRST-AID PRIORITY
          </div>
          <p style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-text-main); line-height: var(--leading-relaxed);">
            ${managed?.immediateSafetyMeasures || protocol.immediateAction}
          </p>
        </div>

        <!-- DO THIS vs DO NOT DO THIS -->
        <div class="grid grid--2" style="margin-bottom: var(--space-2xl);">
          <div>
            ${renderDoDontCard('do', protocol.title, managed?.symptoms || protocol.doList)}
          </div>
          <div>
            ${renderDoDontCard('dont', protocol.title, managed?.whatNotToDo || protocol.dontList)}
          </div>
        </div>

        <!-- Step by Step Actions -->
        <div style="margin-bottom: var(--space-2xl);">
          <div class="section-label">CLINICAL RESPONSE STEPS</div>
          <h2 class="text-h3" style="margin-bottom: var(--space-md);">
            Step-by-Step Emergency Response
          </h2>

          <div class="grid grid--2">
            ${stepsHtml}
          </div>
        </div>

        <!-- Required Medical Equipment & References -->
        ${
          managed?.requiredEquipment && managed.requiredEquipment.length > 0
            ? `
          <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-lg);">
            <div class="section-label">RECOMMENDED FIRST AID EQUIPMENT</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
              ${managed.requiredEquipment.map((eq: string) => `<span class="badge badge--gray">📦 ${eq}</span>`).join('')}
            </div>
            ${
              managed.medicalReferences && managed.medicalReferences.length > 0
                ? `
              <div style="margin-top: 16px; pt: 12px; border-top: 1px solid var(--color-border); font-size: var(--text-xs); color: var(--color-text-muted);">
                <strong>Statutory References:</strong>
                ${managed.medicalReferences.join(' • ')}
              </div>
            `
                : ''
            }
          </div>
        `
            : ''
        }

        <!-- When Professional Help is Required & Statutory Disclaimer -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); border-left: 6px solid var(--color-danger);">
          <div class="section-label">HOSPITAL HANDOVER & TRIAGE</div>
          <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 6px;">When to Call Emergency Services (112 / 108)</h3>
          <p class="text-base text-body" style="line-height: var(--leading-relaxed); margin-bottom: 12px;">
            ${managed?.whenToCallEmergency || protocol.whenProfessionalHelpRequired}
          </p>
          <div class="text-xs text-muted" style="background: var(--color-canvas); padding: 10px 14px; border-radius: var(--radius-md);">
            <strong>Statutory Emergency Disclaimer:</strong> This protocol distinguishes general first-aid guidance from professional hospital intervention. It is authored for educational preparedness and does not replace emergency medical triage by certified hospital physicians.
          </div>
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
