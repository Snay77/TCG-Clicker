import type { Save } from '../../lib/game';
import type { UX } from '../../lib/ux';
import { explorationLevel } from '../../lib/exploration';
import Modal from './Modal';
export default function Settings({save,onChange,onFast,onClose}:{save:Save;onChange:(change:Partial<UX>)=>void;onFast:()=>void;onClose:()=>void}){
 const unlocked=explorationLevel(save.account.xp)>=12;
 return <Modal title="Paramètres" onClose={onClose} className="settings-modal"><span className="eyebrow">À VOTRE RYTHME</span><h2>Paramètres</h2>
  <label><input type="checkbox" checked={save.ux.sound} onChange={e=>onChange({sound:e.target.checked})}/>Sons activés</label>
  <label className="volume-setting">Volume des effets · {Math.round(save.ux.volume*100)} %<input aria-label="Volume des effets" type="range" min="0" max="100" value={Math.round(save.ux.volume*100)} onChange={e=>onChange({volume:Number(e.target.value)/100})}/></label>
  <label>Animations<select aria-label="Animations" value={save.ux.motion} onChange={e=>onChange({motion:e.target.value as UX['motion']})}><option value="system">Respecter le système</option><option value="reduce">Animations réduites</option></select></label>
  <label><input type="checkbox" checked={save.account.fastOpening} disabled={!unlocked} onChange={onFast}/>Ouverture rapide {unlocked?'':'· niveau 12 requis'}</label><p>Les Mythiques gardent leur mise en scène. Les animations réduites restent prioritaires.</p>
  <button className="ux-primary" onClick={onClose}>Revenir au jeu</button>
 </Modal>;
}
