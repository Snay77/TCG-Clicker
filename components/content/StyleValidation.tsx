import { useState } from "react";
import { ANATOMIES, POSTURES } from "../../lib/content/model";
import { EXTREME_STUDIES, PHASE4_BASELINE, STYLE_NOTES, STYLE_SAMPLE, headRatio, baselineHeadRatio } from "../../lib/content/style-validation";
import ContentSprite from "./ContentSprite";

export default function StyleValidation({animated}:{animated:boolean}) {
  const [before,setBefore]=useState(false);
  const [allSizes,setAllSizes]=useState(false);
  return <section className="style-validation" aria-label="Set 01 — Style Validation">
    <div className="roster-intro"><div className="eyebrow">PHASE 4.5 · LANGAGE DES CRÉATURES</div>
      <h2>Douze identités, plusieurs façons d’habiter le monde.</h2>
      <p>Silhouette noire, couleurs à 48 et 112 px, proportions et expressions. Le témoin Phase 4 conserve exactement les pixels précédents. Les 48 autres sprites restent à produire.</p>
    </div>
    <div className="style-controls">
      <button aria-pressed={!before} onClick={()=>setBefore(false)}>Après · Phase 4.5</button>
      <button aria-pressed={before} onClick={()=>setBefore(true)}>Avant · Phase 4</button>
      <label><input type="checkbox" checked={allSizes} onChange={e=>setAllSizes(e.target.checked)}/>Toutes les tailles · 48/64/80/112/160</label>
      <span role="status">{before?"Témoin figé Phase 4":"Direction artistique Phase 4.5"}</span>
    </div>
    <div className="style-grid">{STYLE_SAMPLE.map(c=>{
      const old=PHASE4_BASELINE.find(b=>b.id===c.id)!;
      const r=c.sprite!;
      const sprite=(size:number,black=false)=>before?<svg width={size} height={size} viewBox="0 0 64 64" shapeRendering="crispEdges" role="img" aria-label={`${black?"Silhouette":"Sprite"} Phase 4 de ${c.name}`}>
        {old.paths.map((p,i)=><path key={i} d={p.d} fill={black?"#000000":p.color}/>)}</svg>
        :<ContentSprite card={c} size={size} silhouette={black} animated={animated}/>;
      return <article className="style-tile" key={c.id} data-style-id={c.id}>
        <header><small>{c.id}</small><h3>{c.name}</h3></header>
        <div className="style-comparisons"><div>{sprite(112,true)}<small>Silhouette noire</small></div><div>{sprite(48)}<small>48 px</small></div><div>{sprite(112)}<small>112 px</small></div></div>
        <dl><dt>Anatomie</dt><dd>{ANATOMIES[c.anatomy]}</dd><dt>Posture</dt><dd>{before?"Pose Phase 4":POSTURES[r.posture]}</dd>
          <dt>Head ratio</dt><dd>{before?baselineHeadRatio(old):headRatio(c)}</dd>
          <dt>Face variant</dt><dd>{before?old.recipe.eyes:`${r.face.eyes} · écart ${r.face.spacing} · ${r.face.mouth}${r.face.mask?" · masque":""}${r.face.asymmetric?" · asymétrique":""}`}</dd>
          <dt>Animation</dt><dd>{before?`${old.recipe.idle} · témoin figé`:r.idle}</dd></dl>
        <p>{before?"Référence vectorielle conservée avant les corrections.":STYLE_NOTES[c.id]}</p>
        {allSizes&&<div className="style-size-strip">{[48,64,80,112,160].map(s=><div key={s}>{sprite(s)}<small>{s} px</small></div>)}</div>}
      </article>;
    })}</div>
    <div className="style-extremes"><h2>Huit limites de silhouette</h2><p>Cinq études temporaires de proportions, hors du roster. Trois cas utilisent les échantillons existants.</p>
      <div className="extreme-grid">{EXTREME_STUDIES.map(({label,card})=><article key={label}><h3>{label}</h3><div className="extreme-pair"><ContentSprite card={card} size={112} silhouette animated={false}/><ContentSprite card={card} size={112} animated={animated}/></div><p>{card.name}</p></article>)}</div>
    </div>
  </section>;
}
