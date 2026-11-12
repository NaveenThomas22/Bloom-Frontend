import Dexie, { type Table } from 'dexie';

export interface OfflineCacheItem {
  key: string;
  data: any;
  updatedAt: number;
}

export interface SyncQueueItem {
  id?: number;
  endpoint: string;
  method: string;
  payload: any;
  createdAt: number;
  attempts: number;
}

/**
 * Bloom offline database for non-sensitive data and background sync queue.
 * NOTE: As per security requirements, private authentication credentials
 * and personal user identity data MUST NEVER be cached to IndexedDB.
 */
export class BloomOfflineDatabase extends Dexie {
  cache!: Table<OfflineCacheItem, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('BloomOfflineDb');
    this.version(1).stores({
      cache: 'key, updatedAt',
      syncQueue: '++id, endpoint, createdAt, attempts'
    });
  }
}

export const offlineDb = new BloomOfflineDatabase();

