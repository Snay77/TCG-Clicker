import UIAction from './UIAction';
import { useState } from 'react';
import { downloadJSON, saveSummary } from '../../lib/save-manager';
import type { useSaveSession } from './useSaveSession';
export default function SaveGate({session}:{session:ReturnType<typeof useSaveSession>}) {
  const [confirm, setConfirm] = useState(false), [error, setError] = useState('');
  const recovery = session.recovery;
  function act(action: () => void) { try { action(); } catch { setError('Le stockage est inaccessible ou plein. Les données existantes sont conservées. Exportez-les avant de réessayer.'); } }
  if (session.status === 'loading') return <main className="alpha-gate brutal-shell" aria-busy="true"><h1>La clairière s’éveille…</h1><p role="status">Chargement de votre progression.</p></main>;
  return <main className="alpha-gate brutal-shell"><span className="eyebrow">TCG CLICKER · FAERIE</span>
    <h1>{session.status === 'recovery' ? 'Sauvegarde principale illisible.' : 'Sauvegarde inaccessible.'}</h1>
    {session.status === 'recovery' ? <>
      <p>Vos données sont conservées. Aucune progression ne sera remplacée sans votre choix.</p>
      {recovery?.backup && <><p>Copie valide : niveau {saveSummary(recovery.backup).level} · {Object.keys(recovery.backup.owned).length}/60 espèces · {recovery.backup.packs} boosters.</p><UIAction onClick={()=>act(session.restore)}>Restaurer la dernière sauvegarde valide</UIAction></>}
      <UIAction disabled={!recovery?.raw} onClick={()=>downloadJSON(recovery!.raw,'tcg-clicker-donnees-problematiques.json')}>Exporter les données problématiques</UIAction>
      {!confirm ? <UIAction onClick={()=>setConfirm(true)}>Commencer une nouvelle partie</UIAction> : <div role="group" aria-label="Confirmation nouvelle partie"><p>Repartir de zéro ? Les données illisibles seront conservées dans une copie séparée.</p><UIAction onClick={()=>act(session.startFresh)}>Confirmer la nouvelle partie</UIAction><UIAction onClick={()=>setConfirm(false)}>Annuler</UIAction></div>}
    </> : <><p>Autorisez le stockage local de ce site ou libérez de l’espace, puis rechargez. Votre sauvegarde n’a pas été effacée.</p><UIAction onClick={()=>window.location.reload()}>Réessayer</UIAction></>}
    {error && <p role="alert">{error}</p>}
  </main>;
}
