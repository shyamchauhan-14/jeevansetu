export type SyncStatus = 'local_only' | 'pending_sync' | 'synced' | 'sync_failed' | 'conflict_detected';

export interface SyncQueueItem {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload: Record<string, any>;
  status: SyncStatus;
  clientVersion: number;
  serverVersion?: string;
  createdAt: string;
  lastAttemptAt?: string;
  retryCount: number;
  errorMsg?: string;
}

const STORAGE_KEYS = {
  QUEUE: 'jeevansetu_offline_sync_queue',
  LAST_SYNC: 'jeevansetu_last_sync_timestamp'
};

export class OfflineSyncService {
  public static getQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static enqueueItem(
    table: string,
    action: 'insert' | 'update' | 'delete',
    payload: Record<string, any>,
    clientVersion = 1
  ): SyncQueueItem {
    const queue = this.getQueue();
    const item: SyncQueueItem = {
      id: payload.id || 'sync-' + Date.now().toString(36),
      table,
      action,
      payload,
      status: 'pending_sync',
      clientVersion,
      createdAt: new Date().toISOString(),
      retryCount: 0
    };

    const existingIdx = queue.findIndex((q) => q.id === item.id && q.table === table);
    if (existingIdx >= 0) {
      queue[existingIdx] = item;
    } else {
      queue.push(item);
    }

    this.saveQueue(queue);
    return item;
  }

  public static updateItemStatus(
    id: string,
    status: SyncStatus,
    errorMsg?: string,
    serverVersion?: string
  ): void {
    const queue = this.getQueue();
    const item = queue.find((q) => q.id === id);
    if (item) {
      item.status = status;
      item.lastAttemptAt = new Date().toISOString();
      if (errorMsg) item.errorMsg = errorMsg;
      if (serverVersion) item.serverVersion = serverVersion;
      if (status === 'sync_failed') {
        item.retryCount += 1;
      }
      this.saveQueue(queue);
    }
  }

  /**
   * Idempotent sync executor.
   * Processes all pending items and handles conflict detection.
   */
  public static async processSyncQueue(
    syncHandler?: (item: SyncQueueItem) => Promise<{ success: boolean; serverVersion?: string; conflict?: boolean }>
  ): Promise<{ syncedCount: number; failedCount: number; conflictCount: number }> {
    const queue = this.getQueue();
    const pending = queue.filter((q) => q.status === 'pending_sync' || q.status === 'sync_failed');

    let syncedCount = 0;
    let failedCount = 0;
    let conflictCount = 0;

    for (const item of pending) {
      item.lastAttemptAt = new Date().toISOString();

      if (syncHandler) {
        try {
          const res = await syncHandler(item);
          if (res.conflict) {
            item.status = 'conflict_detected';
            item.errorMsg = 'Server record is newer than local edit. Manual review needed.';
            conflictCount += 1;
          } else if (res.success) {
            item.status = 'synced';
            item.serverVersion = res.serverVersion;
            syncedCount += 1;
          } else {
            item.status = 'sync_failed';
            item.retryCount += 1;
            failedCount += 1;
          }
        } catch (err: any) {
          item.status = 'sync_failed';
          item.retryCount += 1;
          item.errorMsg = err.message || 'Network error during sync';
          failedCount += 1;
        }
      } else {
        // Default local execution: Mark synced
        item.status = 'synced';
        syncedCount += 1;
      }
    }

    this.saveQueue(queue);

    if (syncedCount > 0) {
      this.setLastSyncTime(new Date().toISOString());
    }

    return { syncedCount, failedCount, conflictCount };
  }

  public static getLastSyncTime(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch {
      return null;
    }
  }

  public static setLastSyncTime(isoDate: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, isoDate);
    } catch {
      // ignore
    }
  }

  public static clearLocalData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUEUE);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    } catch {
      // ignore
    }
  }

  private static saveQueue(queue: SyncQueueItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    } catch {
      // ignore
    }
  }
}
