import {byId} from '../../lib/cards';
import type {Save} from '../../lib/game';
import type {AdvancedContext} from '../../lib/advanced-effects';
import Modal from './Modal';
import Sprite from '../Sprite';
import DeckComparison from './DeckComparison';
export default function DeckReplacement({save,id,onReplace,onClose,context={}}:{save:Save;id:string;onReplace:(replaceId:string)=>void;onClose:()=>void;context?:AdvancedContext}){
 return <Modal title={`Équiper ${byId(id).name} · remplacer un compagnon`} onClose={onClose} className="deck-replacement"><h2>Choisir le compagnon à remplacer</h2><p>{byId(id).name} occupera son emplacement.</p>{save.deck.map((cid,i)=><section key={cid}><h3>Emplacement {i+1} · {byId(cid).name}</h3><Sprite creature={byId(cid)}/><DeckComparison save={save} id={id} replaceId={cid} context={context}/><button onClick={()=>onReplace(cid)}>Remplacer {byId(cid).name}</button></section>)}</Modal>;
}
