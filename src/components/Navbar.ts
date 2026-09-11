import { StorageService } from '../services/storageService';
import { I18nService } from '../services/i18nService';

export function renderNavbar(currentPath: string): string {
  const currentLang = StorageService.getLanguage();

  const links = [
    { path: '#/', label: I18nService.t('nav.home', 'Home'), icon: '🏠' },
    { path: '#/symptoms', label: I18nService.t('nav.triage', 'Triage AI'), icon: '🩺' },
    { path: '#/emergency', label: I18nService.t('nav.emergency', 'Emergency'), icon: '🚨' },
    { path: '#/care', label: I18nService.t('nav.care', 'Safe Care'), icon: '🛡️' },
    { path: '#/guide', label: I18nService.t('nav.guide', 'Guide'), icon: '📚' },
    { path: '#/care-locator', label: I18nService.t('nav.locator', 'Find Care'), icon: '📍' }
  ];

  const desktopNavItems = links
    .map((item) => {
      const isEmergency = item.path === '#/emergency';
      const isActive = currentPath === item.path || (item.path !== '#/' && currentPath.startsWith(item.path));
      const activeClass = isActive ? 'active' : '';
      const emergencyClass = isEmergency ? 'text-red font-bold' : '';

      return `<a href="${item.path}" class="navbar__link ${activeClass} ${emergencyClass}">${item.icon} ${item.label}</a>`;
    })
    .join('');

  const mobileNavItems = links
    .map((item) => {
      const isActive = currentPath === item.path || (item.path !== '#/' && currentPath.startsWith(item.path));
      const activeClass = isActive ? 'active' : '';
      const isEmergency = item.path === '#/emergency';
      const emergencyClass = isEmergency ? 'text-red font-bold' : '';

      return `
        <a href="${item.path}" class="mobile-menu__link ${activeClass} ${emergencyClass}" onclick="window.closeMobileMenu()">
          <span>${item.icon} ${item.label}</span>
          <span style="font-size: 0.85rem; opacity: 0.5;">→</span>
        </a>
      `;
    })
    .join('');

  return `
    <div class="navbar-wrapper">
      <header class="navbar" role="banner">
        <a href="#/" class="navbar__logo" aria-label="JeevanSetu Home">
          <div class="navbar__logo-mark" aria-hidden="true">🌱</div>
          <div class="navbar__logo-text">Jeevan<span>Setu</span></div>
        </a>

        <nav class="navbar__nav" role="navigation" aria-label="Primary Navigation">
          ${desktopNavItems}
        </nav>

        <div class="navbar__actions">
          <div class="navbar__lang" role="group" aria-label="Language Selector">
            <button class="navbar__lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="window.setAppLanguage('en')">EN</button>
            <button class="navbar__lang-btn ${currentLang === 'hi' ? 'active' : ''}" onclick="window.setAppLanguage('hi')">हिन्दी</button>
            <button class="navbar__lang-btn ${currentLang === 'gu' ? 'active' : ''}" onclick="window.setAppLanguage('gu')">ગુજ</button>
            <button class="navbar__lang-btn ${currentLang === 'mr' ? 'active' : ''}" onclick="window.setAppLanguage('mr')">मरा</button>
          </div>

          <a href="#/emergency" class="btn btn--emergency btn--sm" aria-label="Emergency Help">
            ${I18nService.t('nav.directHelp', '🚨 108 Direct')}
          </a>

          <button class="navbar__hamburger" id="navbar-hamburger" onclick="window.toggleMobileMenu()" aria-label="Toggle Navigation Menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div class="mobile-menu" id="mobile-menu" role="menu">
        ${mobileNavItems}
        <div class="divider divider--light"></div>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <a href="#/language" class="btn btn--outline btn--sm" onclick="window.closeMobileMenu()">${I18nService.t('nav.allLanguages', '🌐 All Languages')}</a>
          <a href="#/profile" class="btn btn--ghost btn--sm" onclick="window.closeMobileMenu()">${I18nService.t('nav.profile', '👤 Profile')}</a>
          <a href="#/history" class="btn btn--ghost btn--sm" onclick="window.closeMobileMenu()">${I18nService.t('nav.history', '📋 History')}</a>
        </div>
      </div>
    </div>
  `;
}
