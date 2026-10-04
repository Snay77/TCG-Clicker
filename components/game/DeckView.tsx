import { useState } from "react";
import { CARDS, byId } from "../../lib/cards";
import { changeDeck, deckCapacity, deckEffects, equipBlockedReason, Save, stats, savedCardLevel } from "../../lib/game";
import { describeEffect } from "../../lib/effects";
import { leveledEffect } from "../../lib/progression";
import { BUILD_ARCHETYPES, synergies, advancedSynergies } from "../../lib/synergies";
import Sprite from "../Sprite";
import { TYPE_SIGNS } from "../../lib/ux";
import { explorationLevel } from "../../lib/exploration";
import BottomSheet from './BottomSheet';
import { useMobileLayout } from './useMobileLayout';
import { TYPES } from '../../lib/content/model';
export function statImpact(before: ReturnType<typeof stats>, after: ReturnType<typeof stats>): string {
  const delta = (n: number) => `${n >= 0 ? "+" : ""}${Number(n.toFixed(2))}`;
  return `${delta(after.click - before.click)} / clic · ${delta(after.auto - before.auto)} / sec · ${delta((after.crit - before.crit) * 100)} points critique · ${delta(after.critMultiplier - before.critMultiplier)} × critique · ${delta((after.discount - before.discount) * 100)} points réduction booster`;
}
export default function DeckView({ save, onEquip }: { save: Save; onEquip: (id: string, replaceId?: string) => void }) {
  const mobile=useMobileLayout();
  const [picker,setPicker]=useState(false),[search,setSearch]=useState(""),[type,setType]=useState("");
  const [replaceId, setReplaceId] = useState("");
  const replacement = save.deck.includes(replaceId) ? replaceId : undefined;
  const power = stats(save);
  const bonuses = deckEffects(save);
  const choices=CARDS.filter(c => save.owned[c.id] && (!mobile || (!save.deck.includes(c.id) && c.name.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")) && (!type || c.type===type))));
  const candidates=(!mobile || picker) ? (<div className="build-candidates">{choices.map(c => {
      const candidate = replacement && !save.deck.includes(c.id) ? { ...save, deck: save.deck.filter(id => id !== replacement) } : save;
      const reason = equipBlockedReason(candidate, c.id);
      const preview = changeDeck(save, c.id, replacement);
      return <div className="build-candidate" key={c.id}><Sprite creature={c} /><div><strong>{c.name} · niv. {savedCardLevel(save, c.id)}</strong><p>{describeEffect(leveledEffect(c.effect, savedCardLevel(save, c.id)))}</p>{reason?<small>{reason}</small>:<div className="replacement-comparison"><span>Clic <b>{power.click.toFixed(2)} → {stats(preview).click.toFixed(2)}</b></span><span>Passif <b>{power.auto.toFixed(2)} → {stats(preview).auto.toFixed(2)} / s</b></span><small>{statImpact(power,stats(preview))}</small></div>}</div><button disabled={!!reason} onClick={() => { onEquip(c.id, replacement); setReplaceId(""); setPicker(false); }}>{save.deck.includes(c.id) ? "Retirer" : replacement ? "Remplacer" : "Équiper"}</button></div>;
    })}</div>) : null;
  return <>
    <section className="build-panel">
      <div className="section-title"><div><div className="eyebrow">PUISSANCE DU DECK</div><h2>Vos compagnons · {save.deck.length} / {deckCapacity(save)}</h2><p>Sélectionnez un emplacement pour remplacer une carte, ou retirez-la directement.</p></div></div>
      <div className="deck-slots">{Array.from({ length: deckCapacity(save) }, (_, i) => {
        const c = save.deck[i] ? byId(save.deck[i]) : null;
        return c ? <div data-type={c.type} className={`equipped-slot ${replacement === c.id ? "selected-slot" : ""}`} key={i}>
          <button aria-label={`Remplacer ${c.name}`} onClick={() => {setReplaceId(mobile ? c.id : replacement === c.id ? "" : c.id);if(mobile){setSearch("");setType("");setPicker(true);}}} aria-pressed={replacement === c.id}><span className="companion-index" aria-hidden="true"><small>LIEN /</small>{String(i+1).padStart(2,'0')}</span><Sprite creature={c} /><strong>{c.name}</strong><small>{TYPE_SIGNS[c.type]} {c.type} · Niv. {savedCardLevel(save,c.id)}</small><small>{describeEffect(leveledEffect(c.effect,savedCardLevel(save,c.id)))}</small></button>
          <button className="companion-remove" onClick={() => onEquip(c.id)}>Retirer −</button>
        </div> : <button className="empty-slot" key={i} aria-label={`Choisir le compagnon ${i+1}`} onClick={()=>{setReplaceId("");setSearch("");setType("");if(mobile)setPicker(true);else document.querySelector(".build-candidates")?.scrollIntoView({block:"start"});}}><span className="companion-index" aria-hidden="true"><small>LIEN /</small>{String(i+1).padStart(2,'0')}</span><span>+</span><small>EMPLACEMENT {i + 1}</small></button>;
      })}</div>
      <div className="build-stats"><div><small>CLIC TOTAL</small><strong>{power.click.toFixed(2)}</strong></div><div><small>PASSIF / SEC</small><strong>{power.auto.toFixed(2)}</strong></div><div><small>CRITIQUE</small><strong>{(power.crit * 100).toFixed(1)} % · ×{power.critMultiplier.toFixed(2)}</strong></div><div><small>BOOSTER</small><strong>−{(power.discount * 100).toFixed(1)} %</strong></div></div>
      <p><strong>Bonus du deck : </strong>{describeEffect(bonuses) || "Équipez votre premier compagnon."}</p>
      <p className="progression-hint">Statistiques incluant les améliorations permanentes, hors combo. Rare+ : poids +{(power.rareChance * 100).toFixed(1)} % · doublon : +{power.duplicateBonus.toFixed(1)} éclats.</p>
    </section>
    <details className="deck-mobile-details" open={mobile?undefined:true}><summary>{mobile?"Synergies et styles de deck":"Détails des synergies"}</summary>
    <section className="synergy-panel"><h2>Synergies de type</h2><div className="synergy-grid">{synergies(save.deck).map(s => <div data-type={s.type} className={s.active ? "synergy active" : s.count===s.required-1?"synergy almost":"synergy"} key={s.type}><strong>{TYPE_SIGNS[s.type]} {s.type} · {s.count}/{s.required}</strong><div className="synergy-links" aria-hidden="true">{Array.from({length:s.required},(_,i)=><i className={i<s.count?"linked":""} key={i}/>)}</div><small>{describeEffect(s.effect)}</small><span>{s.active ? "Active" : `Encore ${s.required - s.count} compagnon(s)`}</span></div>)}</div></section>
    <section className="synergy-panel"><h2>Synergies avancées · exploration niveau 3</h2><div className="synergy-grid">{advancedSynergies(save.deck,explorationLevel(save.account.xp)).map(s=><div data-type={s.type} className={s.active?"synergy active":s.unlocked&&s.count===2?"synergy almost":"synergy"} key={s.type}><strong>{TYPE_SIGNS[s.type]} {s.type} · {s.count}/3</strong><div className="synergy-links" aria-hidden="true">{[0,1,2].map(i=><i className={i<s.count?"linked":""} key={i}/>)}</div><small>+3 % énergie globale</small><span>{!s.unlocked?"Exploration niveau 3 requis":s.active?"Active":`Encore ${Math.max(0,3-s.count)} compagnon(s)`}</span></div>)}</div></section>
    <section className="archetype-grid" aria-label="Styles de build">{BUILD_ARCHETYPES.map(b => <div key={b.name}><h3>Build {b.name}</h3><p>{b.description}</p><small>{b.ids.map(id => byId(id).name).join(" · ")}</small></div>)}</section>
    </details>
    {!mobile&&<div className="section-title"><div><h2>{replacement ? `Remplacer ${byId(replacement).name}` : "Choisir vos compagnons"}</h2><p>Impact calculé avec les niveaux de carte et les synergies.</p></div></div>}
    {!mobile&&candidates}
    {mobile&&picker&&<BottomSheet title={replacement ? `Remplacer ${byId(replacement).name}` : "Choisir un compagnon"} onClose={()=>{setPicker(false);setReplaceId("");}}><div className="deck-picker-search"><label>Recherche<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Type<select value={type} onChange={e=>setType(e.target.value)}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label></div>{candidates}{!choices.length&&<p>Aucun compagnon disponible pour ces filtres. Effacez la recherche ou ouvrez un booster pour de nouvelles rencontres.</p>}</BottomSheet>}
    {!Object.keys(save.owned).length && <div className="notice deck-empty">Votre deck est vide. Ouvrez un booster pour rencontrer vos premiers compagnons.</div>}
  </>;
}
