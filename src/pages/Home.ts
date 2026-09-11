export function renderHomePage(): string {
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
                  AI-POWERED HEALTH TRIAGE • 10+ REGIONAL LANGUAGES
                </div>

                <h1 class="text-hero" style="margin-bottom: var(--space-md);">
                  Right Care.<br />
                  <span class="text-gradient-green">Right When You Need It.</span>
                </h1>

                <p class="text-lg text-muted" style="max-width: 580px; line-height: var(--leading-relaxed); margin-bottom: var(--space-lg);">
                  Empowering rural communities with instant symptom triage, life-saving emergency first aid, and direct routing to nearest verified health centers.
                </p>
              </div>

              <div>
                <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: center; margin-bottom: var(--space-lg);">
                  <a href="#/symptoms" class="btn btn--primary btn--lg">
                    🩺 Check Symptoms →
                  </a>
                  <a href="#/voice" class="btn btn--secondary btn--lg">
                    🎙️ Speak to Assistant
                  </a>
                </div>

                <!-- Feature Highlights Pills -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <span class="badge badge--paper">⚡ Instant Assessment</span>
                  <span class="badge badge--paper">📶 100% Offline Ready</span>
                  <span class="badge badge--paper">🛡️ Clinically Verified</span>
                  <span class="badge badge--paper">🔒 Zero Data Stored</span>
                </div>
              </div>
            </div>

            <!-- Bento Emergency Card (4 cols) -->
            <div class="col-span-4 card card--red" style="padding: clamp(20px, 3vw, 32px); display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); min-height: 420px;">
              <div>
                <div class="badge badge--red" style="margin-bottom: var(--space-md); box-shadow: var(--shadow-xs);">
                  <span class="badge-dot badge-dot--pulse"></span>
                  24/7 RAPID FIRST AID
                </div>

                <h2 style="font-size: var(--text-h2); font-weight: var(--font-weight-xbold); line-height: var(--leading-tight); color: var(--color-danger-dark); margin-bottom: var(--space-sm);">
                  Medical Emergency?
                </h2>
                <p class="text-sm text-body" style="line-height: var(--leading-relaxed); margin-bottom: var(--space-md);">
                  Instant step-by-step first-aid protocols for snake bites, chest pain, stroke, burns, and trauma.
                </p>

                <div class="card card--paper" style="padding: 12px; margin-bottom: var(--space-md); border-radius: var(--radius-md);">
                  <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-danger-dark); margin-bottom: 4px;">DIRECT AMBULANCE HOTLINES</div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <a href="tel:108" class="btn btn--emergency btn--sm" style="flex: 1;">📞 Call 108</a>
                    <a href="tel:102" class="btn btn--outline btn--sm" style="flex: 1;">🤱 Call 102</a>
                  </div>
                </div>
              </div>

              <div>
                <a href="#/emergency" class="btn btn--emergency btn--lg btn--full">
                  🚨 Open Emergency Guides →
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ── SECTION 2: PLAYFUL QUICK ACCESS TILES ── -->
      <section class="section--tight">
        <div class="container">
          <div class="section-label">QUICK ACCESS TILES</div>
          
          <div class="grid grid--4">
            
            <!-- Quick Action 1: Symptom Checker -->
            <a href="#/symptoms" class="card card--green card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🩺</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">Check Symptoms</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">
                  Evaluate urgency in seconds and get structured next steps.
                </p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>Start Triage</span>
                <span class="pill pill--green" style="width: 28px; height: 28px; font-size: 0.75rem;">→</span>
              </div>
            </a>

            <!-- Quick Action 2: Talk to AI -->
            <a href="#/voice" class="card card--blue card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🎙️</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-info-dark);">Voice Assistant</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">
                  Speak naturally in Hindi, Gujarati, Marathi, or English.
                </p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-info-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>Speak Now</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-info); color: white;">→</span>
              </div>
            </a>

            <!-- Quick Action 3: Emergency Protocols -->
            <a href="#/emergency" class="card card--red card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🚨</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-danger-dark);">Emergency Protocols</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">
                  Snakebite, CPR, heart attack, and heavy bleeding steps.
                </p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>View First Aid</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-danger); color: white;">→</span>
              </div>
            </a>

            <!-- Quick Action 4: Find Care -->
            <a href="#/care-locator" class="card card--orange card--clickable" style="text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; min-height: 210px; border-radius: var(--radius-lg);">
              <div>
                <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">📍</div>
                <h3 style="font-size: var(--text-h4); font-weight: var(--font-weight-bold); color: var(--color-warning-dark);">Find Health Center</h3>
                <p class="text-sm text-body" style="margin-top: 6px;">
                  Locate nearest PHC, CHC, and 24/7 hospitals.
                </p>
              </div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark); margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>Locate Now</span>
                <span class="pill" style="width: 28px; height: 28px; font-size: 0.75rem; background: var(--color-warning); color: white;">→</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      <!-- ── SECTION 3: HOW IT WORKS BENTO PROGRESSION ── -->
      <section class="section">
        <div class="container">
          <div style="text-align: center; max-width: 640px; margin: 0 auto var(--space-xl);">
            <div class="section-label">SIMPLE 3-STEP FLOW</div>
            <h2 class="text-h2" style="margin-bottom: 8px;">
              Bridging the Gap to Immediate Healthcare
            </h2>
            <p class="text-base text-muted">
              Designed for ease of use in rural regions, high-stress situations, and low-connectivity environments.
            </p>
          </div>

          <div class="grid grid--3">
            
            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--green">01</span>
                  <span style="font-size: 2rem;">🗣️</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">1. Describe Symptoms</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  Type your symptoms, speak in your mother tongue, or simply tap through common visual condition chips.
                </p>
              </div>
              <div class="badge badge--green" style="margin-top: var(--space-md); width: fit-content;">Voice & Regional Input</div>
            </div>

            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--black">02</span>
                  <span style="font-size: 2rem;">⚡</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">2. AI Risk Assessment</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  Identifies red-flag emergency symptoms, categorizes urgency (Critical, Urgent, Routine, Home Care), and calculates risk level.
                </p>
              </div>
              <div class="badge badge--blue" style="margin-top: var(--space-md); width: fit-content;">Evidence-Based Triage</div>
            </div>

            <div class="card card--paper" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); padding: var(--space-xl);">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                  <span class="pill pill--lg pill--green">03</span>
                  <span style="font-size: 2rem;">🛡️</span>
                </div>
                <h3 class="text-h4" style="margin-bottom: 8px;">3. Act & Reach Care</h3>
                <p class="text-sm text-muted" style="line-height: var(--leading-relaxed);">
                  Get clear, verified DOs and DON'Ts, safe supportive measures, and one-tap directions to nearest available medical beds.
                </p>
              </div>
              <div class="badge badge--orange" style="margin-top: var(--space-md); width: fit-content;">Safe Action Protocols</div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── SECTION 4: CLINICAL CONDITIONS BENTO TILES ── -->
      <section class="section--tight">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div class="section-label">HEALTH GUIDES & PROTOCOLS</div>
              <h2 class="text-h2">Supported Health Situations</h2>
            </div>
            <a href="#/care" class="btn btn--outline btn--sm">
              Explore All Guides →
            </a>
          </div>

          <div class="grid grid--4">
            <a href="#/emergency/snake-bite" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🐍</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">Snake Bite & Toxin</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Anti-venom protocol & immobilization</div>
            </a>

            <a href="#/emergency/heart-attack" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">❤️</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">Chest Pain & Heart</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Early warning signs & immediate rest</div>
            </a>

            <a href="#/emergency/severe-breathing-difficulty" class="card card--blue card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🫁</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-info-dark);">Breathing Difficulty</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Asthma, chest infection & choking</div>
            </a>

            <a href="#/care/fever" class="card card--orange card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🌡️</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark);">High Fever & Spikes</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Safe hydration & cooling techniques</div>
            </a>

            <a href="#/care/stomach-discomfort" class="card card--green card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">⚡</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-primary-dark);">Stomach & Dehydration</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">ORS formulation & food hygiene</div>
            </a>

            <a href="#/emergency/child-emergency" class="card card--orange card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">👶</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-warning-dark);">Child Health Urgency</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Pediatric red flags & febrile seizures</div>
            </a>

            <a href="#/emergency/pregnancy-emergency" class="card card--purple card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🤰</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-purple);">Pregnancy Alerts</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Maternal bleeding & labour signals</div>
            </a>

            <a href="#/emergency/burns" class="card card--red card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg);">
              <div style="font-size: 1.8rem; margin-bottom: 6px;">🔥</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-danger-dark);">Burns & Scalds</div>
              <div class="text-xs text-muted" style="margin-top: 4px;">Cool running water & clean dressing</div>
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
                  Built for Safety, Accuracy & Trust
                </h4>
                <p class="text-sm text-muted" style="line-height: var(--leading-normal);">
                  JeevanSetu prevents dangerous traditional practices (e.g. tying tourniquets on snake bites, applying dung on burns, or forceful feeding during convulsions) and guides families safely to certified medical professionals.
                </p>
              </div>
              <div>
                <a href="#/safety" class="btn btn--outline btn--sm">
                  Read Safety Protocol →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
