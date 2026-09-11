import { StorageService } from '../services/storageService';

export function renderProfilePage(): string {
  const profile = StorageService.getProfile();

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 780px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            OPTIONAL LOCAL PROFILE
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Medical Profile
          </h1>
          <p class="text-base text-muted">
            Saving your basic medical details helps the AI provide more personalized triage guidance.
          </p>
        </div>

        <!-- Privacy Assurance Banner Bento -->
        <div class="card card--green" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg);">
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 1.8rem;">🔒</span>
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark);">100% PRIVATE & STORED ON THIS DEVICE ONLY</div>
              <div class="text-xs text-muted" style="margin-top: 2px;">
                No account or login required. Your medical information stays completely local in your browser.
              </div>
            </div>
          </div>
        </div>

        <!-- Form Bento Card -->
        <form id="profile-form" onsubmit="window.handleProfileSave(event)" class="card card--paper" style="display: flex; flex-direction: column; gap: var(--space-lg); border-radius: var(--radius-xl); padding: var(--space-xl);">
          
          <div class="grid grid--2">
            <div class="input-wrap">
              <label class="input-label" for="profile-name">Full Name</label>
              <input type="text" id="profile-name" name="name" class="input" value="${profile.name}" required />
            </div>

            <div class="grid grid--2">
              <div class="input-wrap">
                <label class="input-label" for="profile-age">Age</label>
                <input type="number" id="profile-age" name="age" class="input" value="${profile.age}" min="1" max="120" required />
              </div>

              <div class="input-wrap">
                <label class="input-label" for="profile-sex">Sex</label>
                <select id="profile-sex" name="sex" class="select">
                  <option value="male" ${profile.sex === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${profile.sex === 'female' ? 'selected' : ''}>Female</option>
                  <option value="other" ${profile.sex === 'other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="grid grid--3">
            <div class="input-wrap">
              <label class="input-label" for="profile-village">Village / Town</label>
              <input type="text" id="profile-village" name="villageTown" class="input" value="${profile.villageTown}" />
            </div>

            <div class="input-wrap">
              <label class="input-label" for="profile-district">District</label>
              <input type="text" id="profile-district" name="district" class="input" value="${profile.district}" />
            </div>

            <div class="input-wrap">
              <label class="input-label" for="profile-pincode">PIN Code</label>
              <input type="text" id="profile-pincode" name="pincode" class="input" value="${profile.pincode}" />
            </div>
          </div>

          <div class="divider divider--light" style="margin: 0;"></div>

          <div class="grid grid--2">
            <div class="input-wrap">
              <label class="input-label" for="profile-contact-name">Emergency Contact Person</label>
              <input type="text" id="profile-contact-name" name="emergencyContactName" class="input" value="${profile.emergencyContactName}" />
            </div>

            <div class="input-wrap">
              <label class="input-label" for="profile-contact-phone">Emergency Contact Phone</label>
              <input type="tel" id="profile-contact-phone" name="emergencyContactPhone" class="input" value="${profile.emergencyContactPhone}" />
            </div>
          </div>

          <div class="divider divider--light" style="margin: 0;"></div>

          <div class="input-wrap">
            <label class="input-label" for="profile-allergies">Known Drug / Food Allergies</label>
            <input type="text" id="profile-allergies" name="knownAllergies" class="input" value="${profile.knownAllergies}" placeholder="e.g. Penicillin, Sulfa drugs, Peanuts" />
          </div>

          <div class="input-wrap">
            <label class="input-label" for="profile-conditions">Existing Chronic Health Conditions</label>
            <input type="text" id="profile-conditions" name="existingConditions" class="input" value="${profile.existingConditions}" placeholder="e.g. Diabetes, High Blood Pressure, Asthma" />
          </div>

          <div class="input-wrap">
            <label class="input-label" for="profile-medications">Current Daily Medications</label>
            <input type="text" id="profile-medications" name="currentMedications" class="input" value="${profile.currentMedications}" placeholder="e.g. Metformin 500mg, Inhaler" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: var(--space-md);">
            <button type="submit" class="btn btn--primary btn--lg">
              Save Medical Profile ✓
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
