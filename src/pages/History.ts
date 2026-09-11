import { StorageService } from '../services/storageService';

export function renderHistoryPage(): string {
  const history = StorageService.getHistory();

  const historyItemsHtml = history
    .map((item) => {
      const badgeClass =
        item.riskLevel === 'CRITICAL' ? 'badge--red' : item.riskLevel === 'MODERATE' ? 'badge--orange' : 'badge--green';

      const symptomsString = item.symptoms.join(' • ');

      return `
      <div class="card card--paper card--clickable" style="padding: var(--space-md) var(--space-lg); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;" onclick="window.viewHistoryItem('${item.id}')">
        <div>
          <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: 2px;">${item.date}</div>
          <div style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-text-main);">${item.headline}</div>
          <div style="font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px;">Symptoms: ${symptomsString}</div>
          <div style="font-size: var(--text-xs); color: var(--color-primary-dark); font-weight: 600; margin-top: 4px;">Action: ${item.actionTaken}</div>
        </div>
        <div>
          <span class="badge ${badgeClass}">${item.riskLevel}</span>
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
              <span class="badge-dot badge-dot--pulse"></span>
              PAST ASSESSMENTS
            </div>
            <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
              Triage History
            </h1>
            <p class="text-base text-muted">
              Review previous symptom evaluations and recommended clinical actions.
            </p>
          </div>

          ${
            history.length > 0
              ? `
            <button type="button" class="btn btn--ghost btn--sm" onclick="window.clearTriageHistory()">
              🗑️ Clear History
            </button>
          `
              : ''
          }
        </div>

        <!-- History List -->
        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-2xl);">
          ${
            history.length > 0
              ? historyItemsHtml
              : `
            <div class="card card--paper" style="text-align: center; padding: var(--space-3xl); border-radius: var(--radius-xl);">
              <div style="font-size: 3rem; margin-bottom: 12px;">📋</div>
              <h3 class="text-h4">No assessment history yet</h3>
              <p class="text-muted" style="margin-top: 6px; margin-bottom: 16px;">
                When you run a symptom check or voice triage, records will appear here.
              </p>
              <a href="#/symptoms" class="btn btn--primary">
                Check Symptoms Now →
              </a>
            </div>
          `
          }
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <a href="#/" class="btn btn--ghost">
            ← Back to Home
          </a>
          <a href="#/symptoms" class="btn btn--primary btn--lg">
            Start New Symptom Triage →
          </a>
        </div>

      </div>
    </div>
  `;
}
