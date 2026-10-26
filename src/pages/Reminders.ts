import { StorageService } from '../services/storageService';
import { MedicineReminder } from '../types/health';
import { isSupabaseConfigured } from '../services/supabaseClient';

export function renderRemindersPage(): string {
  const reminders = StorageService.getReminders();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalDoses = reminders.length;
  const takenDoses = reminders.filter((r) => r.lastTakenDate === todayStr).length;
  const progressPct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const morningMeds = reminders.filter((r) => r.timeSlot === 'morning');
  const afternoonMeds = reminders.filter((r) => r.timeSlot === 'afternoon');
  const nightMeds = reminders.filter((r) => r.timeSlot === 'night');

  const renderSlotSection = (title: string, icon: string, timeDesc: string, meds: MedicineReminder[], slotBadgeClass: string) => {
    return `
      <div class="card card--paper" style="margin-bottom: var(--space-lg); border-radius: var(--radius-xl); padding: var(--space-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--color-gray-200);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.5rem;">${icon}</span>
            <div>
              <h3 style="font-family: var(--font-display); font-size: var(--text-h5); font-weight: var(--font-weight-bold); margin: 0;">${title}</h3>
              <span class="text-xs text-muted">${timeDesc}</span>
            </div>
          </div>
          <span class="badge ${slotBadgeClass}">${meds.length} Meds</span>
        </div>

        ${
          meds.length === 0
            ? `<div class="text-xs text-muted" style="text-align: center; padding: var(--space-md) 0; font-style: italic;">No medicines scheduled for this slot.</div>`
            : `<div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                ${meds.map((med) => renderMedicineCard(med, todayStr)).join('')}
              </div>`
        }
      </div>
    `;
  };

  const renderMedicineCard = (med: MedicineReminder, todayStr: string) => {
    const isTaken = med.lastTakenDate === todayStr;
    const mealLabel =
      med.mealInstruction === 'after_meal'
        ? '🍽️ After Food'
        : med.mealInstruction === 'before_meal'
        ? '🥗 Before Food'
        : '💧 With Food/Water';

    return `
      <div class="card ${isTaken ? 'card--green-soft' : 'card--paper'}" style="padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid ${isTaken ? 'var(--color-primary)' : 'var(--color-gray-200)'}; transition: all var(--transition-fast);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-pill); background: ${isTaken ? 'var(--color-primary)' : 'var(--color-gray-100)'}; color: ${isTaken ? 'white' : 'var(--color-primary-dark)'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: var(--shadow-xs);">
              ${isTaken ? '✓' : '💊'}
            </div>
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-text-main); ${isTaken ? 'text-decoration: line-through; opacity: 0.8;' : ''}">
                ${med.name}
              </div>
              <div class="text-xs text-muted" style="margin-top: 2px;">
                <strong>${med.dosage}</strong> • ⏰ ${med.time}
              </div>
              <div style="margin-top: 6px;">
                <span class="badge ${isTaken ? 'badge--green' : 'badge--paper'}" style="font-size: 0.72rem; padding: 2px 8px;">
                  ${mealLabel}
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
            <button 
              type="button" 
              class="btn ${isTaken ? 'btn--primary' : 'btn--outline'} btn--sm" 
              onclick="window.toggleMedicineTaken('${med.id}')"
              title="${isTaken ? 'Mark as Not Taken' : 'Mark as Taken'}"
            >
              ${isTaken ? '✅ Taken' : 'Take Dose'}
            </button>
            <button 
              type="button" 
              class="btn btn--ghost btn--sm" 
              style="color: var(--color-danger); padding: 6px 10px;"
              onclick="window.handleDeleteMedicine('${med.id}')"
              title="Delete Reminder"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  };

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl); max-width: 820px;">
        
        <!-- Header Bento -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: var(--space-xl); flex-wrap: wrap;">
          <div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--space-xs);">
              <span class="badge badge--green">
                <span class="badge-dot badge-dot--pulse"></span>
                MEDICINE REMINDERS • दवा रिमाइंडर
              </span>
              ${
                isSupabaseConfigured
                  ? `<span class="badge badge--blue" title="Connected to Supabase Cloud Database">☁️ Supabase Synced</span>`
                  : `<span class="badge badge--paper">💾 Offline Local Storage</span>`
              }
            </div>
            <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
              Daily Medicine Schedule
            </h1>
            <p class="text-base text-muted">
              Never miss your prescribed dose. Works completely offline with live Supabase cloud backup.
            </p>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn--outline btn--sm" onclick="window.testReminderChime()" title="Play audio alert tone">
              🔊 Test Chime
            </button>
            <button class="btn btn--outline btn--sm" onclick="window.enableReminderNotifications()" title="Turn on browser notifications">
              🔔 Enable Alerts
            </button>
          </div>
        </div>

        <!-- Today's Adherence Bento Card -->
        <div class="card card--green" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-lg) var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: var(--tracking-wider); font-weight: bold;">
                TODAY'S PROGRESS (${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
              </div>
              <div style="font-size: var(--text-h3); font-weight: var(--font-weight-xbold); color: var(--color-primary-dark); margin-top: 2px;">
                ${takenDoses} of ${totalDoses} Doses Taken
              </div>
            </div>
            <div style="font-size: var(--text-h2); font-weight: 800; color: var(--color-primary-dark);">
              ${progressPct}%
            </div>
          </div>
          <!-- Progress bar track -->
          <div style="width: 100%; height: 10px; background: rgba(16, 185, 129, 0.2); border-radius: var(--radius-pill); overflow: hidden;">
            <div style="width: ${progressPct}%; height: 100%; background: var(--grad-primary); border-radius: var(--radius-pill); transition: width 0.4s ease;"></div>
          </div>
        </div>

        <!-- Quick Rural Presets Bento -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-md) var(--space-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div class="text-xs text-muted" style="font-weight: bold; text-transform: uppercase; letter-spacing: var(--tracking-wider);">
              ⚡ Quick Add Common Medicines
            </div>
            <span class="text-2xs text-muted">1-Tap Preset</span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="chip" onclick="window.quickAddPreset('Paracetamol (Fever)', '500mg - 1 Tablet', 'afternoon', '13:00', 'after_meal')">
              💊 Paracetamol 500mg
            </button>
            <button type="button" class="chip" onclick="window.quickAddPreset('ORS Sachet (Hydration)', '1 Pack in 1L Water', 'morning', '09:00', 'with_meal')">
              💧 ORS Hydration
            </button>
            <button type="button" class="chip" onclick="window.quickAddPreset('Amlodipine (Blood Pressure)', '5mg - 1 Tab', 'morning', '08:00', 'after_meal')">
              🩺 BP Tablet
            </button>
            <button type="button" class="chip" onclick="window.quickAddPreset('Metformin (Diabetes)', '500mg - 1 Tab', 'night', '20:00', 'after_meal')">
              🩸 Diabetes Tablet
            </button>
            <button type="button" class="chip" onclick="window.quickAddPreset('Iron & Folic Acid', '1 Tablet', 'night', '21:00', 'after_meal')">
              🌿 Iron & Folic Acid
            </button>
          </div>
        </div>

        <!-- Medicine Time Slots -->
        <div class="grid" style="gap: var(--space-lg);">
          ${renderSlotSection('Morning / सुबह', '🌅', '06:00 AM – 12:00 PM', morningMeds, 'badge--yellow')}
          ${renderSlotSection('Afternoon / दोपहर', '☀️', '12:00 PM – 05:00 PM', afternoonMeds, 'badge--orange')}
          ${renderSlotSection('Night / रात', '🌙', '05:00 PM – 11:00 PM', nightMeds, 'badge--blue')}
        </div>

        <!-- Add Custom Medicine Form Bento -->
        <div class="card card--paper" style="margin-top: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-xl);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-md);">
            <span style="font-size: 1.5rem;">➕</span>
            <div>
              <h2 style="font-family: var(--font-display); font-size: var(--text-h4); font-weight: var(--font-weight-bold); margin: 0;">Add Custom Medicine</h2>
              <p class="text-xs text-muted" style="margin-top: 2px;">Enter your prescription details to receive timely alerts.</p>
            </div>
          </div>

          <form id="medicine-form" onsubmit="window.handleSaveMedicineForm(event)" style="display: flex; flex-direction: column; gap: var(--space-md);">
            <div class="grid grid--2">
              <div class="input-wrap">
                <label class="input-label" for="med-name">Medicine Name (दवा का नाम)</label>
                <input type="text" id="med-name" name="name" class="input" placeholder="e.g. Paracetamol / Amlodipine" required />
              </div>
              <div class="input-wrap">
                <label class="input-label" for="med-dosage">Dosage (मात्रा)</label>
                <input type="text" id="med-dosage" name="dosage" class="input" placeholder="e.g. 1 Tablet / 5ml Syrup" required />
              </div>
            </div>

            <div class="grid grid--3">
              <div class="input-wrap">
                <label class="input-label" for="med-slot">Time of Day (समय)</label>
                <select id="med-slot" name="timeSlot" class="select" required>
                  <option value="morning">🌅 Morning (सुबह)</option>
                  <option value="afternoon">☀️ Afternoon (दोपहर)</option>
                  <option value="night">🌙 Night (रात)</option>
                </select>
              </div>

              <div class="input-wrap">
                <label class="input-label" for="med-time">Exact Time (घड़ी का समय)</label>
                <input type="time" id="med-time" name="time" class="input" value="08:00" required />
              </div>

              <div class="input-wrap">
                <label class="input-label" for="med-meal">Food Instruction (भोजन)</label>
                <select id="med-meal" name="mealInstruction" class="select" required>
                  <option value="after_meal">🍽️ After Food (खाने के बाद)</option>
                  <option value="before_meal">🥗 Before Food (खाने से पहले)</option>
                  <option value="with_meal">💧 With Water/Food (पानी के साथ)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: var(--space-sm);">
              <button type="submit" class="btn btn--primary">
                ➕ Save Medicine Reminder
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  `;
}
