'use client';
import { useEffect, useRef, useState } from 'react';
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
export function usePWA() {
  const [installed, setInstalled] = useState(false), [ios, setIOS] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [status, setStatus] = useState(''), [offlineReady, setOfflineReady] = useState(false);
  const requested = useRef(false), registration = useRef<ServiceWorkerRegistration | null>(null);
  useEffect(() => {
    const mode = matchMedia('(display-mode: standalone)');
    const updateMode = () => setInstalled(mode.matches || !!(navigator as Navigator & { standalone?: boolean }).standalone);
    updateMode(); mode.addEventListener('change', updateMode);
    setIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const didInstall = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', capture); window.addEventListener('appinstalled', didInstall);
    let disposed = false;
    let watched: ServiceWorkerRegistration | null = null;
    const detectWaiting = () => { if (!disposed && registration.current?.waiting) setWaiting(registration.current.waiting); };
    const updateFound = () => {
      const worker = registration.current?.installing;
      worker?.addEventListener('statechange', () => {
        if (disposed || worker.state !== 'installed') return;
        setOfflineReady(true); detectWaiting();
      });
    };
    const controlled = () => { if (requested.current) window.location.reload(); };
    const check = () => { if (document.visibilityState === 'visible') void registration.current?.update().catch(() => {}); };
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && window.isSecureContext) {
      navigator.serviceWorker.addEventListener('controllerchange', controlled);
      void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(reg => {
        if (disposed) return;
        watched = reg; registration.current = reg;
        setOfflineReady(!!reg.active); detectWaiting(); reg.addEventListener('updatefound', updateFound); updateFound();
      }).catch(() => { if (!disposed) setStatus('Mode hors ligne indisponible dans ce navigateur.'); });
      document.addEventListener('visibilitychange', check);
    }
    return () => {
      disposed = true; mode.removeEventListener('change', updateMode);
      window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', didInstall);
      watched?.removeEventListener('updatefound', updateFound);
      document.removeEventListener('visibilitychange', check);
      navigator.serviceWorker?.removeEventListener('controllerchange', controlled);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    try { await prompt.prompt(); const choice = await prompt.userChoice; setStatus(choice.outcome === 'accepted' ? 'Installation demandée.' : 'Installation annulée.'); }
    catch { setStatus('Installation indisponible. Utilisez le menu du navigateur.'); }
    setPrompt(null);
  }
  function update(beforeReload: () => boolean) {
    if (!waiting || !beforeReload()) { setStatus('Mise à jour différée : exportez votre sauvegarde puis réessayez.'); return; }
    requested.current = true; setStatus('Mise à jour en cours…'); waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
  }
  return { installed, ios, canInstall: !!prompt, install, waiting: !!waiting, update, status, offlineReady };
}
export type PWAState = ReturnType<typeof usePWA>;
