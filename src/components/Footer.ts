import { I18nService } from '../services/i18nService';
import { renderLogoMark } from './BrandLogo';

export function renderFooter(): string {
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="navbar__logo" style="margin-bottom: 12px;">
              <div class="navbar__logo-mark" aria-hidden="true" style="padding: 0; background: transparent; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                ${renderLogoMark(38)}
              </div>
              <div class="navbar__logo-text">Jeevan<span>Setu</span></div>
            </div>
            <p class="text-sm text-muted" style="max-width: 320px; line-height: var(--leading-relaxed); margin-bottom: 16px;">
              "Bridge to Life" — ${I18nService.t('home.heroSub', 'AI-assisted triage, emergency first-aid protocols, and evidence-based healthcare guidance for rural communities.')}
            </p>
            <div>
              <!-- Note: Removed the emoji from inside the default translation string to match the others -->
              <a href="#/emergency" class="btn btn--emergency btn--sm">
                🚨 ${I18nService.t('nav.directHelp', '108 Direct Hotline')}
              </a>
            </div>
          </div>

          <div>
            <h4 class="footer__title">Navigation</h4>
            <div class="footer__links">
              <a href="#/">🏠 ${I18nService.t('nav.home', 'Home')}</a>
              <a href="#/symptoms">🩺 ${I18nService.t('nav.triage', 'Symptom Checker')}</a>
              <a href="#/emergency">🚨 ${I18nService.t('nav.emergency', 'Emergency Center')}</a>
              <a href="#/care">🛡️ ${I18nService.t('nav.care', 'Safe Temporary Care')}</a>
              <a href="#/guide">📚 ${I18nService.t('nav.guide', 'Health Wisdom Guide')}</a>
              <a href="#/care-locator">📍 ${I18nService.t('nav.locator', 'Find Nearest Hospital')}</a>
            </div>
          </div>

          <div>
            <h4 class="footer__title">Tools & AI</h4>
            <div class="footer__links">
              <a href="#/voice">${I18nService.t('quick.voiceTitle', 'Voice Assistant')}</a>
              <a href="#/language">${I18nService.t('nav.allLanguages', 'Regional Languages')}</a>
              <a href="#/profile">${I18nService.t('nav.profile', 'Medical Profile')}</a>
              <a href="#/history">${I18nService.t('nav.history', 'Triage History')}</a>
              <a href="#/settings">${I18nService.t('nav.settings', 'Settings')}</a>
              <a href="#/offline">${I18nService.t('nav.offline', 'Offline Guides')}</a>
            </div>
          </div>

          <div>
            <h4 class="footer__title">Helplines & Trust</h4>
            <div class="footer__links">
              <a href="#/safety">🛡️ ${I18nService.t('nav.safety', 'Safety & Protocols')}</a>
              <a href="#/privacy">🔒 ${I18nService.t('nav.privacy', 'Privacy Guarantee')}</a>
              <div class="card card--paper" style="padding: 12px; margin-top: 6px; font-size: var(--text-xs); line-height: 1.6;">
                <div>🚑 Ambulance: <strong>108</strong></div>
                <div>🤱 Maternal: <strong>102</strong></div>
                <div>📞 Health Helpline: <strong>104 / 1075</strong></div>
                <div>🚨 National Emergency: <strong>112</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p style="font-size: var(--text-xs); color: var(--color-text-muted); max-width: 760px; line-height: 1.5;">
            ⚠️ <strong>${I18nService.t('common.disclaimerTitle', 'CLINICAL DISCLAIMER')}:</strong> ${I18nService.t('common.disclaimerText', 'JeevanSetu provides educational triage and first-response emergency guidance. It does not replace professional diagnosis by a qualified medical officer. In severe emergencies, call 108 immediately.')}
          </p>
          <div style="font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap;">
            © 2026 JeevanSetu • Bridge to Care
          </div>
        </div>
      </div>
    </footer>
  `;
}