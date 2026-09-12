import { StorageService } from '../services/storageService';
import { I18nService } from '../services/i18nService';

export function renderSettingsPage(): string {
  const currentLang = StorageService.getLanguage();
  const t = (key: string, def: string = '') => I18nService.t(key, def);

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 780px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ${t('settings.label', 'APP PREFERENCES')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${t('settings.title', 'Settings & Accessibility')}
          </h1>
          <p class="text-base text-muted">
            Configure accessibility, audio, language, and offline storage preferences.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
          
          <!-- Language Setting Bento Card -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold);">Primary Language</h3>
                <p class="text-sm text-muted">Current language for symptom triage & voice assistance</p>
              </div>
              <a href="#/language" class="btn btn--outline btn--sm">
                Change (${currentLang.toUpperCase()}) →
              </a>
            </div>
          </div>

          <!-- Text Size / Accessibility Bento Card -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 4px;">Typography & Readability</h3>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-md);">
              Adjust text size for easier reading in bright daylight or on small phone screens.
            </p>
            <div class="grid grid--3">
              <button type="button" class="btn btn--outline btn--sm" onclick="document.documentElement.style.fontSize='16px'; window.showToast('Font size set to Standard', 'success');">Standard (100%)</button>
              <button type="button" class="btn btn--outline btn--sm" onclick="document.documentElement.style.fontSize='18px'; window.showToast('Font size set to Large', 'success');">Large (115%)</button>
              <button type="button" class="btn btn--outline btn--sm" onclick="document.documentElement.style.fontSize='20px'; window.showToast('Font size set to Extra Large', 'success');">Extra Large (125%)</button>
            </div>
          </div>

          <!-- Voice & Speech Speed Bento Card -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 4px;">Voice Assistant Accessibility</h3>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-sm);">
              Speech speed and audio accessibility prompts.
            </p>
            <label style="display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: var(--text-sm); cursor: pointer;">
              <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--color-primary);" />
              <span>Read triage results aloud automatically (Screen-Reader Friendly)</span>
            </label>
          </div>

          <!-- Offline Storage Management Bento Card -->
          <div class="card card--green" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">Offline Emergency Cache</h3>
                <p class="text-sm text-muted">13 clinical emergency protocols are saved locally on this phone.</p>
              </div>
              <span class="badge badge--green">✓ 100% Synced</span>
            </div>
          </div>

          <!-- Privacy & Data Controls Bento Card -->
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
            <h3 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 4px;">Privacy & Local Storage</h3>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-md);">
              All profile and symptom history data is stored exclusively in your device’s browser.
            </p>
            <button type="button" class="btn btn--ghost btn--sm" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3);" onclick="window.clearAllAppData()">
              🗑️ Reset All Local Data & History
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}
