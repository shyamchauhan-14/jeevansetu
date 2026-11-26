import { BloodDonorService } from '../services/bloodDonorService';
import { AuthService } from '../services/authService';

export function renderDonorsPage(): string {
  const currentUser = AuthService.getCurrentUser();
  const publicDonors = BloodDonorService.getPublicDonors();
  const myProfile = BloodDonorService.getByUserId(currentUser.id);

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 920px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            VOLUNTARY COMMUNITY BLOOD DONOR NETWORK
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Community Blood Donors
          </h1>
          <p class="text-base text-muted">
            Voluntary, consent-based emergency blood donor registry for rural healthcare centers and critical transfers.
          </p>
        </div>

        <!-- Privacy & Medical Safety Notice -->
        <div class="card card--red" style="border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-danger-dark); text-transform: uppercase;">
            🛡️ Privacy & Medical Compatibility Notice
          </div>
          <div class="text-xs text-body" style="margin-top: 4px; line-height: var(--leading-normal);">
            Personal addresses and full phone numbers are strictly protected and never publicly exposed. All donor eligibility, blood typing, and serological cross-matching must be verified at a licensed hospital or blood bank prior to transfusion.
          </div>
        </div>

        ${
          myProfile
            ? `
          <!-- My Registered Donor Profile Banner -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl); border-left: 6px solid #10B981; background: #F0FDF4;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <div class="badge badge--green" style="margin-bottom: 4px;">YOUR REGISTERED DONOR PROFILE</div>
                <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 2px;">
                  ${myProfile.fullName} <span style="color: #DC2626;">(${myProfile.bloodGroup} ${myProfile.rhFactor})</span>
                </h3>
                <div class="text-xs text-muted">
                  📍 ${myProfile.city}, ${myProfile.district} • Contact: ${myProfile.preferredContactMethod.replace('_', ' ')} • Status: <strong>${myProfile.availabilityStatus}</strong>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn ${myProfile.availabilityStatus === 'ACTIVE' ? 'btn--outline' : 'btn--primary'} btn--sm" onclick="window.handleToggleMyDonorStatus('${myProfile.id}')">
                  ${myProfile.availabilityStatus === 'ACTIVE' ? '⏸️ Pause My Availability' : '🟢 Activate Availability'}
                </button>
                <button type="button" class="btn btn--ghost btn--sm" style="color: #DC2626;" onclick="window.handleWithdrawDonorRegistration('${myProfile.id}')">
                  Withdraw Profile
                </button>
              </div>
            </div>
          </div>
        `
            : `
          <!-- Registration Bento Box -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="font-size: var(--text-base); font-weight: bold;">Want to Help Save Lives in Emergencies?</h3>
              <p class="text-xs text-muted">Register voluntarily as a blood donor. You control your availability and can withdraw at any time.</p>
            </div>
            <button type="button" class="btn btn--emergency btn--sm" onclick="window.toggleDonorRegistrationForm()">
              + Register as Voluntary Donor
            </button>
          </div>
        `
        }

        <!-- Registration Form (Modal or expandable) -->
        <form id="donor-reg-form" style="display: none; background: var(--color-canvas); padding: var(--space-xl); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); border: 1px solid var(--color-gray-200);" onsubmit="window.handleDonorRegistration(event)">
          <div style="margin-bottom: 16px;">
            <h3 class="text-h3" style="color: #DC2626; margin-bottom: 4px;">Become a Voluntary Blood Donor</h3>
            <p class="text-xs text-muted">Your contact information will be masked and guarded by role-based privacy policies.</p>
          </div>

          <div class="grid grid--2" style="gap: 16px; margin-bottom: 16px;">
            <div class="input-wrap">
              <label class="input-label" for="reg-donor-name">Full Name *</label>
              <input type="text" id="reg-donor-name" class="input" value="${currentUser.displayName || ''}" placeholder="Full Name" required />
            </div>
            <div class="input-wrap">
              <label class="input-label" for="reg-donor-phone">Mobile Phone Number *</label>
              <input type="tel" id="reg-donor-phone" class="input" placeholder="+91 98220 12345" required />
            </div>
          </div>

          <div class="grid grid--3" style="gap: 16px; margin-bottom: 16px;">
            <div class="input-wrap">
              <label class="input-label" for="donor-blood-group">Blood Group *</label>
              <select id="donor-blood-group" class="select" required>
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
              <label class="input-label" for="reg-donor-age">Age (Years) *</label>
              <input type="number" id="reg-donor-age" class="input" min="18" max="65" value="28" required />
            </div>
            <div class="input-wrap">
              <label class="input-label" for="reg-donor-gender">Gender</label>
              <select id="reg-donor-gender" class="select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div class="grid grid--3" style="gap: 16px; margin-bottom: 16px;">
            <div class="input-wrap">
              <label class="input-label" for="reg-donor-district">District *</label>
              <input type="text" id="reg-donor-district" class="input" value="Pune" required />
            </div>
            <div class="input-wrap">
              <label class="input-label" for="reg-donor-city">City / Taluka *</label>
              <input type="text" id="reg-donor-city" class="input" placeholder="e.g. Khed / Junnar / Manchar" required />
            </div>
            <div class="input-wrap">
              <label class="input-label" for="donor-broad-area">Area / Locality / Pincode *</label>
              <input type="text" id="donor-broad-area" class="input" placeholder="e.g. Rajgurunagar Sector 2" required />
            </div>
          </div>

          <div class="input-wrap" style="margin-bottom: 20px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.85rem;">
              <input type="checkbox" id="reg-donor-consent" required style="margin-top: 3px;" />
              <span>
                <strong>Mandatory Consent:</strong> I voluntarily consent to be contacted by verified healthcare coordinators and emergency responders for blood donation requests. I understand my phone number will be masked in public directories.
              </span>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn--ghost btn--sm" onclick="window.toggleDonorRegistrationForm()">Cancel</button>
            <button type="submit" class="btn btn--primary btn--sm">Submit Voluntary Registration</button>
          </div>
        </form>

        <!-- Donors Roster Filter Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: var(--space-lg);">
          <div style="font-weight: bold; font-size: 1.1rem;">
            Active Donors in Network (${publicDonors.length})
          </div>
          <div style="display: flex; gap: 8px;">
            <select id="user-donor-filter-bg" class="select select--sm" onchange="window.handleFilterUserDonors(this.value)">
              <option value="ALL">All Blood Groups</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <!-- Donors Roster Grid -->
        <div id="user-donors-grid" class="grid grid--2" style="gap: 16px; margin-bottom: var(--space-2xl);">
          ${publicDonors
            .map(
              (d) => `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid var(--color-border);">
              <div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 1.75rem; font-weight: 800; color: #DC2626;">${d.bloodGroup}</span>
                  <span class="badge ${d.availabilityStatus === 'ACTIVE' ? 'badge--green' : 'badge--paper'}">
                    ${d.availabilityStatus === 'ACTIVE' ? '🟢 Available' : '⏸️ Paused'}
                  </span>
                  ${d.verificationStatus === 'VERIFIED' ? `<span class="badge badge--gray">✓ Verified</span>` : ''}
                </div>
                <div style="font-weight: 600; font-size: 0.95rem; margin-top: 4px;">
                  ${d.fullName}
                </div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px;">
                  📍 ${d.broadLocality} • ${d.maskedPhone}
                </div>
                <div class="text-xs text-muted" style="margin-top: 2px;">
                  Last Donation: ${d.lastDonationDate || 'First-time donor'}
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
