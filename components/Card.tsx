"use client";
import type { CSSProperties, PointerEvent } from "react";
import { memo, useEffect, useRef, useState } from 'react';
import { Creature, RARITIES } from "../lib/cards";
import { FINISHES, VISUALS } from "../lib/visuals";
import CardArt from "./CardArt";
import { describeEffect } from "../lib/effects";
import { leveledEffect } from "../lib/progression";
function Card({
  card,
  owned = 1,
  level = 1,
  children,
  animated = true,
}: {
  card: Creature;
  owned?: number;
  level?: number;
  children?: React.ReactNode;
  animated?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  function reflect(e: PointerEvent<HTMLElement>) {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    const s = e.currentTarget.style;
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--rx", `${(y - 0.5) * -7}deg`);
    s.setProperty("--ry", `${(x - 0.5) * 9}deg`);
  }
  function reset(e: PointerEvent<HTMLElement>) {
    for (const key of ["--rx", "--ry", "--mx", "--my"])
      e.currentTarget.style.removeProperty(key);
  }
  const v = VISUALS[card.id];
  return (
    <article
      ref={ref}
      data-offscreen={!visible || undefined}
      className={`card rarity-${card.rarity} ${!owned ? "unknown" : ""} ${animated ? "" : "card-still"}`}
      style={{ "--accent": v.accent } as CSSProperties}
      onPointerMove={reflect}
      onPointerLeave={reset}
      data-finish={FINISHES[card.rarity]}
    >
      <div className="card-engraving" aria-hidden="true">
        ✧
      </div>
      <div className="card-name">
        <strong>{owned ? card.name : "À découvrir"}</strong>
        <span className="type-gem" title={card.type}>
          {["Sylve", "Mycète"].includes(card.type)
            ? "❧"
            : card.type === "Lune"
              ? "☾"
              : "✧"}
        </span>
      </div>
      <div className="card-taxonomy">
        <span>{card.type}</span>
        <small>{owned ? card.stage : "???"}</small>
      </div>
      <CardArt card={card} hidden={!owned} animated={animated} />
      <div className="rarity-label">
        <span>{RARITIES[card.rarity]}</span>
        <span aria-hidden="true">{"◆".repeat(card.rarity + 1)}</span>
      </div>
      <div className="card-ability">
        <span className="ability-sigil" aria-hidden="true">
          ⌁
        </span>
        <div>
          <h3>{owned ? v.title : "Rencontre inconnue"}</h3>
          <p>
            {owned
              ? describeEffect(leveledEffect(card.effect, level))
              : "Cette créature attend de croiser votre chemin."}
          </p>
        </div>
      </div>
      <p className="card-flavor">
        {owned
          ? v.flavor
          : "Les murmures de la forêt gardent encore son secret."}
      </p>
      <footer>
        <span>
          FÆ · {String(card.number || card.id).padStart(3,"0")}
          <b> / 060</b>
        </span>
        <span>
          {owned ? `×${owned}` : "◇"} · {FINISHES[card.rarity]}
        </span>
      </footer>
      <div className="card-foil" aria-hidden="true" />
      <div className="card-holo" aria-hidden="true" />
      <div className="card-reflection" aria-hidden="true" />
      {children}
    </article>
  );
}
export default memo(Card);
