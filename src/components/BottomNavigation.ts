import { I18nService } from '../services/i18nService';

export function renderBottomNavigation(currentPath: string): string {
  const isHome = currentPath === '#/' || currentPath === '';
  const isSymptoms = currentPath.startsWith('#/symptoms') || currentPath.startsWith('#/assessment');
  const isEmergency = currentPath.startsWith('#/emergency');
  const isCare = currentPath.startsWith('#/care') || currentPath.startsWith('#/safety');
  const isLocator = currentPath.startsWith('#/care-locator');

  return `
    <nav class="bottom-nav" aria-label="Mobile Navigation">
      <div class="bottom-nav__list">
        <div class="bottom-nav__item">
          <a href="#/" class="bottom-nav__link ${isHome ? 'active' : ''}">
            <span class="bottom-nav__icon">🏠</span>
            <span class="bottom-nav__label">${I18nService.t('nav.home', 'Home')}</span>
          </a>
        </div>

        <div class="bottom-nav__item">
          <a href="#/symptoms" class="bottom-nav__link ${isSymptoms ? 'active' : ''}">
            <span class="bottom-nav__icon">🩺</span>
            <span class="bottom-nav__label">${I18nService.t('nav.triage', 'Triage')}</span>
          </a>
        </div>

        <div class="bottom-nav__item">
          <a href="#/emergency" class="bottom-nav__link bottom-nav__link--emergency ${isEmergency ? 'active' : ''}">
            <span class="bottom-nav__icon">🚨</span>
            <span class="bottom-nav__label">${I18nService.t('nav.emergency', 'Emergency')}</span>
          </a>
        </div>

        <div class="bottom-nav__item">
          <a href="#/care" class="bottom-nav__link ${isCare ? 'active' : ''}">
            <span class="bottom-nav__icon">🛡️</span>
            <span class="bottom-nav__label">${I18nService.t('nav.care', 'Care')}</span>
          </a>
        </div>

        <div class="bottom-nav__item">
          <a href="#/care-locator" class="bottom-nav__link ${isLocator ? 'active' : ''}">
            <span class="bottom-nav__icon">📍</span>
            <span class="bottom-nav__label">${I18nService.t('nav.locator', 'Locator')}</span>
          </a>
        </div>
      </div>
    </nav>
  `;
}
