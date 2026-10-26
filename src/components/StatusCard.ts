import { RiskLevel } from '../types/health';

export function renderStatusCard(level: RiskLevel, headline: string, subheadline: string, timeframe: string): string {
  const levelClass =
    level === 'CRITICAL' ? 'status-card--critical' : level === 'MODERATE' ? 'status-card--moderate' : 'status-card--low';

  const badgeType = level === 'CRITICAL' ? 'badge--red' : level === 'MODERATE' ? 'badge--orange' : 'badge--green';

  return `
    <div class="status-card ${levelClass}">
      <div class="status-card__label">TRIAGE URGENCY LEVEL</div>
      <div class="status-card__level">${headline}</div>
      <div style="font-size: var(--text-lg); font-weight: 700; margin-top: 8px;">${subheadline}</div>
      <div style="margin-top: 16px; display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.15); padding: 6px 16px; border-radius: var(--radius-full);">
        <span style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracking-wider);">Action Timeframe:</span>
        <span class="badge ${badgeType}">${timeframe}</span>
      </div>
    </div>
  `;
}
