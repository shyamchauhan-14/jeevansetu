import { SUPPORTED_LANGUAGES } from '../data/languages';
import { StorageService } from '../services/storageService';
import { renderLanguageCard } from '../components/LanguageCard';

export function renderLanguagePage(): string {
  const currentLang = StorageService.getLanguage();

  const cardsHtml = SUPPORTED_LANGUAGES.map((lang) =>
    renderLanguageCard(lang, currentLang === lang.code)
  ).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 900px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl); text-align: center;">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ACCESSIBILITY & INCLUSION
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Choose Your Regional Language
          </h1>
          <p class="text-base text-muted" style="max-width: 600px; margin: 0 auto;">
            आपकी अपनी भाषा में स्वास्थ्य सहायता। Select your preferred Indian language for symptom triage, audio guidance, and emergency protocols.
          </p>
        </div>

        <!-- Languages Bento Grid -->
        <div class="grid grid--3" style="margin-bottom: var(--space-xl);">
          ${cardsHtml}
        </div>

        <!-- Info Bento Card -->
        <div class="card card--green" style="text-align: center; padding: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🎙️</div>
          <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">Regional Voice Assistant</h3>
          <p class="text-sm text-body" style="max-width: 500px; margin: 8px auto 16px;">
            JeevanSetu Voice Assistant automatically adapts its speech recognition engine to match your selected language dialect.
          </p>
          <a href="#/voice" class="btn btn--primary">
            Try Voice Assistant in Your Language →
          </a>
        </div>

      </div>
    </div>
  `;
}
