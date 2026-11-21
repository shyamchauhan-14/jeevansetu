import { CommunityService } from '../services/communityService';
import { AuthService } from '../services/authService';

export function renderWorkerWorkspacePage(): string {
  const user = AuthService.getCurrentUser();
  const assignments = CommunityService.getWorkerAssignments();

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--blue" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            COMMUNITY HEALTH WORKER (ASHA) WORKSPACE • ${user.displayName}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Assigned Patient Follow-Ups
          </h1>
          <p class="text-base text-muted">
            Authorized workspace for field visits, medication reviews, and consent-managed patient care.
          </p>
        </div>

        <!-- Role Boundaries Notice -->
        <div class="card card--paper" style="border-left: 5px solid var(--color-info); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-info-dark); text-transform: uppercase;">
            Least-Privilege & Consent Enforcement
          </div>
          <div class="text-xs text-muted" style="margin-top: 4px; line-height: var(--leading-normal);">
            Access is restricted to patients who have granted active consent. Health worker guidance is supportive and educational; it does not replace a doctor's clinical prescription or hospital triage.
          </div>
        </div>

        <!-- Patient Roster List -->
        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-2xl);">
          ${
            assignments.length === 0
              ? `<div class="card card--paper" style="text-align: center; padding: var(--space-xl); border-radius: var(--radius-xl);">No patients currently assigned.</div>`
              : assignments
                  .map(
                    (asgn) => `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: var(--space-sm);">
                <div>
                  <h3 style="font-size: var(--text-base); font-weight: bold; color: var(--color-text-main);">${asgn.patientName}</h3>
                  <div class="text-xs text-muted">Patient ID: ${asgn.patientUserId} • Last Visit: ${asgn.lastVisitDate || 'Not visited'}</div>
                </div>
                <div>
                  <span class="badge ${asgn.status === 'active' ? 'badge--green' : 'badge--paper'}">
                    ${asgn.status === 'active' ? '✓ Consent Active' : 'Consent Revoked'}
                  </span>
                </div>
              </div>

              <div style="background: var(--color-surface-soft); padding: 10px 14px; border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--color-text-body); margin-bottom: var(--space-md);">
                <strong>Latest Visit Note:</strong> ${asgn.notes || 'No notes recorded.'}
              </div>

              ${
                asgn.status === 'active'
                  ? `
                <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
                  <button type="button" class="btn btn--outline btn--sm" onclick="window.promptUpdateVisitNote('${asgn.id}')">
                    📝 Update Visit Note
                  </button>
                  <button type="button" class="btn btn--ghost btn--sm" style="color: var(--color-danger);" onclick="window.handleRevokePatientConsent('${asgn.id}')">
                    ✕ Revoke Consent
                  </button>
                </div>
              `
                  : `<div class="text-xs text-muted italic">Patient has revoked access. No further visit updates permitted.</div>`
              }
            </div>
          `
                  )
                  .join('')
          }
        </div>

        <div style="text-align: center;">
          <a href="#/" class="btn btn--outline">
            ← Return to Main Application
          </a>
        </div>

      </div>
    </div>
  `;
}
