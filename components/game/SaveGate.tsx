import { useState } from 'react';
import { downloadJSON, saveSummary } from '../../lib/save-manager';
import type { useSaveSession } from './useSaveSession';
export default function SaveGate({session}:{session:ReturnType<typeof useSaveSession>}) {
  const [confirm, setConfirm] = useState(false), [error, setError] = useState('');
  const recovery = session.recovery;
  function act(action: () => void) { try { action(); } catch { setError('Le stockage est inaccessible ou plein. Les données existantes sont conservées. Exportez-les avant de réessayer.'); } }
  if (session.status === 'loading') return <main className="alpha-gate" aria-busy="true"><h1>La clairière s’éveille…</h1><p role="status">Chargement de votre progression.</p></main>;
  return <main className="alpha-gate"><span className="eyebrow">TCG CLICKER · FAERIE</span>
    <h1>{session.status === 'conflict' ? 'TCG Clicker est déjà actif dans un autre onglet.' : session.status === 'recovery' ? 'Sauvegarde principale illisible.' : 'Sauvegarde inaccessible.'}</h1>
    {session.status === 'conflict' ? <><p>Fermez l’autre onglet, puis rechargez ici pour reprendre votre progression. Cet onglet est en pause.</p><button onClick={()=>window.location.reload()}>Recharger</button></> : session.status === 'recovery' ? <>
      <p>Vos données sont conservées. Aucune progression ne sera remplacée sans votre choix.</p>
      {recovery?.backup && <><p>Copie valide : niveau {saveSummary(recovery.backup).level} · {Object.keys(recovery.backup.owned).length}/60 espèces · {recovery.backup.packs} boosters.</p><button onClick={()=>act(session.restore)}>Restaurer la dernière sauvegarde valide</button></>}
      <button disabled={!recovery?.raw} onClick={()=>downloadJSON(recovery!.raw,'tcg-clicker-donnees-problematiques.json')}>Exporter les données problématiques</button>
      {!confirm ? <button onClick={()=>setConfirm(true)}>Commencer une nouvelle partie</button> : <div role="group" aria-label="Confirmation nouvelle partie"><p>Repartir de zéro ? Les données illisibles seront conservées dans une copie séparée.</p><button onClick={()=>act(session.startFresh)}>Confirmer la nouvelle partie</button><button onClick={()=>setConfirm(false)}>Annuler</button></div>}
    </> : <><p>Autorisez le stockage local de ce site ou libérez de l’espace, puis rechargez. Votre sauvegarde n’a pas été effacée.</p><button onClick={()=>window.location.reload()}>Réessayer</button></>}
    {error && <p role="alert">{error}</p>}
  </main>;
}
