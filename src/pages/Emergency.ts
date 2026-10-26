import { EMERGENCY_PROTOCOLS } from '../data/emergencies';

export function renderEmergencyPage(): string {
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
        
        <!-- Emergency Header Bento -->
        <div class="bento-grid" style="margin-bottom: var(--space-xl); align-items: stretch;">
          
          <div class="col-span-8 card card--red" style="padding: clamp(24px, 4vw, 40px); border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
                <span class="badge-dot badge-dot--pulse"></span>
                24/7 CRITICAL EMERGENCY DIRECTORY
              </div>
              <h1 class="text-h1" style="line-height: 1.1; margin-bottom: var(--space-xs); color: var(--color-danger-dark);">
                Need Emergency Help Right Now?
              </h1>
              <p class="text-base text-body" style="max-width: 600px; line-height: var(--leading-relaxed);">
                Select an emergency category below for immediate, verified step-by-step first-aid while medical help is on the way.
              </p>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: var(--space-md);">
              <span class="badge badge--paper">🚑 Dial 108 Ambulance</span>
              <span class="badge badge--paper">🤱 Dial 102 Maternal</span>
              <span class="badge badge--paper">🚨 Dial 112 National</span>
            </div>
          </div>

          <!-- Hotline Bento Box -->
          <div class="col-span-4 card card--black" style="padding: var(--space-lg); border-radius: var(--radius-xl); text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-danger);">
              NATIONAL AMBULANCE HELPLINE
            </div>
            <a href="tel:108" class="btn btn--emergency btn--xl" style="font-size: 2rem; margin: 16px 0; width: 100%; border-radius: var(--radius-pill);">
              📞 CALL 108
            </a>
            <div style="font-size: var(--text-xs); color: var(--color-gray-400);">
              Free 24/7 Government Medical Ambulance Service
            </div>
          </div>

        </div>

        <!-- Emergency Protocols Bento Grid -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="section-label">SELECT EMERGENCY SITUATION (13 VERIFIED PROTOCOLS)</div>

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
