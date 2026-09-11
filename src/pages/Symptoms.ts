import { COMMON_SYMPTOMS, FOLLOW_UP_QUESTIONS } from '../data/symptoms';

export function renderSymptomsPage(): string {
  const chipsHtml = COMMON_SYMPTOMS.map((symptom) => {
    const redFlagAttr = symptom.isRedFlag ? 'data-redflag="true"' : '';
    const badgeText = symptom.isRedFlag ? '<span style="color: var(--color-danger); margin-left: 4px;">●</span>' : '';
    return `
      <button 
        type="button" 
        class="chip ${symptom.isRedFlag ? 'chip--redflag' : ''}" 
        data-symptom-id="${symptom.id}" 
        ${redFlagAttr}
        onclick="window.toggleSymptomChip(this, '${symptom.id}')"
        aria-pressed="false"
      >
        <span>${symptom.icon}</span>
        <span>${symptom.name}</span>
        ${badgeText}
      </button>
    `;
  }).join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 880px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            AI SYMPTOM TRIAGE
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            What symptoms are you experiencing?
          </h1>
          <p class="text-base text-muted">
            Tell us what you or your family member are feeling. We will evaluate urgency and recommend safe next steps.
          </p>
        </div>

        <form id="symptom-form" onsubmit="window.handleSymptomSubmit(event)">
          
          <!-- Step 1: Input text / voice -->
          <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
              <label for="symptom-description" class="input-label" style="font-size: var(--text-base); margin-bottom: 0;">
                1. Describe in your own words
              </label>
              <a href="#/voice" class="btn btn--outline btn--sm">
                🎙️ Speak Instead
              </a>
            </div>

            <textarea 
              id="symptom-description" 
              name="description" 
              class="textarea" 
              placeholder="Example: High fever since yesterday, chest tightness, headache, and feeling dizzy when standing..."
              rows="3"
            ></textarea>
          </div>

          <!-- Step 2: Select Symptom Chips -->
          <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl);">
            <div style="margin-bottom: var(--space-md);">
              <div class="input-label" style="font-size: var(--text-base);">
                2. Tap all symptoms that apply
              </div>
              <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px;">
                <span style="color: var(--color-danger); font-weight: bold;">●</span> Marks critical warning symptoms
              </div>
            </div>

            <div class="chip-group" id="symptoms-chip-group" style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${chipsHtml}
            </div>
          </div>

          <!-- Step 3: Duration question -->
          <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl);">
            <div style="margin-bottom: var(--space-md);">
              <div class="input-label" style="font-size: var(--text-base);">
                3. ${FOLLOW_UP_QUESTIONS.duration.question}
              </div>
              <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px;">
                ${FOLLOW_UP_QUESTIONS.duration.subtext}
              </div>
            </div>

            <div class="grid grid--2">
              ${FOLLOW_UP_QUESTIONS.duration.options
                .map(
                  (opt, idx) => `
                <label class="card card--clickable" style="display: flex; align-items: center; gap: 12px; margin: 0; padding: var(--space-md); border-radius: var(--radius-md);">
                  <input type="radio" name="duration" value="${opt.value}" ${idx === 0 ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--color-primary);" />
                  <span style="font-weight: var(--font-weight-semi); font-size: var(--text-sm);">${opt.label}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Step 4: Severity Scale -->
          <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
            <div style="margin-bottom: var(--space-md);">
              <div class="input-label" style="font-size: var(--text-base);">
                4. ${FOLLOW_UP_QUESTIONS.severity.question}
              </div>
              <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px;">
                ${FOLLOW_UP_QUESTIONS.severity.subtext}
              </div>
            </div>

            <div class="grid grid--3">
              <label class="card card--green card--clickable" style="display: flex; flex-direction: column; gap: 6px; padding: var(--space-md); border-radius: var(--radius-md);">
                <input type="radio" name="severity" value="mild" checked style="accent-color: var(--color-primary);" />
                <span style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-primary-dark);">🟢 Mild</span>
                <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Able to speak & move normally</span>
              </label>

              <label class="card card--orange card--clickable" style="display: flex; flex-direction: column; gap: 6px; padding: var(--space-md); border-radius: var(--radius-md);">
                <input type="radio" name="severity" value="moderate" style="accent-color: var(--color-warning);" />
                <span style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-warning-dark);">🟠 Moderate</span>
                <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Significant distress, resting</span>
              </label>

              <label class="card card--red card--clickable" style="display: flex; flex-direction: column; gap: 6px; padding: var(--space-md); border-radius: var(--radius-md);">
                <input type="radio" name="severity" value="severe" style="accent-color: var(--color-danger);" />
                <span style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-danger-dark);">🔴 Severe</span>
                <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Unbearable, cannot stand/talk</span>
              </label>
            </div>
          </div>

          <!-- Submit Action -->
          <div style="display: flex; gap: var(--space-md); align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <a href="#/" class="btn btn--ghost">
              ← Back to Home
            </a>
            
            <button type="submit" class="btn btn--primary btn--xl" id="submit-triage-btn">
              Analyze Symptoms & Get Guidance →
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
