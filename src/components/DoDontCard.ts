export function renderDoDontCard(type: 'do' | 'dont', title: string, items: string[]): string {
  const isDo = type === 'do';
  const cardClass = isDo ? 'dodont-card--do' : 'dodont-card--dont';
  const icon = isDo ? '✓' : '✕';
  const headerText = isDo ? `DO THIS (${title})` : `DO NOT DO THIS (${title})`;

  const listItems = items
    .map(
      (item) => `
    <li class="dodont-item">
      <span class="dodont-item__mark">${icon}</span>
      <span>${item}</span>
    </li>
  `
    )
    .join('');

  return `
    <div class="dodont-card ${cardClass}">
      <div class="dodont-card__header">
        <span style="font-size: 1.5rem;">${isDo ? '✅' : '🛑'}</span>
        <span>${headerText}</span>
      </div>
      <ul class="dodont-card__list">
        ${listItems}
      </ul>
    </div>
  `;
}
