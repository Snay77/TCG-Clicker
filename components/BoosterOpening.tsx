"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { byId, RARITIES } from "../lib/cards";
import { atmosphere, REVEAL_TIMINGS } from "../lib/visuals";
import Card from "./Card";
import Sprite from "./Sprite";
import BoosterPack from "./BoosterPack";
import type { Save } from "../lib/game";

type Stage =
  | "sealed"
  | "tearing"
  | "dealing"
  | "cards"
  | "suspense"
  | "reveal"
  | "summary";
export default function BoosterOpening({
  save,
  onReveal,
  onClose,
}: {
  save: Save;
  onReveal: () => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>(
    save.revealed === 5 ? "summary" : save.revealed > 0 ? "cards" : "sealed",
  );
  const [index, setIndex] = useState(Math.min(save.revealed, 4));
  const [reduced, setReduced] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const revealCommitted = useRef(false);
  const revealCallback = useRef(onReveal);
  revealCallback.current = onReveal;
  const creature = byId(save.pending[index]);
  const tier = creature.rarity;
  useEffect(() => {
    const opener = document.activeElement;
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener("change", update);
    dialog.current?.showModal();
    return () => {
      q.removeEventListener("change", update);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  useEffect(() => {
    dialog.current
      ?.querySelector<HTMLButtonElement>(
        ".opening-action button:not(:disabled)",
      )
      ?.focus({ preventScroll: true });
  }, [stage]);
  function commit() {
    if (revealCommitted.current) return;
    revealCommitted.current = true;
    revealCallback.current();
    setStage("reveal");
  }
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (stage === "tearing")
      t = setTimeout(() => setStage("dealing"), reduced ? 50 : 850);
    if (stage === "dealing")
      t = setTimeout(() => setStage("cards"), reduced ? 50 : 1350);
    if (stage === "suspense")
      t = setTimeout(
        () => {
          if (!revealCommitted.current) {
            revealCommitted.current = true;
            revealCallback.current();
            setStage("reveal");
          }
        },
        reduced ? 60 : REVEAL_TIMINGS[tier],
      );
    return () => clearTimeout(t);
  }, [stage, tier, reduced]);
  function next() {
    if (index === 4) {
      setStage("summary");
      return;
    }
    setIndex((i) => i + 1);
    revealCommitted.current = false;
    setStage("cards");
  }
  const busy =
    stage === "tearing" || stage === "dealing" || stage === "suspense";
  const revealStage = stage === "reveal";
  const title =
    stage === "summary"
      ? "Cinq rencontres. Un nouveau chapitre."
      : stage === "sealed" || stage === "tearing"
        ? "La forêt garde ses secrets."
        : stage === "suspense" && tier >= 2
          ? "Une présence extraordinaire…"
          : revealStage
            ? creature.name
            : "Qui se cache de l’autre côté ?";
  return (
    <dialog
      ref={dialog}
      className={`reveal-dialog opening-stage-${stage} opening-tier-${revealStage || stage === "suspense" ? tier : 0}`}
      onCancel={(e) => e.preventDefault()}
      aria-labelledby="opening-title"
    >
      <div className="opening-orbits" aria-hidden="true" />
      <div className="opening-content">
        <div className="eyebrow">FAERIE · LES MURMURES DE LA FORÊT</div>
        <h2 id="opening-title">{title}</h2>
        <p className="opening-caption" aria-live="polite">
          {stage === "summary"
            ? "Vos cinq cartes sont conservées dans la collection."
            : stage === "sealed"
              ? "Un petit rituel. Cinq nouvelles histoires."
              : stage === "tearing"
                ? "Le sceau se brise…"
                : stage === "dealing"
                  ? "Les cinq cartes traversent le portail."
                  : stage === "suspense"
                    ? tier >= 2
                      ? "L’énergie se concentre. Quelque chose approche…"
                      : "Une créature vient à votre rencontre."
                    : revealStage
                      ? `${RARITIES[tier]} · carte ${index + 1} sur 5`
                      : `Carte ${index + 1} sur 5 · touchez le sceau pour la révéler`}
        </p>
        {(stage === "sealed" || stage === "tearing") && (
          <div
            className={`sealed-booster ${stage === "tearing" ? "tearing" : ""}`}
          >
            <div className="booster-aura" />
            <BoosterPack />
            <div className="seal-dust" aria-hidden="true">
              {atmosphere(77, 20).map((p, i) => (
                <span
                  key={i}
                  style={
                    {
                      "--x": `${p.x}%`,
                      "--delay": `${p.delay}s`,
                    } as CSSProperties
                  }
                >
                  ✧
                </span>
              ))}
            </div>
          </div>
        )}
        {stage === "dealing" && (
          <div className="dealing-hand" aria-label="Cinq cartes apparaissent">
            {save.pending.map((_, i) => (
              <div
                key={i}
                className="card-back"
                style={{ "--slot": i } as CSSProperties}
              >
                <span>✦</span>
                <strong>FAERIE</strong>
                <small>0{i + 1}</small>
              </div>
            ))}
          </div>
        )}
        {["cards", "suspense", "reveal"].includes(stage) && (
          <>
            <div
              className={`reveal-theater ${revealStage ? "is-revealed" : ""}`}
            >
              <div className="reveal-rays" aria-hidden="true" />
              <div className="reveal-orbit" aria-hidden="true" />
              {revealStage ? (
                <div key={index} className={`hero-card reveal-tier-${tier}`}>
                  <Card card={creature} owned={save.owned[creature.id] || 1} />
                </div>
              ) : (
                <div
                  className={`hero-back card-back ${stage === "suspense" ? "charging" : ""}`}
                >
                  <div className="back-filigree" />
                  <span>✦</span>
                  <strong>FAERIE</strong>
                  <small>LES MURMURES DE LA FORÊT</small>
                </div>
              )}
              {revealStage && tier >= 2 && (
                <div className="reveal-confetti" aria-hidden="true">
                  {atmosphere(creature.seed, 8 + tier * 5).map((p, i) => (
                    <span
                      key={i}
                      style={
                        {
                          "--angle": `${i * 137.5}deg`,
                          "--distance": `${110 + p.x * 2}px`,
                          "--delay": `${(i % 5) * 0.07}s`,
                        } as CSSProperties
                      }
                    >
                      {tier >= 4 ? "✧" : "◆"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div
              className="opening-progress"
              aria-label={`${save.revealed} cartes révélées sur 5`}
            >
              {save.pending.map((id, i) => (
                <div
                  key={i}
                  className={`${i === index ? "current" : ""} ${i < save.revealed ? "seen" : ""}`}
                >
                  <span>
                    {i < save.revealed ? (
                      <Sprite creature={byId(id)} animated={false} />
                    ) : (
                      "✦"
                    )}
                  </span>
                  <small>0{i + 1}</small>
                </div>
              ))}
            </div>
          </>
        )}
        {stage === "summary" && (
          <>
            <div className="summary-tally">
              <span>
                5 <small>CARTES OBTENUES</small>
              </span>
              <span>
                {new Set(save.pending).size}
                <small>ESPÈCES RENCONTRÉES</small>
              </span>
              <span>
                {
                  RARITIES[
                    Math.max(...save.pending.map((id) => byId(id).rarity))
                  ]
                }
                <small>PLUS HAUTE RARETÉ</small>
              </span>
            </div>
            <div className="reveal-cards summary-cards">
              {save.pending.map((id, i) => (
                <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <Card card={byId(id)} owned={save.owned[id] || 1} />
                </div>
              ))}
            </div>
          </>
        )}
        <div className="opening-action">
          {stage === "sealed" ? (
            <button
              className="primary"
              autoFocus
              onClick={() => setStage("tearing")}
            >
              Déchirer le sceau ✦
            </button>
          ) : stage === "cards" ? (
            <button
              className="primary"
              onClick={() => {
                revealCommitted.current = false;
                setStage("suspense");
              }}
            >
              Révéler la carte {index + 1} ✦
            </button>
          ) : revealStage ? (
            <button className="primary" onClick={next}>
              {index === 4 ? "Voir le récapitulatif →" : "Carte suivante →"}
            </button>
          ) : stage === "summary" ? (
            <button className="primary" onClick={onClose}>
              Découvrir ma collection →
            </button>
          ) : (
            <>
              <button className="primary" disabled>
                {stage === "suspense"
                  ? "Le portail se concentre…"
                  : "Ouverture en cours…"}
              </button>
              {stage === "suspense" && (
                <button className="skip-animation" onClick={commit}>
                  Passer l’animation
                </button>
              )}
            </>
          )}
        </div>
        <small className="opening-footnote">
          {busy
            ? "Le temps d’une petite merveille."
            : "Chaque créature a sa place dans votre histoire."}
        </small>
      </div>
    </dialog>
  );
}
