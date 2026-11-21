import { AuthService } from '../services/authService';
import { HealthcareService } from '../services/healthcareService';
import { SOSService } from '../services/sosService';
import { CommunityService } from '../services/communityService';

export function renderAdminDashboardPage(activeTab = 'facilities'): string {
  const currentUser = AuthService.getCurrentUser();
  const isAdminOrClinician = AuthService.canAccessAdmin(currentUser);

  // If not admin or clinician, show role barrier with demo toggle
  if (!isAdminOrClinician) {
    return `
      <div class="page-content">
        <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 700px;">
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 40px); text-align: center; border-top: 6px solid var(--color-emergency);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🛡️</div>
            <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
              RESTRICTED ACCESS
            </div>
            <h1 class="text-h2" style="color: var(--color-emergency); margin-bottom: var(--space-sm);">
              Administrator Role Required
            </h1>
            <p class="text-base text-muted" style="line-height: var(--leading-relaxed); margin-bottom: var(--space-lg);">
              The JeevanSetu Governance Console is strictly protected by Supabase Row-Level Security (RLS) policies. Only accounts with the <strong>administrator</strong> or <strong>clinician_reviewer</strong> role are permitted to view audit logs and manage clinical records.
            </p>
            <div class="card card--paper" style="background: var(--color-bg-subtle); padding: 14px; border-radius: var(--radius-md); margin-bottom: var(--space-lg); text-align: left; font-size: var(--text-xs);">
              <div><strong>Current Identity:</strong> ${currentUser.displayName} (${currentUser.email})</div>
              <div><strong>Active Role:</strong> <span class="badge badge--gray">${currentUser.role.toUpperCase()}</span></div>
              <div style="margin-top: 4px; color: var(--color-text-muted);">Enforced via <code>public.user_roles</code> table in PostgreSQL schema.</div>
            </div>

            <!-- Demo Mode Role Elevation -->
            <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border);">
              <div class="text-xs text-muted" style="margin-bottom: 12px;">
                <strong>Demo / Evaluation Mode:</strong> Switch your local session role to inspect the administration dashboard:
              </div>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button onclick="window.handleAdminSwitchRole('administrator')" class="btn btn--primary btn--sm">
                  Switch to Administrator
                </button>
                <button onclick="window.handleAdminSwitchRole('clinician_reviewer')" class="btn btn--outline btn--sm">
                  Switch to Clinician Reviewer
                </button>
                <a href="#/" class="btn btn--ghost btn--sm">
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Admin access granted: Gather data
  const facilities = HealthcareService.getAllFacilities();
  const correctionReports = HealthcareService.getCorrectionReports();
  const incidentAudit = SOSService.getIncidentAuditTrail();
  const healthTrends = CommunityService.getHealthTrends();

  // Facility rows
  const facilityRowsHtml = facilities.map((f) => `
    <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
      <div>
        <div style="font-weight: bold; font-size: var(--text-sm); color: var(--color-text-main);">
          ${f.name}
          <span class="badge ${f.isVerified ? 'badge--green' : 'badge--gray'}" style="margin-left: 6px;">
            ${f.isVerified ? '✓ VERIFIED' : 'UNVERIFIED'}
          </span>
        </div>
        <div class="text-xs text-muted" style="margin-top: 2px;">
          ${f.type.toUpperCase()} • ${f.locationName} • Verification Source: <strong>${f.source || 'NHM Rural Registry'}</strong>
          ${f.verifiedDate ? ` • Last Verified: ${f.verifiedDate}` : ''}
        </div>
      </div>
      <div>
        <button onclick="window.handleAdminToggleFacility('${f.id}')" class="btn ${f.isVerified ? 'btn--outline' : 'btn--primary'} btn--sm" style="font-size: 0.75rem; padding: 4px 10px;">
          ${f.isVerified ? 'Revoke Verification' : 'Verify Facility'}
        </button>
      </div>
    </div>
  `).join('');

  // Correction Reports rows
  const correctionReportsHtml = correctionReports.length > 0
    ? correctionReports.map((r) => `
        <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #FFFBEB;">
          <div>
            <div style="font-weight: bold; font-size: var(--text-sm); color: #B45309;">
              ⚠ Correction Request: ${r.facilityName}
              <span class="badge badge--amber" style="margin-left: 6px;">${r.issueType.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="text-xs" style="color: var(--color-text-main); margin-top: 2px;">
              "${r.details}"
            </div>
            <div class="text-xs text-muted" style="margin-top: 2px;">
              Reported: ${new Date(r.reportedAt).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <button onclick="window.handleAdminResolveCorrection('${r.id}')" class="btn btn--primary btn--sm" style="font-size: 0.75rem; padding: 4px 10px;">
              ✓ Mark Reviewed & Resolved
            </button>
          </div>
        </div>
      `).join('')
    : `<div class="text-xs text-muted" style="padding: 16px; text-align: center;">No unresolved facility correction reports.</div>`;

  // Privacy-preserved incident audit rows
  const incidentRowsHtml = incidentAudit.map((inc) => {
    let badgeClass = 'badge--gray';
    if (inc.status === 'resolved') badgeClass = 'badge--green';
    else if (inc.status === 'call_opened' || inc.status === 'sent') badgeClass = 'badge--amber';
    else if (inc.status === 'cancelled') badgeClass = 'badge--red';

    return `
      <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
        <div>
          <div style="font-weight: bold; font-size: var(--text-sm); color: var(--color-text-main);">
            Incident #${inc.id}
            <span class="badge ${badgeClass}" style="margin-left: 6px;">${inc.status.toUpperCase()}</span>
          </div>
          <div class="text-xs text-muted" style="margin-top: 2px;">
            Emergency Type: <strong>${inc.emergencyType}</strong> • Locality: <strong>${inc.locality}</strong> (Precise GPS Redacted)
          </div>
          <div class="text-xs text-muted">
            Status: ${inc.alertStatus} • Logged: ${new Date(inc.createdAt).toLocaleString('en-IN')}
            ${inc.resolvedAt ? ` • Resolved: ${new Date(inc.resolvedAt).toLocaleString('en-IN')}` : ''}
          </div>
        </div>
        <div class="text-xs text-muted" style="text-align: right;">
          🔒 Privacy Protected
        </div>
      </div>
    `;
  }).join('');

  // Trend management rows
  const trendRowsHtml = healthTrends.map((trend) => `
    <div style="padding: 14px 16px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
      <div>
        <div style="font-weight: bold; font-size: var(--text-sm); color: var(--color-text-main);">
          ${trend.category}
          <span class="badge ${trend.reviewedStatus === 'validated' ? 'badge--green' : trend.reviewedStatus === 'closed' ? 'badge--gray' : 'badge--amber'}" style="margin-left: 6px;">
            ${trend.reviewedStatus.toUpperCase()}
          </span>
        </div>
        <div class="text-xs text-muted" style="margin-top: 2px;">
          Area: <strong>${trend.areaCode}</strong> • Case Estimate: <strong>${trend.countBucket}</strong> • Period: <strong>${trend.period}</strong>
        </div>
        <div class="text-xs text-muted" style="margin-top: 2px;">
          Data Source: ${trend.dataSource} • Limitations: ${trend.limitations}
        </div>
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button onclick="window.handleAdminUpdateTrend('${trend.id}', 'validated')" class="btn btn--outline btn--sm" style="font-size: 0.72rem; padding: 4px 8px;">
          Validate Signal
        </button>
        <button onclick="window.handleAdminUpdateTrend('${trend.id}', 'unverified_signal')" class="btn btn--outline btn--sm" style="font-size: 0.72rem; padding: 4px 8px;">
          Mark Unverified
        </button>
        <button onclick="window.handleAdminUpdateTrend('${trend.id}', 'closed')" class="btn btn--primary btn--sm" style="font-size: 0.72rem; padding: 4px 8px;">
          Close Signal
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header Bento -->
        <div class="card card--green" style="border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 40px); margin-bottom: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
            <div>
              <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
                <span class="badge-dot badge-dot--pulse"></span>
                SYSTEM GOVERNANCE & CLINICAL AUDIT CONSOLE
              </div>
              <h1 class="text-h1" style="line-height: 1.15; color: var(--color-primary-dark); margin-bottom: var(--space-xs);">
                Healthcare Operations & Auditing
              </h1>
              <p class="text-base text-muted" style="max-width: 680px; line-height: var(--leading-relaxed);">
                Role-protected dashboard for verified administrators and clinician reviewers. Inspect emergency dispatch history, govern facility data integrity, and review community cluster signals.
              </p>
            </div>

            <!-- Role Indicator & Demo Switcher -->
            <div class="card card--paper" style="padding: 12px 16px; border-radius: var(--radius-lg); min-width: 200px;">
              <div class="text-xs text-muted">Active Identity</div>
              <div style="font-weight: bold; color: var(--color-text-main); font-size: var(--text-sm);">${currentUser.displayName}</div>
              <div style="margin-top: 4px;">
                <span class="badge badge--green">${currentUser.role.toUpperCase()}</span>
              </div>
              <div style="margin-top: 8px; font-size: 0.72rem; color: var(--color-text-muted);">
                Switch role (Demo):
              </div>
              <div style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;">
                <button onclick="window.handleAdminSwitchRole('administrator')" class="btn btn--ghost btn--sm" style="font-size: 0.68rem; padding: 2px 6px;">Admin</button>
                <button onclick="window.handleAdminSwitchRole('clinician_reviewer')" class="btn btn--ghost btn--sm" style="font-size: 0.68rem; padding: 2px 6px;">Clinician</button>
                <button onclick="window.handleAdminSwitchRole('community_worker')" class="btn btn--ghost btn--sm" style="font-size: 0.68rem; padding: 2px 6px;">ASHA</button>
                <button onclick="window.handleAdminSwitchRole('patient')" class="btn btn--ghost btn--sm" style="font-size: 0.68rem; padding: 2px 6px;">Patient</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: var(--space-lg); border-bottom: 2px solid var(--color-border); padding-bottom: 8px; overflow-x: auto;">
          <button onclick="window.setAdminTab('facilities')" class="btn ${activeTab === 'facilities' ? 'btn--primary' : 'btn--ghost'} btn--sm">
            🏥 Facilities & Corrections (${correctionReports.length} pending)
          </button>
          <button onclick="window.setAdminTab('incidents')" class="btn ${activeTab === 'incidents' ? 'btn--primary' : 'btn--ghost'} btn--sm">
            🚨 Emergency Audit Trail (${incidentAudit.length})
          </button>
          <button onclick="window.setAdminTab('trends')" class="btn ${activeTab === 'trends' ? 'btn--primary' : 'btn--ghost'} btn--sm">
            📈 Public Health Signals (${healthTrends.length})
          </button>
          <button onclick="window.setAdminTab('rbac')" class="btn ${activeTab === 'rbac' ? 'btn--primary' : 'btn--ghost'} btn--sm">
            🔐 RBAC Architecture & Roles
          </button>
        </div>

        <!-- TAB CONTENT 1: Facilities & Corrections -->
        ${activeTab === 'facilities' ? `
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
            <div class="section-label" style="margin-bottom: var(--space-sm);">
              USER-SUBMITTED FACILITY CORRECTION REPORTS
            </div>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              Crowdsourced reports for outdated telephone lines, relocated dispensaries, or temporarily out-of-stock emergency antivenom vials.
            </p>
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: white; margin-bottom: var(--space-xl);">
              ${correctionReportsHtml}
            </div>

            <div class="section-label" style="margin-bottom: var(--space-sm);">
              HEALTHCARE FACILITY VERIFICATION DIRECTORY
            </div>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              Clinician reviewers can verify or revoke facility credentials. Only verified facilities display the green verification badge in patient searches.
            </p>
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: white;">
              ${facilityRowsHtml}
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT 2: Emergency Incident Audit Trail -->
        ${activeTab === 'incidents' ? `
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
            <div class="section-label" style="margin-bottom: var(--space-sm);">
              EMERGENCY INCIDENT AUDIT TRAIL
            </div>
            <div class="card card--green" style="padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: var(--space-md); font-size: var(--text-xs); line-height: 1.5;">
              🔒 <strong>Privacy & Compliance Notice (DISHA & HIPAA Alignment):</strong>
              Precise latitude/longitude coordinates and conversational AI triage texts are scrubbed from administrative logs. Only district/taluka sector localities, emergency classification, and lifecycle state changes are audited.
            </div>
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: white;">
              ${incidentRowsHtml}
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT 3: Public Health Trends -->
        ${activeTab === 'trends' ? `
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
            <div class="section-label" style="margin-bottom: var(--space-sm);">
              ANONYMIZED COMMUNITY HEALTH CLUSTER SIGNALS
            </div>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              Aggregated early-warning cluster signals from rural PHCs and ASHA logs. Small-cell suppression is automatically applied for case counts under 5.
            </p>
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: white;">
              ${trendRowsHtml}
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT 4: RBAC & Security Overview -->
        ${activeTab === 'rbac' ? `
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
            <div class="section-label" style="margin-bottom: var(--space-md);">
              ROLE-BASED ACCESS CONTROL (RBAC) POLICIES
            </div>
            <div class="grid grid--2" style="gap: 16px; margin-bottom: var(--space-lg);">
              <div class="card card--paper" style="border-radius: var(--radius-md); padding: 16px; border-left: 4px solid var(--color-primary);">
                <div style="font-weight: bold; font-size: var(--text-sm); margin-bottom: 6px;">1. Patient (<code>patient</code>)</div>
                <div class="text-xs text-muted" style="line-height: 1.6;">
                  • Read & write own medical profile<br/>
                  • Manage personal medicine reminders<br/>
                  • Initiate emergency SOS incidents<br/>
                  • Store local offline health records<br/>
                  • Strict isolation: Cannot access any other patient's data
                </div>
              </div>

              <div class="card card--paper" style="border-radius: var(--radius-md); padding: 16px; border-left: 4px solid #3B82F6;">
                <div style="font-weight: bold; font-size: var(--text-sm); margin-bottom: 6px;">2. Community Worker (<code>community_worker</code>)</div>
                <div class="text-xs text-muted" style="line-height: 1.6;">
                  • Assigned patients in designated village/ward only<br/>
                  • Requires explicit consent granted by patient<br/>
                  • Record home visit notes & vitals<br/>
                  • Enqueue offline village health records<br/>
                  • View aggregated community health trends
                </div>
              </div>

              <div class="card card--paper" style="border-radius: var(--radius-md); padding: 16px; border-left: 4px solid #8B5CF6;">
                <div style="font-weight: bold; font-size: var(--text-sm); margin-bottom: 6px;">3. Clinician Reviewer (<code>clinician_reviewer</code>)</div>
                <div class="text-xs text-muted" style="line-height: 1.6;">
                  • Review & verify healthcare facility data<br/>
                  • Audit deterministic clinical triage rules<br/>
                  • Review community syndrome outbreak alerts<br/>
                  • Resolve crowdsourced correction reports<br/>
                  • Maintain clinical first-aid emergency protocols
                </div>
              </div>

              <div class="card card--paper" style="border-radius: var(--radius-md); padding: 16px; border-left: 4px solid var(--color-emergency);">
                <div style="font-weight: bold; font-size: var(--text-sm); margin-bottom: 6px;">4. Administrator (<code>administrator</code>)</div>
                <div class="text-xs text-muted" style="line-height: 1.6;">
                  • View privacy-preserved emergency audit trails<br/>
                  • Manage user roles via <code>public.user_roles</code><br/>
                  • System uptime & Supabase RLS monitoring<br/>
                  • Oversee immutable audit logs (<code>audit_events</code>)<br/>
                  • Small-cell suppression compliance oversight
                </div>
              </div>
            </div>

            <div class="card card--green" style="padding: 12px 16px; border-radius: var(--radius-md); font-size: var(--text-xs); line-height: 1.5;">
              🔒 <strong>PostgreSQL RLS Enforcement:</strong>
              Supabase enforces these boundaries in the database engine via <code>auth.uid() = user_id</code> and <code>has_role()</code> security functions defined in <code>supabase/migrations/20261121000000_jeevansetu_core_schema.sql</code>. Even direct API calls cannot bypass table-level access controls.
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
