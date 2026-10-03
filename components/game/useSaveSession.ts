'use client';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { initialSave, type Save } from '../../lib/game';
import { loadSave, persistSave, replaceSave, type LoadedSave } from '../../lib/save-manager';
import { acquireLease, ownsLease, refreshLease, TAB_LOCK } from '../../lib/tab-ownership';
import { SAVE_KEY } from '../../lib/save-storage';

export function useSaveSession(save: Save, setSave: Dispatch<SetStateAction<Save>>) {
  const [status, setStatus] = useState<'loading' | 'active' | 'conflict' | 'recovery' | 'unavailable'>('loading');
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
    let releaseLock: (() => void) | undefined;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let leaseStart: ReturnType<typeof setTimeout> | undefined;
    const id = crypto.randomUUID();
    let usesLease = false;
    function lost() { permission.current = () => false; setStatus('conflict'); }
    function activate() {
      if (disposed) return;
      permission.current = () => {
        if (disposed) return false;
        if (usesLease) {
          try { if (!ownsLease(localStorage, id, Date.now())) { lost(); return false; } }
          catch { setStatus('unavailable'); return false; }
        }
        return true;
      };
      try {
        const loaded = loadSave(localStorage);
        if (loaded.kind === 'recovery') { setRecovery(loaded); setStatus('recovery'); }
        else {
          latest.current = loaded.save; setSave(loaded.save);
          lastWritten.current = localStorage.getItem(SAVE_KEY) || '';
          setStatus('active');
        }
      } catch { setStorageOk(false); setStatus('unavailable'); }
    }
    if (navigator.locks) {
      // Web Locks are atomic and remain held even when a browser suspends a tab.
      void navigator.locks.request(TAB_LOCK, { ifAvailable: true }, async lock => {
        if (disposed) return;
        if (!lock) { lost(); return; }
        activate();
        await new Promise<void>(resolve => { releaseLock = resolve; if (disposed) resolve(); });
      }).catch(() => { if (!disposed) setStatus('unavailable'); });
    } else {
      usesLease = true;
      try {
        if (acquireLease(localStorage, id, Date.now())) {
          // Recheck after simultaneous tabs have had time to announce ownership.
          leaseStart = setTimeout(() => {
            if (disposed) return;
            try {
              if (!ownsLease(localStorage, id, Date.now())) { lost(); return; }
              activate();
              heartbeat = setInterval(() => {
                try { if (!refreshLease(localStorage, id, Date.now())) lost(); }
                catch { setStatus('unavailable'); }
              }, 3000);
            } catch { setStatus('unavailable'); }
          }, 100);
        } else lost();
      } catch { setStatus('unavailable'); }
    }
    function storageChanged(event: StorageEvent) {
      if (usesLease && (event.key === TAB_LOCK || event.key === null)) permission.current();
    }
    function pageShown(event: PageTransitionEvent) { if (event.persisted) window.location.reload(); }
    window.addEventListener('storage', storageChanged);
    window.addEventListener('pageshow', pageShown);
    return () => {
      flush.current(); disposed = true;
      clearInterval(heartbeat);
      clearTimeout(leaseStart);
      window.removeEventListener('storage', storageChanged);
      window.removeEventListener('pageshow', pageShown);
      if (usesLease) try {
        if (ownsLease(localStorage, id, Date.now())) localStorage.removeItem(TAB_LOCK);
      } catch { /* Already blocked. */ }
      releaseLock?.(); permission.current = () => false;
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
    if (!permission.current()) throw Error('Cet onglet ne peut plus sauvegarder. Rechargez après avoir fermé les autres onglets.');
    const safe = replaceSave(localStorage, next, recoveryAction ? recovery?.backup || null : latest.current, recoveryAction ? recovery?.raw : undefined);
    lastWritten.current = JSON.stringify(safe); latest.current = safe; dirty.current = false;
    setSave(safe); setRecovery(null); setStorageOk(true); setStatus('active');
  }
  return { status, recovery, storageOk, writable: () => status === 'active' && permission.current(), replace,
    restore: () => { if (recovery?.backup) replace(recovery.backup, true); },
    startFresh: () => replace(initialSave(), true) };
}
