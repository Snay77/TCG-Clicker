"use client";
import Link from "next/link";
import { useState } from "react";
import { CARDS, RARITIES } from "../../lib/cards";
import {
  PART_NAMES,
  usedSpritePalette,
  SPRITE_SIZE,
  type Part,
} from "../../lib/sprites";
import { usedContentPalette } from "../../lib/content/directed-sprites";
import { FINISHES } from "../../lib/visuals";
import { initialSave, reveal, type Save } from "../../lib/game";
import Sprite from "../Sprite";
import Card from "../Card";
import BoosterOpening from "../BoosterOpening";
import RosterWorkbench from "../content/RosterWorkbench";
import PlaytestReset from "../content/PlaytestReset";
import StyleValidation from "../content/StyleValidation";
export default function DevWorkbench() {
  const [seed, setSeed] = useState(0),
    [scale, setScale] = useState(3);
  const [background, setBackground] = useState("forest");
  const [animated, setAnimated] = useState(true);
  const [palette, setPalette] = useState(true);
  const [part, setPart] = useState<Part | "">("");
  const [tab, setTab] = useState("sprites");
  const [preview, setPreview] = useState<Save | null>(null);
  return (
    <main className="dev-page">
      <Link href="/">← Retour à la clairière</Link>
      <PlaytestReset/>
      <div className="dev-intro">
        <div>
          <div className="eyebrow">ATELIER VISUEL · FAERIE</div>
          <h1>Les rencontres prennent forme.</h1>
          <p>
            Silhouettes originales sur une grille de {SPRITE_SIZE} × {SPRITE_SIZE}
            pixels. Comparez leur présence, leur volume et leur lisibilité avant
            de peupler la forêt.
          </p>
        </div>
      </div>
      <div className="dev-tabs" aria-label="Vue de l’atelier">
        <button
          className={tab === "sprites" ? "active" : ""}
          onClick={() => setTab("sprites")}
        >
          Créatures
        </button>
        <button
          className={tab === "cards" ? "active" : ""}
          onClick={() => setTab("cards")}
        >
          Cartes & finitions
        </button>
        <button
          className={tab === "roster" ? "active" : ""}
          onClick={() => setTab("roster")}
        >
          Set 01 — Full Roster
        </button>
        <button
          className={tab === "style" ? "active" : ""}
          onClick={() => setTab("style")}
        >
          Set 01 — Style Validation
        </button>
        <button
          onClick={() =>
            setPreview({
              ...initialSave(),
              pending: ["001", "005", "007", "008", "009"],
            })
          }
        >
          Tester l’ouverture ✦
        </button>
      </div>
      <div className="dev-controls">
        <label>
          <input
            type="checkbox"
            checked={animated}
            onChange={(e) => setAnimated(e.target.checked)}
          />
          Animations idle
        </label>
        <label>
          <input
            type="checkbox"
            checked={palette}
            onChange={(e) => setPalette(e.target.checked)}
          />
          Palettes
        </label>
        {tab === "sprites" && (
          <>
            <label>
              Fond{" "}
              <select
                aria-label="Fond"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              >
                <option value="forest">Sous-bois</option>
                <option value="night">Nuit</option>
                <option value="cream">Parchemin clair</option>
                <option value="checker">Quadrillage</option>
              </select>
            </label>
            <label>
              Zoom{" "}
              <select
                aria-label="Zoom"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              >
                <option value="2">×2 · 128 px</option>
                <option value="3">×3 · 192 px</option>
                <option value="4">×4 · 256 px</option>
              </select>
            </label>
            <label>
              Seed +{" "}
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 0)}
              />
            </label>
            <label>
              Parties{" "}
              <select
                aria-label="Parties"
                value={part}
                onChange={(e) => setPart(e.target.value as Part | "")}
              >
                <option value="">Assemblage complet</option>
                {Object.entries(PART_NAMES).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={() => {
                setSeed(0);
                setPart("");
                setScale(3);
              }}
            >
              Réinitialiser la vue
            </button>
          </>
        )}
      </div>
      <p className="dev-preview-note">
        {tab === "roster" || tab === "style" ? "Design complet et échantillon visuel indépendants du jeu. Les 48 autres sprites attendent la validation artistique."
          : tab === "sprites"
          ? "Comparaison simultanée : 48, 80 et 112 px sur trois fonds. Le seed modifie les marques, jamais l’identité de la créature."
          : "Survolez les cartes pour déplacer le reflet. Les finitions sont visuelles : aucune nouvelle variante ni aucun bonus de gameplay."}{" "}
        Le test d’ouverture utilise des cartes de démonstration et ne touche pas
        à votre sauvegarde.
      </p>
      {tab === "style" ? (
        <StyleValidation animated={animated}/>
      ) : tab === "roster" ? (
        <RosterWorkbench animated={animated} palettes={palette} />
      ) : tab === "sprites" ? (
        <div className="sprite-gallery">
          {CARDS.map((c) => (
            <article key={c.id}>
              <div className={`sprite-stage bench-${background}`}>
                <div style={{ width: SPRITE_SIZE * scale }}>
                  <Sprite
                    creature={c}
                    seed={c.seed + seed}
                    animated={animated}
                    onlyPart={part || undefined}
                  />
                </div>
              </div>
              <div className="size-comparison">
                {[48, 80, 112].map((size, i) => (
                  <div key={size}>
                    <div
                      className={`sample bench-${["cream", "night", "checker"][i]}`}
                      style={{ width: size, height: size }}
                    >
                      <Sprite
                        creature={c}
                        seed={c.seed + seed}
                        animated={animated}
                        onlyPart={part || undefined}
                      />
                    </div>
                    <small>{size} px</small>
                  </div>
                ))}
              </div>
              <h2>
                {c.id} · {c.name}
              </h2>
              <p>
                {RARITIES[c.rarity]} · {c.type} · seed {c.seed + seed}
              </p>
              {palette && (
                <div className="palette" aria-label={`Palette de ${c.name}`}>
                  {(c.design ? usedContentPalette(c.design, c.seed + seed) : usedSpritePalette(c, c.seed + seed)).map((color, i) => (
                    <span key={i} style={{ background: color }} title={color} />
                  ))}
                </div>
              )}
              <div className="sprite-parts">
                <strong>Construction</strong> ·{" "}
                {c.design ? `${c.design.anatomy} · ${c.design.sprite!.bodyVariant} · ${c.design.sprite!.posture}` : c.shape}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="dev-card-grid">
          {CARDS.map((c) => (
            <div key={c.id}>
              <Card card={c} animated={animated} />
              <p>
                {RARITIES[c.rarity]} · finition {FINISHES[c.rarity]}
              </p>
              {palette && (
                <div className="palette">
                  {(c.design ? usedContentPalette(c.design, c.seed + seed) : usedSpritePalette(c, c.seed + seed)).map((color, i) => (
                    <span key={i} style={{ background: color }} title={color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {preview && (
        <BoosterOpening
          save={preview}
          onReveal={() => setPreview((s) => (s ? reveal(s) : s))}
          onClose={() => setPreview(null)}
        />
      )}
    </main>
  );
}
