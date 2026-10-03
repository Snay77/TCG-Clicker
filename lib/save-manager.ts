import { CARDS } from './cards';
import { initialSave, parseSave, type Save } from './game';
import { explorationLevel } from './exploration';
import { ALPHA_VERSION, GAME_VERSION } from './release';
import { CORRUPT_BACKUP_KEY, REPLACEMENT_BACKUP_KEY, SAVE_BACKUP_KEYS, SAVE_KEY, VALID_BACKUP_KEY } from './save-storage';

export type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export const MAX_IMPORT_BYTES = 512 * 1024;
const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

// Imports must not silently discard unknown species or invalid deck entries.
// parseSave remains the shared authority for migrations, timers and gameplay rules.
export function validateSave(raw: string, now = Date.now()): Save {
  if (raw.length > MAX_IMPORT_BYTES) throw Error('Fichier trop volumineux (512 Ko maximum).');
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value)) throw Error('Le fichier ne contient pas une sauvegarde.');
  const ids = new Set(CARDS.map(c => c.id));
  if (!isRecord(value.owned) || Object.entries(value.owned).some(([id, n]) => !ids.has(id) || !Number.isSafeInteger(n) || Number(n) < 1)) throw Error('Collection invalide.');
  if (!Array.isArray(value.deck) || value.deck.some(id => typeof id !== 'string' || !ids.has(id) || !Object.hasOwn(value.owned as object, id)) || new Set(value.deck).size !== value.deck.length) throw Error('Deck invalide.');
  for (const key of ['clicks', 'packs']) if (!Number.isSafeInteger(value[key]) || Number(value[key]) < 0) throw Error('Compteur invalide.');
  const save = parseSave(raw, now);
  if (save.level !== save.upgrades.click) throw Error('Niveau de machine incohérent.');
  if (value.deck.length !== save.deck.length) throw Error('Capacité du deck invalide.');
  for (const n of [save.energy, save.account.totals.generatedEnergy, save.account.totals.playSeconds]) if (n > Number.MAX_SAFE_INTEGER) throw Error('Valeur hors limites.');
  if (save.pending.length && save.packs < 1) throw Error('Ouverture sans booster.');
  return save;
}

export function exportSave(save: Save): string {
  // A plain v4 JSON, no executable code and no envelope to complicate recovery.
  return JSON.stringify(validateSave(JSON.stringify(save)), null, 2);
}
export function saveSummary(s: Save) {
  return { level: explorationLevel(s.account.xp), species: Object.keys(s.owned).length, energy: Math.floor(s.energy), packs: s.packs, pending: s.pending.length ? s.revealed : null };
}
export type LoadedSave = { kind: 'ready'; save: Save } | { kind: 'recovery'; raw: string; backup: Save | null };
export function findBackup(storage: StoragePort, now = Date.now()): Save | null {
  for (const key of SAVE_BACKUP_KEYS) {
    const raw = storage.getItem(key);
    if (raw) try { return validateSave(raw, now); } catch { /* Try the next known backup. */ }
  }
  return null;
}
export function loadSave(storage: StoragePort, now = Date.now()): LoadedSave {
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) {
    const backup = findBackup(storage, now);
    return backup ? { kind: 'recovery', raw: '', backup } : { kind: 'ready', save: initialSave(now) };
  }
  let save: Save;
  try { save = validateSave(raw, now); }
  catch { return { kind: 'recovery', raw, backup: findBackup(storage, now) }; }
  const old = JSON.parse(raw);
  if (old.version < 4 || !old.account || !old.ux) {
    const key = old.version < 4 ? old.version === 1 ? `${SAVE_KEY}-backup` : `${SAVE_KEY}-backup-v${old.version}` : !old.account ? `${SAVE_KEY}-backup-v4-before-phase7` : `${SAVE_KEY}-backup-v4-before-phase8`;
    storage.setItem(key, raw);
  }
  storage.setItem(VALID_BACKUP_KEY, JSON.stringify(save));
  return { kind: 'ready', save };
}
export function replaceSave(storage: StoragePort, next: Save, current: Save | null, damagedRaw?: string): Save {
  const safe = validateSave(JSON.stringify(next));
  // Backups must succeed before the primary can be replaced.
  if (current) storage.setItem(REPLACEMENT_BACKUP_KEY, exportSave(current));
  if (damagedRaw) storage.setItem(CORRUPT_BACKUP_KEY, damagedRaw);
  storage.setItem(SAVE_KEY, JSON.stringify(safe));
  return safe;
}
export function persistSave(storage: StoragePort, save: Save, backup: boolean) {
  const raw = JSON.stringify(save);
  if (backup) {
    const previous = storage.getItem(SAVE_KEY);
    if (previous) {
      let valid = false;
      try { validateSave(previous); valid = true; } catch { /* Preserve existing backups. */ }
      if (valid) storage.setItem(VALID_BACKUP_KEY, previous);
    }
  }
  storage.setItem(SAVE_KEY, raw);
}
export function diagnostics(save: Save, environment: { browser: string; width: number; height: number }) {
  return { game: 'TCG Clicker', version: GAME_VERSION, label: ALPHA_VERSION, saveVersion: save.version,
    browser: environment.browser.slice(0, 300), viewport: `${environment.width}×${environment.height}`,
    ...saveSummary(save), sound: save.ux.sound, volume: save.ux.volume, motion: save.ux.motion, fastOpening: save.account.fastOpening };
}
export function downloadJSON(raw: string, filename: string) {
  const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
