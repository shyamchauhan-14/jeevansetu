export function renderErrorState(
  title: string,
  desc: string,
  actionText = 'Try Again',
  actionHref = '#/symptoms',
  icon = '⚠️'
): string {
  return `
    <div class="error-state" role="alert">
      <div class="error-state__icon">${icon}</div>
      <h2 class="error-state__title">${title}</h2>
      <p class="error-state__desc">${desc}</p>
      <div style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; justify-content: center;">
        <a href="${actionHref}" class="btn btn--primary">${actionText}</a>
        <a href="#/emergency" class="btn btn--emergency">🚨 108 Emergency</a>
      </div>
    </div>
  `;
}
