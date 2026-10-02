import { CARDS, byId } from "../../lib/cards";
import { deckCapacity, equipBlockedReason, Save } from "../../lib/game";
import { cardLevel, CARD_LEVEL_THRESHOLDS } from "../../lib/progression";
import Card from "../Card";
import Sprite from "../Sprite";
export default function CollectionView({ save, onEquip }: { save: Save; onEquip: (id: string) => void }) {
  const roots = CARDS.filter(c => !c.evolvesFrom && c.evolvesTo);
  return <>
    <div className="section-title"><div><h2>Classeur Faerie</h2><p>{Object.keys(save.owned).length} / {CARDS.length} espèces disponibles dans le prototype · Set complet : 60 cartes.</p></div></div>
    <section className="lineages" aria-label="Lignées d’évolution">
      {roots.map(root => {
        const lineage = [root];
        while (lineage.at(-1)!.evolvesTo) lineage.push(byId(lineage.at(-1)!.evolvesTo!));
        return <div className="lineage" key={root.id}>{lineage.map((c, i) => <div className="lineage-stage" key={c.id}>
          {i > 0 && <span aria-hidden="true">→</span>}
          <div><Sprite creature={c} silhouette={!save.owned[c.id]} /><strong>{save.owned[c.id] ? c.name : "???"}</strong><small>{c.stage}</small></div>
        </div>)}</div>;
      })}
    </section>
    <p className="progression-hint">Les formes restent indépendantes. Découvrez la forme précédente pour équiper une évolution. Chaque doublon offre des éclats et rapproche du prochain niveau.</p>
    <div className="collection-grid">{CARDS.map(c => {
      const copies = save.owned[c.id] || 0;
      const level = cardLevel(copies);
      const next = CARD_LEVEL_THRESHOLDS[level];
      const reason = equipBlockedReason(save, c.id);
      return <Card key={c.id} card={c} owned={copies}>
        {copies > 0 && <div className="card-progression"><strong>Niveau {level} / 5</strong><small>{next ? `${copies} / ${next} copies pour le niveau suivant` : "Effet maximal · doublons toujours récompensés"}</small>
          <button className={save.deck.includes(c.id) ? "equipped" : "equip-button"} disabled={!!reason} title={reason || undefined} onClick={() => onEquip(c.id)}>
            {save.deck.includes(c.id) ? "✓ Équipée · Retirer" : reason || `Équiper · ${save.deck.length}/${deckCapacity(save)}`}
          </button>
        </div>}
      </Card>;
    })}</div>
  </>;
}
