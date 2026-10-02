"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CARDS, RARITIES, byId } from "../lib/cards";
import {
  buyPack,
  drawPack,
  changeDeck,
  deckCapacity,
  equipBlockedReason,
  buyUpgrade,
  rarityProbabilities,
  initialSave,
  parseSave,
  price,
  reveal,
  Save,
  stats,
} from "../lib/game";
import Sprite from "./Sprite";
import Machine from "./Machine";
import BoosterPack from "./BoosterPack";
import BoosterOpening from "./BoosterOpening";
import CollectionView from "./game/CollectionView";
import DeckView, { statImpact } from "./game/DeckView";
import UpgradesView from "./game/UpgradesView";
import ComboBar from "./game/ComboBar";
import { advanceCombo, decayCombo, comboFactor, initialCombo, machineTier, leveledEffect, cardLevel } from "../lib/progression";
import { describeEffect } from "../lib/effects";
const KEY = "tcg-faerie-v1";
const fmt = (n: number) => Math.floor(n).toLocaleString("fr-FR");
export default function Game() {
  const [save, setSave] = useState<Save>(initialSave);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("machine");
  const [notice, setNotice] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const [combo, setCombo] = useState(initialCombo);
  const comboRef = useRef(initialCombo());
  const storageBlocked = useRef(false);
  const [sparks, setSparks] = useState<
    { id: number; x: number; y: number; gain: number; crit: boolean }[]
  >([]);
  const serial = useRef(0);
  const latest = useRef(save);
  const buyButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const migrated = parseSave(raw);
        setSave(migrated);
        if (JSON.parse(raw).version === 1) {
          localStorage.setItem(`${KEY}-backup`, raw);
          setNotice("Sauvegarde migrée en v2. Votre progression et le booster en cours sont conservés ; une copie v1 est gardée.");
        }
      }
    } catch {
      storageBlocked.current = true;
      setStorageOk(false);
      setNotice(
        "La sauvegarde est illisible ou inaccessible. Elle est conservée sans écrasement ; cette session ne sera pas sauvegardée.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    latest.current = save;
  }, [save]);
  useEffect(() => {
    if (!ready) return;
    const persist = () => {
      if (storageBlocked.current) return;
      try {
        localStorage.setItem(KEY, JSON.stringify(latest.current));
      } catch {
        setStorageOk(false);
      }
    };
    const t = setTimeout(persist, 180);
    window.addEventListener("pagehide", persist);
    return () => {
      clearTimeout(t);
      persist();
      window.removeEventListener("pagehide", persist);
    };
  }, [save, ready]);
  useEffect(() => {
    if (!ready) return;
    let last = performance.now();
    const t = setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min((now - last) / 1000, 5);
      last = now;
      const nextCombo = decayCombo(comboRef.current, now);
      comboRef.current = nextCombo;
      setCombo(previous => previous.charge === nextCombo.charge ? previous : nextCombo);
      setSave((s) => {
        const passive = stats(s).auto;
        return passive ? { ...s, energy: s.energy + passive * elapsed } : s;
      });
    }, 200);
    return () => clearInterval(t);
  }, [ready]);
  useEffect(() => {
    const t = setInterval(
      () => setSparks((s) => s.filter((x) => Date.now() - x.id < 950)),
      300,
    );
    return () => clearInterval(t);
  }, []);
  const opening = save.pending.length > 0;
  const power = stats(save);
  const discovered = Object.keys(save.owned).length;
  function click(e: React.MouseEvent<HTMLButtonElement>) {
    const current = latest.current;
    const currentPower = stats(current);
    const nextCombo = advanceCombo(comboRef.current, performance.now());
    comboRef.current = nextCombo;
    setCombo(nextCombo);
    const critical = Math.random() < currentPower.crit;
    const gain = currentPower.click * comboFactor(nextCombo.charge, currentPower.comboBonus) * (critical ? currentPower.critMultiplier : 1);
    const box = e.currentTarget.getBoundingClientRect();
    setSave((s) => ({ ...s, energy: s.energy + gain, clicks: s.clicks + 1 }));
    setSparks((s) => [
      ...s.slice(-18),
      {
        id: Date.now() + serial.current++ / 1000,
        x: e.detail ? e.clientX - box.left : box.width / 2,
        y: e.detail ? e.clientY - box.top : box.height / 2,
        gain,
        crit: critical,
      },
    ]);
  }
  function toggle(id: string, replaceId?: string) {
    const candidate = replaceId && !save.deck.includes(id) ? { ...save, deck: save.deck.filter(x => x !== replaceId) } : save;
    const reason = equipBlockedReason(candidate, id);
    if (reason) {
      setNotice(reason);
      return;
    }
    const next = changeDeck(save, id, replaceId);
    setNotice(`${byId(id).name} · ${statImpact(stats(save), stats(next))}`);
    setSave((s) => changeDeck(s, id, replaceId));
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">✦</span>
          <span>
            TCG<span className="brand-bottom">CLICKER</span>
          </span>
        </Link>
        <div className="world-tag">
          <i /> MONDE 01 <span>FAERIE</span>
        </div>
        <nav aria-label="Navigation principale">
          {[
            ["machine", "◈", "La machine"],
            ["collection", "▦", "Collection"],
            ["deck", "▤", "Mon deck"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <span>{icon}</span>
              {label}
              {id === "collection" && <small>{discovered}/9</small>}
              {id === "deck" && <small>{save.deck.length}/{deckCapacity(save)}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-world">
            <span>✧</span>
            <strong>La forêt s’éveille.</strong>
            <p>
              Chaque rencontre ouvre
              <br />
              un nouveau possible.
            </p>
          </div>
          <Link href="/dev">⌘ Atelier des sprites ↗</Link>
          <small>PROGRESSION · v0.3</small>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <span>
            La Clairière{" "}
            <span className="muted">
              /{" "}
              {tab === "machine"
                ? "Portail interdimensionnel"
                : tab === "deck"
                  ? "Compagnons actifs"
                  : "Classeur de créatures"}
            </span>
          </span>
          <span className="save-status">
            <i />{" "}
            {!ready
              ? "Chargement…"
              : storageOk
                ? "Sauvegarde locale"
                : "Sauvegarde indisponible"}
          </span>
        </header>
        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">EXPÉDITION 001 · LE MONDE FÉERIQUE</div>
              <h1>
                {tab === "machine"
                  ? "Un passage vers l’inconnu."
                  : tab === "deck"
                    ? "De petites créatures. De grands pouvoirs."
                    : "Votre petit monde prend vie."}
              </h1>
              <p>
                {tab === "machine"
                  ? "Éveillez le portail. Récoltez l’énergie. Rencontrez l’extraordinaire."
                  : "Collectionnez, composez votre deck et faites grandir la clairière."}
              </p>
            </div>
            <span className="set-badge">
              ✧
              <span>
                SET 01<strong>FAERIE</strong>
              </span>
            </span>
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                onClick={() => setNotice("")}
                aria-label="Fermer le message"
              >
                ×
              </button>
            </div>
          )}
          <section className="stats-row" aria-label="Ressources">
            <div className="energy-stat">
              <span className="stat-icon">✦</span>
              <div>
                <small>ÉNERGIE FÉERIQUE</small>
                <strong data-testid="energy">
                  {fmt(save.energy)} <em>éclats</em>
                </strong>
              </div>
            </div>
            <div>
              <small>PUISSANCE DU CLIC</small>
              <strong>
                +{Number(power.click.toFixed(2))} <em>/ clic</em>
              </strong>
            </div>
            <div>
              <small>PRODUCTION PASSIVE</small>
              <strong>
                {power.auto.toFixed(1)} <em>/ sec</em>
              </strong>
            </div>
            <div>
              <small>COLLECTION</small>
              <strong>
                {discovered}
                <em> / {CARDS.length} découvertes</em>
              </strong>
            </div>
          </section>
          {tab === "machine" ? (
            <>
              <div className="play-grid">
                <section className="machine-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        GÉNÉRATEUR INTERDIMENSIONNEL
                      </span>
                      <h2>Le Cœur de la clairière</h2>
                    </div>
                    <span className="level">NIV. {save.level + 1} · {machineTier(save.level).name}</span>
                  </div>
                  <div className="forest">
                    <div className="forest-trees" />
                    <div className="orbital orbit-one" />
                    <div className="orbital orbit-two" />
                    <button
                      className="machine-button"
                      onClick={click}
                      disabled={!ready}
                      aria-label="Générer de l’énergie"
                    >
                      <Machine level={save.level} />
                      {sparks.slice(-1).map((p) => (
                        <span
                          key={p.id}
                          className={`machine-impact ${p.crit ? "impact-critical" : ""}`}
                          aria-hidden="true"
                        >
                          <span className="impact-ring" />
                          <span className="impact-ring second" />
                          <span className="impact-light" />
                          {Array.from({ length: p.crit ? 20 : 10 }, (_, i) => (
                            <span
                              className="impact-mote"
                              key={i}
                              style={
                                {
                                  "--angle": `${i * 137.5}deg`,
                                  "--distance": `${65 + (i % 5) * 18}px`,
                                } as React.CSSProperties
                              }
                            />
                          ))}
                        </span>
                      ))}
                      {sparks.map((p) => (
                        <span
                          className={`click-spark ${p.crit ? "critical" : ""}`}
                          key={p.id}
                          style={{ left: p.x, top: p.y }}
                        >
                          +{Number(p.gain.toFixed(1))} ✦{p.crit && <small>CRITIQUE !</small>}
                        </span>
                      ))}
                    </button>
                    <div className="machine-prompt">
                      <span className="live-dot" /> LE PORTAIL VOUS ATTEND
                      <strong>
                        Cliquez pour générer <b>+{Number((power.click * comboFactor(combo.charge, power.comboBonus)).toFixed(1))} ✦</b>
                      </strong>
                      <small>
                        {Math.round(power.crit * 100)} % de chance de critique ·
                        énergie ×{Number(power.critMultiplier.toFixed(2))}
                      </small>
                    </div>
                  </div>
                  <ComboBar combo={combo} bonus={power.comboBonus} />
                </section>
                <section className="shop-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">UNE NOUVELLE RENCONTRE</span>
                      <h2>Booster Faerie</h2>
                    </div>
                    <span>✧</span>
                  </div>
                  <div className="pack-stage">
                    <BoosterPack />
                  </div>
                  <p className="shop-description">
                    Cinq créatures. Une infinité de possibles.
                    <br />
                    <strong>Une peu commune ou mieux garantie.</strong>
                  </p>
                  <button
                    ref={buyButton}
                    className="primary buy-button"
                    disabled={!ready || save.energy < price(save) || opening}
                    onClick={() => {
                      const cards = drawPack(Math.random, stats(latest.current).rareChance);
                      setSave((s) => buyPack(s, cards));
                    }}
                  >
                    Ouvrir un booster <span>{price(save)} ✦</span>
                  </button>
                  <div className="progress-track">
                    <i
                      style={{
                        width: `${Math.min(100, (save.energy / price(save)) * 100)}%`,
                      }}
                    />
                  </div>
                  <small className="shop-hint">
                    {save.energy < price(save)
                      ? `Encore ${Math.ceil(price(save) - save.energy)} éclats pour votre prochaine découverte`
                      : "Votre prochaine rencontre est à portée de main."}
                  </small>
                  <details>
                    <summary>Probabilités des raretés</summary>
                    <p>
                      {[false, true].map(guaranteed => (
                        <span className="probability-line" key={String(guaranteed)}>
                          {guaranteed ? "Carte 5" : "Cartes 1–4"} : {rarityProbabilities(power.rareChance, guaranteed)
                            .map((p, i) => `${RARITIES[i]} ${(p * 100).toFixed(2)} %`).join(" · ")}
                        </span>
                      ))}
                      Doublons : +{power.duplicateBonus.toFixed(1)} éclats et progression de niveau.
                    </p>
                  </details>
                </section>
              </div>
              <UpgradesView save={save} ready={ready} onBuy={id => setSave(s => buyUpgrade(s, id))} />
              <section className="deck-panel">
                <div className="section-title">
                  <div>
                    <h2>
                      Vos compagnons de voyage <span>{save.deck.length}/{deckCapacity(save)}</span>
                    </h2>
                    <p>Leurs pouvoirs alimentent votre machine.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setTab("deck")}
                  >
                    Composer mon deck <span>→</span>
                  </button>
                </div>
                <div className="deck-slots">
                  {Array.from({ length: deckCapacity(save) }, (_, i) => {
                    const c = save.deck[i] ? byId(save.deck[i]) : null;
                    return c ? (
                      <button
                        key={i}
                        className="equipped-slot"
                        onClick={() => toggle(c.id)}
                        title={`Déséquiper ${c.name}`}
                      >
                        <Sprite creature={c} />
                        <strong>{c.name}</strong>
                        <small>Niv. {cardLevel(save.owned[c.id])} · {describeEffect(leveledEffect(c.effect, save.owned[c.id]))}</small>
                        <span>Retirer −</span>
                      </button>
                    ) : (
                      <div className="empty-slot" key={i}>
                        <span>+</span>
                        <small>EMPLACEMENT {i + 1}</small>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : tab === "deck" ? (
            <DeckView save={save} onEquip={toggle} />
          ) : (
            <CollectionView save={save} onEquip={toggle} />
          )}
          <Link className="mobile-dev-link" href="/dev">
            ⌘ Atelier des sprites ↗
          </Link>
          <footer className="page-footer">
            <span>✧ Une petite machine pour de grandes découvertes.</span>
            <span>
              {fmt(save.clicks)} clics · {save.packs} boosters ouverts
            </span>
          </footer>
        </div>
      </main>
      {opening && (
        <BoosterOpening
          key={save.packs}
          save={save}
          onReveal={() => setSave(reveal)}
          onClose={() => {
            setSave((s) => ({ ...s, pending: [], revealed: 0 }));
            setTab("collection");
          }}
        />
      )}
    </div>
  );
}
