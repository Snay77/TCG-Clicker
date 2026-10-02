import { useState } from "react";
import { RARITIES } from "../../lib/cards";
import { describeEffect } from "../../lib/effects";
import { ANATOMIES, HABITATS, TYPES, type CardDesign } from "../../lib/content/model";
import { CONTENT_PARTS, type ContentPart } from "../../lib/content/directed-sprites";
import { designById, describeCondition, LINEAGES, ROSTER, SAMPLE, STAGES } from "../../lib/content/roster";
import ContentSprite from "./ContentSprite";
import ContentHabitat from "./ContentHabitat";
import ContentCard from "./ContentCard";

const SIZES = [48,64,80,112,160];
function Palette({ card }: { card: CardDesign }) {
  return <div className="roster-palette" aria-label={`Palette de ${card.name}`}>
    {Object.values(card.palette).map(color=><span key={color} style={{background:color}} title={color}><small>{color}</small></span>)}
  </div>;
}
function DesignDetails({ card }: { card: CardDesign }) {
  return <details className="design-details"><summary>Fiche complète · {card.id}</summary>
    <dl>
      <dt>Lignée / relations</dt><dd>{card.lineage||"Unique"} · {card.evolvesFrom||"—"} → {card.id} → {card.evolvesTo||"—"}</dd>
      <dt>Stade / rareté / type</dt><dd>{STAGES[card.stage]} · {RARITIES[card.rarity]} · {card.type}</dd>
      <dt>Anatomie / silhouette</dt><dd>{ANATOMIES[card.anatomy]} · {card.silhouette}</dd>
      <dt>Palettes</dt><dd>{card.palette.primary} / {card.palette.secondary} / {card.palette.light}</dd>
      <dt>Habitat / personnalité</dt><dd>{HABITATS[card.habitat]} · {card.personality}</dd>
      <dt>Description visuelle</dt><dd>{card.visual}</dd>
      <dt>Marqueurs communs</dt><dd>{card.sharedMarkers}</dd>
      <dt>Rôle / effet prévu</dt><dd>{card.role} · {describeEffect(card.plannedEffects)}</dd>
      <dt>Capacités futures</dt><dd>{card.conditions.length?card.conditions.map(describeCondition).join(" ; "):"Aucune condition prévue"} · non actives</dd>
      <dt>Ambiance</dt><dd>{card.flavor}</dd>
      <dt>Seed / production</dt><dd>{card.seed} · {card.status==="sample"?"Référence validée":"Produit et jouable"}</dd>
      {card.sprite && <><dt>Composants dirigés</dt><dd>{Object.entries(card.sprite).map(([k,v])=>`${k}: ${typeof v==="object"?JSON.stringify(v):v}`).join(" · ")}</dd></>}
      {card.signature && Object.entries(card.signature).map(([key,value])=><div className="signature-detail" key={key}><dt>{key}</dt><dd>{value}</dd></div>)}
    </dl>
  </details>;
}
export default function RosterWorkbench({ animated, palettes }: { animated: boolean; palettes: boolean }) {
  const [view,setView]=useState("full");
  const [size,setSize]=useState(160);
  const [silhouette,setSilhouette]=useState(false);
  const [background,setBackground]=useState("cream");
  const [allSizes,setAllSizes]=useState(false);
  const [seedOffset,setSeedOffset]=useState(0);
  const [part,setPart]=useState<ContentPart|"">("");
  const [anatomy,setAnatomy]=useState(""),[habitat,setHabitat]=useState("");
  const [type,setType]=useState("");
  const [rarity,setRarity]=useState("");
  const [status,setStatus]=useState("");
  const [search,setSearch]=useState("");
  const matches=(c:CardDesign)=>(!anatomy||c.anatomy===anatomy)&&(!habitat||c.habitat===habitat)&&(!type||c.type===type)&&(!rarity||c.rarity===Number(rarity))&&(!status||c.status===status)&&c.name.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr"));
  const filtered=(view==="sample"?SAMPLE:ROSTER).filter(matches);
  const stages=(ids:string[])=>ids.map(id=>designById(id)!);
  return <section className="roster-workbench" aria-label="Set 01 — Roster">
    <div className="roster-intro"><div><div className="eyebrow">SET 01 — ROSTER · PHASE 05</div><h2>Soixante rencontres dans la clairière.</h2>
      <p>60 sprites jouables · 20 lignées · 8 uniques · 12 références validées.</p></div>
      <div className="roster-counts">{RARITIES.map((r,i)=><span key={r}>{r}<strong>{ROSTER.filter(c=>c.rarity===i).length}</strong></span>)}</div>
    </div>
    <nav className="roster-tabs" aria-label="Production du set">
      {[["full","Set 01 — Full Roster"],["sample","Références · 12"],["contentCards","Cartes d’étude"],["lineages","Lignées · 20"],["roster","Fiches · 60"],["habitats","Habitats · 16"]].map(([id,label])=><button key={id} className={view===id?"active":""} aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}
    </nav>
    <div className="roster-controls">
      <label>Taille<select value={size} onChange={e=>setSize(Number(e.target.value))}>{SIZES.map(s=><option key={s} value={s}>{s} px</option>)}</select></label>
      <label>Fond<select value={background} onChange={e=>setBackground(e.target.value)}><option value="cream">Parchemin</option><option value="night">Nuit</option><option value="checker">Quadrillage</option></select></label>
      <label><input type="checkbox" checked={silhouette} onChange={e=>setSilhouette(e.target.checked)}/>Silhouettes</label>
      <label><input type="checkbox" checked={allSizes} onChange={e=>setAllSizes(e.target.checked)}/>Comparer 48 → 160 px</label>
      <label>Seed +<input type="number" value={seedOffset} onChange={e=>setSeedOffset(Number(e.target.value)||0)}/></label>
      <label>Partie<select value={part} onChange={e=>setPart(e.target.value as ContentPart|"")}><option value="">Assemblage complet</option>{CONTENT_PARTS.map(p=><option key={p}>{p}</option>)}</select></label>
    </div>
    {view!=="habitats" && <div className="roster-filters">
      <label>Recherche<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom de créature"/></label>
      <label>Type<select aria-label="Type" value={type} onChange={e=>setType(e.target.value)}><option value="">Tous les types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Rareté<select aria-label="Rareté" value={rarity} onChange={e=>setRarity(e.target.value)}><option value="">Toutes les raretés</option>{RARITIES.map((r,i)=><option key={r} value={i}>{r}</option>)}</select></label>
      <label>Anatomie<select aria-label="Anatomie" value={anatomy} onChange={e=>setAnatomy(e.target.value)}><option value="">Toutes les anatomies</option>{Object.entries(ANATOMIES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <label>Habitat<select aria-label="Habitat" value={habitat} onChange={e=>setHabitat(e.target.value)}><option value="">Tous les habitats</option>{Object.entries(HABITATS).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <label>Production<select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Tous les designs</option><option value="sample">Échantillon rendu</option><option value="produced">Nouvelles productions</option></select></label>
      <button onClick={()=>{setAnatomy("");setHabitat("");setType("");setRarity("");setStatus("");setSearch("");}}>Effacer les filtres</button>
    </div>}
    <p className="roster-note" role="status">{view==="habitats"?"16 environnements construits en code":`${filtered.length} fiche(s) correspondante(s)`} · Effets simples actifs ; capacités conditionnelles réservées à une phase future.</p>
    {(view==="sample"||view==="full") && <div className="roster-sample-grid">{filtered.map(c=><article className="sample-tile" key={c.id} data-design-id={c.id}>
      <div className={`content-bench bench-${background}`}><ContentSprite card={c} seed={c.seed+seedOffset} size={size} silhouette={silhouette} animated={animated} onlyPart={part||undefined}/></div>
      <header><small>{c.id} · {RARITIES[c.rarity]}</small><h3>{c.name}</h3><span>{c.type} · {STAGES[c.stage]} · {ANATOMIES[c.anatomy]}</span></header>
      <p className="sample-silhouette">{c.silhouette}</p>
      {palettes && <Palette card={c}/>}
      <small className="sample-seed">seed {c.seed+seedOffset} · {HABITATS[c.habitat]}</small>
      {allSizes && <div className="content-size-strip">{SIZES.map(s=><div key={s}><ContentSprite card={c} seed={c.seed+seedOffset} size={s} silhouette={silhouette} animated={animated} onlyPart={part||undefined}/><small>{s} px</small></div>)}</div>}
      <DesignDetails card={c}/>
    </article>)}</div>}
    {view==="contentCards" && <div className="content-card-grid">{filtered.map(c=><div key={c.id}><ContentCard card={c} animated={animated}/><DesignDetails card={c}/></div>)}</div>}
    {view==="lineages" && <div className="roster-lineages">{LINEAGES.filter(l=>stages(l.cardIds).some(matches)).map(l=><article className="roster-lineage" key={l.id}>
      <header><span>{l.id} · {l.type}</span><h3>{l.name}</h3><p>{l.transformation}</p></header>
      <div className="roster-lineage-stages">{stages(l.cardIds).map(c=><div key={c.id} data-design-id={c.id}>
        {c.sprite?<div className={`content-bench bench-${background}`}><ContentSprite card={c} size={112} silhouette={silhouette} animated={animated}/></div>:<div className="design-placeholder"><span>◇</span><small>Design · sprite à produire</small></div>}
        <strong>{c.name}</strong><small>{STAGES[c.stage]} · {RARITIES[c.rarity]}</small><p>{c.silhouette}</p>{palettes&&<Palette card={c}/>}<DesignDetails card={c}/>
      </div>)}</div>
      <div className="lineage-direction"><p><strong>Concept :</strong> {l.concept}</p><p><strong>Personnalité :</strong> {l.personality}</p><p><strong>Marqueur :</strong> {l.marker}</p><p><strong>Gimmick :</strong> {l.gimmick} · {l.faerie}</p></div>
    </article>)}</div>}
    {view==="roster" && <div className="roster-all-grid">{filtered.map(c=><article className="roster-design-tile" key={c.id} data-design-id={c.id}>
      {c.sprite?<div className={`content-bench bench-${background}`}><ContentSprite card={c} size={112} animated={animated} silhouette={silhouette}/></div>:<div className="design-placeholder"><span>◇ {ANATOMIES[c.anatomy]}</span><small>Design · sprite à produire</small></div>}
      <small>{c.id} · {c.sprite?"Rendu d’étude":"Fiche de design"}</small><h3>{c.name}</h3><p>{RARITIES[c.rarity]} · {c.type} · {c.role}</p><p>{c.silhouette}</p>
      {palettes&&<Palette card={c}/>}<small>{HABITATS[c.habitat]} · seed {c.seed}</small><DesignDetails card={c}/>
    </article>)}</div>}
    {view==="habitats" && <div className="habitat-atlas">{Object.entries(HABITATS).map(([id,label],i)=><article key={id}>
      <div className="habitat-atlas-image"><ContentHabitat habitat={id as CardDesign["habitat"]} seed={1459+i*37} signature={id==="astral"||id==="ancient-tree"}/></div><h3>{label}</h3><small>{ROSTER.filter(c=>c.habitat===id).length} design(s) · variation déterministe</small>
    </article>)}</div>}
    <div className="anatomy-inventory"><strong>Bibliothèque produite · {Object.keys(ANATOMIES).length} familles</strong><p>{Object.values(ANATOMIES).join(" · ")}</p></div>
    {view!=="habitats" && view!=="lineages" && filtered.length===0 && <p>Aucune fiche ne correspond aux filtres.</p>}
  </section>;
}
