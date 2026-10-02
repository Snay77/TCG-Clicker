import { useState } from "react";
import { CARDS, byId } from "../../lib/cards";
import { changeDeck, deckCapacity, deckEffects, equipBlockedReason, Save, stats, savedCardLevel } from "../../lib/game";
import { describeEffect } from "../../lib/effects";
import { leveledEffect } from "../../lib/progression";
import { BUILD_ARCHETYPES, synergies } from "../../lib/synergies";
import Sprite from "../Sprite";
export function statImpact(before: ReturnType<typeof stats>, after: ReturnType<typeof stats>): string {
  const delta = (n: number) => `${n >= 0 ? "+" : ""}${Number(n.toFixed(2))}`;
  return `${delta(after.click - before.click)} / clic · ${delta(after.auto - before.auto)} / sec · ${delta((after.crit - before.crit) * 100)} points critique · ${delta(after.critMultiplier - before.critMultiplier)} × critique · ${delta((after.discount - before.discount) * 100)} points réduction booster`;
}
export default function DeckView({ save, onEquip }: { save: Save; onEquip: (id: string, replaceId?: string) => void }) {
  const [replaceId, setReplaceId] = useState("");
  const replacement = save.deck.includes(replaceId) ? replaceId : undefined;
  const power = stats(save);
  const bonuses = deckEffects(save);
  return <>
    <section className="build-panel">
      <div className="section-title"><div><div className="eyebrow">PUISSANCE DU DECK</div><h2>Vos compagnons · {save.deck.length} / {deckCapacity(save)}</h2><p>Sélectionnez un emplacement pour remplacer une carte, ou retirez-la directement.</p></div></div>
      <div className="deck-slots">{Array.from({ length: deckCapacity(save) }, (_, i) => {
        const c = save.deck[i] ? byId(save.deck[i]) : null;
        return c ? <div className={`equipped-slot ${replacement === c.id ? "selected-slot" : ""}`} key={i}>
          <button onClick={() => setReplaceId(replacement === c.id ? "" : c.id)} aria-pressed={replacement === c.id}><Sprite creature={c} /><strong>{c.name}</strong><small>Niv. {savedCardLevel(save, c.id)}</small></button>
          <button onClick={() => onEquip(c.id)}>Retirer −</button>
        </div> : <div className="empty-slot" key={i}><span>+</span><small>EMPLACEMENT {i + 1}</small></div>;
      })}</div>
      <div className="build-stats"><div><small>CLIC TOTAL</small><strong>{power.click.toFixed(2)}</strong></div><div><small>PASSIF / SEC</small><strong>{power.auto.toFixed(2)}</strong></div><div><small>CRITIQUE</small><strong>{(power.crit * 100).toFixed(1)} % · ×{power.critMultiplier.toFixed(2)}</strong></div><div><small>BOOSTER</small><strong>−{(power.discount * 100).toFixed(1)} %</strong></div></div>
      <p><strong>Bonus du deck : </strong>{describeEffect(bonuses) || "Équipez votre premier compagnon."}</p>
      <p className="progression-hint">Statistiques incluant les améliorations permanentes, hors combo. Rare+ : poids +{(power.rareChance * 100).toFixed(1)} % · doublon : +{power.duplicateBonus.toFixed(1)} éclats.</p>
    </section>
    <section className="synergy-panel"><h2>Synergies de type</h2><div className="synergy-grid">{synergies(save.deck).map(s => <div className={s.active ? "synergy active" : "synergy"} key={s.type}><strong>{s.active ? "✦" : "◇"} {s.type} · {s.count}/{s.required}</strong><small>{describeEffect(s.effect)}</small><span>{s.active ? "Active" : `Encore ${s.required - s.count} compagnon(s)`}</span></div>)}</div></section>
    <section className="archetype-grid" aria-label="Styles de build">{BUILD_ARCHETYPES.map(b => <div key={b.name}><h3>Build {b.name}</h3><p>{b.description}</p><small>{b.ids.map(id => byId(id).name).join(" · ")}</small></div>)}</section>
    <div className="section-title"><div><h2>{replacement ? `Remplacer ${byId(replacement).name}` : "Choisir vos compagnons"}</h2><p>Impact calculé avec les niveaux de carte et les synergies.</p></div></div>
    <div className="build-candidates">{CARDS.filter(c => save.owned[c.id]).map(c => {
      const candidate = replacement && !save.deck.includes(c.id) ? { ...save, deck: save.deck.filter(id => id !== replacement) } : save;
      const reason = equipBlockedReason(candidate, c.id);
      const preview = changeDeck(save, c.id, replacement);
      return <div className="build-candidate" key={c.id}><Sprite creature={c} /><div><strong>{c.name} · niv. {savedCardLevel(save, c.id)}</strong><p>{describeEffect(leveledEffect(c.effect, savedCardLevel(save, c.id)))}</p><small>{reason || statImpact(power, stats(preview))}</small></div><button disabled={!!reason} onClick={() => { onEquip(c.id, replacement); setReplaceId(""); }}>{save.deck.includes(c.id) ? "Retirer" : replacement ? "Remplacer" : "Équiper"}</button></div>;
    })}</div>
    {!Object.keys(save.owned).length && <div className="notice">Votre deck est vide. Ouvrez un booster pour rencontrer vos premiers compagnons.</div>}
  </>;
}
