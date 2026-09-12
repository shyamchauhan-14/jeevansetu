/**
 * JeevanSetu Brand Logo Component
 * "Jeevan" (Life / Heartbeat) + "Setu" (Bridge)
 * Visual: Suspension bridge arch carrying a radiant ECG heartbeat pulse with medical cross emblem.
 */

export interface LogoOptions {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  textColor?: string;
  tagline?: boolean;
}

export function renderLogoMark(size: number = 38, className: string = ''): string {
  return `
    <svg 
      class="${className}" 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JeevanSetu Logo: Bridge of Life"
    >
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="jsBridgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>

        <!-- Bridge Arch Gradient -->
        <linearGradient id="jsArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="50%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#06B6D4" />
        </linearGradient>

        <!-- Heartbeat Lifeline Pulse Gradient -->
        <linearGradient id="jsPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="50%" stop-color="#FB7185" />
          <stop offset="100%" stop-color="#F59E0B" />
        </linearGradient>

        <!-- Glow Filter for Pulse -->
        <filter id="jsGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Rounded Container Frame -->
      <rect width="48" height="48" rx="12" fill="url(#jsBridgeBg)" />
      
      <!-- Subtle Tech Accent Ring -->
      <rect x="1" y="1" width="46" height="46" rx="11" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none" />

      <!-- Bridge Main Suspension Arch -->
      <path 
        d="M6 34 C14 21, 34 21, 42 34" 
        stroke="url(#jsArchGrad)" 
        stroke-width="3" 
        stroke-linecap="round"
        fill="none"
      />

      <!-- Bridge Suspension Cables -->
      <line x1="14" y1="27" x2="14" y2="35" stroke="#34D399" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="1 1.5" />
      <line x1="20" y1="24" x2="20" y2="35" stroke="#34D399" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="1 1.5" />
      <line x1="28" y1="24" x2="28" y2="35" stroke="#38BDF8" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="1 1.5" />
      <line x1="34" y1="27" x2="34" y2="35" stroke="#38BDF8" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="1 1.5" />

      <!-- Bridge Foundation Deck Roadway -->
      <path 
        d="M5 35 H43" 
        stroke="#475569" 
        stroke-width="2.5" 
        stroke-linecap="round"
      />

      <!-- Medical Cross at the Apex/Center of Bridge -->
      <g transform="translate(24, 15)">
        <!-- Subtle pulsing circle behind cross -->
        <circle cx="0" cy="0" r="5" fill="#10B981" fill-opacity="0.2" />
        <!-- Cross Bars -->
        <rect x="-1.4" y="-4" width="2.8" height="8" rx="1.4" fill="#10B981" />
        <rect x="-4" y="-1.4" width="8" height="2.8" rx="1.4" fill="#10B981" />
      </g>

      <!-- Vital Lifeline / Heartbeat ECG Pulse Spanning the Bridge Deck -->
      <path 
        d="M7 35 H15 L18 35 L21 31 L24 39 L27 27 L30 36 L33 35 H41" 
        stroke="url(#jsPulseGrad)" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#jsGlow)"
        fill="none"
      />

      <!-- Living Pulse Beacon Node at the Peak -->
      <circle cx="27" cy="27" r="1.8" fill="#FFF" />
    </svg>
  `;
}

export function renderBrandLogo(options: LogoOptions = {}): string {
  const size = options.size || 38;
  const showWordmark = options.showWordmark ?? true;
  const tagline = options.tagline ?? false;

  const mark = renderLogoMark(size, 'navbar__logo-svg');

  if (!showWordmark) {
    return mark;
  }

  return `
    <div class="navbar__logo-group" style="display: flex; align-items: center; gap: 10px;">
      <div class="navbar__logo-mark" style="padding: 0; background: transparent; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${mark}
      </div>
      <div style="display: flex; flex-direction: column;">
        <div class="navbar__logo-text" style="line-height: 1.1;">Jeevan<span>Setu</span></div>
        ${
          tagline
            ? `<span style="font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-primary-dark); margin-top: 1px;">Bridge to Life</span>`
            : ''
        }
      </div>
    </div>
  `;
}
