import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineSyncService, SyncQueueItem } from '../services/offlineSyncService';

describe('OfflineSyncService & Background Sync Queue', () => {
  beforeEach(() => {
    OfflineSyncService.clearLocalData();
  });

  it('enqueues transactions with pending_sync status and versioning', () => {
    const item = OfflineSyncService.enqueueItem('medicine_reminders', 'insert', {
      id: 'med-101',
      name: 'Metformin',
      dosage: '500mg'
    });

    expect(item.id).toBe('med-101');
    expect(item.table).toBe('medicine_reminders');
    expect(item.status).toBe('pending_sync');
    expect(item.clientVersion).toBe(1);
    expect(item.retryCount).toBe(0);

    const queue = OfflineSyncService.getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe('med-101');
  });

  it('updates existing queued item on subsequent edits instead of duplicating', () => {
    OfflineSyncService.enqueueItem('medicine_reminders', 'insert', {
      id: 'med-102',
      name: 'Amlodipine',
      dosage: '5mg'
    });

    OfflineSyncService.enqueueItem('medicine_reminders', 'update', {
      id: 'med-102',
      name: 'Amlodipine',
      dosage: '10mg'
    });

    const queue = OfflineSyncService.getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].payload.dosage).toBe('10mg');
    expect(queue[0].action).toBe('update');
  });

  it('processes pending queue items and marks them synced idempotently', async () => {
    OfflineSyncService.enqueueItem('emergency_incidents', 'insert', { id: 'inc-99', locality: 'Khed' });

    expect(OfflineSyncService.getLastSyncTime()).toBeNull();

    const result = await OfflineSyncService.processSyncQueue();
    expect(result.syncedCount).toBe(1);
    expect(result.failedCount).toBe(0);
    expect(result.conflictCount).toBe(0);

    const queue = OfflineSyncService.getQueue();
    expect(queue[0].status).toBe('synced');
    expect(OfflineSyncService.getLastSyncTime()).not.toBeNull();
  });

  it('handles sync failures by incrementing retry count and marking sync_failed', async () => {
    OfflineSyncService.enqueueItem('symptom_assessments', 'insert', { id: 'tri-42', score: 3 });

    const failingHandler = async (_item: SyncQueueItem) => {
      throw new Error('503 Service Unavailable: Uplink timeout');
    };

    const result = await OfflineSyncService.processSyncQueue(failingHandler);
    expect(result.syncedCount).toBe(0);
    expect(result.failedCount).toBe(1);

    const queue = OfflineSyncService.getQueue();
    expect(queue[0].status).toBe('sync_failed');
    expect(queue[0].retryCount).toBe(1);
    expect(queue[0].errorMsg).toContain('Uplink timeout');
  });

  it('detects server-client version conflicts and marks conflict_detected', async () => {
    OfflineSyncService.enqueueItem('profiles', 'update', { id: 'prof-1', name: 'Ramesh' });

    const conflictingHandler = async (_item: SyncQueueItem) => {
      return { success: false, conflict: true };
    };

    const result = await OfflineSyncService.processSyncQueue(conflictingHandler);
    expect(result.conflictCount).toBe(1);

    const queue = OfflineSyncService.getQueue();
    expect(queue[0].status).toBe('conflict_detected');
    expect(queue[0].errorMsg).toContain('Server record is newer');
  });

  it('clears all local queue and sync timestamp on wipe for shared devices', () => {
    OfflineSyncService.enqueueItem('worker_assignments', 'update', { id: 'w-1', note: 'Visited' });
    OfflineSyncService.setLastSyncTime(new Date().toISOString());

    expect(OfflineSyncService.getQueue().length).toBe(1);
    expect(OfflineSyncService.getLastSyncTime()).not.toBeNull();

    OfflineSyncService.clearLocalData();

    expect(OfflineSyncService.getQueue().length).toBe(0);
    expect(OfflineSyncService.getLastSyncTime()).toBeNull();
  });
});
