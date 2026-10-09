import UIAction from './UIAction';
import type { Save } from '../../lib/game';
import type { UX } from '../../lib/ux';
import { fastOpeningAvailable } from '../../lib/exploration';
import Modal from './Modal';
import { useEffect, useRef, useState } from 'react';
import { initialSave } from '../../lib/game';
import { diagnostics, downloadJSON, exportSave, MAX_IMPORT_BYTES, saveSummary, validateSave } from '../../lib/save-manager';
import { ALPHA_VERSION } from '../../lib/release';
import PWASettings from './PWASettings';
import type { PWAState } from './usePWA';
export default function Settings({save,onChange,onFast,onClose,onReplace,pwa,beforeReload}:{save:Save;onChange:(change:Partial<UX>)=>void;onFast:()=>void;onClose:()=>void;onReplace:(next:Save)=>void;pwa:PWAState;beforeReload:()=>boolean}){
 const unlocked=fastOpeningAvailable(save);
 const [candidate,setCandidate]=useState<Save|null>(null),[message,setMessage]=useState(''),[reset,setReset]=useState(false),[confirmation,setConfirmation]=useState(''),[diagnosticText,setDiagnosticText]=useState('');
 const reading=useRef(0),mounted=useRef(true);
 // Async file reads must not apply after the settings dialog is closed.
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;reading.current++;};},[]);
 const fileInput=useRef<HTMLInputElement>(null);
 async function read(file:File|undefined) {
  const request=++reading.current;setCandidate(null);setMessage('');
  if(!file)return;
  try {
   if(file.size>MAX_IMPORT_BYTES)throw Error('Fichier trop volumineux (512 Ko maximum).');
   const next=validateSave(await file.text());
   if(mounted.current&&request===reading.current)setCandidate(next);
  }catch {if(mounted.current&&request===reading.current)setMessage('Import refusé : JSON invalide, version non reconnue ou données hors limites. Aucun remplacement effectué.');}
 }
 function replace(next:Save) {try{onReplace(next);onClose();}catch{setMessage('Remplacement impossible : copie de secours ou écriture refusée. La progression actuelle est conservée.');}}
 async function copyDiagnostics() {
  const text=JSON.stringify(diagnostics(save,{browser:navigator.userAgent,width:window.innerWidth,height:window.innerHeight}),null,2);
  try{await navigator.clipboard.writeText(text);setMessage('Diagnostics copiés.');}catch{setDiagnosticText(text);setMessage('Copie automatique indisponible : sélectionnez le texte ci-dessous.');}
 }
 const summary=candidate?saveSummary(candidate):null;
 return <Modal title="Paramètres" onClose={onClose} className="settings-modal"><span className="eyebrow">À VOTRE RYTHME</span><h2>Paramètres</h2>
  <label><input type="checkbox" checked={save.ux.sound} onChange={e=>onChange({sound:e.target.checked})}/>Sons activés</label>
  <label className="volume-setting">Volume des effets · {Math.round(save.ux.volume*100)} %<input aria-label="Volume des effets" type="range" min="0" max="100" value={Math.round(save.ux.volume*100)} onChange={e=>onChange({volume:Number(e.target.value)/100})}/></label>
  <label className="motion-setting">Animations<select aria-label="Animations" value={save.ux.motion} onChange={e=>onChange({motion:e.target.value as UX['motion']})}><option value="system">Respecter le système</option><option value="reduce">Animations réduites</option></select></label>
  {<><label><input type="checkbox" checked={save.account.fastOpening} disabled={!unlocked} onChange={onFast}/>Ouverture rapide {unlocked?'':'· 8 boosters terminés ou exploration niveau 12 requis'}</label><p>Les Mythiques gardent leur mise en scène. Les animations réduites restent prioritaires.</p></>}

  <section className="save-settings" aria-label="Sauvegarde"><h3>Sauvegarde</h3><p>Votre progression reste dans ce navigateur. Exportez une copie avant de changer d’appareil ou d’effacer les données du site.</p>
   <UIAction onClick={()=>{try{downloadJSON(exportSave(save),'tcg-clicker-sauvegarde-v4.json');setMessage('Sauvegarde exportée.');}catch{setMessage('Export impossible.');}}}>Exporter la sauvegarde</UIAction>
   <label className="import-label">Importer une sauvegarde<input ref={fileInput} type="file" accept=".json,application/json" onChange={e=>void read(e.target.files?.[0])}/></label>
   {candidate&&summary&&<div className="save-confirmation" role="group" aria-label="Confirmer l’import"><h4>Vérifier avant remplacement</h4><p>Machine niveau {summary.level} · {summary.species}/60 espèces · {summary.energy.toLocaleString('fr-FR')} éclats · {summary.packs} boosters.{summary.pending!==null?` Ouverture en cours : ${summary.pending}/5 cartes révélées.`:''}</p><p>Votre partie actuelle sera remplacée. Une copie de secours sera créée avant l’import.</p><UIAction onClick={()=>replace(candidate)}>Confirmer le remplacement</UIAction><UIAction onClick={()=>{setCandidate(null);if(fileInput.current)fileInput.current.value='';}}>Annuler l’import</UIAction></div>}
   <UIAction variant="destructive" onClick={()=>{setReset(true);setCandidate(null);}}>Réinitialiser la progression</UIAction>
   {reset&&<div className="save-confirmation"><p>La progression repartira de zéro. Une copie de secours sera conservée. Saisissez RESET pour confirmer.</p><label>Confirmation<input value={confirmation} autoComplete="off" onChange={e=>setConfirmation(e.target.value)}/></label><UIAction variant="destructive" disabled={confirmation!=='RESET'} onClick={()=>replace(initialSave())}>Confirmer la réinitialisation</UIAction><UIAction onClick={()=>{setReset(false);setConfirmation('');}}>Annuler la réinitialisation</UIAction></div>}
  </section>
  <details className="installation-details"><summary>Installation et mises à jour</summary><PWASettings pwa={pwa} beforeReload={beforeReload} busy={!!candidate||reset||!!save.pending.length}/></details>
  <section className="alpha-settings"><h3>{ALPHA_VERSION}</h3><p>Vous testez une version alpha de TCG Clicker.</p><UIAction onClick={()=>void copyDiagnostics()}>Copier les diagnostics</UIAction><p>Version, navigateur, taille d’écran et compteurs de progression uniquement. Aucun contenu complet de sauvegarde ni donnée personnelle.</p>{diagnosticText&&<textarea readOnly aria-label="Diagnostics à copier" value={diagnosticText} onFocus={e=>e.target.select()}/>}</section>
  {message&&<p role="status">{message}</p>}
  <UIAction variant="primary" className="ux-primary" onClick={onClose}>Revenir au jeu</UIAction>
 </Modal>;
}
