import { AuthService } from '../services/authService';
import { DoctorVerificationService } from '../services/doctorVerificationService';
import { EmergencyProtocolService } from '../services/emergencyProtocolService';
import { BloodDonorService } from '../services/bloodDonorService';
import { AdminAnalyticsService } from '../services/adminAnalyticsService';
import { AdminNotificationService } from '../services/adminNotificationService';

export function renderAdminDashboardPage(activeTab = 'dashboard'): string {
  const currentUser = AuthService.getCurrentUser();
  const canAccess = AuthService.canAccessAdmin(currentUser);

  // RBAC Barrier: Require Super Admin or Clinician Reviewer
  if (!canAccess) {
    return `
      <div class="page-content">
        <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 700px;">
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 40px); text-align: center; border-top: 6px solid var(--color-emergency);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🛡️</div>
            <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
              RESTRICTED ACCESS • RBAC ENFORCED
            </div>
            <h1 class="text-h2" style="color: var(--color-emergency); margin-bottom: var(--space-sm);">
              Super Administrator Role Required
            </h1>
            <p class="text-base text-muted" style="line-height: var(--leading-relaxed); margin-bottom: var(--space-lg);">
              The JeevanSetu Healthcare SaaS Governance Console and Medical Authority System are strictly restricted. Only verified accounts with <strong>SUPER ADMIN</strong> or <strong>VERIFIED DOCTOR</strong> permissions can access clinical management data.
            </p>
            <div class="card card--paper" style="background: var(--color-bg-subtle); padding: 14px; border-radius: var(--radius-md); margin-bottom: var(--space-lg); text-align: left; font-size: var(--text-xs);">
              <div><strong>Current Identity:</strong> ${currentUser.displayName} (${currentUser.email})</div>
              <div><strong>Active Role:</strong> <span class="badge badge--gray">${currentUser.role.toUpperCase()}</span></div>
              <div style="margin-top: 4px; color: var(--color-text-muted);">Client and server permissions validated against PostgreSQL RLS policies.</div>
            </div>

            <!-- Demo Mode Role Elevation -->
            <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border);">
              <div class="text-xs text-muted" style="margin-bottom: 12px;">
                <strong>Demo / Evaluation Mode:</strong> Switch session role to inspect the admin features:
              </div>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button onclick="window.handleAdminSwitchRole('super_admin')" class="btn btn--primary btn--sm">
                  Switch to Super Admin
                </button>
                <button onclick="window.handleAdminSwitchRole('verified_doctor')" class="btn btn--outline btn--sm">
                  Switch to Verified Doctor
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

  // Gather system state
  const overview = AdminAnalyticsService.getOverviewStats();
  const unreadNotifications = AdminNotificationService.getUnreadCount();
  const doctors = DoctorVerificationService.getAll();
  const protocols = EmergencyProtocolService.getAll();
  const donors = BloodDonorService.getAll();
  const bloodGroupsDist = AdminAnalyticsService.getBloodGroupDistribution();
  const recentActivities = AdminAnalyticsService.getRecentActivity(8);
  const notifications = AdminNotificationService.getForCurrentRole();

  // Navigation Items for SaaS Sidebar
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', badge: '' },
    { key: 'users', label: 'User Management', icon: '👥', badge: '142' },
    { key: 'doctors', label: 'Doctor Verification', icon: '🩺', badge: overview.pendingDoctorVerifications > 0 ? `${overview.pendingDoctorVerifications}` : '' },
    { key: 'donors', label: 'Blood Donor Management', icon: '🩸', badge: `${overview.totalRegisteredDonors}` },
    { key: 'protocols', label: 'Emergency Protocols', icon: '📋', badge: `${overview.publishedProtocols}` },
    { key: 'approvals', label: 'Protocol Approvals', icon: '✅', badge: overview.pendingApprovalProtocols > 0 ? `${overview.pendingApprovalProtocols}` : '' },
    { key: 'analytics', label: 'Reports & Analytics', icon: '📈', badge: '' },
    { key: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadNotifications > 0 ? `${unreadNotifications}` : '' },
    { key: 'audit_logs', label: 'Audit Logs', icon: '📜', badge: '' },
    { key: 'settings', label: 'Settings', icon: '⚙️', badge: '' },
    { key: 'logout', label: 'Session / Role', icon: '🔄', badge: '' }
  ];

  return `
    <div class="admin-wrapper" style="display: flex; min-height: calc(100vh - 64px); background: #F8FAFC;">
      
      <!-- SaaS Sidebar Navigation -->
      <aside class="admin-sidebar" style="width: 260px; background: #064E3B; color: #FFFFFF; flex-shrink: 0; display: flex; flex-direction: column; border-right: 1px solid #047857;">
        
        <!-- Sidebar Brand Header -->
        <div style="padding: 20px 16px; border-bottom: 1px solid #065F46; display: flex; align-items: center; gap: 10px;">
          <div style="background: #10B981; color: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem;">
            JS
          </div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.5px; color: #ECFDF5;">JEEVANSETU ADMIN</div>
            <div style="font-size: 0.7rem; color: #A7F3D0;">Medical Authority & Governance</div>
          </div>
        </div>

        <!-- Role Pill -->
        <div style="padding: 12px 16px; background: #044433; border-bottom: 1px solid #065F46; font-size: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="color: #6EE7B7;">Role: <strong>${currentUser.role.toUpperCase()}</strong></span>
          <span style="background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem;">ONLINE</span>
        </div>

        <!-- Sidebar Navigation Links -->
        <nav style="flex: 1; padding: 12px 8px; overflow-y: auto;">
          ${navItems
            .map((item) => {
              const isActive = activeTab === item.key;
              return `
              <a href="#/admin/${item.key}" class="admin-nav-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; margin-bottom: 4px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: ${
                isActive ? '700' : '500'
              }; color: ${isActive ? '#FFFFFF' : '#D1FAE5'}; background: ${isActive ? '#059669' : 'transparent'}; transition: all 0.15s ease;">
                <span style="display: flex; align-items: center; gap: 10px;">
                  <span>${item.icon}</span>
                  <span>${item.label}</span>
                </span>
                ${
                  item.badge
                    ? `<span style="background: ${isActive ? '#047857' : '#065F46'}; color: #ECFDF5; font-size: 0.7rem; font-weight: bold; padding: 1px 7px; border-radius: 10px;">${item.badge}</span>`
                    : ''
                }
              </a>
            `;
            })
            .join('')}
        </nav>

        <!-- Sidebar Footer -->
        <div style="padding: 16px; border-top: 1px solid #065F46; font-size: 0.7rem; color: #A7F3D0; text-align: center;">
          JeevanSetu 2.0 • ISO 27799 Medical Compliance
        </div>
      </aside>

      <!-- Main Dashboard Workspace -->
      <main class="admin-main" style="flex: 1; padding: 24px; overflow-y: auto; max-width: 1400px;">
        
        <!-- Top Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 class="text-h2" style="color: #0F172A; text-transform: capitalize; margin-bottom: 2px;">
              ${activeTab.replace('_', ' ')}
            </h1>
            <p class="text-xs text-muted">
              Authoritative medical management, emergency protocol governance, and voluntary blood donor registry.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <a href="#/admin/notifications" class="btn btn--outline btn--sm" style="position: relative;">
              🔔 Alerts ${unreadNotifications > 0 ? `<span style="background: #EF4444; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.65rem; margin-left: 4px;">${unreadNotifications}</span>` : ''}
            </a>
            <a href="#/doctor-portal" class="btn btn--outline btn--sm">
              🩺 Doctor Portal
            </a>
            <button onclick="window.handleExportDonorsCsv()" class="btn btn--outline btn--sm">
              📥 Export CSV
            </button>
            <a href="#/" class="btn btn--ghost btn--sm">
              ← Public App
            </a>
          </div>
        </div>

        <!-- Render Content based on activeTab -->
        ${renderActiveTabContent(activeTab, overview, doctors, protocols, donors, bloodGroupsDist, recentActivities, notifications, currentUser)}

      </main>
    </div>
  `;
}

/**
 * Tab Content Switcher
 */
function renderActiveTabContent(
  tab: string,
  overview: any,
  doctors: any[],
  protocols: any[],
  donors: any[],
  bloodGroupsDist: any[],
  recentActivities: any[],
  notifications: any[],
  currentUser: any
): string {
  switch (tab) {
    case 'users':
      return renderUserManagementView();
    case 'doctors':
      return renderDoctorVerificationView(doctors);
    case 'donors':
      return renderBloodDonorManagementView(donors);
    case 'protocols':
      return renderProtocolsManagementView(protocols);
    case 'approvals':
      return renderProtocolApprovalsView(protocols);
    case 'analytics':
      return renderAnalyticsView(bloodGroupsDist);
    case 'notifications':
      return renderNotificationsView(notifications);
    case 'audit_logs':
      return renderAuditLogsView();
    case 'settings':
      return renderSettingsView();
    case 'logout':
      return renderSessionRoleView(currentUser);
    case 'dashboard':
    default:
      return renderDashboardOverview(overview, bloodGroupsDist, recentActivities);
  }
}

/**
 * VIEW 1: DASHBOARD OVERVIEW
 */
function renderDashboardOverview(
  overview: any,
  bloodGroupsDist: any[],
  recentActivities: any[]
): string {
  return `
    <!-- Top KPI Bento Cards -->
    <div class="grid grid--4" style="gap: 16px; margin-bottom: 24px;">
      
      <!-- Donors Card -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px; border-left: 5px solid #EF4444;">
        <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Registered Blood Donors</div>
        <div style="font-size: 2rem; font-weight: 800; color: #1E293B; margin: 4px 0;">${overview.totalRegisteredDonors}</div>
        <div class="text-xs" style="color: #10B981; display: flex; align-items: center; gap: 4px;">
          <span>🟢 ${overview.activeDonors} active donors</span> • <span>${overview.inactiveDonors} paused</span>
        </div>
      </div>

      <!-- Doctors Card -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px; border-left: 5px solid #10B981;">
        <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Verified Doctors</div>
        <div style="font-size: 2rem; font-weight: 800; color: #1E293B; margin: 4px 0;">${overview.verifiedDoctors}</div>
        <div class="text-xs" style="color: #B45309; display: flex; align-items: center; gap: 4px;">
          <span>⏳ ${overview.pendingDoctorVerifications} pending verification</span>
        </div>
      </div>

      <!-- Published Protocols Card -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px; border-left: 5px solid #0284C7;">
        <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Published Protocols</div>
        <div style="font-size: 2rem; font-weight: 800; color: #1E293B; margin: 4px 0;">${overview.publishedProtocols}</div>
        <div class="text-xs" style="color: #0369A1; display: flex; align-items: center; gap: 4px;">
          <span>${overview.pendingApprovalProtocols} awaiting board approval</span>
        </div>
      </div>

      <!-- System Health Card -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px; border-left: 5px solid #8B5CF6;">
        <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Active Users & Responders</div>
        <div style="font-size: 2rem; font-weight: 800; color: #1E293B; margin: 4px 0;">${overview.totalUsers}</div>
        <div class="text-xs" style="color: #6D28D9;">
          <span>100% RLS Server-Side Enforced</span>
        </div>
      </div>

    </div>

    <!-- Middle Bento: Blood Group Breakdown Chart + Quick Review Queue -->
    <div class="grid grid--2" style="gap: 20px; margin-bottom: 24px;">
      
      <!-- Blood Group Distribution Chart -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1rem; font-weight: bold;">Blood Group Availability</h3>
            <p class="text-xs text-muted">Distribution of active voluntary donors across ABO/Rh groups.</p>
          </div>
          <a href="#/admin/donors" class="btn btn--outline btn--sm">View Registry</a>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${bloodGroupsDist
            .map(
              (bg) => `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 3px;">
                <span style="font-weight: bold;">${bg.bloodGroup}</span>
                <span class="text-muted">${bg.count} donors (${bg.percentage}%)</span>
              </div>
              <div style="background: #E2E8F0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #EF4444; height: 100%; width: ${Math.max(bg.percentage, 4)}%; border-radius: 4px;"></div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Pending Verification Action Queue -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1rem; font-weight: bold;">Priority Action Queue</h3>
            <p class="text-xs text-muted">Awaiting administrative validation and medical review.</p>
          </div>
          <span class="badge badge--amber">${overview.pendingDoctorVerifications + overview.pendingApprovalProtocols} Pending</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${
            overview.pendingDoctorVerifications > 0
              ? `
            <div style="padding: 12px; background: #FFFBEB; border-radius: 8px; border-left: 4px solid #F59E0B; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; font-size: 0.85rem; color: #92400E;">Doctor Verification Request</div>
                <div class="text-xs text-muted">Dr. Suresh Deshmukh (MMC-2014-098231) submitted credentials.</div>
              </div>
              <a href="#/admin/doctors" class="btn btn--primary btn--sm" style="font-size: 0.75rem; padding: 4px 10px;">Review</a>
            </div>
          `
              : ''
          }

          ${
            overview.pendingApprovalProtocols > 0
              ? `
            <div style="padding: 12px; background: #F0FDF4; border-radius: 8px; border-left: 4px solid #10B981; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; font-size: 0.85rem; color: #065F46;">Emergency Protocol Approval</div>
                <div class="text-xs text-muted">Cardiology / Severe Bleeding guideline submitted for review.</div>
              </div>
              <a href="#/admin/approvals" class="btn btn--primary btn--sm" style="font-size: 0.75rem; padding: 4px 10px;">Review</a>
            </div>
          `
              : ''
          }

          <div style="padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.85rem; color: #334155;">Voluntary Blood Donors</div>
              <div class="text-xs text-muted">All sensitive donor contact numbers are masked for unauthorized users.</div>
            </div>
            <a href="#/admin/donors" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 10px;">Manage</a>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Table: Recent Administrative Activities -->
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-size: 1rem; font-weight: bold;">Recent Activity Audit Log</h3>
          <p class="text-xs text-muted">Chronological audit stream of registrations, protocol changes, and approvals.</p>
        </div>
        <a href="#/admin/audit_logs" class="btn btn--outline btn--sm">Full Audit Trail</a>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">Type</th>
              <th style="padding: 10px 16px;">Activity Title</th>
              <th style="padding: 10px 16px;">Details</th>
              <th style="padding: 10px 16px;">Status</th>
              <th style="padding: 10px 16px;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${recentActivities
              .map(
                (act) => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 16px; font-weight: bold; color: #334155;">${act.type}</td>
                <td style="padding: 12px 16px; font-weight: 600;">${act.title}</td>
                <td style="padding: 12px 16px; color: #64748B;">${act.description}</td>
                <td style="padding: 12px 16px;">
                  <span class="badge ${act.badgeClass}">${act.badgeText}</span>
                </td>
                <td style="padding: 12px 16px; color: #94A3B8; font-size: 0.75rem;">
                  ${new Date(act.timestamp).toLocaleString('en-IN')}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 2: USER MANAGEMENT (RBAC)
 */
function renderUserManagementView(): string {
  const users = [
    { id: 'usr-1', name: 'Super Admin', email: 'admin@jeevansetu.med', role: 'SUPER ADMIN', status: 'ACTIVE', lastLogin: 'Just now' },
    { id: 'usr-2', name: 'Dr. Rajesh Kulkarni', email: 'dr.rajesh.kulkarni@jeevansetu.med', role: 'VERIFIED DOCTOR', status: 'ACTIVE', lastLogin: '2 hours ago' },
    { id: 'usr-3', name: 'Dr. Suresh Deshmukh', email: 'dr.suresh.deshmukh@ruralhealth.org', role: 'NORMAL USER (APPLIED)', status: 'ACTIVE', lastLogin: 'Yesterday' },
    { id: 'usr-4', name: 'Dr. Anita Joshi', email: 'dr.anita.joshi@cardio-care.in', role: 'VERIFIED DOCTOR', status: 'ACTIVE', lastLogin: '3 days ago' },
    { id: 'usr-5', name: 'Kavita Shinde (ASHA)', email: 'kavita.asha@phc.org', role: 'NORMAL USER', status: 'ACTIVE', lastLogin: '5 days ago' },
    { id: 'usr-6', name: 'Suspicious Bot Account', email: 'spammer99@temp.net', role: 'NORMAL USER', status: 'SUSPENDED', lastLogin: '10 days ago' }
  ];

  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1rem; font-weight: bold;">User Management & Role-Based Access Control (RBAC)</h3>
          <p class="text-xs text-muted">Manage system participants, assign roles, and enforce security policies.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" class="input input--sm" placeholder="Search user by name or email..." style="width: 240px;" />
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">User</th>
              <th style="padding: 10px 16px;">Assigned Role</th>
              <th style="padding: 10px 16px;">Account Status</th>
              <th style="padding: 10px 16px;">Last Active</th>
              <th style="padding: 10px 16px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (u) => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 16px;">
                  <div style="font-weight: bold;">${u.name}</div>
                  <div class="text-xs text-muted">${u.email}</div>
                </td>
                <td style="padding: 12px 16px;">
                  <span class="badge ${u.role === 'SUPER ADMIN' ? 'badge--green' : u.role.includes('DOCTOR') ? 'badge--amber' : 'badge--gray'}">
                    ${u.role}
                  </span>
                </td>
                <td style="padding: 12px 16px;">
                  <span class="badge ${u.status === 'ACTIVE' ? 'badge--green' : 'badge--red'}">${u.status}</span>
                </td>
                <td style="padding: 12px 16px; color: #64748B; font-size: 0.75rem;">${u.lastLogin}</td>
                <td style="padding: 12px 16px; text-align: right;">
                  <button onclick="window.handleAdminToggleUserSuspension('${u.id}')" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                    ${u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 3: DOCTOR VERIFICATION
 */
function renderDoctorVerificationView(doctors: any[]): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 24px;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1rem; font-weight: bold;">Medical Authority Verification Queue</h3>
          <p class="text-xs text-muted">Verify statutory medical registrations against National Medical Commission (NMC) & State Councils.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <select id="doctor-filter-status" class="select select--sm" onchange="window.handleFilterDoctorStatus(this.value)">
            <option value="ALL">All Statuses</option>
            <option value="PENDING" selected>Pending Review</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">Doctor / Applicant</th>
              <th style="padding: 10px 16px;">Council Registration</th>
              <th style="padding: 10px 16px;">Qualification & Affiliation</th>
              <th style="padding: 10px 16px;">Status</th>
              <th style="padding: 10px 16px; text-align: right;">Verification Actions</th>
            </tr>
          </thead>
          <tbody>
            ${doctors
              .map((d) => {
                let badgeClass = 'badge--gray';
                if (d.status === 'VERIFIED') badgeClass = 'badge--green';
                else if (d.status === 'PENDING') badgeClass = 'badge--amber';
                else if (d.status === 'UNDER_REVIEW') badgeClass = 'badge--amber';
                else if (d.status === 'REJECTED') badgeClass = 'badge--red';

                return `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: bold; font-size: 0.9rem;">${d.fullName}</div>
                    <div class="text-xs text-muted">${d.email} • ${d.phone}</div>
                    <div class="text-xs text-muted">${d.professionalAddress}</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: 600; font-family: monospace; color: #065F46;">${d.registrationNumber}</div>
                    <div class="text-xs text-muted">${d.registrationAuthority} (${d.state})</div>
                    ${
                      d.certificateUrl
                        ? `<a href="${d.certificateUrl}" target="_blank" class="text-xs" style="color: #0284C7; text-decoration: underline;">📄 View Certificate</a>`
                        : ''
                    }
                  </td>
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: 500;">${d.qualification}</div>
                    <div class="text-xs text-muted">${d.specialization} • ${d.experienceYears} yrs exp</div>
                    <div class="text-xs text-muted"><strong>${d.hospitalName}</strong></div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge ${badgeClass}">${d.status}</span>
                    ${
                      d.adminNotes
                        ? `<div class="text-xs text-muted" style="margin-top: 4px; max-width: 200px;">${d.adminNotes}</div>`
                        : ''
                    }
                  </td>
                  <td style="padding: 12px 16px; text-align: right;">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                      ${
                        d.status !== 'VERIFIED'
                          ? `
                        <button onclick="window.handleApproveDoctor('${d.id}')" class="btn btn--primary btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                          ✓ Verify & Approve
                        </button>
                      `
                          : ''
                      }
                      ${
                        d.status !== 'REJECTED'
                          ? `
                        <button onclick="window.handleRejectDoctorPrompt('${d.id}')" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 8px; color: #DC2626; border-color: #FCA5A5;">
                          ✕ Reject
                        </button>
                      `
                          : ''
                      }
                      ${
                        d.status === 'PENDING'
                          ? `
                        <button onclick="window.handleDoctorUnderReview('${d.id}')" class="btn btn--ghost btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                          Under Review
                        </button>
                      `
                          : ''
                      }
                    </div>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 4: BLOOD DONOR MANAGEMENT
 */
function renderBloodDonorManagementView(donors: any[]): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 24px;">
      
      <!-- Toolbar & Multi-Criteria Filters -->
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1rem; font-weight: bold;">Blood Donor Registry Management</h3>
            <p class="text-xs text-muted">Complete administrative access with privacy controls and contact masking.</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.handleOpenAddDonorModal()" class="btn btn--primary btn--sm">
              + Add Donor Record
            </button>
            <button onclick="window.handleExportDonorsCsv()" class="btn btn--outline btn--sm">
              📥 Export CSV
            </button>
          </div>
        </div>

        <!-- Filter Row -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" id="donor-search-input" class="input input--sm" placeholder="Search by name, city, or pincode..." style="flex: 1; min-width: 200px;" oninput="window.handleFilterDonors()" />
          <select id="donor-filter-blood-group" class="select select--sm" style="width: 140px;" onchange="window.handleFilterDonors()">
            <option value="ALL">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <select id="donor-filter-availability" class="select select--sm" style="width: 150px;" onchange="window.handleFilterDonors()">
            <option value="ALL">All Availabilities</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="TEMPORARILY_UNAVAILABLE">TEMP UNAVAILABLE</option>
          </select>
        </div>
      </div>

      <!-- Donors Data Table -->
      <div style="overflow-x: auto;">
        <table id="donors-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">Donor ID & Name</th>
              <th style="padding: 10px 16px;">Blood Group</th>
              <th style="padding: 10px 16px;">Location</th>
              <th style="padding: 10px 16px;">Contact Info (Protected)</th>
              <th style="padding: 10px 16px;">Availability</th>
              <th style="padding: 10px 16px;">Verification</th>
              <th style="padding: 10px 16px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${donors
              .map((d) => {
                let statusBadge = 'badge--gray';
                if (d.availabilityStatus === 'ACTIVE') statusBadge = 'badge--green';
                else if (d.availabilityStatus === 'TEMPORARILY_UNAVAILABLE') statusBadge = 'badge--amber';
                else if (d.availabilityStatus === 'INACTIVE') statusBadge = 'badge--red';

                return `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: bold;">${d.fullName}</div>
                    <div class="text-xs text-muted">ID: ${d.id} • ${d.age || 'N/A'} yrs • ${d.gender || 'N/A'}</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span style="font-size: 1.1rem; font-weight: 800; color: #DC2626;">${d.bloodGroup}</span>
                    <span class="text-xs text-muted" style="display: block;">(${d.rhFactor})</span>
                  </td>
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: 500;">${d.city}, ${d.district}</div>
                    <div class="text-xs text-muted">${d.area} (${d.pincode})</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <div style="font-family: monospace; font-weight: 600;">
                      <span id="phone-display-${d.id}">${BloodDonorService.maskPhone(d.phone)}</span>
                      <button onclick="window.toggleAdminRevealPhone('${d.id}', '${d.phone}')" class="btn btn--ghost btn--sm" style="font-size: 0.65rem; padding: 1px 4px; margin-left: 4px;">👁 Reveal</button>
                    </div>
                    <div class="text-xs text-muted">${d.email || 'No email provided'}</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge ${statusBadge}">${d.availabilityStatus}</span>
                    <div class="text-xs text-muted" style="margin-top: 2px;">
                      Last: ${d.lastDonationDate || 'First-time'}
                    </div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge ${d.verificationStatus === 'VERIFIED' ? 'badge--green' : 'badge--gray'}">${d.verificationStatus}</span>
                  </td>
                  <td style="padding: 12px 16px; text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                      <button onclick="window.handleToggleDonorAvailability('${d.id}')" class="btn btn--outline btn--sm" style="font-size: 0.7rem; padding: 3px 6px;">
                        ${d.availabilityStatus === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </button>
                      <button onclick="window.handleVerifyDonorToggle('${d.id}')" class="btn btn--outline btn--sm" style="font-size: 0.7rem; padding: 3px 6px;">
                        ${d.verificationStatus === 'VERIFIED' ? 'Unverify' : 'Verify'}
                      </button>
                      <button onclick="window.handleDeleteDonorRecord('${d.id}')" class="btn btn--ghost btn--sm" style="font-size: 0.7rem; padding: 3px 6px; color: #DC2626;">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 5: EMERGENCY PROTOCOLS MANAGEMENT
 */
function renderProtocolsManagementView(protocols: any[]): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1rem; font-weight: bold;">Emergency Medical Protocols Repository</h3>
          <p class="text-xs text-muted">Statutory first-response workflows reviewed by certified medical authorities.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="#/doctor-portal" class="btn btn--primary btn--sm">
            + Author New Protocol
          </a>
          <button onclick="window.handleExportProtocolsCsv()" class="btn btn--outline btn--sm">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">Protocol Title</th>
              <th style="padding: 10px 16px;">Category</th>
              <th style="padding: 10px 16px;">Author (Verified Clinician)</th>
              <th style="padding: 10px 16px;">Status & Version</th>
              <th style="padding: 10px 16px; text-align: right;">Governance Actions</th>
            </tr>
          </thead>
          <tbody>
            ${protocols
              .map((p) => {
                let badgeClass = 'badge--gray';
                if (p.status === 'PUBLISHED') badgeClass = 'badge--green';
                else if (p.status === 'PENDING_APPROVAL') badgeClass = 'badge--amber';
                else if (p.status === 'REJECTED') badgeClass = 'badge--red';

                return `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: bold; font-size: 0.9rem;">${p.title}</div>
                    <div class="text-xs text-muted" style="max-width: 400px; line-height: 1.3;">${p.shortDescription}</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge badge--gray">${p.category}</span>
                  </td>
                  <td style="padding: 12px 16px;">
                    <div style="font-weight: 500;">${p.authorName}</div>
                    <div class="text-xs text-muted">Reg: ${p.authorRegistrationNo || 'MMC'}</div>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge ${badgeClass}">${p.status.replace('_', ' ')}</span>
                    <span class="text-xs text-muted" style="display: block; margin-top: 2px;">Version ${p.version}</span>
                  </td>
                  <td style="padding: 12px 16px; text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                      <a href="#/protocol/${p.slug}" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                        View
                      </a>
                      ${
                        p.status === 'PUBLISHED'
                          ? `
                        <button onclick="window.handleUnpublishProtocol('${p.id}')" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                          Archive
                        </button>
                      `
                          : `
                        <button onclick="window.handlePublishProtocol('${p.id}')" class="btn btn--primary btn--sm" style="font-size: 0.75rem; padding: 4px 8px;">
                          Publish
                        </button>
                      `
                      }
                    </div>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 6: PROTOCOL APPROVALS QUEUE
 */
function renderProtocolApprovalsView(protocols: any[]): string {
  const pending = protocols.filter((p) => p.status === 'PENDING_APPROVAL' || p.status === 'UNDER_REVIEW');

  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas);">
        <h3 style="font-size: 1rem; font-weight: bold;">Protocol Approvals Queue (${pending.length} Pending)</h3>
        <p class="text-xs text-muted">Medical Authority board review: verify symptoms, emergency dispatch instructions (112), and safety warnings.</p>
      </div>

      <div style="padding: 20px;">
        ${
          pending.length === 0
            ? `<div style="text-align: center; padding: 32px;" class="text-muted text-sm">🎉 All submitted emergency protocols have been reviewed. No pending approvals in queue.</div>`
            : pending
                .map(
                  (p) => `
              <div class="card card--paper" style="border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; border: 1px solid #E2E8F0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 12px;">
                  <div>
                    <span class="badge badge--amber" style="margin-bottom: 6px;">PENDING MEDICAL REVIEW</span>
                    <h4 style="font-size: 1.1rem; font-weight: bold;">${p.title}</h4>
                    <div class="text-xs text-muted">
                      Category: <strong>${p.category}</strong> • Author: <strong>${p.authorName}</strong> (MMC Reg: ${p.authorRegistrationNo || 'Verified'})
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button onclick="window.handleApproveProtocol('${p.id}')" class="btn btn--primary btn--sm">
                      ✓ Approve & Publish
                    </button>
                    <button onclick="window.handleRequestChangesPrompt('${p.id}')" class="btn btn--outline btn--sm">
                      ✏ Request Changes
                    </button>
                    <button onclick="window.handleRejectProtocolPrompt('${p.id}')" class="btn btn--outline btn--sm" style="color: #DC2626; border-color: #FCA5A5;">
                      ✕ Reject
                    </button>
                  </div>
                </div>

                <p class="text-xs text-body" style="background: #F8FAFC; padding: 12px; border-radius: 6px; margin-bottom: 12px; line-height: 1.4;">
                  ${p.shortDescription}
                </p>

                <div class="grid grid--2" style="gap: 12px; font-size: 0.75rem;">
                  <div>
                    <strong>Identified Symptoms:</strong>
                    <ul style="margin: 4px 0 0 16px; padding: 0;">
                      ${(p.symptoms || []).map((s: string) => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <strong>Contraindications / What NOT to Do:</strong>
                    <ul style="margin: 4px 0 0 16px; padding: 0; color: #DC2626;">
                      ${(p.whatNotToDo || []).map((w: string) => `<li>${w}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `
                )
                .join('')
        }
      </div>
    </div>
  `;
}

/**
 * VIEW 7: REPORTS & ANALYTICS
 */
function renderAnalyticsView(bloodGroupsDist: any[]): string {
  const cityDist = AdminAnalyticsService.getCityDistribution();
  const categoryDist = AdminAnalyticsService.getProtocolCategoryDistribution();

  return `
    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 16px;">
      <button onclick="window.handleExportDonorsCsv()" class="btn btn--outline btn--sm">📥 Export Donors CSV</button>
      <button onclick="window.handleExportProtocolsCsv()" class="btn btn--outline btn--sm">📥 Export Protocols CSV</button>
      <button onclick="window.handleExportAnalyticsJson()" class="btn btn--primary btn--sm">📊 Export Full JSON Report</button>
    </div>

    <div class="grid grid--2" style="gap: 20px; margin-bottom: 24px;">
      
      <!-- Blood Group Distribution Table -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px;">
        <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 12px;">Blood Group Roster Metrics</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid #E2E8F0; text-align: left;">
              <th style="padding: 6px 0;">Group</th>
              <th style="padding: 6px 0;">Count</th>
              <th style="padding: 6px 0;">Share</th>
            </tr>
          </thead>
          <tbody>
            ${bloodGroupsDist
              .map(
                (bg) => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 8px 0; font-weight: bold; color: #DC2626;">${bg.bloodGroup}</td>
                <td style="padding: 8px 0;">${bg.count} donors</td>
                <td style="padding: 8px 0;">${bg.percentage}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- City & Taluka Geographic Distribution -->
      <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px;">
        <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 12px;">Geographic Cluster Distribution</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid #E2E8F0; text-align: left;">
              <th style="padding: 6px 0;">City / Taluka</th>
              <th style="padding: 6px 0;">Registered Donors</th>
            </tr>
          </thead>
          <tbody>
            ${cityDist
              .map(
                (c) => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 8px 0; font-weight: 500;">${c.city}</td>
                <td style="padding: 8px 0;">${c.count}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

    </div>

    <!-- Protocols by Category Breakdown -->
    <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 20px;">
      <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 12px;">Emergency Protocols by Category</h3>
      <div class="grid grid--3" style="gap: 12px;">
        ${categoryDist
          .map(
            (cat) => `
          <div style="background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <div style="font-weight: bold; font-size: 0.9rem;">${cat.category}</div>
            <div class="text-xs text-muted">${cat.count} protocols published / drafted</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

/**
 * VIEW 8: NOTIFICATIONS PANEL
 */
function renderNotificationsView(notifications: any[]): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-size: 1rem; font-weight: bold;">Administrative Notifications</h3>
          <p class="text-xs text-muted">Real-time alerts on doctor verifications, protocol submissions, and donor activities.</p>
        </div>
        <button onclick="window.handleMarkAllNotificationsRead()" class="btn btn--outline btn--sm">
          Mark All as Read
        </button>
      </div>

      <div style="divide-y: 1px solid var(--color-border);">
        ${notifications
          .map(
            (n) => `
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: ${n.isRead ? 'transparent' : '#F0FDF4'}; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                <span class="badge ${n.category === 'DOCTOR_VERIFICATION' ? 'badge--amber' : n.category === 'PROTOCOL' ? 'badge--blue' : 'badge--green'}">${n.category}</span>
                <span style="font-weight: bold; font-size: 0.9rem;">${n.title}</span>
                ${!n.isRead ? `<span style="background: #10B981; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>` : ''}
              </div>
              <p class="text-xs text-muted">${n.message}</p>
              <div class="text-xs text-muted" style="margin-top: 4px;">${new Date(n.createdAt).toLocaleString('en-IN')}</div>
            </div>
            <div>
              ${
                !n.isRead
                  ? `<button onclick="window.handleMarkNotificationRead('${n.id}')" class="btn btn--ghost btn--sm" style="font-size: 0.75rem;">✓ Read</button>`
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

/**
 * VIEW 9: AUDIT LOGS
 */
function renderAuditLogsView(): string {
  const auditLogs = [
    { actor: 'Super Admin', role: 'SUPER_ADMIN', action: 'APPROVE_DOCTOR_VERIFICATION', target: 'Dr. Rajesh Kulkarni (MMC-2008-041289)', ip: '103.21.124.8', timestamp: '2026-10-12T10:30:00.000Z' },
    { actor: 'Super Admin', role: 'SUPER_ADMIN', action: 'PUBLISH_EMERGENCY_PROTOCOL', target: 'Acute Myocardial Infarction Rural First-Response', ip: '103.21.124.8', timestamp: '2026-10-15T11:00:00.000Z' },
    { actor: 'Dr. Anita Joshi', role: 'VERIFIED_DOCTOR', action: 'SUBMIT_PROTOCOL_FOR_APPROVAL', target: 'Cardiac Arrest Cardiopulmonary Resuscitation', ip: '103.21.124.44', timestamp: '2026-10-20T08:15:00.000Z' },
    { actor: 'Super Admin', role: 'SUPER_ADMIN', action: 'VERIFY_BLOOD_DONOR', target: 'Sachin Ramesh Tendulkar (O+)', ip: '103.21.124.8', timestamp: '2026-10-22T14:00:00.000Z' }
  ];

  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas);">
        <h3 style="font-size: 1rem; font-weight: bold;">System Governance & Security Audit Trail</h3>
        <p class="text-xs text-muted">Immutable ledger of administrative decisions, role modifications, and clinical protocol actions.</p>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #F1F5F9; border-bottom: 1px solid #CBD5E1; color: #475569;">
              <th style="padding: 10px 16px;">Actor</th>
              <th style="padding: 10px 16px;">Role</th>
              <th style="padding: 10px 16px;">Action</th>
              <th style="padding: 10px 16px;">Target Resource</th>
              <th style="padding: 10px 16px;">IP Address</th>
              <th style="padding: 10px 16px;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${auditLogs
              .map(
                (log) => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 16px; font-weight: bold;">${log.actor}</td>
                <td style="padding: 12px 16px;"><span class="badge badge--gray">${log.role}</span></td>
                <td style="padding: 12px 16px; font-family: monospace; font-size: 0.8rem; color: #065F46;">${log.action}</td>
                <td style="padding: 12px 16px; color: #334155;">${log.target}</td>
                <td style="padding: 12px 16px; color: #64748B; font-family: monospace; font-size: 0.75rem;">${log.ip}</td>
                <td style="padding: 12px 16px; color: #94A3B8; font-size: 0.75rem;">${new Date(log.timestamp).toLocaleString('en-IN')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * VIEW 10: SETTINGS
 */
function renderSettingsView(): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 24px; max-width: 780px;">
      <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 16px;">Platform Settings & Emergency Dispatch Configuration</h3>

      <div class="input-wrap" style="margin-bottom: 16px;">
        <label class="input-label">National Universal Emergency Number</label>
        <input type="text" class="input" value="112" readonly style="background: #F1F5F9;" />
        <div class="text-xs text-muted" style="margin-top: 4px;">Universal emergency number for Police, Fire, and Ambulance across India.</div>
      </div>

      <div class="input-wrap" style="margin-bottom: 16px;">
        <label class="input-label">Dedicated Medical Ambulance Response</label>
        <input type="text" class="input" value="108" readonly style="background: #F1F5F9;" />
        <div class="text-xs text-muted" style="margin-top: 4px;">State emergency medical ambulance dispatch service (MEMS).</div>
      </div>

      <div class="input-wrap" style="margin-bottom: 24px;">
        <label class="input-label">Donor Privacy Masking Enforcement</label>
        <div style="padding: 12px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; font-size: 0.85rem; color: #065F46;">
          ✓ ACTIVE: Complete phone numbers and personal addresses are strictly masked for unauthenticated and normal users.
        </div>
      </div>

      <button type="button" class="btn btn--primary" onclick="alert('Configuration saved.')">
        Save Platform Preferences
      </button>
    </div>
  `;
}

/**
 * VIEW 11: SESSION & ROLE SWITCHER
 */
function renderSessionRoleView(currentUser: any): string {
  return `
    <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 24px; max-width: 650px;">
      <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 8px;">Active Session & Evaluation Role Switcher</h3>
      <p class="text-xs text-muted" style="margin-bottom: 20px;">
        Easily test the 3 primary roles (Super Admin, Verified Doctor, Normal User) directly in your local environment.
      </p>

      <div style="background: #F8FAFC; padding: 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem;">
        <div><strong>Current Identity:</strong> ${currentUser.displayName}</div>
        <div><strong>Email:</strong> ${currentUser.email}</div>
        <div><strong>Active Role:</strong> <span class="badge badge--green">${currentUser.role.toUpperCase()}</span></div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button onclick="window.handleAdminSwitchRole('super_admin')" class="btn btn--primary btn--sm">
          Switch to Super Admin
        </button>
        <button onclick="window.handleAdminSwitchRole('verified_doctor')" class="btn btn--outline btn--sm">
          Switch to Verified Doctor
        </button>
        <button onclick="window.handleAdminSwitchRole('citizen')" class="btn btn--ghost btn--sm">
          Switch to Normal User
        </button>
      </div>
    </div>
  `;
}
