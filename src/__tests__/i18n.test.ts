import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService } from '../services/i18nService';

describe('Phase 3 — Multilingual & UX Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Defaults to English and falls back gracefully when key is missing', () => {
    expect(I18nService.getCurrentLanguage()).toBe('en');
    expect(I18nService.t('nav.home')).toBe('Home');
    expect(I18nService.t('non_existent_key', 'Fallback Label')).toBe('Fallback Label');
  });

  it('Correctly serves verified Hindi translations for critical emergency terms', () => {
    I18nService.setLanguage('hi');
    expect(I18nService.getCurrentLanguage()).toBe('hi');
    expect(I18nService.t('nav.emergency')).toBe('आपातकालीन SOS');
    expect(I18nService.t('home.call108')).toContain('108 एम्बुलेंस को कॉल करें');
    expect(I18nService.t('sos.stateCallOpened')).toContain('डायल पैड खुला');
  });

  it('Correctly serves verified Gujarati translations for critical emergency terms', () => {
    I18nService.setLanguage('gu');
    expect(I18nService.getCurrentLanguage()).toBe('gu');
    expect(I18nService.t('nav.emergency')).toBe('ઇમરજન્સી SOS');
    expect(I18nService.t('home.call108')).toContain('108 એમ્બ્યુલન્સને કૉલ કરો');
    expect(I18nService.t('sos.holdToActivate')).toContain('SOS શરૂ કરવા 2 સેકન્ડ દબાવી રાખો');
  });

  it('Guarantees non-empty disclaimers in all three supported languages', () => {
    ['en', 'hi', 'gu'].forEach((lang) => {
      I18nService.setLanguage(lang as any);
      const disclaimer = I18nService.t('triage.disclaimer');
      expect(disclaimer.length).toBeGreaterThan(15);
      expect(disclaimer).not.toBe('triage.disclaimer');
    });
  });
});
