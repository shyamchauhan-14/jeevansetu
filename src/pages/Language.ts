import { SUPPORTED_LANGUAGES } from '../data/languages';
import { StorageService } from '../services/storageService';
import { I18nService } from '../services/i18nService';

export function renderLanguagePage(): string {
  const currentLang = StorageService.getLanguage();
  const t = (key: string, def: string = '') => I18nService.t(key, def);

  const cardsHtml = SUPPORTED_LANGUAGES.map((lang) => {
    const isSelected = currentLang === lang.code;
    return `
      <div
        class="language-card ${isSelected ? 'active' : ''}"
        role="button"
        tabindex="0"
        id="lang-card-${lang.code}"
        onclick="window.selectLanguage('${lang.code}')"
        onkeydown="if(event.key==='Enter'||event.key===' ')window.selectLanguage('${lang.code}')"
        style="cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; position: relative; overflow: hidden;"
      >
        <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">
          ${lang.code === 'en' ? '🇬🇧' : '🇮🇳'}
        </div>
        <div class="language-card__name" style="font-size: var(--text-sm); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7;">${lang.name}</div>
        <div class="language-card__native" style="font-size: var(--text-h3); font-weight: 800; line-height: 1.15; margin: 6px 0;">${lang.nativeName}</div>
        <div style="font-size: var(--text-xs); opacity: 0.75; margin-bottom: var(--space-sm);">${lang.subtext}</div>
        ${isSelected
          ? `<span class="badge badge--black" style="margin-top: 4px;">${t('language.active', '✓ Active')}</span>`
          : `<span class="badge badge--paper" style="margin-top: 4px; opacity: 0.6;">Tap to select</span>`
        }
      </div>
    `;
  }).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl); text-align: center;">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ${t('language.badge', 'ACCESSIBILITY & INCLUSION')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${t('language.title', 'Choose Your Language')}
          </h1>
          <p class="text-base text-muted" style="max-width: 560px; margin: 0 auto;">
            ${t('language.subtitle', 'Select your preferred language. The entire app will instantly switch to your language.')}
          </p>
        </div>

        <!-- Language Cards — 3 cards, equal width -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-xl);">
          ${cardsHtml}
        </div>

        <!-- Info Card -->
        <div class="card card--green" style="text-align: center; padding: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🎙️</div>
          <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">${t('language.voice.title', 'Regional Voice Assistant')}</h3>
          <p class="text-sm text-body" style="max-width: 500px; margin: 8px auto 16px;">
            ${t('language.voice.sub', 'JeevanSetu Voice Assistant automatically adapts its speech recognition engine to match your selected language.')}
          </p>
          <a href="#/voice" class="btn btn--primary">
            ${t('language.voice.cta', 'Try Voice Assistant →')}
          </a>
        </div>

      </div>
    </div>
  `;
}
