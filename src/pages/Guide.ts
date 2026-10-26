import { HEALTH_GUIDES } from '../data/healthGuides';

export function renderGuidePage(filterQuery = ''): string {
  let list = HEALTH_GUIDES;
  if (filterQuery.trim()) {
    const q = filterQuery.toLowerCase();
    list = list.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q) ||
        g.keyPoints.some((k) => k.toLowerCase().includes(q))
    );
  }

  const articlesHtml = list
    .map(
      (article) => `
    <a href="#/guide/${article.slug}" class="card card--paper card--clickable" style="text-decoration: none; border-radius: var(--radius-xl); display: flex; flex-direction: column; justify-content: space-between; padding: var(--space-lg); min-height: 240px;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 2rem; line-height: 1;">${article.icon}</span>
          <span class="badge badge--green">${article.category}</span>
        </div>
        <h3 class="text-h5" style="margin-bottom: 6px; color: var(--color-text-main);">${article.title}</h3>
        <p class="text-sm text-muted" style="line-height: var(--leading-normal);">${article.excerpt}</p>
      </div>
      
      <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: var(--text-xs); color: var(--color-text-muted); border-top: 1px solid var(--color-gray-200); padding-top: 12px;">
        <span>⏱️ ${article.readTime}</span>
        <span style="font-weight: var(--font-weight-bold); color: var(--color-primary-dark); text-transform: uppercase;">Read Guide →</span>
      </div>
    </a>
  `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl); max-width: 800px;">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            COMMUNITY HEALTH WISDOM
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Health Information Guide
          </h1>
          <p class="text-base text-muted">
            Practical health knowledge, rural first aid, maternal safety, child hydration, and seasonal illness prevention.
          </p>
        </div>

        <!-- Search Bar Bento Card -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div class="search-bar">
            <span style="font-size: 1.2rem; margin-right: 8px;">🔍</span>
            <input 
              type="text" 
              placeholder="What health topic do you want to learn about? (e.g. ORS, fever, snake bite, pregnancy)"
              value="${filterQuery}"
              oninput="window.handleGuideSearch(this.value)"
            />
          </div>
        </div>

        <!-- Articles Grid -->
        <div class="grid grid--3">
          ${
            articlesHtml.length > 0
              ? articlesHtml
              : `
            <div class="col-span-3 card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
              <div style="font-size: 3rem; margin-bottom: var(--space-sm);">🔍</div>
              <h3 class="text-h4">No matching health guides found</h3>
              <p class="text-muted" style="margin-top: 6px;">Try searching for "fever", "diarrhea", "maternal", or "first aid"</p>
            </div>
          `
          }
        </div>

      </div>
    </div>
  `;
}
