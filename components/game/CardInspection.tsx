import type { Save } from '../../lib/game';
import { equipBlockedReason } from '../../lib/game';
import { cardInspection } from '../../lib/ux';
import { LINEAGES } from '../../lib/exploration';
import { byId, RARITIES } from '../../lib/cards';
import Card from '../Card';
import Sprite from '../Sprite';
import Modal from './Modal';
import UIAction from './UIAction';
import { advancedDesign } from '../../lib/advanced-card-design';

export function CardUpgrade({save,id,onUpgrade}:{save:Save;id:string;onUpgrade:(id:string)=>void}){
 const v=cardInspection(save,id);
 if(!v.copies)return null;
 const required=v.cost===null?null:v.cost+1;
 return <section className={`inspection-section card-progression ${v.upgradeable?'available':''}`} aria-label="Progression de la carte">
  <div className="inspection-section-heading"><h3>PROGRESSION</h3><strong className="inspection-value">{v.cost===null?`Niveau ${v.level} · MAX`:`Niveau ${v.level} → ${v.level+1}`}</strong></div>
  {v.next&&<div className="effect-comparison"><span><small>ACTUEL</small>{v.current}</span><span aria-hidden="true">→</span><span><small>PROCHAIN</small>{v.next}</span></div>}
  <div className="copy-meter"><span className="inspection-label">COPIES</span>
   {required!==null&&<span className="copy-dots" aria-hidden="true">{Array.from({length:required},(_,i)=><i key={i} className={i<v.copies?'filled':''}/>)}</span>}
   <strong aria-label={required===null?`${v.copies} copies`:`${v.copies} copies sur ${required} nécessaires`}>{v.copies}{required!==null&&<span> / {required}</span>} <span className="copy-unit">{v.copies===1&&required===null?'copie':'copies'}</span></strong>
   {required!==null&&v.copies<required&&<small className="copy-shortfall" role="status">{required-v.copies} {required-v.copies===1?'manquante':'manquantes'}</small>}
  </div>
  {v.cost!==null&&<div className="inspection-upgrade-actions"><UIAction variant={v.upgradeable?'primary':'secondary'} className="card-upgrade-button" disabled={!v.upgradeable||!!save.pending.length} aria-label={`Améliorer ${v.card.name} au niveau ${v.level+1} : consommer ${v.cost} doublons`} onClick={()=>onUpgrade(id)}>AMÉLIORER</UIAction><details className="inspection-help upgrade-help"><summary aria-label="Règles d’amélioration">?</summary><p>{v.cost} doublons consommés · une copie conservée. Chaque forme évolue indépendamment.</p></details></div>}
 </section>;
}
export default function CardInspection({save,id,onClose,onUpgrade,onEquip}:{save:Save;id:string;onClose:()=>void;onUpgrade:(id:string)=>void;onEquip:(id:string)=>void}){
 const v=cardInspection(save,id),lineage=LINEAGES.find(l=>l.ids.includes(id)),reason=equipBlockedReason(save,id),equipped=save.deck.includes(id);
 const evolutionLocked=!!v.card.evolvesFrom&&!save.owned[v.card.evolvesFrom]&&!equipped;
 return <Modal title={`Examiner ${v.copies?v.card.name:'une rencontre inconnue'}`} onClose={onClose} className="card-inspection">
  <div className="inspection-art"><Card card={v.card} owned={v.copies} level={v.level}/><span className="inspection-object-label">FAERIE / OBJET TCG</span></div>
  <div className="inspection-details">
   <section className="inspection-section inspection-capacity" aria-label="Capacité de la carte"><h3>CAPACITÉ</h3><strong className="inspection-value">{v.current}</strong>{v.copies>0&&advancedDesign(v.card.design?.id)&&<p className="advanced-card-description">{advancedDesign(v.card.design?.id)!.text}</p>}</section>
   <CardUpgrade save={save} id={id} onUpgrade={onUpgrade}/>
   {v.copies>0&&<section className="inspection-section inspection-deck" aria-label="Deck"><div className="inspection-section-heading"><h3>DECK</h3><span className={`inspection-deck-state ${equipped?'is-equipped':''}`}>{equipped?'● Équipée':evolutionLocked?'◇ Évolution verrouillée':'○ Non équipée'}</span></div><UIAction variant={equipped?'secondary':'primary'} disabled={!!reason||!!save.pending.length} onClick={()=>onEquip(id)}>{equipped?'RETIRER DU DECK':'ÉQUIPER'}</UIAction>{reason&&<p className="inspection-blocked">{evolutionLocked?`Forme requise : ${byId(v.card.evolvesFrom!).name}`:reason}</p>}</section>}
   <details className="inspection-secondary inspection-help"><summary>Identité et lignée</summary><section className="inspection-section inspection-identity" aria-label="Identité de la carte"><h2>{v.copies?v.card.name:'À découvrir'}</h2><dl><div><dt>TYPE</dt><dd>{v.card.type}</dd></div><div><dt>RARETÉ</dt><dd>{RARITIES[v.card.rarity]}</dd></div><div><dt>LIGNÉE</dt><dd>{lineage?.name||'Créature unique'}</dd></div></dl><span className="inspection-metadata">SET 01 · {String(v.card.number).padStart(3,'0')} / 060 · {v.copies?v.card.stage:'Forme inconnue'}</span></section>
   {lineage&&<div className="inspection-lineage"><div>{lineage.ids.map(cid=><div key={cid}><Sprite creature={byId(cid)} silhouette={!save.owned[cid]}/><span>{save.owned[cid]?byId(cid).name:'À découvrir'}</span></div>)}</div></div>}</details>
  </div>
 </Modal>;
}
