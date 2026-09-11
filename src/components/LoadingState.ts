export function renderLoadingState(title = "UNDERSTANDING WHAT'S HAPPENING..."): string {
  return `
    <div class="loading-state" role="status" aria-live="polite">
      <div class="loading-dots">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>

      <div class="loading-state__title">${title}</div>
      <p class="loading-state__sub">JeevanSetu AI is analyzing symptom urgency and safety protocols</p>

      <div class="loading-steps">
        <div class="loading-step done">
          <span class="loading-step__icon">✓</span>
          <span>Checking reported symptoms</span>
        </div>
        <div class="loading-step done">
          <span class="loading-step__icon">✓</span>
          <span>Screening for critical red flags</span>
        </div>
        <div class="loading-step" id="loading-step-3">
          <span class="loading-step__icon">⏱️</span>
          <span>Preparing immediate first-aid & next steps...</span>
        </div>
      </div>
    </div>
  `;
}
