import { StorageService } from '../services/storageService';
import { MedicineReminder } from '../types/health';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { I18nService } from '../services/i18nService';

export function renderRemindersPage(): string {
  const reminders = StorageService.getReminders();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalDoses = reminders.length;
  const takenDoses = reminders.filter((r) => r.status === 'taken' || r.lastTakenDate === todayStr).length;
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
    const isTaken = med.status === 'taken' || med.lastTakenDate === todayStr;
    const isSkipped = med.status === 'skipped';
    const isSnoozed = med.status === 'snoozed';

    const mealLabel =
      med.mealInstruction === 'after_meal'
        ? '🍽️ After Food'
        : med.mealInstruction === 'before_meal'
        ? '🥗 Before Food'
        : '💧 With Food/Water';

    const cardClass = isTaken
      ? 'card--green-soft'
      : isSkipped
      ? 'card--orange-soft'
      : isSnoozed
      ? 'card--blue'
      : 'card--paper';

    return `
      <div class="card ${cardClass}" style="padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--color-gray-200); transition: all var(--transition-fast);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-pill); background: ${isTaken ? 'var(--color-primary)' : isSkipped ? 'var(--color-warning)' : 'var(--color-gray-100)'}; color: ${isTaken || isSkipped ? 'white' : 'var(--color-primary-dark)'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: var(--shadow-xs);">
              ${isTaken ? '✓' : isSkipped ? '⏭️' : isSnoozed ? '⏰' : '💊'}
            </div>
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-text-main); ${isTaken ? 'text-decoration: line-through; opacity: 0.8;' : ''}">
                ${med.name}
              </div>
              <div class="text-xs text-muted" style="margin-top: 2px;">
                <strong>${med.dosage}</strong> • ⏰ ${med.time}
              </div>
              <div style="margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap;">
                <span class="badge ${isTaken ? 'badge--green' : 'badge--paper'}" style="font-size: 0.72rem; padding: 2px 8px;">
                  ${mealLabel}
                </span>
                ${
                  isSkipped
                    ? '<span class="badge badge--orange" style="font-size: 0.72rem; padding: 2px 8px;">Skipped Dose</span>'
                    : isSnoozed
                    ? '<span class="badge badge--blue" style="font-size: 0.72rem; padding: 2px 8px;">Snoozed (15m)</span>'
                    : ''
                }
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; margin-left: auto; flex-wrap: wrap;">
            <button 
              type="button" 
              class="btn ${isTaken ? 'btn--primary' : 'btn--outline'} btn--sm" 
              onclick="window.setMedicineStatus('${med.id}', 'taken')"
              title="Mark as Taken"
            >
              ${isTaken ? '✅ Taken' : 'Take Dose'}
            </button>

            <button 
              type="button" 
              class="btn btn--outline btn--sm" 
              style="padding: 6px 10px; font-size: 0.75rem;"
              onclick="window.setMedicineStatus('${med.id}', 'skipped')"
              title="Skip this dose"
            >
              ⏭️ Skip
            </button>

            <button 
              type="button" 
              class="btn btn--outline btn--sm" 
              style="padding: 6px 10px; font-size: 0.75rem;"
              onclick="window.setMedicineStatus('${med.id}', 'snoozed')"
              title="Snooze for 15 minutes"
            >
              ⏰ Snooze
            </button>

            <button 
              type="button" 
              class="btn btn--ghost btn--sm" 
              style="color: var(--color-danger); padding: 6px 8px;"
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
                ${I18nService.t('reminders.badge', 'MEDICINE REMINDERS • दवा रिमाइंडर')}
              </span>
              ${
                isSupabaseConfigured
                  ? `<span class="badge badge--blue" title="Connected to Supabase Cloud Database">☁️ Cloud Synced</span>`
                  : `<span class="badge badge--paper">💾 Offline Local Storage</span>`
              }
            </div>
            <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
              ${I18nService.t('reminders.title', 'Daily Medicine Schedule')}
            </h1>
            <p class="text-base text-muted">
              ${I18nService.t('reminders.subtitle', 'Track your prescribed doses offline with status logging. Not a dosage calculator.')}
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn--outline btn--sm" onclick="window.testReminderChime()" title="Play audio alert tone">
              🔊 Test Chime
            </button>
            <button class="btn btn--outline btn--sm" onclick="window.enableReminderNotifications()" title="Turn on browser notifications">
              🔔 Enable Alerts
            </button>
          </div>
        </div>

        <!-- Clinical Safety Boundary Notice -->
        <div style="background: rgba(248, 250, 252, 0.9); border-left: 4px solid var(--color-info); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: var(--space-lg); font-size: var(--text-xs); color: var(--color-text-muted);">
          ℹ️ <strong>Safety & Adherence Boundary:</strong> JeevanSetu records user/prescriber instructions and does not calculate, recommend, or alter medicine dosages. Logged states (Taken, Skipped, Snoozed) represent patient self-reporting and do not constitute clinical verification of medical adherence.
        </div>

        <!-- Today's Adherence Bento Card -->
        <div class="card card--green" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); padding: var(--space-lg) var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: var(--tracking-wider); font-weight: bold;">
                TODAY'S SCHEDULE (${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
              </div>
              <div style="font-size: var(--text-h3); font-weight: var(--font-weight-xbold); color: var(--color-primary-dark); margin-top: 2px;">
                ${takenDoses} of ${totalDoses} Doses Completed
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

        <!-- Medicine Schedule by Slot -->
        ${renderSlotSection('Morning Doses • सुबह', '🌅', '06:00 AM – 11:59 AM', morningMeds, 'badge--green')}
        ${renderSlotSection('Afternoon Doses • दोपहर', '☀️', '12:00 PM – 04:59 PM', afternoonMeds, 'badge--orange')}
        ${renderSlotSection('Night Doses • रात', '🌙', '05:00 PM – 11:59 PM', nightMeds, 'badge--blue')}

        <!-- Add New Medicine Form Bento Card -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-xl); margin-top: var(--space-xl);">
          <h3 style="font-family: var(--font-display); font-size: var(--text-h4); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">
            ➕ Add Medicine Reminder
          </h3>
          <p class="text-sm text-muted" style="margin-bottom: var(--space-lg);">
            Enter the exact name and instructions from your doctor's prescription slip.
          </p>

          <form id="reminder-form" onsubmit="window.handleSaveMedicineForm(event)">
            <div class="grid grid--2" style="margin-bottom: var(--space-md);">
              <div class="input-wrap">
                <label class="input-label" for="med-name">Medicine Name</label>
                <input type="text" id="med-name" name="name" class="input" placeholder="e.g. Metformin / Amlodipine" required />
              </div>
              <div class="input-wrap">
                <label class="input-label" for="med-dosage">Dosage Instructions</label>
                <input type="text" id="med-dosage" name="dosage" class="input" placeholder="e.g. 1 Tablet (500mg)" required />
              </div>
            </div>

            <div class="grid grid--3" style="margin-bottom: var(--space-lg);">
              <div class="input-wrap">
                <label class="input-label" for="med-slot">Time Slot</label>
                <select id="med-slot" name="timeSlot" class="select">
                  <option value="morning">Morning (सुबह)</option>
                  <option value="afternoon">Afternoon (दोपहर)</option>
                  <option value="night">Night (रात)</option>
                </select>
              </div>

              <div class="input-wrap">
                <label class="input-label" for="med-time">Alarm Time</label>
                <input type="time" id="med-time" name="time" class="input" value="08:00" required />
              </div>

              <div class="input-wrap">
                <label class="input-label" for="med-meal">Food Instruction</label>
                <select id="med-meal" name="mealInstruction" class="select">
                  <option value="after_meal">After Meal (भोजन के बाद)</option>
                  <option value="before_meal">Before Meal (भोजन से पहले)</option>
                  <option value="with_meal">With Food/Water (भोजन के साथ)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn--primary btn--md">
                Save Medicine Schedule ✓
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  `;
}
