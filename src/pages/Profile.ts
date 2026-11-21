import { StorageService } from '../services/storageService';

export function renderProfilePage(): string {
  const profile = StorageService.getProfile();
  const records = StorageService.getHealthRecords();

  const recordsHtml = records
    .map((rec) => {
      const provBadge =
        rec.provenance === 'clinician_verified'
          ? '<span class="badge badge--green" style="font-size: 0.72rem;">🩺 Clinician Verified</span>'
          : rec.provenance === 'worker_entered'
          ? '<span class="badge badge--blue" style="font-size: 0.72rem;">👩‍⚕️ Health Worker Entered</span>'
          : '<span class="badge badge--paper" style="font-size: 0.72rem;">👤 Patient Entered</span>';

      return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--color-surface-soft); border-radius: var(--radius-md); margin-bottom: 8px;">
        <div>
          <div style="font-weight: bold; font-size: var(--text-sm);">${rec.title}</div>
          <div class="text-xs text-muted" style="margin-top: 2px;">
            ${rec.recordType.toUpperCase()} • Added ${new Date(rec.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${provBadge}
          <button type="button" class="btn btn--ghost btn--sm" style="color: var(--color-danger); padding: 4px 8px;" onclick="window.handleDeleteHealthRecord('${rec.id}')">🗑️</button>
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 820px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: 16px;">
          <div>
            <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
              <span class="badge-dot badge-dot--pulse"></span>
              DIGITAL HEALTH RECORD (v2.0)
            </div>
            <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
              Personal Health Summary
            </h1>
            <p class="text-base text-muted">
              Manage user-controlled clinical summaries, provenance tracking, and portable medical export.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn btn--primary btn--sm" onclick="window.handleExportHealthSummary()">
              📄 Export Summary (PDF / Print)
            </button>
            <button type="button" class="btn btn--outline btn--sm" style="color: var(--color-danger);" onclick="window.handleDeleteAllUserData()">
              🗑️ Delete My Data
            </button>
          </div>
        </div>

        <!-- Privacy & Provenance Assurance -->
        <div class="card card--green" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg);">
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 1.8rem;">🔒</span>
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark);">USER-CONTROLLED PRIVACY & PROVENANCE GUARANTEE</div>
              <div class="text-xs text-muted" style="margin-top: 2px;">
                You own your medical data. Each record clearly displays who entered it (Patient, ASHA Health Worker, or Clinician).
              </div>
            </div>
          </div>
        </div>

        <!-- Verified Health Records Section -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-xl); margin-bottom: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 8px;">
            <div>
              <div class="section-label" style="margin-bottom: 2px;">RECORD ITEMS & PROVENANCE</div>
              <h3 style="font-size: var(--text-h5); font-weight: bold;">Verified Health Conditions & Allergies</h3>
            </div>
            <button type="button" class="btn btn--outline btn--sm" onclick="window.toggleAddRecordForm()">
              + Add Health Item
            </button>
          </div>

          <!-- Add Record Form (Hidden by default) -->
          <form id="add-record-form" style="display: none; background: var(--color-canvas); padding: 14px; border-radius: var(--radius-md); margin-bottom: var(--space-md);" onsubmit="window.handleAddRecordSubmit(event)">
            <div class="grid grid--2" style="margin-bottom: 8px;">
              <div class="input-wrap">
                <label class="input-label" for="record-title" style="font-size: var(--text-xs);">Item Title</label>
                <input type="text" id="record-title" class="input" placeholder="e.g. Asthma, Penicillin Allergy..." required />
              </div>
              <div class="input-wrap">
                <label class="input-label" for="record-type" style="font-size: var(--text-xs);">Category</label>
                <select id="record-type" class="select">
                  <option value="allergy">Allergy</option>
                  <option value="condition">Chronic Condition</option>
                  <option value="medication">Ongoing Prescription</option>
                  <option value="visit_note">Health Worker Note</option>
                </select>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button type="button" class="btn btn--ghost btn--sm" onclick="window.toggleAddRecordForm()">Cancel</button>
              <button type="submit" class="btn btn--primary btn--sm">Save Record</button>
            </div>
          </form>

          <div>
            ${records.length > 0 ? recordsHtml : '<div class="text-xs text-muted italic">No health records entered yet. Add one above.</div>'}
          </div>
        </div>

        <!-- Profile Form Bento Card -->
        <form id="profile-form" onsubmit="window.handleProfileSave(event)" class="card card--paper" style="display: flex; flex-direction: column; gap: var(--space-lg); border-radius: var(--radius-xl); padding: var(--space-xl);">
          <div style="font-family: var(--font-display); font-size: var(--text-h5); font-weight: bold;">
            Personal Patient Profile
          </div>

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
