import { CommunityService } from '../services/communityService';

export function renderDonorsPage(): string {
  const donors = CommunityService.getActiveDonors();

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 840px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            VOLUNTARY BLOOD DONOR DIRECTORY
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Community Blood Donors
          </h1>
          <p class="text-base text-muted">
            Voluntary, consent-based blood donor registry for rural emergency preparedness.
          </p>
        </div>

        <!-- Privacy & Medical Safety Notice -->
        <div class="card card--red" style="border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-danger-dark); text-transform: uppercase;">
            🛡️ Privacy & Medical Compatibility Notice
          </div>
          <div class="text-xs text-body" style="margin-top: 4px; line-height: var(--leading-normal);">
            Personal addresses and phone numbers are never published publicly. All donor eligibility, blood typing, and cross-matching must be officially verified at a licensed hospital or blood bank prior to transfusion.
          </div>
        </div>

        <!-- Registration & Filter Bar Bento -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-size: var(--text-base); font-weight: bold;">Want to Help Save Lives?</h3>
            <p class="text-xs text-muted">Register voluntarily. You can pause or withdraw your listing at any time.</p>
          </div>
          <button type="button" class="btn btn--emergency btn--sm" onclick="window.toggleDonorRegistrationForm()">
            + Register as Voluntary Donor
          </button>
        </div>

        <!-- Registration Form (Hidden by default) -->
        <form id="donor-reg-form" style="display: none; background: var(--color-canvas); padding: var(--space-lg); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); border: 1px solid var(--color-gray-200);" onsubmit="window.handleDonorRegistration(event)">
          <div class="grid grid--2" style="margin-bottom: var(--space-md);">
            <div class="input-wrap">
              <label class="input-label" for="donor-blood-group" style="font-size: var(--text-xs);">Blood Group</label>
              <select id="donor-blood-group" class="select">
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
            <div class="input-wrap">
              <label class="input-label" for="donor-broad-area" style="font-size: var(--text-xs);">Broad Locality / Taluka</label>
              <input type="text" id="donor-broad-area" class="input" placeholder="e.g. Khed Taluka / Manchar Sector" required />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn--ghost btn--sm" onclick="window.toggleDonorRegistrationForm()">Cancel</button>
            <button type="submit" class="btn btn--primary btn--sm">Complete Registration</button>
          </div>
        </form>

        <!-- Donors Roster Grid -->
        <div class="grid grid--2" style="margin-bottom: var(--space-2xl);">
          ${donors
            .map(
              (d) => `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
              <div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 1.75rem; font-weight: 800; color: var(--color-danger);">${d.bloodGroup}</span>
                  <span class="badge ${d.isAvailable ? 'badge--green' : 'badge--paper'}">
                    ${d.isAvailable ? '🟢 Available' : '⏸️ Paused'}
                  </span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px;">
                  📍 ${d.broadArea} • Contact: ${d.contactPreference === 'in_app' ? 'In-App Secure Request' : 'Masked Phone'}
                </div>
              </div>
              <div>
                <button type="button" class="btn btn--outline btn--sm" onclick="window.handleRequestDonorContact('${d.id}')">
                  Request
                </button>
              </div>
            </div>
          `
            )
            .join('')}
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
