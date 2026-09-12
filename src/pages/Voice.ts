import { I18nService } from '../services/i18nService';

export function renderVoicePage(): string {
  const t = (key: string, def: string = '') => I18nService.t(key, def);
  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 760px; text-align: center;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ${t('voice.label', 'VOICE-FIRST ASSISTANT')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${t('voice.title', 'Tell Us What\'s Happening')}
          </h1>
          <p class="text-base text-muted">
            ${t('voice.subtitle', 'Speak naturally in Hindi, Marathi, Gujarati, English, or your regional language. JeevanSetu will listen and guide you step by step.')}
          </p>
        </div>

        <!-- Central Microphone Voice Orb Bento Card -->
        <div class="card card--paper" style="border-radius: var(--radius-2xl); padding: var(--space-2xl) var(--space-lg); margin-bottom: var(--space-xl); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          
          <div class="voice-orb-container">
            <button 
              type="button" 
              class="voice-orb" 
              id="main-voice-button" 
              onclick="window.toggleVoiceRecording()"
              aria-label="Toggle Voice Assistant Recording"
            >
              <span id="voice-icon">🎙️</span>
            </button>
          </div>

          <div class="voice-visualizer" id="voice-visualizer" style="margin: var(--space-md) 0;">
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
            <div class="voice-bar"></div>
          </div>

          <div id="voice-status-text" style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-text-main); margin-top: 4px;">
            ${t('voice.tapToSpeak', 'Tap microphone to speak')}
          </div>

          <div id="voice-subtext" class="text-xs text-muted" style="margin-top: 4px;">
            Supported in Chrome, Edge, Safari, and mobile browsers
          </div>
        </div>

        <!-- Live Transcript Bento Card -->
        <div class="card card--paper" style="text-align: left; margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
            <div class="section-label" style="margin-bottom: 0;">SPOKEN TRANSCRIPT</div>
            <span class="badge badge--paper" id="voice-state-badge">IDLE</span>
          </div>

          <div 
            id="voice-transcript-output" 
            style="min-height: 70px; font-size: var(--text-base); line-height: var(--leading-relaxed); color: var(--color-text-main);"
          >
            <em class="text-muted">${t('voice.placeholder', 'Your spoken words will appear here in real time...')}</em>
          </div>

          <div id="voice-actions" style="display: none; margin-top: var(--space-md); border-top: 1px solid var(--color-gray-200); padding-top: var(--space-md); justify-content: flex-end; gap: 10px;">
            <button type="button" class="btn btn--ghost btn--sm" onclick="window.clearVoiceTranscript()">
              ${t('voice.clear', 'Clear')}
            </button>
            <button type="button" class="btn btn--primary btn--sm" onclick="window.submitVoiceTranscript()">
              ${t('voice.analyze', '⚡ Analyze Voice Symptoms')}
            </button>
          </div>
        </div>

        <!-- Type Alternative Option -->
        <div style="display: flex; justify-content: center; gap: var(--space-md); align-items: center; flex-wrap: wrap;">
          <span class="text-sm text-muted">Prefer typing?</span>
          <a href="#/symptoms" class="btn btn--secondary btn--sm">
            ⌨️ Type Symptoms Instead →
          </a>
        </div>

      </div>
    </div>
  `;
}
