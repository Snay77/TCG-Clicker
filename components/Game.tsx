"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CARDS, byId } from "../lib/cards";
import {
  buyPack,
  drawPack,
  equip,
  initialSave,
  parseSave,
  price,
  reveal,
  Save,
  stats,
  upgradePrice,
} from "../lib/game";
import Card from "./Card";
import Sprite from "./Sprite";
import Machine from "./Machine";
import BoosterPack from "./BoosterPack";
import BoosterOpening from "./BoosterOpening";
const KEY = "tcg-faerie-v1";
const fmt = (n: number) => Math.floor(n).toLocaleString("fr-FR");
export default function Game() {
  const [save, setSave] = useState<Save>(initialSave);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("machine");
  const [notice, setNotice] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const [sparks, setSparks] = useState<
    { id: number; x: number; y: number; gain: number; crit: boolean }[]
  >([]);
  const serial = useRef(0);
  const latest = useRef(save);
  const buyButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSave(parseSave(raw));
    } catch {
      setNotice(
        "La sauvegarde est illisible ou inaccessible. Une nouvelle session commence.",
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
      setSave((s) =>
        stats(s).auto
          ? { ...s, energy: s.energy + stats(s).auto * elapsed }
          : s,
      );
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
  const total = Object.values(save.owned).reduce((a, b) => a + b, 0);
  function click(e: React.MouseEvent<HTMLButtonElement>) {
    const critical = Math.random() < power.crit;
    const gain = power.click * (critical ? 3 : 1);
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
  function toggle(id: string) {
    if (!save.deck.includes(id) && save.deck.length === 6) {
      setNotice(
        "Votre deck est plein. Retirez une carte pour libérer un emplacement.",
      );
      return;
    }
    setSave((s) => equip(s, id));
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
              {id === "deck" && <small>{save.deck.length}/6</small>}
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
          <small>VISUAL POLISH · v0.2</small>
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
                +{power.click} <em>/ clic</em>
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
                    <span className="level">NIV. {save.level + 1}</span>
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
                          +{p.gain} ✦{p.crit && <small>CRITIQUE !</small>}
                        </span>
                      ))}
                    </button>
                    <div className="machine-prompt">
                      <span className="live-dot" /> LE PORTAIL VOUS ATTEND
                      <strong>
                        Cliquez pour générer <b>+{power.click} ✦</b>
                      </strong>
                      <small>
                        {Math.round(power.crit * 100)} % de chance de critique ·
                        énergie ×3
                      </small>
                    </div>
                  </div>
                  <div className="upgrade-bar">
                    <div>
                      <span>⌁</span>
                      <div>
                        <strong>Amplificateur sylvestre</strong>
                        <small>
                          +2 énergies par clic · amélioration permanente
                        </small>
                      </div>
                    </div>
                    <button
                      disabled={
                        !ready ||
                        save.energy < upgradePrice(save) ||
                        save.level >= 100
                      }
                      onClick={() =>
                        setSave((s) =>
                          s.energy >= upgradePrice(s) && s.level < 100
                            ? {
                                ...s,
                                energy: s.energy - upgradePrice(s),
                                level: s.level + 1,
                              }
                            : s,
                        )
                      }
                    >
                      {save.level >= 100
                        ? "MAX"
                        : `${fmt(upgradePrice(save))} ✦`}{" "}
                      <span>↗</span>
                    </button>
                  </div>
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
                      const cards = drawPack();
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
                      Cartes 1–4 : commune 50 %, peu commune 27 %, rare 14 %,
                      épique 6 %, légendaire 2,5 %, mythique 0,5 %. Carte 5 :
                      mêmes poids sans commune, soit 54 / 28 / 12 / 5 / 1 %.
                      Doublons possibles.
                    </p>
                  </details>
                </section>
              </div>
              <section className="deck-panel">
                <div className="section-title">
                  <div>
                    <h2>
                      Vos compagnons de voyage <span>{save.deck.length}/6</span>
                    </h2>
                    <p>Leurs pouvoirs alimentent votre machine.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setTab("collection")}
                  >
                    Composer mon deck <span>→</span>
                  </button>
                </div>
                <div className="deck-slots">
                  {Array.from({ length: 6 }, (_, i) => {
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
                        <small>{c.description}</small>
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
          ) : (
            <>
              <div className="section-title">
                <div>
                  <h2>
                    {tab === "deck"
                      ? "Deck actif · 6 emplacements"
                      : "Classeur Faerie"}{" "}
                    <span>{total} cartes obtenues</span>
                  </h2>
                  <p>
                    {tab === "deck"
                      ? "Une carte par espèce. Les effets se cumulent entre compagnons."
                      : "Les doublons sont conservés ; leur amélioration viendra après le prototype."}
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setTab("machine")}
                >
                  Retour au portail →
                </button>
              </div>
              {tab === "deck" && !save.deck.length && (
                <div className="notice">
                  Votre deck est vide. Équipez vos découvertes depuis la
                  collection.
                  <button onClick={() => setTab("collection")}>
                    Voir la collection →
                  </button>
                </div>
              )}
              <div className="collection-grid">
                {CARDS.filter(
                  (c) => tab !== "deck" || save.deck.includes(c.id),
                ).map((c) => (
                  <Card key={c.id} card={c} owned={save.owned[c.id] || 0}>
                    {!!save.owned[c.id] && (
                      <button
                        className={
                          save.deck.includes(c.id) ? "equipped" : "equip-button"
                        }
                        onClick={() => toggle(c.id)}
                        disabled={
                          !save.deck.includes(c.id) && save.deck.length === 6
                        }
                      >
                        {save.deck.includes(c.id)
                          ? "✓ Équipée · Retirer"
                          : save.deck.length === 6
                            ? "Deck complet"
                            : "Équiper + "}
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </>
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
