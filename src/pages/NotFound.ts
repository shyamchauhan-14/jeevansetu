export function renderNotFoundPage(): string {
  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-3xl); padding-bottom: var(--space-3xl); text-align: center; max-width: 600px;">
        
        <div style="font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; line-height: 1; color: var(--color-black); margin-bottom: var(--space-sm);">
          404
        </div>

        <h1 class="text-h2" style="margin-bottom: var(--space-sm);">
          PAGE NOT FOUND
        </h1>

        <p class="text-lg text-muted" style="margin-bottom: var(--space-xl);">
          The page you requested does not exist or has been moved. Use the buttons below to return to safe healthcare guidance.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="#/" class="btn btn--primary btn--lg">
            Return to Home →
          </a>
          <a href="#/emergency" class="btn btn--emergency btn--lg">
            🚨 24/7 Emergency Center
          </a>
        </div>

      </div>
    </div>
  `;
}
