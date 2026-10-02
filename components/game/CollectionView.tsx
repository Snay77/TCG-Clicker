import { useState } from "react";
import { RARITIES } from "../../lib/cards";
import { TYPES } from "../../lib/content/model";
import { deckCapacity, equipBlockedReason, type Save } from "../../lib/game";
import { filterCollection, cardInspection, type CollectionFilters } from "../../lib/ux";
import { LINEAGES } from "../../lib/exploration";
import Card from "../Card";
import { CollectionSummary, LineageGoals } from "./ProgressionView";
import CardInspection, { CardUpgrade } from "./CardInspection";
const emptyFilters:CollectionFilters={search:"",type:"",rarity:"",discovery:"",upgradeable:false,sort:"number"};
export default function CollectionView({save,onEquip,onUpgrade,onClaim}:{save:Save;onEquip:(id:string)=>void;onUpgrade:(id:string)=>void;onClaim:(id:string)=>void}){
 const [filters,setFilters]=useState(emptyFilters),[view,setView]=useState('cards'),[selected,setSelected]=useState('');
 const filtered=filterCollection(save,filters);
 const change=(patch:Partial<CollectionFilters>)=>setFilters(f=>({...f,...patch}));
 const renderCard=(c:typeof filtered[number])=>{const v=cardInspection(save,c.id),reason=equipBlockedReason(save,c.id);return <Card key={c.id} card={c} owned={v.copies} level={v.level}>
  <button className="inspect-button" aria-label={`Examiner ${v.copies?c.name:`la carte ${c.number}`}`} onClick={()=>setSelected(c.id)}>Examiner la carte ↗</button>
  {v.copies>0&&<><CardUpgrade save={save} id={c.id} onUpgrade={onUpgrade}/><button className={save.deck.includes(c.id)?"equipped":"equip-button"} disabled={!!reason} title={reason||undefined} onClick={()=>onEquip(c.id)}>{save.deck.includes(c.id)?"✓ Équipée · Retirer":reason||`Équiper · ${save.deck.length}/${deckCapacity(save)}`}</button></>}
 </Card>;};
 return <>
  <div className="section-title"><div><h2>Classeur Faerie</h2><p>{Object.keys(save.owned).length} / 60 espèces · 20 lignées et 8 uniques.</p></div></div>
  <CollectionSummary save={save}/><details className="collection-lineages"><summary>Voir les 20 lignées d’évolution et leurs récompenses</summary><LineageGoals save={save} onClaim={onClaim}/></details>
  <div className="collection-filters">
   <label>Recherche<input type="search" value={filters.search} onChange={e=>change({search:e.target.value})}/></label>
   <label>Type<select aria-label="Type" value={filters.type} onChange={e=>change({type:e.target.value})}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label>
   <label>Rareté<select aria-label="Rareté" value={filters.rarity} onChange={e=>change({rarity:e.target.value})}><option value="">Toutes les raretés</option>{RARITIES.map((r,i)=><option key={r} value={i}>{r}</option>)}</select></label>
   <label>Découvertes<select aria-label="Découvertes" value={filters.discovery} onChange={e=>change({discovery:e.target.value})}><option value="">Toutes les rencontres</option><option value="owned">Découvertes</option><option value="unknown">À découvrir</option></select></label>
   <label>Trier par<select aria-label="Trier par" value={filters.sort} onChange={e=>change({sort:e.target.value as CollectionFilters['sort']})}><option value="number">Numéro</option><option value="rarity">Rareté</option></select></label>
   <label className="checkbox-filter"><input type="checkbox" checked={filters.upgradeable} onChange={e=>change({upgradeable:e.target.checked})}/>Améliorables</label><button onClick={()=>setFilters(emptyFilters)}>Effacer les filtres</button>
  </div>
  <div className="collection-view-controls"><button aria-pressed={view==='cards'} onClick={()=>setView('cards')}>Toutes les cartes</button><button aria-pressed={view==='lineages'} onClick={()=>setView('lineages')}>Par lignée</button><span role="status">{filtered.length} rencontres</span></div>
  {view==='cards'?<div className="collection-grid">{filtered.map(renderCard)}</div>:<>{[...LINEAGES,{id:'unique',name:'Créatures uniques',ids:filtered.filter(c=>!LINEAGES.some(l=>l.ids.includes(c.id))).map(c=>c.id)}].map(l=>{const cards=filtered.filter(c=>l.ids.includes(c.id));return cards.length?<section className="collection-family" key={l.id}><h3>{l.name}</h3><div className="collection-grid">{cards.map(renderCard)}</div></section>:null;})}</>}
  {!filtered.length&&<p className="notice">Aucune carte pour ces filtres. Essayez de les effacer.</p>}
  {selected&&<CardInspection save={save} id={selected} onClose={()=>setSelected('')} onUpgrade={onUpgrade} onEquip={onEquip}/>}
 </>;
}
