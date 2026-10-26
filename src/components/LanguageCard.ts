import { LanguageOption } from '../types/health';

export function renderLanguageCard(lang: LanguageOption, isSelected: boolean): string {
  const activeClass = isSelected ? 'active' : '';

  return `
    <div class="language-card ${activeClass}" role="button" tabindex="0" onclick="window.selectLanguage('${lang.code}')">
      <div style="font-size: 2rem;">🇮🇳</div>
      <div class="language-card__name">${lang.name}</div>
      <div class="language-card__native" style="font-size: var(--text-h4); font-weight: 700;">${lang.nativeName}</div>
      <div style="font-size: var(--text-xs); color: inherit; opacity: 0.8; margin-top: 4px;">${lang.subtext}</div>
      ${isSelected ? '<span class="badge badge--black" style="margin-top: 8px;">✓ Active</span>' : ''}
    </div>
  `;
}
