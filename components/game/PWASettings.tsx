import UIAction from './UIAction';
import type { PWAState } from './usePWA';
export default function PWASettings({ pwa, beforeReload, busy }: { pwa: PWAState; beforeReload: () => boolean; busy: boolean }) {
  return <section className="pwa-settings"><h3>Installer TCG Clicker</h3>
    {pwa.installed ? <p>Application installée</p> : pwa.canInstall ? <UIAction onClick={() => void pwa.install()}>Installer TCG Clicker</UIAction> : pwa.ios ? <p>Dans Safari : touchez Partager, puis « Ajouter à l’écran d’accueil ». Activez « Ouvrir comme app » si cette option est proposée.</p> : <p>Ouvrez le menu de votre navigateur et cherchez « Installer l’application » ou « Ajouter à l’écran d’accueil ». Cette option dépend du navigateur.</p>}
    <p>{pwa.offlineReady ? 'L’application est prête pour une relance hors connexion sur cet appareil.' : 'Gardez une connexion pour préparer la première relance hors ligne.'}</p>
    <p>La progression reste locale. Exportez une copie avant de changer de navigateur, d’appareil ou de domaine ; le stockage de l’application installée peut être distinct.</p>
    {pwa.waiting && <><p>Une nouvelle version de TCG Clicker est disponible.</p><UIAction disabled={busy} onClick={() => pwa.update(beforeReload)}>Mettre à jour</UIAction><p>La partie sera sauvegardée puis l’application rechargée à votre demande.</p></>}
    {pwa.status && <p role="status">{pwa.status}</p>}
  </section>;
}
