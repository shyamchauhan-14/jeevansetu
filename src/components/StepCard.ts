export function renderStepCard(number: string, title: string, detail: string): string {
  return `
    <div class="step-card">
      <div class="step-card__number">${number}</div>
      <div class="step-card__body">
        <h3 class="step-card__title">${title}</h3>
        <p class="step-card__desc">${detail}</p>
      </div>
    </div>
  `;
}
