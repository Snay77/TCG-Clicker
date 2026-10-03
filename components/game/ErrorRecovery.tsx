'use client';
import { useState } from 'react';
import { downloadJSON } from '../../lib/save-manager';
import { SAVE_KEY } from '../../lib/save-storage';
export default function ErrorRecovery() {
  const [message, setMessage] = useState('');
  function exportRaw() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) { setMessage('Aucune sauvegarde accessible.'); return; }
      downloadJSON(raw, 'tcg-clicker-recuperation.json');
    } catch { setMessage('Le stockage du navigateur est inaccessible.'); }
  }
  return <main className="alpha-gate"><span className="eyebrow">TCG CLICKER · FAERIE</span><h1>La clairière a rencontré un problème.</h1><p>Rechargez pour reprendre votre partie. Vous pouvez d’abord exporter les données sauvegardées.</p><button onClick={()=>window.location.reload()}>Recharger le jeu</button><button onClick={exportRaw}>Exporter la sauvegarde accessible</button>{message&&<p role="status">{message}</p>}</main>;
}
