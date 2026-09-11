export function renderSafetyPage(): string {
  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--red" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            CLINICAL ETHICS & BOUNDARIES
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Safety & Medical Charter
          </h1>
          <p class="text-base text-muted">
            Our strict clinical safety boundaries, ethical principles, and patient protection standards.
          </p>
        </div>

        <!-- What JeevanSetu IS vs IS NOT Bento -->
        <div class="grid grid--2" style="margin-bottom: var(--space-xl);">
          
          <div class="card card--green" style="border-radius: var(--radius-xl);">
            <div style="font-size: var(--text-xs); font-weight: 800; color: var(--color-primary-dark); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 12px;">
              WHAT JEEVANSETU IS:
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: var(--text-sm); font-weight: 500;">
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-primary-dark); font-weight: bold;">✓</span> An urgent symptom triage and urgency classifier</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-primary-dark); font-weight: bold;">✓</span> A first-aid emergency response guide (DOs and DON'Ts)</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-primary-dark); font-weight: bold;">✓</span> A bridge directing patients to appropriate PHCs/hospitals</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-primary-dark); font-weight: bold;">✓</span> An educational health library for rural families</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-primary-dark); font-weight: bold;">✓</span> A low-bandwidth emergency aid tool</li>
            </ul>
          </div>

          <div class="card card--red" style="border-radius: var(--radius-xl);">
            <div style="font-size: var(--text-xs); font-weight: 800; color: var(--color-danger-dark); text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 12px;">
              WHAT JEEVANSETU IS NOT:
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: var(--text-sm); font-weight: 500;">
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-danger-dark); font-weight: bold;">✕</span> NOT a licensed medical doctor or specialist</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-danger-dark); font-weight: bold;">✕</span> NOT a definitive medical diagnostic machine</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-danger-dark); font-weight: bold;">✕</span> NOT a replacement for emergency ambulance/ICU</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-danger-dark); font-weight: bold;">✕</span> NOT an online prescription or pharmacy seller</li>
              <li style="display: flex; gap: 8px;"><span style="color: var(--color-danger-dark); font-weight: bold;">✕</span> NOT a proponent of unverified home concoctions</li>
            </ul>
          </div>

        </div>

        <!-- Four Core Clinical Safety Mandates Bento -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div class="section-label">CORE SAFETY ARCHITECTURE</div>
          <h2 class="text-h3" style="margin-bottom: var(--space-lg);">Our Four Safety Commitments</h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
            
            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <div class="pill pill--green pill--lg" style="flex-shrink: 0;">1</div>
              <div>
                <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 2px;">Immediate Prioritization of Danger Flags</h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  Whenever high-risk red flag keywords (e.g. chest pain, snake bite, gasping, heavy bleeding) are detected, the system immediately cuts through lengthy forms and presents direct 108 emergency calling and hospital routing.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <div class="pill pill--green pill--lg" style="flex-shrink: 0;">2</div>
              <div>
                <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 2px;">Zero Dangerous "Remedies"</h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  We strictly curate first-aid guidance against recognized WHO and ICMR guidelines. The system never generates unverified folk mixtures, cutting techniques, or harmful home experiments.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <div class="pill pill--green pill--lg" style="flex-shrink: 0;">3</div>
              <div>
                <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 2px;">Privacy Without Forced Sign-Ups</h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  Access to emergency first-aid protocols and symptom triage is 100% free and open without requiring phone number OTPs, account creation, or tracking cookies.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <div class="pill pill--green pill--lg" style="flex-shrink: 0;">4</div>
              <div>
                <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin-bottom: 2px;">Offline Reliability for Remote Areas</h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  When rural mobile towers lose power or connectivity is absent, critical first-aid instructions remain locally stored in browser memory so life-saving information is never unreachable.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div style="text-align: center;">
          <a href="#/emergency" class="btn btn--emergency btn--lg">
            🚨 View 24/7 Emergency Protocols
          </a>
        </div>

      </div>
    </div>
  `;
}
