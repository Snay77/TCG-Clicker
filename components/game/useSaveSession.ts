'use client';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { initialSave, type Save } from '../../lib/game';
import { loadSave, persistSave, replaceSave, type LoadedSave } from '../../lib/save-manager';
import { SAVE_KEY } from '../../lib/save-storage';

export function useSaveSession(save: Save, setSave: Dispatch<SetStateAction<Save>>) {
  const [status, setStatus] = useState<'loading' | 'active' | 'recovery' | 'unavailable'>('loading');
  const [recovery, setRecovery] = useState<Extract<LoadedSave, { kind: 'recovery' }> | null>(null);
  const [storageOk, setStorageOk] = useState(true);
  const latest = useRef(save); latest.current = save;
  const mode = useRef(status); mode.current = status;
  const permission = useRef<() => boolean>(() => false);
  const flush = useRef<() => void>(() => {});
  const lastWritten = useRef('');
  const dirty = useRef(false);
  const lastBackup = useRef(0);

  useEffect(() => {
    let disposed = false;
    // Sessions load directly: old Web Locks and localStorage leases are ignored.
    permission.current = () => !disposed;
    try {
      const loaded = loadSave(localStorage);
      if (loaded.kind === 'recovery') { setRecovery(loaded); setStatus('recovery'); }
      else {
        latest.current = loaded.save; setSave(loaded.save);
        lastWritten.current = localStorage.getItem(SAVE_KEY) || '';
        setStatus('active');
      }
    } catch { permission.current = () => false; setStorageOk(false); setStatus('unavailable'); }
    function pageShown(event: PageTransitionEvent) { if (event.persisted) window.location.reload(); }
    window.addEventListener('pageshow', pageShown);
    return () => {
      flush.current(); disposed = true;
      window.removeEventListener('pageshow', pageShown);
      permission.current = () => false;
    };
  }, [setSave]);

  useEffect(() => {
    if (status !== 'active') return;
    const persist = () => {
      if (mode.current !== 'active' || !dirty.current || !permission.current()) return;
      const raw = JSON.stringify(latest.current);
      if (raw === lastWritten.current) { dirty.current = false; return; }
      try {
        const backup = Date.now() - lastBackup.current >= 30000;
        persistSave(localStorage, latest.current, backup);
        if (backup) lastBackup.current = Date.now();
        lastWritten.current = raw; dirty.current = false; setStorageOk(true);
      } catch { setStorageOk(false); }
    };
    flush.current = persist;
    const timer = setInterval(persist, 1000);
    const hidden = () => { if (document.visibilityState === 'hidden') persist(); };
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      persist(); clearInterval(timer);
      window.removeEventListener('pagehide', persist);
      document.removeEventListener('visibilitychange', hidden);
      flush.current = () => {};
    };
  }, [status]);

  const previous = useRef<Save | null>(null);
  useEffect(() => {
    if (status !== 'active') return;
    dirty.current = true;
    const before = previous.current;
    previous.current = save;
    // Purchases, reveals, deck changes and settings are durable immediately.
    if (!before || before.pending !== save.pending || before.revealed !== save.revealed || before.owned !== save.owned || before.deck !== save.deck || before.upgrades !== save.upgrades || before.ux !== save.ux || before.account.claimed !== save.account.claimed || before.extraDeckSlots !== save.extraDeckSlots || before.freeBoosterCapacity !== save.freeBoosterCapacity || before.account.fastOpening !== save.account.fastOpening || before.account.activeTitle !== save.account.activeTitle) flush.current();
  }, [save, status]);

  function replace(next: Save, recoveryAction = false) {
    if (!permission.current()) throw Error('La sauvegarde est inaccessible. Rechargez pour réessayer.');
    const safe = replaceSave(localStorage, next, recoveryAction ? recovery?.backup || null : latest.current, recoveryAction ? recovery?.raw : undefined);
    lastWritten.current = JSON.stringify(safe); latest.current = safe; dirty.current = false;
    setSave(safe); setRecovery(null); setStorageOk(true); setStatus('active');
  }
  function saveBeforeReload() {
    if (mode.current !== 'active' || !permission.current() || latest.current.pending.length) return false;
    try { persistSave(localStorage, latest.current, true); lastWritten.current = JSON.stringify(latest.current); dirty.current = false; setStorageOk(true); return true; }
    catch { setStorageOk(false); return false; }
  }
  return { status, recovery, storageOk, writable: () => status === 'active' && permission.current(), replace, saveBeforeReload,
    restore: () => { if (recovery?.backup) replace(recovery.backup, true); },
    startFresh: () => replace(initialSave(), true) };
}
