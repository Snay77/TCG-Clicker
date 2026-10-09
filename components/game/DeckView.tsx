import { useState } from "react";
import { CARDS, byId } from "../../lib/cards";
import { changeDeck, deckCapacity, deckEffects, equipBlockedReason, Save, stats, savedCardLevel } from "../../lib/game";
import { describeUIEffect as describeEffect } from "../../lib/effects";
import { leveledEffect } from "../../lib/progression";
import { BUILD_ARCHETYPES, synergies, advancedSynergies } from "../../lib/synergies";
import Sprite from "../Sprite";
import { TYPE_SIGNS } from "../../lib/ux";
import { explorationLevel } from "../../lib/exploration";
import BottomSheet from './BottomSheet';
import { useMobileLayout } from './useMobileLayout';
import { TYPES } from '../../lib/content/model';
import { visibleSystems } from '../../lib/disclosure';
import type { AdvancedContext } from '../../lib/advanced-effects';
import AdvancedDeckEffects from './AdvancedDeckEffects';
import {advancedDesign} from '../../lib/advanced-card-design';
import {advancedRows} from '../../lib/advanced-effects';
import {amount,decimal,percent,rarePlusChance,missingParent,sortDeckChoices,slotOffer} from '../../lib/game-ux';
import EvolutionRequirement from './EvolutionRequirement';
import DeckComparison from './DeckComparison';
import DeckReplacement from './DeckReplacement';
export function statImpact(before: ReturnType<typeof stats>, after: ReturnType<typeof stats>): string {
  const fields:[string,number][]=[['/ clic',after.click-before.click],['/ sec',after.auto-before.auto],['points critique',(after.crit-before.crit)*100],['× critique',after.critMultiplier-before.critMultiplier],['points réduction booster',(after.discount-before.discount)*100]];
  return fields.filter(([,n])=>Math.abs(n)>=.005).map(([label,n])=>(n>0?'+':'')+decimal(n)+' '+label).join(' · ');
}
export default function DeckView({ save, onEquip, effectContext={},recentIds=[],onSlot }: { save: Save; onEquip: (id: string, replaceId?: string) => void; effectContext?:AdvancedContext;recentIds?:string[];onSlot?:()=>void }) {
  const mobile=useMobileLayout();
  const [directReplacement,setDirectReplacement]=useState('');
  const offer=slotOffer(save);
  const systems=visibleSystems(save);
  const eligible=Object.keys(save.owned).filter(id=>save.owned[id]&&!equipBlockedReason({...save,deck:[]},id));
  const typeCounts=new Map<string,number>();
  for(const id of eligible){const type=byId(id).type;typeCounts.set(type,(typeCounts.get(type)||0)+1);}
  const styles=BUILD_ARCHETYPES.filter(b=>b.ids.filter(id=>eligible.includes(id)).length>=2);
  const [picker,setPicker]=useState(false),[search,setSearch]=useState(""),[type,setType]=useState("");
  const [replaceId, setReplaceId] = useState("");
  const replacement = save.deck.includes(replaceId) ? replaceId : undefined;
  const power = stats(save,effectContext);
  const bonuses = deckEffects(save,effectContext);
  const choices=CARDS.filter(c => save.owned[c.id] && (!mobile || (!save.deck.includes(c.id) && c.name.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")) && (!type || c.type===type))));
  const sorted=sortDeckChoices(save,choices.map(c=>c.id),recentIds).map(byId);
  const candidates=(!mobile || picker) ? (<div className="build-candidates">{sorted.map(c => {
      const candidate = replacement && !save.deck.includes(c.id) ? { ...save, deck: save.deck.filter(id => id !== replacement) } : save;
      const reason = missingParent(save,c.id)?equipBlockedReason(candidate,c.id):null;
      const ambiguous=!replacement&&!save.deck.includes(c.id)&&save.deck.length>=deckCapacity(save);
      const design=advancedDesign(c.design?.id),row=advancedRows({...save,deck:save.deck.includes(c.id)?save.deck:[...save.deck.filter(cid=>cid!==replacement).slice(0,deckCapacity(save)-1),c.id]},effectContext).find(r=>r.id===c.id);
      return <div className="build-candidate" key={c.id}><Sprite creature={c} /><div><strong>{c.name} · niveau carte {savedCardLevel(save,c.id)}</strong>{recentIds.includes(c.id)&&<span className="recent-badge">NOUVEAU</span>}<p>{describeEffect(leveledEffect(c.effect,savedCardLevel(save,c.id)))}</p>{design&&<p className="candidate-advanced"><strong>{design.text}</strong><small>{ambiguous?'Condition selon le compagnon remplacé':(save.deck.includes(c.id)?row?.status:'À l’équipement')+' · '+(row?.active?'condition remplie':'condition à remplir')}</small></p>}<EvolutionRequirement save={save} id={c.id}/>{!reason&&<DeckComparison save={save} id={c.id} replaceId={replacement} context={effectContext}/>}</div><button disabled={!!reason} onClick={()=>{if(!replacement&&!save.deck.includes(c.id)&&save.deck.length>=deckCapacity(save)){setDirectReplacement(c.id);return;}onEquip(c.id,replacement);setReplaceId('');setPicker(false);}}>{save.deck.includes(c.id)?'Retirer':replacement?'Remplacer':save.deck.length>=deckCapacity(save)?'Choisir un remplacement':'Équiper'}</button></div>;
    })}</div>) : null;
  return <>
    <section className="build-panel">
      <div className="deck-compact-summary" aria-label="Résumé du Deck"><strong>DECK / {save.deck.length}</strong><span>Clic : {decimal(power.click)}</span><span>Passif : {decimal(power.auto)}/s</span>{power.crit>0&&<span>Crit : {percent(power.crit)} · ×{decimal(power.critMultiplier)}</span>}<span>Rare+ : {percent(rarePlusChance(power.rareChance))}</span><small>SYNERGIES · {[...synergies(save.deck),...advancedSynergies(save.deck,explorationLevel(save.account.xp))].filter(x=>x.active).map(x=>x.type+' ×'+x.required).join(' · ')||'Aucune active'}</small></div>
      <div className="section-title"><div><div className="eyebrow">PUISSANCE DU DECK</div><h2>Vos compagnons · {save.deck.length} / {deckCapacity(save)}</h2><p>Sélectionnez un emplacement pour remplacer une carte, ou retirez-la directement.</p></div></div>
      <div className="deck-slots">{Array.from({ length: deckCapacity(save) }, (_, i) => {
        const c = save.deck[i] ? byId(save.deck[i]) : null;
        return c ? <div data-type={c.type} className={`equipped-slot ${replacement === c.id ? "selected-slot" : ""}`} key={i}>
          <button aria-label={`Remplacer ${c.name}`} onClick={() => {setReplaceId(mobile ? c.id : replacement === c.id ? "" : c.id);if(mobile){setSearch("");setType("");setPicker(true);}}} aria-pressed={replacement === c.id}><span className="companion-index" aria-hidden="true"><small>LIEN /</small>{String(i+1).padStart(2,'0')}</span><Sprite creature={c} /><strong>{c.name}</strong><small>{TYPE_SIGNS[c.type]} {c.type} · Niv. {savedCardLevel(save,c.id)}</small><small>{describeEffect(leveledEffect(c.effect,savedCardLevel(save,c.id)))}</small></button>
          <button className="companion-remove" onClick={() => onEquip(c.id)}>Retirer −</button>
        </div> : <button className="empty-slot" key={i} aria-label={`Choisir le compagnon ${i+1}`} onClick={()=>{setReplaceId("");setSearch("");setType("");if(mobile)setPicker(true);else document.querySelector(".build-candidates")?.scrollIntoView({block:"start"});}}><span className="companion-index" aria-hidden="true"><small>LIEN /</small>{String(i+1).padStart(2,'0')}</span><span>+</span><small>EMPLACEMENT {i + 1}</small></button>;
      })}</div>
      <div className="build-stats"><div><small>CLIC TOTAL</small><strong>{decimal(power.click)}</strong></div><div><small>PASSIF / SEC</small><strong>{decimal(power.auto)}</strong></div>{power.crit>0&&<div><small>CRITIQUE</small><strong>{percent(power.crit)} · ×{decimal(power.critMultiplier)}</strong></div>}{power.discount>0&&<div><small>BOOSTER</small><strong>−{percent(power.discount)}</strong></div>}</div>
      <p><strong>Bonus du deck : </strong>{describeEffect(bonuses) || "Équipez votre premier compagnon."}</p>
      <AdvancedDeckEffects save={save} context={effectContext}/>
      {systems.statistics&&<p className="progression-hint">Statistiques incluant les améliorations permanentes, hors multiplicateur combo, avec conditions et effets temporaires actifs. Rare+ : {percent(rarePlusChance(power.rareChance))} (cartes 1–4) · {percent(rarePlusChance(power.rareChance,true))} (carte 5) · doublon : +{decimal(power.duplicateBonus)} éclats.</p>}
    </section>
    {systems.synergies&&<section className="synergy-panel"><h2>Synergies · deux paliers</h2><div className="synergy-grid">{synergies(save.deck).filter(row=>row.count>0||(typeCounts.get(row.type)||0)>=2).map(row=><article className={row.active?'synergy active':'synergy'} key={row.type}><strong>{TYPE_SIGNS[row.type]} {row.type} · {row.count} cartes</strong><p>2 cartes · {describeEffect(row.effect)} {row.active?'✓':''}</p><p>3 cartes · +3 % éclats supplémentaires {row.count>=3&&explorationLevel(save.account.xp)>=3?'✓':'· exploration niveau 3'}</p><small>{row.count<2?'Prochain palier : encore '+(2-row.count)+' carte(s)':row.count<3?'Prochain palier : encore 1 carte':explorationLevel(save.account.xp)<3?'Prochain palier : exploration niveau 3':'Deux paliers actifs'}</small></article>)}</div></section>}
    {offer&&<section className="deck-slot-offer"><h3>{offer.slot}e emplacement {offer.available?'disponible':'· exploration niveau '+offer.level}</h3><p>Vos éclats : {amount(save.energy)} ✦ · Coût : {amount(offer.cost)} ✦</p><button disabled={!offer.available||save.energy<offer.cost||!!save.pending.length} onClick={onSlot}>Acheter le {offer.slot}e emplacement · {amount(offer.cost)} ✦</button></section>}
    {!mobile&&<div className="section-title"><div><h2>{replacement ? `Remplacer ${byId(replacement).name}` : "Choisir vos compagnons"}</h2><p>Impact calculé avec les niveaux de carte et les synergies.</p></div></div>}
    {!mobile&&candidates}
    {mobile&&picker&&<BottomSheet title={replacement ? `Remplacer ${byId(replacement).name}` : "Choisir un compagnon"} onClose={()=>{setPicker(false);setReplaceId("");}}><div className="deck-picker-search"><label>Recherche<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Type<select value={type} onChange={e=>setType(e.target.value)}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label></div>{candidates}{!choices.length&&<p>Aucun compagnon disponible pour ces filtres. Effacez la recherche ou ouvrez un booster pour de nouvelles rencontres.</p>}</BottomSheet>}
    {directReplacement&&<DeckReplacement save={save} id={directReplacement} context={effectContext} onClose={()=>setDirectReplacement('')} onReplace={cid=>{onEquip(directReplacement,cid);setDirectReplacement('');setPicker(false);setReplaceId('');}}/>}
    {!Object.keys(save.owned).length && <div className="notice deck-empty">Votre deck est vide. Ouvrez un booster pour rencontrer vos premiers compagnons.</div>}
  </>;
}
