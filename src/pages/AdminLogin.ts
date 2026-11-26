export function renderAdminLoginPage(initialRole: 'super_admin' | 'doctor' = 'super_admin'): string {
  return `
    <div class="page-content" style="background: #F8FAFC; min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 40px 16px;">
      <div class="container" style="max-width: 520px; width: 100%;">
        
        <!-- Brand Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #064E3B; border-radius: 16px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.2);">
            <span style="font-size: 1.8rem;">🛡️</span>
          </div>
          <div class="badge badge--red" style="margin-bottom: 8px;">
            RESTRICTED ACCESS • Super Administrator Role Required
          </div>
          <h1 class="text-h2" style="color: #0F172A; margin-bottom: 4px;">JeevanSetu Authority Portal</h1>
          <p class="text-xs text-muted">Role-Based Authentication & Clinical Governance Console</p>
        </div>

        <!-- Role Selector Tab Pills -->
        <div style="display: flex; background: #E2E8F0; padding: 4px; border-radius: 12px; margin-bottom: 20px;">
          <button 
            type="button" 
            id="tab-btn-superadmin" 
            class="btn ${initialRole === 'super_admin' ? 'btn--primary' : 'btn--ghost'} btn--sm" 
            style="flex: 1; border-radius: 8px; font-weight: bold; font-size: 0.85rem; padding: 8px 12px; ${initialRole === 'super_admin' ? 'background: #064E3B; color: white;' : 'color: #475569;'}"
            onclick="window.switchLoginTab('super_admin')"
          >
            🛡️ Super Admin
          </button>
          <button 
            type="button" 
            id="tab-btn-doctor" 
            class="btn ${initialRole === 'doctor' ? 'btn--primary' : 'btn--ghost'} btn--sm" 
            style="flex: 1; border-radius: 8px; font-weight: bold; font-size: 0.85rem; padding: 8px 12px; ${initialRole === 'doctor' ? 'background: #064E3B; color: white;' : 'color: #475569;'}"
            onclick="window.switchLoginTab('doctor')"
          >
            🩺 Verified Doctor
          </button>
        </div>

        <!-- Card Container -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03); border: 1px solid #E2E8F0;">
          
          <!-- SUPER ADMIN LOGIN FORM -->
          <div id="login-form-superadmin" style="display: ${initialRole === 'super_admin' ? 'block' : 'none'};">
            <div style="margin-bottom: 20px;">
              <span class="badge badge--green" style="margin-bottom: 6px;">SUPER ADMIN ACCESS</span>
              <h2 style="font-size: 1.25rem; font-weight: bold; color: #1E293B; margin-bottom: 4px;">Administrator Sign In</h2>
              <p class="text-xs text-muted">Access doctor approvals, clinical emergency protocols, and donor governance.</p>
            </div>

            <form onsubmit="window.handleSuperAdminLogin(event)">
              <div class="input-wrap" style="margin-bottom: 16px;">
                <label class="input-label" for="admin-login-email">Administrator Email *</label>
                <input 
                  type="email" 
                  id="admin-login-email" 
                  class="input" 
                  placeholder="admin@jeevansetu.med" 
                  value="admin@jeevansetu.med" 
                  required 
                />
              </div>

              <div class="input-wrap" style="margin-bottom: 20px;">
                <label class="input-label" for="admin-login-password">Password / Access Key *</label>
                <input 
                  type="password" 
                  id="admin-login-password" 
                  class="input" 
                  placeholder="••••••••" 
                  value="Admin@123" 
                  required 
                />
              </div>

              <button type="submit" class="btn btn--primary" style="width: 100%; margin-bottom: 16px; background: #064E3B; border-color: #064E3B; font-weight: bold; padding: 12px;">
                Sign In to Admin Dashboard →
              </button>
            </form>

            <!-- Quick Autofill Helper for Evaluation -->
            <div style="background: #F1F5F9; padding: 12px 14px; border-radius: 8px; border: 1px dashed #CBD5E1; text-align: center;">
              <div class="text-xs text-muted" style="margin-bottom: 6px;">
                <strong>Demo Credentials:</strong> <code>admin@jeevansetu.med</code> • <code>Admin@123</code>
              </div>
              <button type="button" onclick="window.autofillSuperAdminLogin()" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 3px 10px;">
                ⚡ Auto-Fill & Log In as Super Admin
              </button>
            </div>
          </div>

          <!-- VERIFIED DOCTOR LOGIN FORM -->
          <div id="login-form-doctor" style="display: ${initialRole === 'doctor' ? 'block' : 'none'};">
            <div style="margin-bottom: 20px;">
              <span class="badge badge--blue" style="margin-bottom: 6px;">MEDICAL AUTHORITY ACCESS</span>
              <h2 style="font-size: 1.25rem; font-weight: bold; color: #1E293B; margin-bottom: 4px;">Doctor & Clinician Sign In</h2>
              <p class="text-xs text-muted">Author clinical first-response protocols and manage professional credentials.</p>
            </div>

            <form onsubmit="window.handleDoctorLogin(event)">
              <div class="input-wrap" style="margin-bottom: 16px;">
                <label class="input-label" for="doc-login-id">Council Registration No. or Registered Email *</label>
                <input 
                  type="text" 
                  id="doc-login-id" 
                  class="input" 
                  placeholder="e.g. MMC-2008-041289 or dr.rajesh@..." 
                  value="MMC-2008-041289" 
                  required 
                />
                <div class="text-xs text-muted" style="margin-top: 3px;">Maharashtra Medical Council or NMC statutory registry identifier.</div>
              </div>

              <div class="input-wrap" style="margin-bottom: 20px;">
                <label class="input-label" for="doc-login-password">Password *</label>
                <input 
                  type="password" 
                  id="doc-login-password" 
                  class="input" 
                  placeholder="••••••••" 
                  value="Doctor@123" 
                  required 
                />
              </div>

              <button type="submit" class="btn btn--primary" style="width: 100%; margin-bottom: 16px; background: #0284C7; border-color: #0284C7; font-weight: bold; padding: 12px;">
                Sign In to Doctor Portal →
              </button>
            </form>

            <!-- Quick Autofill Helper for Doctor -->
            <div style="background: #F1F5F9; padding: 12px 14px; border-radius: 8px; border: 1px dashed #CBD5E1; text-align: center; margin-bottom: 16px;">
              <div class="text-xs text-muted" style="margin-bottom: 6px;">
                <strong>Verified Doctor:</strong> Dr. Rajesh Kulkarni (<code>MMC-2008-041289</code>)
              </div>
              <button type="button" onclick="window.autofillDoctorLogin()" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 3px 10px;">
                ⚡ Auto-Fill & Log In as Dr. Rajesh
              </button>
            </div>

            <div style="text-align: center; border-top: 1px solid #E2E8F0; padding-top: 14px;">
              <span class="text-xs text-muted">New Medical Practitioner? </span>
              <a href="#/doctor-portal" class="text-xs" style="color: #0284C7; font-weight: bold; text-decoration: underline;">
                Register Credentials for Verification →
              </a>
            </div>
          </div>

        </div>

        <!-- Back to Public App Link -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="#/" class="btn btn--ghost btn--sm" style="color: #64748B;">
            ← Return to Main Application
          </a>
        </div>

      </div>
    </div>
  `;
}
