import { RARITIES } from "../../lib/cards";
import { describeEffect } from "../../lib/effects";
import { STAGES, describeCondition } from "../../lib/content/roster";
import type { CardDesign } from "../../lib/content/model";
import ContentSprite from "./ContentSprite";
import ContentHabitat from "./ContentHabitat";
export default function ContentCard({ card, animated }: { card: CardDesign; animated: boolean }) {
  return <article className={`content-card content-rarity-${card.rarity}`} data-design-id={card.id}>
    <header><strong>{card.name}</strong><span>{card.type} · {STAGES[card.stage]}</span></header>
    <div className={`content-illustration ${card.rarity===5?"signature-composition":""}`}>
      <ContentHabitat habitat={card.habitat} seed={card.seed} signature={card.rarity>=4}/>
      <ContentSprite card={card} size={240} animated={animated}/>
      {card.rarity===5 && <div className={`signature-aura aura-${card.sprite!.aura} ${animated?"":"content-still"}`} aria-hidden="true"/>}
    </div>
    <div className="content-card-rarity">{RARITIES[card.rarity]} · {"◆".repeat(card.rarity+1)}</div>
    <div className="content-card-effect"><strong>Rôle {card.role} · effet prévu</strong><p>{describeEffect(card.plannedEffects)}</p>
      {card.conditions.map((c,i)=><small key={i}>{describeCondition(c)} · phase ultérieure</small>)}
    </div>
    <p className="content-card-flavor">{card.flavor}</p>
    <footer>{String(card.number).padStart(3,"0")} / 060 <span>Échantillon artistique</span></footer>
  </article>;
}
