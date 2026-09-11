export function renderOfflineBanner(): string {
  return `
    <div class="offline-banner" role="status" aria-live="assertive">
      <span class="offline-banner__icon">📶</span>
      <span>OFFLINE MODE: You are currently offline. Emergency first-aid guides remain fully accessible.</span>
      <a href="#/offline" class="btn btn--sm btn--secondary" style="margin-left: 12px; padding: 4px 12px; font-size: 0.75rem;">
        View Cached Guides
      </a>
    </div>
  `;
}
