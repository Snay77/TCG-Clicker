import type { Save } from '../../lib/game';
import { equipBlockedReason } from '../../lib/game';
import { cardInspection } from '../../lib/ux';
import { LINEAGES } from '../../lib/exploration';
import { byId } from '../../lib/cards';
import { VISUALS } from '../../lib/visuals';
import Card from '../Card';
import Sprite from '../Sprite';
import Modal from './Modal';
export function CardUpgrade({save,id,onUpgrade}:{save:Save;id:string;onUpgrade:(id:string)=>void}){
 const v=cardInspection(save,id);
 if(!v.copies)return null;
 return <div className={`card-progression ${v.upgradeable?'available':''}`}><strong>{v.cost===null?'Niveau maximum':`Niveau ${v.level} → ${v.level+1}`}</strong>
  <small>Actuel : {v.current}</small>{v.next&&<small>Après amélioration : {v.next}</small>}
  <small>Copies disponibles : {v.copies} · {v.duplicates} doublons · 1 copie conservée</small>
  {v.cost!==null&&<small>Coût : {v.cost} doublons consommés</small>}
  <button className="card-upgrade-button" disabled={!v.upgradeable||!!save.pending.length} aria-label={`Améliorer ${v.card.name}${v.cost!==null?` au niveau ${v.level+1} : consommer ${v.cost} doublons`:' : niveau maximum'}`} onClick={()=>onUpgrade(id)}>{v.cost===null?'Niveau maximum':v.upgradeable?'Améliorer':'Doublons insuffisants'}</button>
 </div>;
}
export default function CardInspection({save,id,onClose,onUpgrade,onEquip}:{save:Save;id:string;onClose:()=>void;onUpgrade:(id:string)=>void;onEquip:(id:string)=>void}){
 const v=cardInspection(save,id),lineage=LINEAGES.find(l=>l.ids.includes(id)),reason=equipBlockedReason(save,id);
 return <Modal title={`Examiner ${v.copies?v.card.name:'une rencontre inconnue'}`} onClose={onClose} className="card-inspection"><div className="inspection-art"><Card card={v.card} owned={v.copies} level={v.level}/></div>
  <div className="inspection-details"><span className="eyebrow">FAERIE · {String(v.card.number).padStart(3,'0')} / 060</span><h2>{v.copies?v.card.name:'À découvrir'}</h2><p>{v.card.type} · {v.copies?v.card.stage:'Évolution inconnue'} · {v.copies?`Niveau ${v.level} / 5`:'Non découverte'}</p>
   <p>{v.copies?VISUALS[id].flavor:'La forêt garde encore son secret.'}</p><CardUpgrade save={save} id={id} onUpgrade={onUpgrade}/>
   {lineage?<section className="inspection-lineage"><h3>{lineage.name}</h3><div>{lineage.ids.map(cid=><div key={cid}><Sprite creature={byId(cid)} silhouette={!save.owned[cid]}/><span>{save.owned[cid]?byId(cid).name:'À découvrir'}</span></div>)}</div><small>Découvrez la forme précédente pour équiper une évolution. Chaque forme reste indépendante.</small></section>:<p>Créature unique · aucune évolution.</p>}
   {v.copies>0&&<><button className="ux-primary" disabled={!!reason} onClick={()=>onEquip(id)}>{save.deck.includes(id)?'Retirer du deck':'Équiper ce compagnon'}</button>{reason&&<p>{reason}</p>}</>}
  </div>
 </Modal>;
}
