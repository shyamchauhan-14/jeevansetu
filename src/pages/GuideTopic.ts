import { HealthGuideArticle } from '../types/health';

export function renderGuideTopicPage(article: HealthGuideArticle): string {
  const keyPointsHtml = article.keyPoints
    .map(
      (k) => `
    <li style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px; font-size: var(--text-base); font-weight: 500;">
      <span style="color: var(--color-primary-dark); font-size: 1.1rem;">✓</span>
      <span>${k}</span>
    </li>
  `
    )
    .join('');

  const paragraphsHtml = article.fullContent
    .map(
      (p) => `
    <p style="font-size: var(--text-base); line-height: var(--leading-relaxed); margin-bottom: var(--space-md); color: var(--color-text-body);">
      ${p}
    </p>
  `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <a href="#/guide" class="btn btn--ghost btn--sm" style="margin-bottom: var(--space-md);">
          ← Back to Health Guide Library
        </a>

        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: var(--space-xs);">
            <span class="badge badge--green">${article.category}</span>
            <span style="font-size: var(--text-xs); color: var(--color-text-muted);">⏱️ ${article.readTime}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 16px; margin: 8px 0;">
            <span style="font-size: 3rem; line-height: 1;">${article.icon}</span>
            <h1 class="text-h2">${article.title}</h1>
          </div>

          <p class="text-base text-muted" style="font-style: italic;">
            "${article.excerpt}"
          </p>
        </div>

        <!-- Key Takeaways Bento Card -->
        <div class="card card--green" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-primary-dark); margin-bottom: 8px;">
            KEY TAKEAWAYS AT A GLANCE
          </div>
          <ul style="list-style: none;">
            ${keyPointsHtml}
          </ul>
        </div>

        <!-- Full Article Content -->
        <div class="card card--paper" style="padding: var(--space-xl); margin-bottom: var(--space-2xl); border-radius: var(--radius-xl);">
          ${paragraphsHtml}
        </div>

        <!-- Bottom Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <a href="#/guide" class="btn btn--ghost">
            ← Explore More Articles
          </a>
          <a href="#/symptoms" class="btn btn--primary btn--lg">
            Check Your Symptoms Now →
          </a>
        </div>

      </div>
    </div>
  `;
}
