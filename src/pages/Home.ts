import { I18nService } from '../services/i18nService';

export function renderHomePage(): string {
  const t = (key: string, def: string = '') => I18nService.t(key, def);

  return `
    <div class="page-content">
      <!-- ── HERO BENTO SECTION ── -->
      <section class="section" style="padding-top: var(--space-lg); padding-bottom: var(--space-xl);">
        <div class="container">
          
          <div class="bento-grid" style="align-items: stretch;">
            
            <!-- Bento Hero Card (8 cols) -->
            <div class="col-span-8 card card--green" style="padding: clamp(24px, 4vw, 48px); display: flex; flex-direction: column; justify-content: space-between; min-height: 420px; border-radius: var(--radius-xl);">
              <div>
                <div class="badge badge--green" style="margin-bottom: var(--space-md); box-shadow: var(--shadow-xs);">
                  <span class="badge-dot badge-dot--pulse"></span>
                  ${t('home.badge', 'AI-POWERED HEALTH TRIAGE')}
                </div>

                <h1 class="text-hero" style="margin-bottom: var(--space-md);">
                  ${t('home.hero.title1', 'Right Care.')}<br />
                  <span class="text-gradient-green">${t('home.hero.title2', 'Right When You Need It.')}</span>
                </h1>

                <p class="text-lg text-muted" style="max-width: 580px; line-height: var(--leading-relaxed); margin-bottom: var(--space-lg);">
                  ${t('home.hero.subtitle', 'Empowering rural communities with instant symptom triage, life-saving emergency first aid, and direct routing to nearest verified health centers.')}
                </p>
              </div>

              <div>
                <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: center; margin-bottom: var(--space-lg);">
                  <a href="#/symptoms" class="btn btn--primary btn--lg">
                    ${t('home.btn.checkSymptoms', '🩺 Check Symptoms →')}
                  </a>
                  <a href="#/voice" class="btn btn--secondary btn--lg">
                    ${t('home.btn.speakAssistant', '🎙️ Speak to Assistant')}
                  </a>
                </div>

                <!-- Feature Highlights Pills -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <span class="badge badge--paper">${t('home.pill.instant', '⚡ Instant Assessment')}</span>
                  <span class="badge badge--paper">${t('home.pill.offline', '📶 100% Offline Ready')}</span>
                  <span class="badge badge--paper">${t('home.pill.verified', '🛡️ Clinically Verified')}</span>
                  <span class="badge badge--paper">${t('home.pill.privacy', '🔒 Zero Data Stored')}</span>
                </div>
              </div>
            </div>

            <!-- Bento Emergency Card (4 cols) -->
            <div class="col-span-4 card card--red" style="padding: clamp(20px, 3vw, 32px); display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); min-height: 420px;">
              <div>
                <div class="badge badge--red" style="margin-bottom: var(--space-md); box-shadow: var(--shadow-xs);">
                  <span class="badge-dot badge-dot--pulse"></span>
                  ${t('home.emergency.badge', '24/7 RAPID FIRST AID')}
                </div>

                <h2 style="font-size: var(--text-h2); font-weight: var(--font-weight-xbold); line-height: var(--leading-tight); color: var(--color-danger-dark); margin-bottom: var(--space-sm);">
                  ${t('home.emergency.title', 'Medical Emergency?')}
                </h2>
                <p class="text-sm text-body" style="line-height: var(--leading-relaxed); margin-bottom: var(--space-md);">
                  ${t('home.emergency.subtitle', 'Instant step-by-step first-aid protocols for snake bites, chest pain, stroke, burns, and trauma.')}
                </p>

                <div class="card card--paper" style="padding: 12px; margin-bottom: var(--space-md); border-radius: var(--radius-md);">
                  <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-danger-dark); margin-bottom: 4px;">${t('home.emergency.hotlines', 'DIRECT AMBULANCE HOTLINES')}</div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <a href="tel:108" class="btn btn--emergency btn--sm" style="flex: 1;">${t('home.emergency.call108', '📞 Call 108')}</a>
                    <a href="tel:102" class="btn btn--outline btn--sm" style="flex: 1;">${t('home.emergency.call102', '🤱 Call 102')}</a>
                  </div>
                </div>
              </div>

              <div>
                <a href="#/emergency" class="btn btn--emergency btn--lg btn--full">
                  ${t('home.emergency.openGuides', '🚨 Open Emergency Guides →')}
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ── SECTION 2: QUICK ACCESS TILES ── -->
      <section class="section--tight">
        <div class="container">
          <div class="section-label">${t('home.quickAccess', 'QUICK ACCESS TILES')}</div>
          
          <div class="grid grid--4">
            
            <a href="#/symptoms" class="card card--green card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🩺</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">${t('home.tile.symptoms.title', 'Check Symptoms')}</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">${t('home.tile.symptoms.sub', 'Evaluate urgency in seconds and get structured next steps.')}</p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>${t('home.tile.symptoms.cta', 'Start Triage')}</span>
                <span class="pill pill--green" style="width: 28px; height: 28px; font-size: 0.75rem;">→</span>
              </div>
            </a>

            <a href="#/voice" class="card card--blue card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🎙️</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-info-dark);">${t('home.tile.voice.title', 'Voice Assistant')}</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">${t('home.tile.voice.sub', 'Speak naturally in Hindi, Gujarati, or English.')}</p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-info-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>${t('home.tile.voice.cta', 'Speak Now')}</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-info); color: white;">→</span>
              </div>
            </a>

            <a href="#/emergency" class="card card--red card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🚨</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-danger-dark);">${t('home.tile.emergency.title', 'Emergency Protocols')}</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">${t('home.tile.emergency.sub', 'Snakebite, CPR, heart attack, and heavy bleeding steps.')}</p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>${t('home.tile.emergency.cta', 'View First Aid')}</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-danger); color: white;">→</span>
              </div>
            </a>

            <a href="#/care-locator" class="card card--orange card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">📍</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-warning-dark);">${t('home.tile.locator.title', 'Find Health Center')}</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">${t('home.tile.locator.sub', 'Locate nearest PHC, CHC, and 24/7 hospitals.')}</p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>${t('home.tile.locator.cta', 'Locate Now')}</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-warning); color: white;">→</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      <!-- ── SECTION 3: HOW IT WORKS ── -->
      <section class="section">
        <div class="container">
          <div style="text-align: center; max-width: 640px; margin: 0 auto var(--space-xl);">
            <div class="section-label">${t('home.howLabel', 'SIMPLE 3-STEP FLOW')}</div>
            <h2 class="text-h2" style="margin-bottom: 8px;">${t('home.howTitle', 'Bridging the Gap to Immediate Healthcare')}</h2>
            <p class="text-base text-muted">${t('home.howSub', 'Designed for ease of use in rural regions, high-stress situations, and low-connectivity environments.')}</p>
          </div>

          <div class="grid grid--3">
            
            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--green">01</span>
                  <span style="font-size: 2rem;">🗣️</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">${t('home.step1.title', '1. Describe Symptoms')}</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">${t('home.step1.sub', 'Type your symptoms, speak in your mother tongue, or simply tap through common visual condition chips.')}</p>
              </div>
              <div class="badge badge--green" style="margin-top: var(--space-md); width: fit-content;">${t('home.step1.badge', 'Voice & Regional Input')}</div>
            </div>

            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--black">02</span>
                  <span style="font-size: 2rem;">⚡</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">${t('home.step2.title', '2. AI Risk Assessment')}</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">${t('home.step2.sub', 'Identifies red-flag emergency symptoms, categorizes urgency and calculates risk level.')}</p>
              </div>
              <div class="badge badge--blue" style="margin-top: var(--space-md); width: fit-content;">${t('home.step2.badge', 'Evidence-Based Triage')}</div>
            </div>

            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--green">03</span>
                  <span style="font-size: 2rem;">🛡️</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">${t('home.step3.title', '3. Act & Reach Care')}</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">${t('home.step3.sub', "Get clear, verified DOs and DON'Ts, safe supportive measures, and one-tap directions.")}</p>
              </div>
              <div class="badge badge--orange" style="margin-top: var(--space-md); width: fit-content;">${t('home.step3.badge', 'Safe Action Protocols')}</div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── SECTION 4: CLINICAL CONDITIONS ── -->
      <section class="section--tight">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div class="section-label">${t('home.guidesLabel', 'HEALTH GUIDES & PROTOCOLS')}</div>
              <h2 class="text-h2">${t('home.guidesTitle', 'Supported Health Situations')}</h2>
            </div>
            <a href="#/care" class="btn btn--outline btn--sm">${t('home.guidesExplore', 'Explore All Guides →')}</a>
          </div>

          <div class="grid grid--4">
            <a href="#/emergency/snake-bite" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🐍</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">${t('home.cond.snake', 'Snake Bite & Toxin')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.snake.sub', 'Anti-venom protocol & immobilization')}</div>
            </a>

            <a href="#/emergency/heart-attack" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">❤️</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">${t('home.cond.heart', 'Chest Pain & Heart')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.heart.sub', 'Early warning signs & immediate rest')}</div>
            </a>

            <a href="#/emergency/severe-breathing-difficulty" class="card card--blue card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🫁</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-info-dark);">${t('home.cond.breath', 'Breathing Difficulty')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.breath.sub', 'Asthma, chest infection & choking')}</div>
            </a>

            <a href="#/care/fever" class="card card--orange card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🌡️</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark);">${t('home.cond.fever', 'High Fever & Spikes')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.fever.sub', 'Safe hydration & cooling techniques')}</div>
            </a>

            <a href="#/care/stomach-discomfort" class="card card--green card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">⚡</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark);">${t('home.cond.stomach', 'Stomach & Dehydration')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.stomach.sub', 'ORS formulation & food hygiene')}</div>
            </a>

            <a href="#/emergency/child-emergency" class="card card--orange card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">👶</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark);">${t('home.cond.child', 'Child Health Urgency')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.child.sub', 'Pediatric red flags & febrile seizures')}</div>
            </a>

            <a href="#/emergency/pregnancy-emergency" class="card card--purple card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🤰</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-purple);">${t('home.cond.pregnancy', 'Pregnancy Alerts')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.pregnancy.sub', 'Maternal bleeding & labour signals')}</div>
            </a>

            <a href="#/emergency/burns" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🔥</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">${t('home.cond.burns', 'Burns & Scalds')}</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">${t('home.cond.burns.sub', 'Cool running water & clean dressing')}</div>
            </a>
          </div>
        </div>
      </section>

      <!-- ── SECTION 5: SAFETY BANNER ── -->
      <section class="section--tight" style="padding-bottom: var(--space-2xl);">
        <div class="container">
          <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); border-left: 6px solid var(--color-primary);">
            <div style="display: flex; gap: var(--space-md); align-items: flex-start; flex-wrap: wrap;">
              <div style="font-size: 2rem;">🛡️</div>
              <div style="flex: 1; min-width: 260px;">
                <h4 style="font-size: var(--text-base); font-weight: var(--font-weight-bold); margin-bottom: 4px;">
                  ${t('home.safety.title', 'Built for Safety, Accuracy & Trust')}
                </h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-normal);">
                  ${t('home.safety.sub', 'JeevanSetu prevents dangerous traditional practices and guides families safely to certified medical professionals.')}
                </p>
              </div>
              <div>
                <a href="#/safety" class="btn btn--outline btn--sm">
                  ${t('home.safety.cta', 'Read Safety Protocol →')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
