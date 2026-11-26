import { AuthService } from '../services/authService';
import { DoctorVerificationService } from '../services/doctorVerificationService';
import { EmergencyProtocolService } from './../services/emergencyProtocolService';
import { EmergencyCategory } from '../types/health';

export function renderDoctorPortalPage(activeTab = 'protocols'): string {
  const currentUser = AuthService.getCurrentUser();
  const isDoctor = AuthService.isVerifiedDoctor();
  const isSuperAdmin = AuthService.isSuperAdmin();

  // Look up doctor profile for current user
  const doctorProfile = DoctorVerificationService.getByUserId(currentUser.id) ||
    DoctorVerificationService.getAll().find((d) => d.email === currentUser.email);

  // Normal user / Non-doctor view: Show Doctor Registration & Application
  if (!isDoctor && !isSuperAdmin && (!doctorProfile || doctorProfile.status !== 'VERIFIED')) {
    return `
      <div class="page-content">
        <div class="container" style="padding-top: var(--space-xl); padding-bottom: var(--space-3xl); max-width: 840px;">
          
          <div style="margin-bottom: var(--space-xl); text-align: center;">
            <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
              🏥 MEDICAL PROFESSIONAL CREDENTIALING
            </div>
            <h1 class="text-h1" style="margin-bottom: var(--space-xs);">Medical Authority & Doctor Portal</h1>
            <p class="text-base text-muted" style="max-width: 600px; margin: 0 auto;">
              JeevanSetu emergency medical protocols are strictly authored and reviewed by registered medical practitioners with verifiable statutory council credentials.
            </p>
          </div>

          ${
            doctorProfile && doctorProfile.status === 'PENDING'
              ? `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-xl); border-left: 6px solid var(--color-warning); margin-bottom: var(--space-xl);">
              <div style="display: flex; gap: 16px; align-items: flex-start;">
                <span style="font-size: 2rem;">⏳</span>
                <div>
                  <h3 class="text-h3" style="color: #B45309; margin-bottom: 4px;">Verification Application Under Review</h3>
                  <p class="text-sm text-body" style="margin-bottom: 12px;">
                    Your medical credentials registration for <strong>${doctorProfile.fullName}</strong> (${doctorProfile.registrationNumber}) has been received and is pending Super Admin & State Medical Council registry cross-check.
                  </p>
                  <div class="text-xs text-muted" style="background: var(--color-canvas); padding: 12px; border-radius: var(--radius-md);">
                    <div><strong>Registration Authority:</strong> ${doctorProfile.registrationAuthority} (${doctorProfile.state})</div>
                    <div><strong>Qualification:</strong> ${doctorProfile.qualification} • ${doctorProfile.specialization}</div>
                    <div><strong>Affiliated Hospital:</strong> ${doctorProfile.hospitalName}</div>
                    <div><strong>Submitted On:</strong> ${new Date(doctorProfile.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          `
              : doctorProfile && doctorProfile.status === 'REJECTED'
              ? `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-xl); border-left: 6px solid var(--color-danger); margin-bottom: var(--space-xl);">
              <h3 class="text-h3" style="color: var(--color-danger); margin-bottom: 4px;">Application Not Approved</h3>
              <p class="text-sm text-body" style="margin-bottom: 8px;">
                Reason provided: <em>"${doctorProfile.rejectionReason || 'Registration details could not be validated against the State Medical Council live registry.'}"</em>
              </p>
              <p class="text-xs text-muted">You may update your credentials and re-submit your verification application below.</p>
            </div>
          `
              : ''
          }

          <!-- Doctor Registration / Application Form -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: clamp(20px, 4vw, 36px); margin-bottom: var(--space-xl);">
            <h2 class="text-h2" style="margin-bottom: var(--space-xs);">Register as Verified Medical Professional</h2>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-lg);">
              To publish clinical emergency guidance on JeevanSetu, please provide your official medical council registration details.
            </p>

            <form id="doctor-reg-form" onsubmit="window.handleDoctorRegistrationSubmit(event)">
              <div class="grid grid--2" style="gap: 16px; margin-bottom: 16px;">
                <div class="input-wrap">
                  <label class="input-label" for="doc-fullname">Full Name (with Title) *</label>
                  <input type="text" id="doc-fullname" class="input" value="${currentUser.displayName || ''}" placeholder="e.g. Dr. Ramesh Joshi" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-email">Official Email Address *</label>
                  <input type="email" id="doc-email" class="input" value="${currentUser.email || ''}" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-phone">Mobile Number *</label>
                  <input type="tel" id="doc-phone" class="input" placeholder="+91 98220 12345" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-regno">Medical Registration Number *</label>
                  <input type="text" id="doc-regno" class="input" placeholder="e.g. MMC-2015-084920" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-council">Medical Council / Authority *</label>
                  <select id="doc-council" class="select" required>
                    <option value="Maharashtra Medical Council">Maharashtra Medical Council</option>
                    <option value="National Medical Commission (NMC)">National Medical Commission (NMC / MCI)</option>
                    <option value="Delhi Medical Council">Delhi Medical Council</option>
                    <option value="Karnataka Medical Council">Karnataka Medical Council</option>
                    <option value="Other State Medical Council">Other State Medical Council</option>
                  </select>
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-state">State *</label>
                  <input type="text" id="doc-state" class="input" value="Maharashtra" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-qualification">Medical Qualification *</label>
                  <input type="text" id="doc-qualification" class="input" placeholder="e.g. MBBS, MD (Emergency Medicine)" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-specialization">Clinical Specialization *</label>
                  <input type="text" id="doc-specialization" class="input" placeholder="e.g. Emergency Care / Cardiology / Trauma Surgery" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-hospital">Hospital / Clinic / CHC Name *</label>
                  <input type="text" id="doc-hospital" class="input" placeholder="e.g. Rural Hospital Junnar / Primary Health Centre" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="doc-experience">Years of Clinical Experience *</label>
                  <input type="number" id="doc-experience" class="input" min="1" max="50" value="8" required />
                </div>
              </div>

              <div class="input-wrap" style="margin-bottom: 16px;">
                <label class="input-label" for="doc-address">Professional Practice Address</label>
                <input type="text" id="doc-address" class="input" placeholder="Taluka Health Centre / Hospital premises address" />
              </div>

              <div class="input-wrap" style="margin-bottom: 24px;">
                <label class="input-label" for="doc-cert-url">Digital Registration Certificate / Document URL</label>
                <input type="url" id="doc-cert-url" class="input" placeholder="https://example.org/my-council-certificate.pdf" />
                <div class="text-xs text-muted" style="margin-top: 4px;">Note: Independent statutory verification will be conducted by Super Administrators.</div>
              </div>

              <div style="display: flex; gap: 12px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
                <a href="#/" class="btn btn--ghost btn--sm">Cancel</a>
                <button type="submit" class="btn btn--primary">
                  Submit Credentials for Verification
                </button>
              </div>
            </form>
          </div>

          <!-- Doctor Login Helper -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); text-align: center; border: 1px dashed #0284C7;">
            <div class="text-xs text-muted" style="margin-bottom: 8px;">
              <strong>Already a Verified Doctor?</strong> Sign in with your Medical Council credentials:
            </div>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <a href="#/login/doctor" class="btn btn--primary btn--sm" style="background: #0284C7; border-color: #0284C7;">
                🩺 Sign In to Doctor Portal
              </a>
              <button onclick="window.autofillDoctorLogin()" class="btn btn--outline btn--sm">
                ⚡ Instant Doctor Sign-In (Dr. Rajesh Kulkarni)
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Doctor is VERIFIED: Render Verified Doctor Clinical Management Dashboard
  const myProtocols = EmergencyProtocolService.getAll().filter(
    (p) => p.authorId === currentUser.id || p.authorName.includes(currentUser.displayName) || isSuperAdmin
  );

  const categories: EmergencyCategory[] = [
    'Cardiac Emergency',
    'Heart Attack',
    'Stroke',
    'Road Accident',
    'Severe Bleeding',
    'Burns',
    'Choking',
    'Seizures',
    'Allergic Reactions',
    'Poisoning',
    'Fractures',
    'Drowning',
    'Respiratory Emergency',
    'Other Medical Emergencies'
  ];

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 1040px;">
        
        <!-- Doctor Header & Credential Status Banner -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 6px solid var(--color-primary);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge badge--green">✓ VERIFIED MEDICAL AUTHORITY</span>
              <span class="badge badge--gray">MMC Reg: ${doctorProfile?.registrationNumber || 'MMC-2008-041289'}</span>
            </div>
            <h1 class="text-h2" style="margin-bottom: 2px;">
              ${currentUser.displayName || doctorProfile?.fullName || 'Dr. Rajesh Kulkarni'}
            </h1>
            <p class="text-xs text-muted">
              ${doctorProfile?.qualification || 'MBBS, MD (Emergency Medicine)'} • ${doctorProfile?.hospitalName || 'District Sub-Hospital Junnar / Manchar CHC'}
            </p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="window.toggleDoctorCreateProtocolModal()" class="btn btn--primary btn--sm">
              + Author New Emergency Protocol
            </button>
            <a href="#/admin" class="btn btn--outline btn--sm">
              Admin Governance Console
            </a>
            <button onclick="window.handleAdminSignOut()" class="btn btn--outline btn--sm" style="color: #DC2626; border-color: #FCA5A5;">
              🚪 Sign Out
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--color-border); margin-bottom: var(--space-xl);">
          <button class="btn ${activeTab === 'protocols' ? 'btn--primary' : 'btn--ghost'} btn--sm" style="border-radius: var(--radius-md) var(--radius-md) 0 0;" onclick="window.switchDoctorTab('protocols')">
            My Protocols (${myProtocols.length})
          </button>
          <button class="btn ${activeTab === 'author' ? 'btn--primary' : 'btn--ghost'} btn--sm" style="border-radius: var(--radius-md) var(--radius-md) 0 0;" onclick="window.switchDoctorTab('author')">
            Protocol Authoring Studio
          </button>
          <button class="btn ${activeTab === 'profile' ? 'btn--primary' : 'btn--ghost'} btn--sm" style="border-radius: var(--radius-md) var(--radius-md) 0 0;" onclick="window.switchDoctorTab('profile')">
            Medical Profile & Credentials
          </button>
        </div>

        ${
          activeTab === 'protocols'
            ? `
          <!-- Protocols List View -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); overflow: hidden; margin-bottom: var(--space-xl);">
            <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); background: var(--color-canvas); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="font-size: var(--text-base); font-weight: bold;">Authored Clinical Protocols</h3>
                <p class="text-xs text-muted">Emergency first-response workflows authored for public and ASHA worker guidance.</p>
              </div>
              <div class="text-xs text-muted">
                Published protocols undergo Super Admin & Board review.
              </div>
            </div>

            <div style="divide-y: 1px solid var(--color-border);">
              ${
                myProtocols.length === 0
                  ? `<div style="padding: 32px; text-align: center;" class="text-muted text-sm">No protocols authored yet. Click "+ Author New Emergency Protocol" to draft your first clinical workflow.</div>`
                  : myProtocols
                      .map((p) => {
                        let badgeClass = 'badge--gray';
                        if (p.status === 'PUBLISHED') badgeClass = 'badge--green';
                        else if (p.status === 'PENDING_APPROVAL') badgeClass = 'badge--amber';
                        else if (p.status === 'CHANGES_REQUESTED') badgeClass = 'badge--red';

                        return `
                    <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
                      <div style="max-width: 650px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                          <span class="badge ${badgeClass}">${p.status.replace('_', ' ')}</span>
                          <span class="badge badge--gray">${p.category}</span>
                          <span class="text-xs text-muted">v${p.version}</span>
                        </div>
                        <h4 style="font-size: var(--text-base); font-weight: bold; margin-bottom: 4px;">${p.title}</h4>
                        <p class="text-xs text-muted" style="line-height: var(--leading-normal); margin-bottom: 6px;">
                          ${p.shortDescription}
                        </p>
                        ${
                          p.changeRequestNotes
                            ? `<div style="background: #FEF2F2; color: #991B1B; padding: 6px 10px; border-radius: var(--radius-sm); font-size: 0.75rem; margin-top: 4px;">
                                <strong>Admin Change Request:</strong> ${p.changeRequestNotes}
                               </div>`
                            : ''
                        }
                        <div class="text-xs text-muted" style="margin-top: 4px;">
                          Emergency Dial: <strong>112 / 108</strong> • Last Reviewed: ${p.lastReviewedAt ? new Date(p.lastReviewedAt).toLocaleDateString('en-IN') : 'Awaiting review'}
                        </div>
                      </div>
                      <div style="display: flex; gap: 8px;">
                        <a href="#/protocol/${p.slug}" class="btn btn--outline btn--sm">
                          View Live Guide
                        </a>
                        ${
                          p.status === 'DRAFT' || p.status === 'CHANGES_REQUESTED'
                            ? `
                            <button onclick="window.handleSubmitProtocolForApproval('${p.id}')" class="btn btn--primary btn--sm">
                              Submit for Approval
                            </button>
                          `
                            : ''
                        }
                      </div>
                    </div>
                  `;
                      })
                      .join('')
              }
            </div>
          </div>
        `
            : activeTab === 'author'
            ? `
          <!-- Structured Protocol Authoring Studio -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: clamp(20px, 4vw, 36px); margin-bottom: var(--space-xl);">
            <div style="margin-bottom: var(--space-lg);">
              <div class="badge badge--green" style="margin-bottom: 4px;">STRUCTURED CLINICAL WORKFLOW</div>
              <h2 class="text-h2">Author Clinical Emergency Protocol</h2>
              <p class="text-xs text-muted">
                All guidance must adhere to Ministry of Health & Family Welfare (MoHFW) / ICMR first-response guidelines. In India, 112 is the universal emergency response number.
              </p>
            </div>

            <form id="protocol-author-form" onsubmit="window.handleDoctorSaveProtocol(event)">
              <div class="grid grid--2" style="gap: 16px; margin-bottom: 16px;">
                <div class="input-wrap">
                  <label class="input-label" for="proto-title">Protocol Title *</label>
                  <input type="text" id="proto-title" class="input" placeholder="e.g. Acute Myocardial Infarction Rural First-Response" required />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="proto-category">Emergency Category *</label>
                  <select id="proto-category" class="select" required>
                    ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="input-wrap" style="margin-bottom: 16px;">
                <label class="input-label" for="proto-short-desc">Short Summary / Clinical Overview *</label>
                <textarea id="proto-short-desc" class="input" rows="2" placeholder="Brief summary for first responders and public bystanders..." required></textarea>
              </div>

              <div class="grid grid--2" style="gap: 16px; margin-bottom: 16px;">
                <div class="input-wrap">
                  <label class="input-label" for="proto-symptoms">Emergency Symptoms (One per line) *</label>
                  <textarea id="proto-symptoms" class="input" rows="3" placeholder="Crushing central chest pain&#10;Shortness of breath&#10;Cold sweating" required></textarea>
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="proto-warning-signs">Identification / Red Flag Warning Signs (One per line) *</label>
                  <textarea id="proto-warning-signs" class="input" rows="3" placeholder="Loss of consciousness&#10;Cyanosis (blue lips)&#10;Severe hypotensive collapse" required></textarea>
                </div>
              </div>

              <div class="input-wrap" style="margin-bottom: 16px;">
                <label class="input-label" for="proto-safety">Immediate Safety Measures *</label>
                <textarea id="proto-safety" class="input" rows="2" placeholder="Position patient in half-sitting W position. Ensure fresh airflow and loosen tight clothing." required></textarea>
              </div>

              <!-- Step-by-Step Response Guidance -->
              <div class="card card--paper" style="background: var(--color-canvas); padding: 16px; border-radius: var(--radius-lg); margin-bottom: 16px; border: 1px solid var(--color-border);">
                <div style="font-weight: bold; font-size: var(--text-sm); margin-bottom: 8px;">
                  Step-by-Step Clinical Response Steps (Numbered Guidance)
                </div>
                <div id="protocol-steps-container">
                  <div class="grid grid--2" style="gap: 12px; margin-bottom: 10px;">
                    <input type="text" class="input step-title" placeholder="Step 1 Title: e.g. Immediate 112/108 Dispatch" value="Immediate 112 / 108 Emergency Dispatch" required />
                    <input type="text" class="input step-detail" placeholder="Step 1 Detail: e.g. Dial national emergency number 112 immediately." value="Dial 112 or 108 immediately. State exact rural sector and suspected condition." required />
                  </div>
                  <div class="grid grid--2" style="gap: 12px; margin-bottom: 10px;">
                    <input type="text" class="input step-title" placeholder="Step 2 Title" value="Positioning & Reassurance" required />
                    <input type="text" class="input step-detail" placeholder="Step 2 Detail" value="Keep patient calm and seated upright with back supported to reduce myocardial workload." required />
                  </div>
                </div>
              </div>

              <div class="grid grid--2" style="gap: 16px; margin-bottom: 16px;">
                <div class="input-wrap">
                  <label class="input-label" for="proto-not-to-do">What NOT to Do (One per line) *</label>
                  <textarea id="proto-not-to-do" class="input" rows="3" placeholder="DO NOT allow patient to walk or exert&#10;DO NOT give heavy water or food&#10;DO NOT leave patient unattended" required></textarea>
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="proto-when-call">When to Call Emergency Services (112 / 108) *</label>
                  <textarea id="proto-when-call" class="input" rows="3" placeholder="Call 112 immediately without waiting. Every minute of delay worsens ischemic myocardium injury." required></textarea>
                </div>
              </div>

              <div class="grid grid--2" style="gap: 16px; margin-bottom: 24px;">
                <div class="input-wrap">
                  <label class="input-label" for="proto-equipment">Required Medical Equipment / First-Aid Kit (Comma separated)</label>
                  <input type="text" id="proto-equipment" class="input" placeholder="Aspirin 300mg, Pulse Oximeter, BP Monitor, AED" />
                </div>
                <div class="input-wrap">
                  <label class="input-label" for="proto-references">Medical References / Guidelines</label>
                  <input type="text" id="proto-references" class="input" placeholder="ICMR Acute Coronary Guidelines 2024, WHO Rural Emergency Triage" />
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div class="text-xs text-muted">
                  Submitted protocols require Super Admin verification before publishing.
                </div>
                <div style="display: flex; gap: 8px;">
                  <button type="submit" name="action" value="draft" class="btn btn--outline">
                    Save as Draft
                  </button>
                  <button type="submit" name="action" value="submit" class="btn btn--primary">
                    Submit for Admin Approval
                  </button>
                </div>
              </div>
            </form>
          </div>
        `
            : `
          <!-- Doctor Credentials & Profile View -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: clamp(20px, 4vw, 36px); margin-bottom: var(--space-xl);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--color-border); padding-bottom: 16px;">
              <div>
                <h2 class="text-h2">Verified Medical Credentials</h2>
                <p class="text-xs text-muted">Statutory registration and institutional credentials recorded in JeevanSetu.</p>
              </div>
              <span class="badge badge--green">STATUS: VERIFIED</span>
            </div>

            <div class="grid grid--2" style="gap: 20px; font-size: var(--text-sm);">
              <div>
                <div class="text-xs text-muted">Full Legal Name:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.fullName || currentUser.displayName}</div>

                <div class="text-xs text-muted">Statutory Registration Number:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.registrationNumber || 'MMC-2008-041289'}</div>

                <div class="text-xs text-muted">Registering Authority:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.registrationAuthority || 'Maharashtra Medical Council'}</div>

                <div class="text-xs text-muted">State:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.state || 'Maharashtra'}</div>
              </div>

              <div>
                <div class="text-xs text-muted">Medical Qualifications:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.qualification || 'MBBS, MD (Emergency Medicine)'}</div>

                <div class="text-xs text-muted">Clinical Specialization:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.specialization || 'Emergency Medicine & Trauma Care'}</div>

                <div class="text-xs text-muted">Affiliated Facility:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.hospitalName || 'District Sub-Hospital Junnar / Manchar CHC'}</div>

                <div class="text-xs text-muted">Clinical Experience:</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${doctorProfile?.experienceYears || 16} Years</div>
              </div>
            </div>

            <div style="margin-top: 24px; padding: 14px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--text-xs); color: var(--color-text-muted);">
              <strong>Admin Verification Note:</strong> ${doctorProfile?.adminNotes || 'Credentials cross-checked with Maharashtra Medical Council live registry. Active valid practice license verified.'}
            </div>
          </div>
        `
        }

      </div>
    </div>
  `;
}
