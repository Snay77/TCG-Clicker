import { SAVE_KEY } from './save-storage';
import type { StoragePort } from './save-manager';
export const TAB_LOCK = `${SAVE_KEY}-active-tab`;
export const LEASE_MS = 15000;
type Lease = { id: string; until: number };
function readLease(storage: StoragePort): Lease | null {
  try {
    const raw = JSON.parse(storage.getItem(TAB_LOCK) || 'null');
    return raw && typeof raw.id === 'string' && Number.isFinite(raw.until) ? raw : null;
  } catch { return null; }
}
export function acquireLease(storage: StoragePort, id: string, now: number): boolean {
  const current = readLease(storage);
  if (current && current.id !== id && current.until > now) return false;
  storage.setItem(TAB_LOCK, JSON.stringify({ id, until: now + LEASE_MS }));
  return readLease(storage)?.id === id;
}
export function ownsLease(storage: StoragePort, id: string, now: number): boolean {
  const current = readLease(storage);
  return current?.id === id && current.until > now;
}
export function refreshLease(storage: StoragePort, id: string, now: number): boolean {
  if (!ownsLease(storage, id, now)) return false;
  storage.setItem(TAB_LOCK, JSON.stringify({ id, until: now + LEASE_MS }));
  return ownsLease(storage, id, now);
}
