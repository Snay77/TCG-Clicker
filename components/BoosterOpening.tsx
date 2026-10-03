"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { byId, RARITIES } from "../lib/cards";
import { atmosphere } from "../lib/visuals";
import { GameAudio, raritySound, type SoundKind } from "../lib/game-audio";
import { duplicateFeedback, type UX } from "../lib/ux";
import Card from "./Card";
import BoosterPack from "./BoosterPack";
import type { Save, PackSource } from "../lib/game";
import { savedCardLevel } from "../lib/game";
import { openingDelay } from "../lib/exploration";
import { trapDialogTab } from '../lib/dialog-focus';

type Stage =
  | "choose"
  | "sealed"
  | "tearing"
  | "lifting"
  | "suspense"
  | "view"
  | "leaving"
  | "summary";
type Gesture = {
  id: number;
  kind: "carousel" | "cut" | "card";
  x: number;
  y: number;
  dx: number;
  dy: number;
  width: number;
};
export default function BoosterOpening({
  save,
  onReveal,
  onClose,
  onNext,
  economy,
  fast = false,
  audioSettings,
  onSoundChange,
  onSound,
}: {
  save: Save;
  fast?: boolean;
  audioSettings?: UX;
  onSoundChange?:(sound:boolean)=>void;
  onSound?:(kind:SoundKind,gesture?:boolean)=>void;
  onReveal: () => void;
  onClose: (destination?: "machine" | "collection") => void;
  onNext?: (source: PackSource) => void;
  economy?: {freeBoosters:number;rewardBoosters?:number;capacity:number;price:number;nextSource:PackSource|null};
}) {
  const [stage, setStage] = useState<Stage>(
    save.revealed === 5 ? "summary" : save.revealed > 0 ? "suspense" : "choose",
  );
  const [index, setIndex] = useState(Math.min(save.revealed, 4));
  const [selected, setSelected] = useState(2);
  const [cut, setCut] = useState(0);
  const [cutDirection, setCutDirection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(audioSettings?.sound ?? true);
  const dialog = useRef<HTMLDialogElement>(null),
    gesture = useRef<Gesture | null>(null);
  const credited = useRef(save.revealed - 1);
  const exiting = useRef(false);
  const callbacks = useRef({ onReveal, onClose });
  callbacks.current = { onReveal, onClose };
  const audio = useRef<GameAudio|null>(null);
  const enabled = useRef(audioSettings?.sound ?? true);
  const soundOptions=useRef(audioSettings);soundOptions.current=audioSettings;
  const soundCallback=useRef(onSound);soundCallback.current=onSound;
  useEffect(()=>{enabled.current=audioSettings?.sound??true;setSound(enabled.current);},[audioSettings?.sound]);
  const motion = useRef<HTMLDivElement>(null);
  const [originalOwned] = useState(() => {
    const counts = { ...save.owned };
    for (const id of save.pending.slice(0, save.revealed))
      counts[id] = Math.max(0, (counts[id] || 0) - 1);
    return counts;
  });
  const creature = byId(save.pending[index]);
  const nextCreature = index < 4 ? byId(save.pending[index + 1]) : null;
  const tier = creature.rarity;
  const packFast = fast && !save.pending.some(id => byId(id).rarity === 5);
  const isNew = (id: string, i: number) =>
    !originalOwned[id] && save.pending.indexOf(id) === i;
  function play(kind:SoundKind,rarity=tier) {
    if(!enabled.current)return;
    const soundKind=kind==='rare'?raritySound(rarity):kind;
    if(soundCallback.current) soundCallback.current(soundKind,kind==='cut'||kind==='swipe');
    else {audio.current??=new GameAudio();audio.current.play(soundKind,soundOptions.current||{sound:true,volume:0.35},kind==='cut'||kind==='swipe');}
  }
  function commit() {
    if (credited.current >= index) return;
    credited.current = index;
    callbacks.current.onReveal();
    if (tier >= 2) play("rare");
    setStage("view");
  }
  useEffect(() => {
    const opener = document.activeElement;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(soundOptions.current?.motion==='reduce'||preference.matches);
    update();
    preference.addEventListener("change", update);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      preference.removeEventListener("change", update);
      document.body.style.overflow = previous;
      audio.current?.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  useEffect(()=>{setReduced(audioSettings?.motion==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches);},[audioSettings?.motion]);
  useEffect(() => {
    dialog.current
      ?.querySelector<HTMLElement>("[data-opening-focus]")
      ?.focus({ preventScroll: true });
  }, [stage]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (stage === "tearing")
      timer = setTimeout(() => setStage("lifting"), openingDelay(packFast ? 0 : 5,packFast,"tear",reduced));
    if (stage === "lifting")
      timer = setTimeout(() => setStage("suspense"), reduced ? 50 : packFast ? 200 : 700);
    if (stage === "suspense")
      timer = setTimeout(
        () => {
          if (credited.current < index) {
            credited.current = index;
            callbacks.current.onReveal();
            if(tier>=2)play('rare');
          }
          setStage("view");
        },
        openingDelay(tier,fast,"suspense",reduced),
      );
    if (stage === "leaving")
      timer = setTimeout(
        () => {
          exiting.current = false;
          if (index === 4) setStage("summary");
          else if (fast) {
            setIndex(i => i + 1);
            setStage("suspense");
          } else {
            // The next face is already visible beneath the departing card.
            if (credited.current < index + 1) {
              credited.current = index + 1;
              callbacks.current.onReveal();
              if(nextCreature&&nextCreature.rarity>=2)play('rare',nextCreature.rarity);
            }
            setIndex((i) => i + 1);
            setStage("view");
          }
        },
        openingDelay(tier,fast,"leave",reduced),
      );
    return () => clearTimeout(timer);
  }, [stage, index, tier, reduced, nextCreature, fast, packFast]);
  function toggleSound(){
    const next=!enabled.current;enabled.current=next;setSound(next);onSoundChange?.(next);
    if(next&&!onSound){audio.current??=new GameAudio();audio.current.play('swipe',{sound:true,volume:audioSettings?.volume??0.35},true);}
  }
  function unlockAudio(){ play('swipe'); }
  function tear() {
    if (stage !== "sealed") return;
    gesture.current = null;
    setCut(1);
    setDragging(false);
    play("cut");
    setStage("tearing");
  }
  function advance(dx = 0, dy = -160) {
    if (stage !== "view" || exiting.current) return;
    exiting.current = true;
    play("swipe");
    const node = motion.current;
    if (node) {
      node.style.setProperty(
        "--exit-x",
        `${Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) * 650 : dx * 2}px`,
      );
      node.style.setProperty(
        "--exit-y",
        `${Math.abs(dy) >= Math.abs(dx) ? Math.sign(dy || -1) * 850 : dy * 2 - 80}px`,
      );
      node.style.setProperty("--exit-r", `${Math.sign(dx || 1) * 18}deg`);
    }
    setDragging(false);
    setStage("leaving");
  }
  function down(e: PointerEvent<HTMLDivElement>, kind: Gesture["kind"]) {
    if (
      e.button !== 0 ||
      gesture.current ||
      !(
        (kind === "cut" && stage === "sealed") ||
        (kind === "card" && stage === "view") ||
        (kind === "carousel" && stage === "choose")
      )
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    gesture.current = {
      id: e.pointerId,
      kind,
      x: e.clientX,
      y: e.clientY,
      dx: 0,
      dy: 0,
      width: r.width,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    g.dx = e.clientX - g.x;
    g.dy = e.clientY - g.y;
    if (g.kind === "cut") {
      setCutDirection(g.dx < 0 ? -1 : 1);
      const progress = Math.min(1, Math.abs(g.dx) / (g.width * 0.7));
      setCut(progress);
      if (progress === 1) tear();
    }
    if (g.kind === "card" && motion.current) {
      motion.current.style.setProperty("--drag-x", `${g.dx}px`);
      motion.current.style.setProperty("--drag-y", `${g.dy}px`);
      motion.current.style.setProperty("--drag-r", `${g.dx / 22}deg`);
    }
  }
  function resetDrag() {
    setDragging(false);
    for (const key of ["--drag-x", "--drag-y", "--drag-r"])
      motion.current?.style.removeProperty(key);
  }
  function up(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    const distance = Math.hypot(g.dx, g.dy);
    if (g.kind === "card") {
      if (distance > 42 || distance < 8) advance(g.dx, g.dy || -160);
      else resetDrag();
    } else if (g.kind === "carousel") {
      if (Math.abs(g.dx) > 40) setSelected((s) => (s + (g.dx < 0 ? 1 : 4)) % 5);
      else if (distance < 8) {
        const rect = e.currentTarget.getBoundingClientRect();
        const spacing =
          innerWidth <= 580 ? 127 : innerWidth <= 1000 ? 150 : 180;
        const offset = Math.max(
          -2,
          Math.min(
            2,
            Math.round((e.clientX - rect.left - rect.width / 2) / spacing),
          ),
        );
        if (offset === 0) {
          unlockAudio();
          setStage("sealed");
        } else setSelected((s) => (s + offset + 5) % 5);
      }
      setDragging(false);
    } else {
      setCut(0);
      setDragging(false);
    }
  }
  function cancel() {
    gesture.current = null;
    setCut(0);
    resetDrag();
  }
  const duplicate=duplicateFeedback((originalOwned[creature.id]||0)+save.pending.slice(0,index).filter(id=>id===creature.id).length,savedCardLevel(save,creature.id)||1);
  const showing = ["lifting", "suspense", "view", "leaving"].includes(stage);
  const label =
    stage === "choose"
      ? "Choisissez votre booster"
      : stage === "sealed"
        ? "Faites glisser pour ouvrir"
        : stage === "tearing"
          ? "Le sachet s’ouvre…"
          : stage === "summary"
            ? "Vos nouvelles cartes"
            : showing
              ? `${index + 1} / 5`
              : "Ouverture";
  return (
    <dialog
      ref={dialog}
      onKeyDown={trapDialogTab}
      className={`pocket-opening ${reduced?'ux-reduced':''} po-${stage} po-tier-${tier} ${dragging ? "po-dragging" : ""}`}
      onCancel={(e) => {e.preventDefault();if(stage==='summary')callbacks.current.onClose('machine');}}
      aria-labelledby="opening-title"
    >
      <div className="po-atmosphere" aria-hidden="true">
        {atmosphere(42, 20).map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <header className="po-header">
        <span className="po-brand">
          ✧ FAERIE <small>{economy ? `${save.pendingSource === "free" ? "BOOSTER GRATUIT" : "BOOSTER ACHETÉ"} · ${economy.freeBoosters} / ${economy.capacity} disponibles${economy.rewardBoosters ? ` · +${economy.rewardBoosters} récompenses` : ""}` : "LES MURMURES DE LA FORÊT"}{fast ? " · MODE RAPIDE" : ""}</small>
        </span>
        <button
          className="po-sound"
          onClick={toggleSound}
          aria-label={sound ? "Couper le son" : "Activer le son"}
          aria-pressed={sound}
        >
          {sound ? "♪ Son activé" : "♪ Son désactivé"}
        </button>
      </header>
      <div className="po-layout">
        <h2 id="opening-title" className="po-title">
          {label}
        </h2>
        {stage === "choose" && (
          <>
            <div
              className="po-carousel"
              onPointerDown={(e) => down(e, "carousel")}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={cancel}
              aria-label="Choix du sachet"
            >
              {[0, 1, 2, 3, 4].map((i) => {
                const offset = ((i - selected + 7) % 5) - 2;
                return (
                  <div
                    className={`po-carousel-pack ${offset === 0 ? "selected" : ""}`}
                    key={i}
                    style={{ "--offset": offset } as CSSProperties}
                  >
                    <BoosterPack />
                  </div>
                );
              })}
            </div>
            <div className="po-select-controls">
              <button
                aria-label="Sachet précédent"
                onClick={() => setSelected((s) => (s + 4) % 5)}
              >
                ‹
              </button>
              <span>{selected + 1} / 5</span>
              <button
                aria-label="Sachet suivant"
                onClick={() => setSelected((s) => (s + 1) % 5)}
              >
                ›
              </button>
            </div>
            <div className="po-controls">
              <button
                className="po-primary"
                data-opening-focus
                onClick={() => {
                  unlockAudio();
                  setStage("sealed");
                }}
              >
                Choisir ce booster
              </button>
              <p>Faites défiler les sachets, puis choisissez le vôtre.</p>
            </div>
          </>
        )}
        {(stage === "sealed" || stage === "tearing") && (
          <>
            <div className="po-pack-stage">
              <div className="po-pack-shadow" />
              <div
                className="po-cut-pack"
                style={
                  {
                    "--cut": `${cut * 100}%`,
                    "--cut-origin": cutDirection < 0 ? "right" : "left",
                    "--cut-direction": cutDirection,
                    "--cut-head": `${(cutDirection < 0 ? 1 - cut : cut) * 100}%`,
                  } as CSSProperties
                }
              >
                <BoosterPack />
                <div className="po-cut-strip" aria-hidden="true" />
                <div
                  className="po-cut-track"
                  role="button"
                  tabIndex={0}
                  data-opening-focus={stage === "sealed" ? "" : undefined}
                  aria-label="Déchirer le haut du booster"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      tear();
                    }
                  }}
                  onPointerDown={(e) => down(e, "cut")}
                  onPointerMove={move}
                  onPointerUp={up}
                  onPointerCancel={cancel}
                >
                  <span className="po-cut-line" />
                  <span className="po-cut-spark" />
                  <span className="po-cut-guide">↔</span>
                </div>
              </div>
              <div className="po-opening-light" />
            </div>
            <div className="po-controls">
              <p>
                Glissez sur le haut du sachet <span>← →</span>
              </p>
              <button
                className="po-text-button"
                disabled={stage === "tearing"}
                onClick={tear}
              >
                Ouvrir sans glisser
              </button>
            </div>
          </>
        )}
        {showing && (
          <>
            <div
              className={`po-stack-stage ${stage === "view" ? "po-revealed" : ""}`}
            >
              <div className="po-reveal-aura" aria-hidden="true" />
              <div className="po-stack">
                {save.pending.slice(index + 2).map((_, i) => (
                  <div
                    className="po-stack-sheet"
                    key={i}
                    style={{ "--depth": i + 2, zIndex: 5 - i } as CSSProperties}
                    aria-hidden="true"
                  >
                    <span>✧</span>
                  </div>
                ))}
                {nextCreature && (stage === "view" || stage === "leaving") && (
                  <div
                    className="po-front po-next-face"
                    aria-hidden="true"
                    inert
                  >
                    <Card
                      card={nextCreature}
                      owned={(save.owned[nextCreature.id] || 0) + 1}
                      level={savedCardLevel(save, nextCreature.id) || 1}
                      animated={false}
                    />
                    {isNew(nextCreature.id, index + 1) && (
                      <span className="po-new">NOUVEAU</span>
                    )}
                  </div>
                )}
                <div
                  ref={motion}
                  className="po-stack-motion"
                  key={index}
                  style={{ zIndex: 10 }}
                >
                  <div
                    className={`po-front ${stage === "view" || stage === "leaving" ? "po-front-visible" : ""}`}
                    role={stage === "view" ? "button" : undefined}
                    tabIndex={stage === "view" ? 0 : -1}
                    data-opening-focus={stage === "view" ? "" : undefined}
                    aria-label={
                      stage === "view"
                        ? `Carte ${index + 1} : ${creature.name}. ${index === 4 ? "Afficher le récapitulatif" : "Passer à la carte suivante"}`
                        : "Une carte apparaît"
                    }
                    onKeyDown={(e) => {
                      if (
                        ["Enter", " ", "ArrowRight", "ArrowUp"].includes(e.key)
                      ) {
                        e.preventDefault();
                        advance();
                      }
                    }}
                    onPointerDown={(e) => down(e, "card")}
                    onPointerMove={move}
                    onPointerUp={up}
                    onPointerCancel={cancel}
                  >
                    {stage === "view" || stage === "leaving" ? (
                      <>
                        <Card
                          card={creature}
                          owned={save.owned[creature.id] || 1}
                          level={savedCardLevel(save, creature.id) || 1}
                        />
                        {isNew(creature.id, index) && (
                          <span className="po-new">NOUVEAU</span>
                        )}
                      </>
                    ) : (
                      <div className="po-card-back">
                        <span>✧</span>
                        <strong>FAERIE</strong>
                        <small>LES MURMURES DE LA FORÊT</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {stage === "view" && tier >= 2 && (
                <div className="po-stardust" aria-hidden="true">
                  {atmosphere(creature.seed, 10 + tier * 4).map((p, i) => (
                    <span
                      key={i}
                      style={
                        {
                          "--angle": `${i * 137.5}deg`,
                          "--distance": `${110 + p.x * 2}px`,
                          "--delay": `${(i % 4) * 0.07}s`,
                        } as CSSProperties
                      }
                    >
                      ✧
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="po-card-caption" aria-live="polite">
              {stage === "view" ? (
                <>
                  <strong>{creature.name}</strong>
                  <span>
                    {RARITIES[tier]} · {"◆".repeat(tier + 1)}
                  </span>
                  <span>Niv. {savedCardLevel(save, creature.id)} · {isNew(creature.id,index)?'Première copie':`Doublon · Copies : ${duplicate.before} → ${duplicate.after} · énergie bonus créditée`}</span>
                  {duplicate.newlyUpgradeable&&<strong className="duplicate-ready">Amélioration disponible !</strong>}
                </>
              ) : (
                <span>
                  {tier >= 2 ? "Une lumière inhabituelle…" : "Ouverture…"}
                </span>
              )}
            </div>
            <div className="po-controls">
              {stage === "view" ? (
                <>
                  <div className="po-swipe-hint">↑</div>
                  <p>Balayez la carte ou touchez-la pour continuer.</p>
                  <button className="po-text-button" onClick={() => advance()}>
                    {index === 4 ? "Voir les cinq cartes" : "Carte suivante"}
                  </button>
                </>
              ) : stage === "suspense" ? (
                <button className="po-text-button" onClick={commit}>
                  Passer l’animation
                </button>
              ) : (
                <p>✧</p>
              )}
            </div>
          </>
        )}
        {stage === "summary" && (
          <>
            <p className="po-summary-caption">
              5 cartes ajoutées à votre collection
            </p>
            <div className="po-summary-grid">
              {save.pending.map((id, i) => (
                <div
                  className="po-summary-item"
                  key={i}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <Card card={byId(id)} owned={save.owned[id] || 1} level={savedCardLevel(save, id)} />
                  {isNew(id, i) && <span className="po-new">NOUVEAU</span>}
                </div>
              ))}
            </div>
            <div className="po-controls">
              {economy ? <>
                <p>{economy.freeBoosters} / {economy.capacity} boosters gratuits disponibles</p>
                {!!economy.rewardBoosters && <p>+{economy.rewardBoosters} booster(s) de récompense · hors stockage</p>}
                {economy.nextSource && onNext && <button className="po-primary" data-opening-focus onClick={()=>onNext(economy.nextSource!)}>{economy.nextSource==="free"?"Ouvrir le booster suivant":`Acheter et ouvrir un autre · ${economy.price.toLocaleString("fr-FR")} ✦`}</button>}
                <div className="po-summary-actions"><button className="po-secondary" data-opening-focus={!economy.nextSource?"":undefined} onClick={()=>callbacks.current.onClose("machine")}>Retour à la machine</button><button className="po-secondary" onClick={()=>callbacks.current.onClose("collection")}>Voir ma collection</button></div>
              </> : <button className="po-primary" data-opening-focus onClick={()=>callbacks.current.onClose()}>Continuer</button>}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
