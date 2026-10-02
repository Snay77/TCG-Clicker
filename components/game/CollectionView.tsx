import { useState } from "react";
import { RARITIES } from "../../lib/cards";
import { TYPES } from "../../lib/content/model";
import { CARDS, byId } from "../../lib/cards";
import { deckCapacity, equipBlockedReason, savedCardLevel, Save } from "../../lib/game";
import { cardUpgradeCost } from "../../lib/progression";
import Card from "../Card";
import Sprite from "../Sprite";
export default function CollectionView({ save, onEquip, onUpgrade }: { save: Save; onEquip: (id: string) => void; onUpgrade: (id: string) => void }) {
  const [search,setSearch]=useState(""),[type,setType]=useState(""),[rarity,setRarity]=useState(""),[discovery,setDiscovery]=useState("");
  const filtered=CARDS.filter(c=>(!search || (save.owned[c.id] ? c.name : "À découvrir").toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")))&&(!type||c.type===type)&&(!rarity||c.rarity===Number(rarity))&&(!discovery||(discovery==="owned"?!!save.owned[c.id]:!save.owned[c.id])));
  const roots = CARDS.filter(c => !c.evolvesFrom && c.evolvesTo);
  return <>
    <div className="section-title"><div><h2>Classeur Faerie</h2><p>{Object.keys(save.owned).length} / {CARDS.length} espèces découvertes · 20 lignées et 8 uniques.</p></div></div>
    <details className="collection-lineages"><summary>Voir les 20 lignées d’évolution</summary><section className="lineages" aria-label="Lignées d’évolution">
      {roots.map(root => {
        const lineage = [root];
        while (lineage.at(-1)!.evolvesTo) lineage.push(byId(lineage.at(-1)!.evolvesTo!));
        return <div className="lineage" key={root.id}>{lineage.map((c, i) => <div className="lineage-stage" key={c.id}>
          {i > 0 && <span aria-hidden="true">→</span>}
          <div><Sprite creature={c} silhouette={!save.owned[c.id]} /><strong>{save.owned[c.id] ? c.name : "???"}</strong><small>{c.stage}</small></div>
        </div>)}</div>;
      })}
    </section></details>
    <p className="progression-hint">Les formes restent indépendantes. Découvrez la forme précédente pour équiper une évolution. Améliorer une carte consomme 2, puis 3, 4 et 5 doublons de cette même carte. Une copie reste toujours conservée ; le niveau acquis est permanent.</p>
    <div className="collection-filters">
      <label>Recherche<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label>
      <label>Type<select aria-label="Type" value={type} onChange={e=>setType(e.target.value)}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Rareté<select aria-label="Rareté" value={rarity} onChange={e=>setRarity(e.target.value)}><option value="">Toutes les raretés</option>{RARITIES.map((r,i)=><option key={r} value={i}>{r}</option>)}</select></label>
      <label>Découvertes<select value={discovery} onChange={e=>setDiscovery(e.target.value)}><option value="">Toutes les rencontres</option><option value="owned">Découvertes</option><option value="unknown">À découvrir</option></select></label>
      <button onClick={()=>{setSearch("");setType("");setRarity("");setDiscovery("");}}>Effacer les filtres</button>
    </div><p role="status">{filtered.length} rencontres</p>
    <div className="collection-grid">{filtered.map(c => {
      const copies = save.owned[c.id] || 0;
      const level = savedCardLevel(save, c.id);
      const cost = cardUpgradeCost(level);
      const reason = equipBlockedReason(save, c.id);
      return <Card key={c.id} card={c} owned={copies} level={level}>
        {copies > 0 && <div className="card-progression"><strong>Niveau {level} / 5</strong><small>{cost !== null ? `${copies - 1} / ${cost} doublons disponibles · 1 copie conservée` : "Effet maximal · doublons toujours récompensés"}</small>
          <button className="card-upgrade-button" disabled={cost === null || copies - 1 < cost || !!save.pending.length} aria-label={`Améliorer ${c.name}${cost !== null ? ` au niveau ${level + 1} : consommer ${cost} doublons` : " : niveau maximum"}`} onClick={() => onUpgrade(c.id)}>
            {cost === null ? "Niveau maximum" : `Améliorer au niv. ${level + 1} · consommer ${cost} doublons`}
          </button>
          <button className={save.deck.includes(c.id) ? "equipped" : "equip-button"} disabled={!!reason} title={reason || undefined} onClick={() => onEquip(c.id)}>
            {save.deck.includes(c.id) ? "✓ Équipée · Retirer" : reason || `Équiper · ${save.deck.length}/${deckCapacity(save)}`}
          </button>
        </div>}
      </Card>;
    })}</div>
  </>;
}
