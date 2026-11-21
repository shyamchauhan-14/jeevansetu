import { EMERGENCY_PROTOCOLS } from '../data/emergencies';
import { SOSService } from '../services/sosService';
import { I18nService } from '../services/i18nService';

export function renderEmergencyPage(): string {
  const activeIncident = SOSService.getActiveIncident();
  const contacts = SOSService.getTrustedContacts();

  const statusLabel = activeIncident ? activeIncident.status.replace('_', ' ').toUpperCase() : 'NOT STARTED';
  const statusBadgeClass =
    !activeIncident || activeIncident.status === 'not_started'
      ? 'badge--paper'
      : activeIncident.status === 'call_opened' || activeIncident.status === 'sent'
      ? 'badge--blue'
      : activeIncident.status === 'resolved'
      ? 'badge--green'
      : activeIncident.status === 'cancelled'
      ? 'badge--paper'
      : 'badge--red';

  const protocolCardsHtml = EMERGENCY_PROTOCOLS.map((protocol) => `
    <a href="#/emergency/${protocol.slug}" class="card card--paper card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg); display: flex; align-items: center; gap: 14px;">
      <div style="font-size: 2.2rem; line-height: 1; flex-shrink: 0;">${protocol.icon}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-text-main);">${protocol.title}</div>
        <div style="font-size: var(--text-xs); color: var(--color-primary-dark); font-weight: 600;">${protocol.hindiTitle || ''}</div>
        <div class="text-xs text-muted" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">${protocol.warningText}</div>
      </div>
      <div class="pill pill--green" style="width: 32px; height: 32px; font-size: 0.8rem; flex-shrink: 0;">→</div>
    </a>
  `).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- SMART SOS HERO PANEL -->
        <div class="card card--red" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 36px);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: var(--space-md);">
            <div class="badge badge--red">
              <span class="badge-dot badge-dot--pulse"></span>
              ${I18nService.t('sos.badge', '24/7 RAPID EMERGENCY SOS')}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="text-xs font-bold" style="color: var(--color-danger-dark);">${I18nService.t('sos.status', 'Incident Status')}:</span>
              <span class="badge ${statusBadgeClass}" id="sos-incident-status-badge">${statusLabel}</span>
            </div>
          </div>

          <h1 class="text-h1" style="line-height: 1.1; margin-bottom: var(--space-xs); color: var(--color-danger-dark);">
            ${I18nService.t('sos.title', 'Emergency Assistance & Smart SOS')}
          </h1>
          <p class="text-base text-body" style="max-width: 700px; line-height: var(--leading-relaxed); margin-bottom: var(--space-lg);">
            ${I18nService.t('sos.subtext', 'Direct one-tap ambulance dialing, verified first-aid instructions, and instant trusted contact alert.')}
          </p>

          <!-- Pre-flight Consent & Transparency Note -->
          <div style="background: rgba(255, 255, 255, 0.85); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid rgba(239, 68, 68, 0.25); margin-bottom: var(--space-lg); font-size: var(--text-xs); color: var(--color-text-body);">
            <strong>🛡️ Data Transparency Notice:</strong> Activating SOS prepares an alert with your approximate locality, timestamp, and optional emergency note. GPS location is optional; you can manually pick your village below. JeevanSetu opens your phone's native calling app and does not claim automated ambulance dispatch.
          </div>

          <!-- Intentional Activation Trigger (Hold 2s or Tap) -->
          <div style="display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin-bottom: var(--space-lg);">
            <button 
              type="button" 
              id="sos-hold-btn"
              class="btn btn--emergency btn--xl" 
              style="font-size: 1.25rem; width: 100%; border-radius: var(--radius-pill); position: relative; overflow: hidden;"
              onmousedown="window.startSosHoldTimer()"
              onmouseup="window.cancelSosHoldTimer()"
              ontouchstart="window.startSosHoldTimer()"
              ontouchend="window.cancelSosHoldTimer()"
              onclick="window.handleSosInstantTrigger()"
            >
              <span id="sos-btn-text">🚨 ${I18nService.t('sos.holdToActivate', 'PRESS OR HOLD 2S TO ACTIVATE SOS')}</span>
            </button>
            <div id="sos-progress-hint" class="text-xs text-muted" style="text-align: center;">
              Press button or hold for 2 seconds to initiate emergency sequence
            </div>
          </div>

          <!-- Active Incident Controls (if active) -->
          ${
            activeIncident && activeIncident.status !== 'cancelled' && activeIncident.status !== 'resolved'
              ? `
            <div class="card card--paper" style="padding: 16px; border-radius: var(--radius-lg); margin-bottom: var(--space-lg);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="font-weight: bold; font-size: var(--text-sm); color: var(--color-text-main);">Active Emergency Incident #${activeIncident.id}</div>
                  <div class="text-xs text-muted" style="margin-top: 2px;">Locality: ${activeIncident.locality || 'Locating...'} • Status: ${activeIncident.alertStatus}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn btn--outline btn--sm" onclick="window.resolveEmergencyIncident()">
                    ✓ Mark Resolved
                  </button>
                  <button type="button" class="btn btn--ghost btn--sm" style="color: var(--color-danger);" onclick="window.cancelEmergencyIncident()">
                    ✕ False Alarm
                  </button>
                </div>
              </div>
            </div>
          `
              : ''
          }

          <!-- Direct Verified Government Helplines -->
          <div class="grid grid--3" style="margin-top: var(--space-md);">
            <div class="card card--paper" style="padding: var(--space-md); border-radius: var(--radius-lg); text-align: center;">
              <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-danger); text-transform: uppercase;">Medical Ambulance</div>
              <a href="tel:108" class="btn btn--emergency btn--sm btn--full" style="margin-top: 8px;" onclick="window.recordDialerOpened('108')">
                📞 Call 108
              </a>
              <div style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-top: 4px;">Free 24/7 Paramedic Service</div>
            </div>

            <div class="card card--paper" style="padding: var(--space-md); border-radius: var(--radius-lg); text-align: center;">
              <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-primary-dark); text-transform: uppercase;">Maternal & Infant (JSSK)</div>
              <a href="tel:102" class="btn btn--primary btn--sm btn--full" style="margin-top: 8px;" onclick="window.recordDialerOpened('102')">
                🤱 Call 102
              </a>
              <div style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-top: 4px;">Free Transport for Mothers & Newborns</div>
            </div>

            <div class="card card--paper" style="padding: var(--space-md); border-radius: var(--radius-lg); text-align: center;">
              <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-info-dark); text-transform: uppercase;">National Emergency</div>
              <a href="tel:112" class="btn btn--secondary btn--sm btn--full" style="margin-top: 8px;" onclick="window.recordDialerOpened('112')">
                🚨 Call 112
              </a>
              <div style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-top: 4px;">Unified Police, Fire & Disaster Helpline</div>
            </div>
          </div>
        </div>

        <!-- LOCATION FALLBACK & TRUSTED CONTACTS SECTION -->
        <div class="bento-grid" style="margin-bottom: var(--space-xl); align-items: flex-start;">
          
          <!-- Manual Locality Fallback (Col 6) -->
          <div class="col-span-6 card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <div style="font-weight: bold; font-size: var(--text-base); margin-bottom: 4px;">📍 Emergency Location / Locality</div>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              If GPS is unavailable or denied, pick your taluka/village so emergency contacts receive your location context.
            </p>

            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--space-md);">
              <button type="button" class="btn btn--outline btn--sm" onclick="window.setSosManualLocality('Khed Taluka, Pune Rural')">Khed</button>
              <button type="button" class="btn btn--outline btn--sm" onclick="window.setSosManualLocality('Manchar CHC Area, Ambegaon')">Manchar</button>
              <button type="button" class="btn btn--outline btn--sm" onclick="window.setSosManualLocality('Junnar Sub-District')">Junnar</button>
              <button type="button" class="btn btn--outline btn--sm" onclick="window.setSosManualLocality('Alandi Rural Sector')">Alandi</button>
            </div>

            <div class="input-wrap">
              <label class="input-label" for="custom-locality-input" style="font-size: var(--text-xs);">Or enter village name:</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="custom-locality-input" class="input" placeholder="e.g. Nimgaon, Shirur Taluka..." />
                <button type="button" class="btn btn--primary btn--sm" onclick="window.applyCustomLocality()">Apply</button>
              </div>
            </div>
          </div>

          <!-- Trusted Family Contacts (Col 6) -->
          <div class="col-span-6 card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
              <div style="font-weight: bold; font-size: var(--text-base);">👥 Trusted Contacts (${contacts.length})</div>
              <button type="button" class="btn btn--outline btn--sm" onclick="window.toggleAddContactForm()">+ Add Contact</button>
            </div>
            <p class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              These family numbers receive an instant alert when you trigger Smart SOS.
            </p>

            <!-- Add Contact Inline Form (Hidden by default) -->
            <form id="add-contact-form" style="display: none; background: var(--color-canvas); padding: 12px; border-radius: var(--radius-md); margin-bottom: var(--space-md);" onsubmit="window.handleAddContactSubmit(event)">
              <div class="input-wrap" style="margin-bottom: 8px;">
                <input type="text" id="contact-name-input" class="input" placeholder="Full Name (e.g. Sunita Patil)" required />
              </div>
              <div class="input-wrap" style="margin-bottom: 8px;">
                <input type="tel" id="contact-phone-input" class="input" placeholder="Phone Number (e.g. +91 98221 44556)" required />
              </div>
              <div class="input-wrap" style="margin-bottom: 10px;">
                <input type="text" id="contact-relation-input" class="input" placeholder="Relationship (e.g. Spouse / Brother)" />
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn btn--ghost btn--sm" onclick="window.toggleAddContactForm()">Cancel</button>
                <button type="submit" class="btn btn--primary btn--sm">Save Contact</button>
              </div>
            </form>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${
                contacts.length === 0
                  ? `<div class="text-xs text-muted italic">No contacts added yet. Add trusted family numbers above.</div>`
                  : contacts
                      .map(
                        (c) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-surface-soft); border-radius: var(--radius-md);">
                  <div>
                    <div style="font-weight: bold; font-size: var(--text-sm);">${c.name}</div>
                    <div class="text-xs text-muted">${c.phone} • ${c.relationship || 'Contact'}</div>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <a href="tel:${c.phone}" class="btn btn--outline btn--sm" onclick="window.recordDialerOpened('${c.phone}')">📞 Call</a>
                    <button type="button" class="btn btn--ghost btn--sm" style="color: var(--color-danger);" onclick="window.handleDeleteContact('${c.id}')">🗑️</button>
                  </div>
                </div>
              `
                      )
                      .join('')
              }
            </div>
          </div>

        </div>

        <!-- 13 VERIFIED EMERGENCY PROTOCOLS -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="section-label">SELECT EMERGENCY SITUATION (13 VERIFIED FIRST-AID PROTOCOLS)</div>
          <div class="grid grid--2">
            ${protocolCardsHtml}
          </div>
        </div>

        <!-- Offline Support Note -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="font-size: 2.2rem;">📶</div>
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base);">Offline Emergency Access Guaranteed</div>
              <div class="text-sm text-muted">All life-saving instructions on this page remain cached and fully accessible even without cellular data.</div>
            </div>
          </div>
          <a href="#/offline" class="btn btn--outline btn--sm">
            View Offline Directory →
          </a>
        </div>

      </div>
    </div>
  `;
}
