import { CARE_TOPICS } from '../data/care';
import { I18nService } from '../services/i18nService';

export function renderCarePage(): string {
  const t = (key: string, def: string = '') => I18nService.t(key, def);
  const cardsHtml = CARE_TOPICS.map((topic) => `
    <a href="#/care/${topic.slug}" class="card card--paper card--clickable" style="text-decoration: none; border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between; min-height: 240px; padding: var(--space-lg);">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
          <span style="font-size: 2.2rem; line-height: 1;">${topic.icon}</span>
          <span class="badge badge--green">${topic.category}</span>
        </div>
        <h3 class="text-h4" style="margin-bottom: 6px; color: var(--color-text-main);">${topic.title}</h3>
        <p class="text-sm text-muted" style="line-height: var(--leading-normal);">${topic.summary}</p>
      </div>
      <div style="margin-top: var(--space-md); font-size: var(--text-sm); font-weight: var(--font-weight-bold); color: var(--color-primary-dark); display: flex; align-items: center; justify-content: space-between;">
        <span>View Supportive Steps</span>
        <span class="pill pill--green" style="width: 28px; height: 28px; font-size: 0.75rem;">→</span>
      </div>
    </a>
  `).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl); max-width: 800px;">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ${t('care.label', 'SAFE CARE GUIDES')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${t('care.title', 'Home Care & Guidance')}
          </h1>
          <p class="text-base text-muted">
            ${t('care.subtitle', 'Clinically verified, low-risk supportive measures to help manage mild symptoms safely while arranging proper medical consultation.')}
          </p>
        </div>

        <!-- Safety Warning Bento Strip -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg); margin-bottom: var(--space-xl); border-left: 6px solid var(--color-primary); display: flex; gap: 14px; align-items: center;">
          <div style="font-size: 2rem;">💡</div>
          <div>
            <h4 style="font-size: var(--text-base); font-weight: var(--font-weight-bold); margin-bottom: 2px;">Supportive Care vs Medical Treatment</h4>
            <p class="text-sm text-muted">
              These guidelines help keep patients comfortable and hydrated. They do <strong>not replace prescription medication or medical exams</strong> for serious conditions.
            </p>
          </div>
        </div>

        <!-- Bento Grid of Topics -->
        <div class="grid grid--3">
          ${cardsHtml}
        </div>

      </div>
    </div>
  `;
}
