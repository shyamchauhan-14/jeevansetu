import { CareTopic } from '../types/health';
import { renderDoDontCard } from '../components/DoDontCard';

export function renderCareTopicPage(topic: CareTopic): string {
  const doctorReasons = topic.whenToSeeDoctor
    .map(
      (r) => `
    <li style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; font-size: var(--text-sm);">
      <span style="color: var(--color-info); font-weight: bold;">●</span>
      <span>${r}</span>
    </li>
  `
    )
    .join('');

  const warningList = topic.warningSigns
    .map(
      (w) => `
    <li style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; font-size: var(--text-sm); font-weight: 500;">
      <span style="color: var(--color-danger);">⚠️</span>
      <span>${w}</span>
    </li>
  `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 900px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <a href="#/care" class="btn btn--ghost btn--sm" style="margin-bottom: var(--space-sm);">
            ← Back to All Safe Care Topics
          </a>

          <div style="display: flex; align-items: center; gap: 16px; margin: 8px 0;">
            <span style="font-size: 3rem; line-height: 1;">${topic.icon}</span>
            <div>
              <span class="badge badge--green">${topic.category}</span>
              <h1 class="text-h2" style="margin-top: 4px;">${topic.title}</h1>
            </div>
          </div>

          <p class="text-base text-muted">
            ${topic.summary}
          </p>
        </div>

        <!-- DOs vs DON'Ts -->
        <div class="grid grid--2" style="margin-bottom: var(--space-xl);">
          <div>
            ${renderDoDontCard('do', topic.title, topic.whatMayHelp)}
          </div>
          <div>
            ${renderDoDontCard('dont', topic.title, topic.whatToAvoid)}
          </div>
        </div>

        <!-- Clinical Guidelines: When to see a doctor & Warning Signs -->
        <div class="grid grid--2" style="margin-bottom: var(--space-xl);">
          
          <div class="card card--paper" style="border-radius: var(--radius-xl); border-left: 5px solid var(--color-info);">
            <div class="section-label">CLINICAL TIMELINE</div>
            <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm);">When to See a Doctor</h3>
            <ul style="list-style: none;">
              ${doctorReasons}
            </ul>
          </div>

          <div class="card card--paper" style="border-radius: var(--radius-xl); border-left: 5px solid var(--color-danger);">
            <div class="section-label" style="color: var(--color-danger);">RED FLAG ALERT</div>
            <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm); color: var(--color-danger-dark);">Danger Warning Signs</h3>
            <ul style="list-style: none;">
              ${warningList}
            </ul>
          </div>

        </div>

        <!-- Bottom Actions Bento Card -->
        <div class="card card--black" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md); border-radius: var(--radius-xl);">
          <div>
            <div style="color: var(--color-primary); font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 2px;">
              SYMPTOMS PERSISTING OR WORSENING?
            </div>
            <div style="color: var(--color-white); font-size: var(--text-base); font-weight: 700;">Find your nearest Primary Health Centre or hospital.</div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="#/care-locator" class="btn btn--primary">
              🏥 Find Nearest PHC →
            </a>
            <a href="#/emergency" class="btn btn--emergency">
              🚨 Emergency Center
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
