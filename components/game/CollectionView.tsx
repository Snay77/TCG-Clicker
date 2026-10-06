import { memo, useMemo, useState } from "react";
import { RARITIES } from "../../lib/cards";
import { TYPES } from "../../lib/content/model";
import { type Save } from "../../lib/game";
import { filterCollection, cardInspection, TYPE_SIGNS, type CollectionFilters } from "../../lib/ux";
import { LINEAGES } from "../../lib/exploration";
import Card from "../Card";
import { CollectionSummary, LineageGoals } from "./ProgressionView";
import CardInspection from "./CardInspection";
import UIAction from './UIAction';
import { visibleSystems } from '../../lib/disclosure';
import BottomSheet from './BottomSheet';
import { useMobileLayout } from './useMobileLayout';
const emptyFilters:CollectionFilters={search:"",type:"",rarity:"",discovery:"",upgradeable:false,sort:"number"};
const CollectionCard=memo(function CollectionCard({c,save,onInspect}:{c:ReturnType<typeof filterCollection>[number];save:Save;onInspect:(id:string)=>void}){const v=cardInspection(save,c.id);return <article className="archive-entry" data-type={v.copies?c.type:undefined}><header className="archive-label"><span>{String(c.number).padStart(3,'0')}</span><div><strong>{v.copies?c.name:'Non répertoriée'}</strong><small>{v.copies?`${TYPE_SIGNS[c.type]} ${c.type} / SET 01`:'À découvrir'}</small></div></header><Card card={c} owned={v.copies} level={v.level}/>
  <div className="archive-actions"><UIAction aria-label={`Examiner ${v.copies?c.name:`la carte ${c.number}`}`} onClick={()=>onInspect(c.id)}>EXAMINER ↗</UIAction>{v.copies>0&&<span>{save.deck.includes(c.id)?'● Équipée':v.upgradeable?'◇ Améliorable':`NIV. ${v.level}`}</span>}</div>
 </article>;},(a,b)=>a.c===b.c&&a.save.owned===b.save.owned&&a.save.cardLevels===b.save.cardLevels&&a.save.deck===b.save.deck&&a.onInspect===b.onInspect);
export default function CollectionView({save,onEquip,onUpgrade,onClaim}:{save:Save;onEquip:(id:string)=>void;onUpgrade:(id:string)=>void;onClaim:(id:string)=>void}){
 const mobile=useMobileLayout();
 const [filtersOpen,setFiltersOpen]=useState(false);
 const [filters,setFilters]=useState(emptyFilters),[view,setView]=useState('cards'),[selected,setSelected]=useState('');
 const filtered=useMemo(()=>filterCollection(save,filters),[save.owned,save.cardLevels,filters]);
 const change=(patch:Partial<CollectionFilters>)=>setFilters(f=>({...f,...patch}));
 const systems=visibleSystems(save);
 const renderCard=(c:typeof filtered[number])=><CollectionCard key={c.id} c={c} save={save} onInspect={setSelected}/>;
 const filtersPanel=(<div className="collection-filters">
   <label>Type<select aria-label="Type" value={filters.type} onChange={e=>change({type:e.target.value})}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label>
   <label>Rareté<select aria-label="Rareté" value={filters.rarity} onChange={e=>change({rarity:e.target.value})}><option value="">Toutes les raretés</option>{RARITIES.map((r,i)=><option key={r} value={i}>{r}</option>)}</select></label>
   <label>Découvertes<select aria-label="Découvertes" value={filters.discovery} onChange={e=>change({discovery:e.target.value})}><option value="">Toutes les rencontres</option><option value="owned">Découvertes</option><option value="unknown">À découvrir</option></select></label>
   <label>Trier par<select aria-label="Trier par" value={filters.sort} onChange={e=>change({sort:e.target.value as CollectionFilters['sort']})}><option value="number">Numéro</option><option value="rarity">Rareté</option></select></label>
   <label className="checkbox-filter"><input type="checkbox" checked={filters.upgradeable} onChange={e=>change({upgradeable:e.target.checked})}/>Améliorables</label><button onClick={()=>setFilters(emptyFilters)}>Effacer les filtres</button>
  </div>);
 return <>
  {!Object.keys(save.owned).length&&<div className="archive-empty"><strong>REGISTRE / 000 RENCONTRE</strong>Les 60 emplacements attendent vos découvertes. Ouvrez un booster pour identifier vos premiers compagnons.</div>}
  <div className="section-title"><div><h2>Classeur Faerie</h2><p>{Object.keys(save.owned).length} / 60 espèces · 20 lignées et 8 uniques.</p></div></div>
  {systems.progression&&<><details className="collection-mobile-summary"><summary>{Object.keys(save.owned).length} / 60 espèces · Voir la progression</summary><CollectionSummary save={save}/></details><details className="collection-lineages"><summary>Voir les 20 lignées d’évolution et leurs récompenses</summary><LineageGoals save={save} onClaim={onClaim}/></details></>}
  <div className="collection-search"><label>Recherche<input type="search" value={filters.search} onChange={e=>change({search:e.target.value})}/></label>{mobile&&<button className="mobile-filter-button" onClick={()=>setFiltersOpen(true)}>Filtres</button>}</div>
  {!mobile&&filtersPanel}
  {mobile&&filtersOpen&&<BottomSheet title="Filtres de Collection" onClose={()=>setFiltersOpen(false)}>{filtersPanel}<button className="ux-primary" onClick={()=>setFiltersOpen(false)}>Voir {filtered.length} cartes</button></BottomSheet>}
  <div className="collection-view-controls"><button aria-pressed={view==='cards'} onClick={()=>setView('cards')}>Toutes les cartes</button><button aria-pressed={view==='lineages'} onClick={()=>setView('lineages')}>Par lignée</button><span role="status">{filtered.length} rencontres</span></div>
  {view==='cards'?<div className="collection-grid">{filtered.map(renderCard)}</div>:<>{[...LINEAGES,{id:'unique',name:'Créatures uniques',ids:filtered.filter(c=>!LINEAGES.some(l=>l.ids.includes(c.id))).map(c=>c.id)}].map(l=>{const cards=filtered.filter(c=>l.ids.includes(c.id));return cards.length?<section className="collection-family" key={l.id}><h3>{l.name}</h3><div className="collection-grid">{cards.map(renderCard)}</div></section>:null;})}</>}
  {!filtered.length&&<p className="notice">Aucune carte pour ces filtres. Essayez de les effacer.</p>}
  {selected&&<CardInspection save={save} id={selected} onClose={()=>setSelected('')} onUpgrade={onUpgrade} onEquip={onEquip}/>}
 </>;
}
