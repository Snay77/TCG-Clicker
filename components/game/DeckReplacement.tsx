import {byId,RARITIES} from '../../lib/cards';
import type {Save} from '../../lib/game';
import type {AdvancedContext} from '../../lib/advanced-effects';
import Modal from './Modal';
import Sprite from '../Sprite';
import DeckComparison from './DeckComparison';
import {describeUIEffect} from '../../lib/effects';
import {leveledEffect} from '../../lib/progression';
import {advancedDesign} from '../../lib/advanced-card-design';
export default function DeckReplacement({save,id,onReplace,onClose,context={}}:{save:Save;id:string;onReplace:(replaceId:string)=>void;onClose:()=>void;context?:AdvancedContext}){
 return <Modal title={`Équiper ${byId(id).name} · remplacer un compagnon`} onClose={onClose} className="deck-replacement"><h2>Choisir le compagnon à remplacer</h2><p>{byId(id).name} occupera son emplacement.</p><div className="replacement-list">{save.deck.map((cid,i)=>{const c=byId(cid);return <section className="replacement-row" key={cid}><Sprite creature={c}/><div><h3>{i+1} · {c.name}</h3><small>{RARITIES[c.rarity]} · {c.type}</small><p>{describeUIEffect(leveledEffect(c.effect,save.cardLevels[cid]||1))}</p>{advancedDesign(c.design?.id)&&<small>{advancedDesign(c.design?.id)!.text}</small>}<DeckComparison compact save={save} id={id} replaceId={cid} context={context}/></div><button onClick={()=>onReplace(cid)}>Remplacer {c.name}</button></section>;})}</div></Modal>;
}
