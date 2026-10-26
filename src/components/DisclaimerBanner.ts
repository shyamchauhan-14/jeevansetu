export function renderDisclaimerBanner(): string {
  return `
    <div class="disclaimer-banner" role="note">
      <div class="disclaimer-banner__icon">⚠️</div>
      <div>
        <h4 class="disclaimer-banner__title">Medical & Triage Disclaimer</h4>
        <p class="disclaimer-banner__text">
          JeevanSetu provides educational triage and first-response guidance. It does <strong>not replace a doctor</strong>, medical diagnosis, or emergency hospitalization. If symptoms appear severe or sudden, call <strong>108</strong> immediately.
        </p>
      </div>
    </div>
  `;
}
