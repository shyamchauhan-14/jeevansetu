import { EMERGENCY_PROTOCOLS } from '../data/emergencies';
import { OfflineSyncService } from '../services/offlineSyncService';

export function renderOfflinePage(): string {
  const queue = OfflineSyncService.getQueue();
  const lastSync = OfflineSyncService.getLastSyncTime();
  const pendingCount = queue.filter((q) => q.status === 'pending_sync').length;
  const failedCount = queue.filter((q) => q.status === 'sync_failed').length;
  const conflictCount = queue.filter((q) => q.status === 'conflict_detected').length;
  const syncedCount = queue.filter((q) => q.status === 'synced').length;

  const formattedLastSync = lastSync
    ? new Date(lastSync).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Never (Device has not synced with cloud yet)';

  // Cached protocols list
  const cachedCardsHtml = EMERGENCY_PROTOCOLS.map((protocol) => `
    <a href="#/emergency/${protocol.slug}" class="card card--paper card--clickable" style="text-decoration: none; padding: var(--space-md); border-radius: var(--radius-lg); display: flex; align-items: center; gap: 14px;">
      <div style="font-size: 2.2rem; line-height: 1; flex-shrink: 0;">${protocol.icon}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: var(--font-weight-bold); font-size: var(--text-base); color: var(--color-text-main);">${protocol.title}</div>
        <div class="text-xs text-muted" style="margin-top: 2px;">Cached locally in browser storage • Offline ready</div>
      </div>
      <div class="pill pill--green" style="width: 32px; height: 32px; font-size: 0.8rem; flex-shrink: 0;">→</div>
    </a>
  `).join('');

  // Queue rows
  const queueItemsHtml = queue.length > 0
    ? queue.map((item) => {
        let badgeClass = 'badge--gray';
        let badgeLabel = item.status.toUpperCase();
        if (item.status === 'synced') {
          badgeClass = 'badge--green';
          badgeLabel = 'SYNCED';
        } else if (item.status === 'pending_sync') {
          badgeClass = 'badge--amber';
          badgeLabel = 'PENDING SYNC';
        } else if (item.status === 'sync_failed') {
          badgeClass = 'badge--red';
          badgeLabel = `FAILED (${item.retryCount} RETRIES)`;
        } else if (item.status === 'conflict_detected') {
          badgeClass = 'badge--red';
          badgeLabel = 'CONFLICT DETECTED';
        }

        return `
          <div style="padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-text-main);">
                ${item.table.toUpperCase()} • ${item.action.toUpperCase()}
              </div>
              <div class="text-xs text-muted">ID: ${item.id} • Created: ${new Date(item.createdAt).toLocaleTimeString()}</div>
              ${item.errorMsg ? `<div class="text-xs" style="color: var(--color-emergency); margin-top: 2px;">⚠ ${item.errorMsg}</div>` : ''}
            </div>
            <div>
              <span class="badge ${badgeClass}">${badgeLabel}</span>
            </div>
          </div>
        `;
      }).join('')
    : `<div class="text-xs text-muted" style="padding: var(--space-md); text-align: center;">Sync queue is clear. No offline transactions pending.</div>`;

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header Bento -->
        <div class="card card--green" style="border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 40px); margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            OFFLINE-FIRST ENGINE & DATA CONTINUITY
          </div>
          <h1 class="text-h1" style="line-height: 1.15; color: var(--color-primary-dark); margin-bottom: var(--space-xs);">
            Prepared for Zero Connectivity
          </h1>
          <p class="text-base text-muted" style="max-width: 680px; line-height: var(--leading-relaxed);">
            In remote villages with intermittent or no mobile signal, JeevanSetu operates reliably offline. All 13 verified first-aid protocols, locally cached medicine reminders, and emergency dialers stay immediately available.
          </p>
        </div>

        <!-- Offline Sync & Cache Engine Bento -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: var(--space-md);">
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-lg); color: var(--color-text-main);">
                Background Synchronization Engine
              </div>
              <div class="text-xs text-muted" style="margin-top: 4px;">
                Last Cloud Sync: <strong>${formattedLastSync}</strong>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button onclick="window.handleSyncNow()" class="btn btn--primary btn--sm">
                🔄 Sync Now
              </button>
              <button onclick="window.handleWipeLocalCache()" class="btn btn--secondary btn--sm" style="color: var(--color-emergency); border-color: rgba(220, 38, 38, 0.3);">
                🗑 Wipe Shared Device Cache
              </button>
            </div>
          </div>

          <!-- Queue Stats Pills -->
          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: var(--space-md); padding: var(--space-sm) 0;">
            <div class="card card--paper" style="flex: 1; min-width: 130px; padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div class="text-xs text-muted">Pending Sync</div>
              <div style="font-size: 1.4rem; font-weight: bold; color: ${pendingCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)'};">${pendingCount}</div>
            </div>
            <div class="card card--paper" style="flex: 1; min-width: 130px; padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div class="text-xs text-muted">Synced Items</div>
              <div style="font-size: 1.4rem; font-weight: bold; color: var(--color-primary);">${syncedCount}</div>
            </div>
            <div class="card card--paper" style="flex: 1; min-width: 130px; padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div class="text-xs text-muted">Sync Failures</div>
              <div style="font-size: 1.4rem; font-weight: bold; color: ${failedCount > 0 ? 'var(--color-emergency)' : 'var(--color-text-muted)'};">${failedCount}</div>
            </div>
            <div class="card card--paper" style="flex: 1; min-width: 130px; padding: 12px; border-radius: var(--radius-md); text-align: center;">
              <div class="text-xs text-muted">Conflicts</div>
              <div style="font-size: 1.4rem; font-weight: bold; color: ${conflictCount > 0 ? 'var(--color-emergency)' : 'var(--color-text-muted)'};">${conflictCount}</div>
            </div>
          </div>

          <!-- Queue Items List -->
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: white;">
            <div style="background: var(--color-bg-subtle); padding: 8px 16px; font-size: var(--text-xs); font-weight: bold; color: var(--color-text-muted);">
              LOCAL TRANSACTION SYNC QUEUE (${queue.length})
            </div>
            ${queueItemsHtml}
          </div>
        </div>

        <!-- Capability Matrix Bento -->
        <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
          <div class="section-label" style="margin-bottom: var(--space-md);">
            CONNECTIVITY CAPABILITY MATRIX
          </div>
          <div class="grid grid--3">
            <!-- Offline Column -->
            <div class="card card--green" style="border-radius: var(--radius-lg); padding: var(--space-md);">
              <div style="font-weight: bold; color: var(--color-primary-dark); font-size: var(--text-sm); margin-bottom: 8px;">
                ✅ Fully Functional Offline
              </div>
              <div class="text-xs text-muted" style="line-height: 1.6;">
                • 13 Verified Emergency Protocols<br/>
                • Offline Healthcare Facility Directory<br/>
                • Clinical Red-Flag Rule Escalation<br/>
                • Local Medicine Reminders & Chime<br/>
                • Personal Health Records (Local Storage)<br/>
                • Trusted Emergency Contacts List
              </div>
            </div>

            <!-- Voice Telecom Column -->
            <div class="card card--paper" style="border-radius: var(--radius-lg); padding: var(--space-md); border-left: 4px solid #3B82F6;">
              <div style="font-weight: bold; color: #1D4ED8; font-size: var(--text-sm); margin-bottom: 8px;">
                📶 Voice Signal / Cellular Only
              </div>
              <div class="text-xs text-muted" style="line-height: 1.6;">
                • 108 Ambulance National Dispatch<br/>
                • 102 Pregnant Mother & Neonate Hotline<br/>
                • 112 Unified Emergency Services<br/>
                • Pre-formatted SMS Alert Dispatch<br/>
                • Direct Phone Calling to Doctors
              </div>
            </div>

            <!-- Online Data Column -->
            <div class="card card--paper" style="border-radius: var(--radius-lg); padding: var(--space-md); border-left: 4px solid var(--color-emergency);">
              <div style="font-weight: bold; color: var(--color-emergency); font-size: var(--text-sm); margin-bottom: 8px;">
                🌐 Requires Active Mobile Internet
              </div>
              <div class="text-xs text-muted" style="line-height: 1.6;">
                • Real-time Supabase Cloud Database Sync<br/>
                • Conversational AI LLM Health Guidance<br/>
                • Live GPS Route & Driving Navigation<br/>
                • Blood Donor Registration Sync<br/>
                • Village Health Outbreak Trend Updates
              </div>
            </div>
          </div>
        </div>

        <!-- Offline Emergency Dialers Bento -->
        <div class="card card--paper" style="border-left: 6px solid var(--color-primary); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); color: var(--color-text-main);">TELECOM VOICE DIALERS READY</div>
            <div class="text-xs text-muted" style="margin-top: 2px;">
              Emergency lines (108 / 102 / 112) connect via mobile voice network without requiring internet data packs.
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="tel:108" class="btn btn--emergency btn--sm">📞 Dial 108</a>
            <a href="tel:102" class="btn btn--outline btn--sm">📞 Dial 102</a>
            <a href="tel:112" class="btn btn--outline btn--sm">📞 Dial 112</a>
          </div>
        </div>

        <!-- Grid of cached protocols -->
        <div style="margin-bottom: var(--space-2xl);">
          <div class="section-label">
            LOCALLY CACHED FIRST-AID PROTOCOLS (13 AVAILABLE OFFLINE)
          </div>

          <div class="grid grid--2">
            ${cachedCardsHtml}
          </div>
        </div>

        <div style="text-align: center;">
          <a href="#/" class="btn btn--outline">
            ← Return to Main Application
          </a>
        </div>

      </div>
    </div>
  `;
}
