import { StorageService } from '../services/storageService';
import { I18nService } from '../services/i18nService';
import { renderLogoMark } from './BrandLogo';

export function renderNavbar(currentPath: string): string {
  const currentLang = StorageService.getLanguage();
  const t = (key: string, def: string) => I18nService.t(key, def);

  const links = [
    { path: '#/', label: t('nav.home', 'Home'), icon: '🏠' },
    { path: '#/symptoms', label: t('nav.triage', 'Triage AI'), icon: '🩺' },
    { path: '#/emergency', label: t('nav.emergency', 'Emergency'), icon: '🚨' },
    { path: '#/care', label: t('nav.care', 'Safe Care'), icon: '🛡️' },
    { path: '#/guide', label: t('nav.guide', 'Guide'), icon: '📚' },
    { path: '#/care-locator', label: t('nav.locator', 'Find Care'), icon: '📍' }
  ];

  const desktopNavItems = links
    .map((item) => {
      const isEmergency = item.path === '#/emergency';
      const isActive = currentPath === item.path || (item.path !== '#/' && currentPath.startsWith(item.path));
      return `<a href="${item.path}" class="navbar__link ${isActive ? 'active' : ''} ${isEmergency ? 'text-red font-bold' : ''}">${item.icon} ${item.label}</a>`;
    })
    .join('');

  const mobileNavItems = links
    .map((item) => {
      const isActive = currentPath === item.path || (item.path !== '#/' && currentPath.startsWith(item.path));
      const isEmergency = item.path === '#/emergency';
      return `
        <a href="${item.path}" class="mobile-menu__link ${isActive ? 'active' : ''} ${isEmergency ? 'text-red font-bold' : ''}" onclick="window.closeMobileMenu()">
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
          <div class="navbar__logo-mark" aria-hidden="true" style="padding: 0; background: transparent; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            ${renderLogoMark(38)}
          </div>
          <div class="navbar__logo-text">Jeevan<span>Setu</span></div>
        </a>

        <nav class="navbar__nav" role="navigation" aria-label="Primary Navigation">
          ${desktopNavItems}
        </nav>

        <div class="navbar__actions">
          <!-- Language Switcher: EN / हिन्दी / ગુજ -->
          <div class="navbar__lang" role="group" aria-label="Language Selector">
            <button class="navbar__lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="window.setAppLanguage('en')" title="English">EN</button>
            <button class="navbar__lang-btn ${currentLang === 'hi' ? 'active' : ''}" onclick="window.setAppLanguage('hi')" title="हिन्दी">हिन्दी</button>
            <button class="navbar__lang-btn ${currentLang === 'gu' ? 'active' : ''}" onclick="window.setAppLanguage('gu')" title="ગુજરાતી">ગુજ</button>
          </div>

          <a href="#/emergency" class="btn btn--emergency btn--sm" aria-label="Emergency Help">
            ${t('nav.directHelp', '🚨 108')}
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
        <!-- Language buttons in mobile menu -->
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 8px;">
          <button class="btn btn--outline btn--sm ${currentLang === 'en' ? 'btn--active' : ''}" onclick="window.setAppLanguage('en'); window.closeMobileMenu();">🇬🇧 English</button>
          <button class="btn btn--outline btn--sm ${currentLang === 'hi' ? 'btn--active' : ''}" onclick="window.setAppLanguage('hi'); window.closeMobileMenu();">🇮🇳 हिन्दी</button>
          <button class="btn btn--outline btn--sm ${currentLang === 'gu' ? 'btn--active' : ''}" onclick="window.setAppLanguage('gu'); window.closeMobileMenu();">🇮🇳 ગુજ</button>
        </div>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <a href="#/profile" class="btn btn--ghost btn--sm" onclick="window.closeMobileMenu()">${t('nav.profile', '👤 Profile')}</a>
          <a href="#/history" class="btn btn--ghost btn--sm" onclick="window.closeMobileMenu()">${t('nav.history', '📋 History')}</a>
        </div>
      </div>
    </div>
  `;
}
