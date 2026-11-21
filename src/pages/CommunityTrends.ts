import { CommunityService } from '../services/communityService';

export function renderCommunityTrendsPage(): string {
  const trends = CommunityService.getHealthTrends();

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--orange" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            COMMUNITY HEALTH SIGNAL DASHBOARD
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Rural Health Surveillance Signals
          </h1>
          <p class="text-base text-muted">
            Aggregated, de-identified community symptom trends to support public health readiness.
          </p>
        </div>

        <!-- Strict Epidemiological Notice -->
        <div class="card card--paper" style="border-left: 5px solid var(--color-amber); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-amber); text-transform: uppercase;">
            ⚠️ Public Health Disclaimer & Small-Group Suppression
          </div>
          <div class="text-xs text-muted" style="margin-top: 4px; line-height: var(--leading-normal);">
            These aggregated counts represent early self-reported signals for review by public health officers. They are <strong>NOT confirmed clinical outbreaks</strong>. Cell counts under 5 are suppressed to prevent re-identification of patients in small villages.
          </div>
        </div>

        <!-- Signals Grid -->
        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-2xl);">
          ${trends
            .map(
              (t) => `
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                <div>
                  <h3 style="font-size: var(--text-base); font-weight: bold; color: var(--color-text-main);">${t.category}</h3>
                  <div class="text-xs text-muted">📍 Area: ${t.areaCode} • Period: ${t.period}</div>
                </div>
                <div>
                  <span class="badge ${t.reviewedStatus === 'validated' ? 'badge--blue' : 'badge--paper'}">
                    ${t.reviewedStatus === 'validated' ? '🔍 Validated by Block Officer' : '⏳ Unverified Signal'}
                  </span>
                </div>
              </div>

              <div style="display: flex; align-items: baseline; gap: 12px; margin: 10px 0;">
                <span style="font-size: var(--text-h3); font-weight: 800; color: var(--color-primary-dark);">${t.countBucket}</span>
                <span class="text-2xs text-muted">De-identified aggregate count</span>
              </div>

              <div style="font-size: var(--text-2xs); color: var(--color-text-muted); background: var(--color-canvas); padding: 6px 10px; border-radius: var(--radius-xs);">
                <strong>Source:</strong> ${t.dataSource} • <strong>Limitations:</strong> ${t.limitations}
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
