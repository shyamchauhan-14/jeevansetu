import { EMERGENCY_PROTOCOLS } from '../data/emergencies';

export function renderOfflinePage(): string {
  const cachedCardsHtml = EMERGENCY_PROTOCOLS.map((protocol) => `
    <a href="#/emergency/${protocol.slug}" class="card card--paper card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg); display: flex; align-items: center; gap: 14px;">
      <div style="font-size: 2.2rem; line-height: 1; flex-shrink: 0;">${protocol.icon}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-text-main);">${protocol.title}</div>
        <div class="text-xs text-muted" style="margin-top: 2px;">Cached locally in phone memory • Offline ready</div>
      </div>
      <div class="pill pill--green" style="width: 32px; height: 32px; font-size: 0.8rem; flex-shrink: 0;">→</div>
    </a>
  `).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">

        <!-- Header Bento -->
        <div class="card card--green" style="border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 40px); margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            OFFLINE EMERGENCY DIRECTORY
          </div>
          <h1 class="text-h1" style="line-height: 1.15; color: var(--color-primary-dark); margin-bottom: var(--space-xs);">
            Prepared for Zero Connectivity
          </h1>
          <p class="text-base text-muted" style="max-width: 650px; line-height: var(--leading-relaxed);">
            AI triage requires active internet connection, but all 13 life-saving first-aid emergency protocols and health guides are stored directly on your phone and ready anytime.
          </p>
        </div>

        <!-- Download PDF Guide Banner Bento -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-xl); margin-bottom: var(--space-xl); background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #6ee7b7; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-md);">
          <div>
            <div style="font-weight: 800; font-size: var(--text-lg); color: var(--color-primary-dark); display: flex; align-items: center; gap: 8px;">
              <span>📄</span> Complete Disease & Emergency Medical Manual (PDF)
            </div>
            <p class="text-sm text-muted" style="margin-top: 4px; max-width: 640px; line-height: 1.5;">
              Download a complete printable PDF containing all disease guides (Emergency Signs, First Aid, Maternal Red Flags, Child Diarrhea & ORS, Sanitation, Immunity) and all 13 Emergency Protocols.
            </p>
          </div>
          <button type="button" class="btn btn--primary" style="padding: 14px 24px; font-weight: 700; border-radius: var(--radius-lg); font-size: var(--text-sm);" onclick="window.downloadOfflinePDF()">
            📥 Download PDF Manual
          </button>
        </div>

        <!-- Offline Status Banner Bento -->
        <div class="card card--paper" style="border-left: 6px solid var(--color-primary); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-text-main);">EMERGENCY CALLING VIA TELECOM NETWORK</div>
            <div class="text-xs text-muted" style="margin-top: 2px;">
              Emergency dialers (108 / 102 / 112) work even without mobile data if voice signal is present.
            </div>
          </div>
          <a href="tel:108" class="btn btn--emergency btn--sm">
            📞 Dial 108 Now
          </a>
        </div>

        <!-- Grid of cached protocols -->
        <div style="margin-bottom: var(--space-2xl);">
          <div class="section-label">
            LOCALLY STORED EMERGENCY PROTOCOLS
          </div>

          <div class="grid grid--2">
            ${cachedCardsHtml}
          </div>
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
