import { useState } from 'react';
import { RARITIES, byId } from '../../lib/cards';
import type { Save } from '../../lib/game';
import { ACHIEVEMENTS, achievementProgress, achievementReady, collectionProgress, lineageProgress, explorationLevel, explorationProgress, UNLOCKS, DECK_SLOT_UNLOCKS, TITLES, rewardDescription } from '../../lib/exploration';
import Sprite from '../Sprite';
import { sortedAchievements } from '../../lib/ux';
import { useMobileLayout } from './useMobileLayout';
import ExplorationPath from './ExplorationPath';
const fmt=(n:number)=>Math.floor(n).toLocaleString('fr-FR');
export function CollectionSummary({save}:{save:Save}) {
 const progress=collectionProgress(save);
 return <section className={`collection-summary ${progress.species===60?'set-complete':''}`} aria-label="Progression du Set 01">
  <div><span className="eyebrow">SET 01 — FAERIE</span><h2>{progress.species} / 60 espèces</h2><progress value={progress.species} max={60} aria-label="Espèces découvertes"/><p>{progress.lineages} / 20 lignées complètes</p></div>
  <div className="rarity-progress">{progress.rarities.map(r=><div key={r.rarity}><span>{RARITIES[r.rarity]}</span><strong>{r.owned} / {r.total}</strong><progress value={r.owned} max={r.total} aria-label={`Collection ${RARITIES[r.rarity]}`}/></div>)}</div>
  {progress.species===60&&<div className="set-completion" role="status"><span aria-hidden="true">✧</span><div><strong>Faerie est complète. Chaque rencontre a trouvé sa place.</strong><p>60 / 60 · Le titre Gardien du Portail et votre récompense spéciale vous attendent dans les objectifs. Le prochain monde reste à écrire.</p></div></div>}
 </section>;
}
export function LineageGoals({save,onClaim}:{save:Save;onClaim:(id:string)=>void}) {
 const order=sortedAchievements(save).map(a=>a.lineageId);
 return <div className="lineage-goals">{lineageProgress(save).sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id)).map(l=>{
  const a=ACHIEVEMENTS.find(a=>a.lineageId===l.id)!,claimed=save.account.claimed.includes(a.id);
  return <article className={`lineage-goal ${l.complete?'complete':''}`} key={l.id}><header><h3>{l.name}</h3><span>{claimed?'✦ Badge acquis':`${l.count} / ${l.ids.length}`}</span></header>
   <div className="lineage-portraits">{l.ids.map(id=><div key={id}><Sprite creature={byId(id)} silhouette={!save.owned[id]}/><small>{save.owned[id]?byId(id).name:'À découvrir'} {save.owned[id]?'✓':'?'}</small></div>)}</div>
   <progress value={l.count} max={l.ids.length} aria-label={`Lignée ${l.name}`}/><p>{rewardDescription(a.rewards)}</p><button disabled={!achievementReady(save,a)||!!save.pending.length} onClick={()=>onClaim(a.id)}>{claimed?'Récompense reçue':l.complete?'Réclamer la récompense':'Lignée à compléter'}</button>
  </article>;
 })}</div>;
}
export default function ProgressionView({save,onClaim,onSlot,onTitle,onFast}:{save:Save;onClaim:(id:string)=>void;onSlot:()=>void;onTitle:(id:string)=>void;onFast:()=>void}) {
 const mobile=useMobileLayout();
 const [view,setView]=useState('level'),[category,setCategory]=useState('Découverte');
 const xp=explorationProgress(save.account.xp),offer=DECK_SLOT_UNLOCKS[save.extraDeckSlots];
 const nextUnlock=UNLOCKS.find(u=>u.level>xp.level),ordered=sortedAchievements(save),recommended=ordered.find(a=>!save.account.claimed.includes(a.id)&&xp.level>=(a.minLevel||1));
 const claimable=ordered.filter(a=>achievementReady(save,a));
 const pending=claimable.length;
 return <div className="exploration-view journal-view">
  <section className="exploration-header"><div className="journal-level" aria-label={`Exploration niveau ${xp.level}`}><small>Niv.</small><b>{xp.level}</b></div><div><h2>Carnet de voyage</h2><p>{TITLES.find(t=>t.id===save.account.activeTitle)?.name}</p></div><div className="xp-display"><strong>{fmt(save.account.xp)} / {fmt(xp.next)} XP</strong><progress value={xp.current} max={xp.needed} aria-label="XP du niveau d’exploration"/><small>Les rencontres et améliorations font avancer votre voyage.</small></div></section>
  <div className="exploration-tabs" role="tablist" aria-label="Progression">{[['level','Niveau'],['goals',`Objectifs${pending?` · ${pending} à réclamer`:''}`],['stats','Statistiques']].map(([id,label])=><button key={id} role="tab" aria-selected={view===id} aria-controls={`exploration-${id}`} id={`tab-${id}`} onClick={()=>setView(id)}>{label}</button>)}</div>
  <div className={`journey-overview ${view==='level'?'with-path':''}`}>{view==='level'&&<ExplorationPath xp={save.account.xp}/>}<div className="journey-notes"><section className="next-unlock"><span className="eyebrow">À l’horizon</span><h3>{nextUnlock?`${nextUnlock.name} · niveau ${nextUnlock.level}`:'Tous les horizons sont accessibles'}</h3><p>{nextUnlock?.description||'Continuez votre collection et les défis de maîtrise.'}</p></section>
  {recommended&&<section className={`recommended-goal ${achievementReady(save,recommended)?'available':''}`}><div><span className="eyebrow">{achievementReady(save,recommended)?'Une découverte vous attend':'Dans votre carnet'}</span><h3>{recommended.title}</h3><p>{Math.min(achievementProgress(save,recommended),recommended.target)} / {recommended.target} · {rewardDescription(recommended.rewards)}</p></div><button disabled={!achievementReady(save,recommended)||!!save.pending.length} onClick={()=>onClaim(recommended.id)}>{achievementReady(save,recommended)?'Réclamer la récompense':'En cours'}</button></section>}
  {mobile&&pending>0&&<section className="ready-goals"><h3>Récompenses à réclamer · {pending}</h3>{claimable.slice(0,3).map(a=><button key={a.id} disabled={!!save.pending.length} onClick={()=>onClaim(a.id)}>{a.title} · Réclamer</button>)}{claimable.length>3&&<details><summary>Voir les {claimable.length-3} autres récompenses</summary>{claimable.slice(3).map(a=><button key={a.id} disabled={!!save.pending.length} onClick={()=>onClaim(a.id)}>{a.title} · Réclamer</button>)}</details>}</section>}
  </div></div>

  <section role="tabpanel" id={`exploration-${view}`} aria-labelledby={`tab-${view}`}>
   {view==='level'?<>
    <details className="deck-mobile-details" open={mobile?undefined:true}><summary>Tous les déblocages</summary><div className="unlock-grid">{UNLOCKS.map(u=><article className={xp.level>=u.level?'unlocked':''} key={u.level}><span>NIVEAU {u.level} · {xp.level>=u.level?'✓ DÉBLOQUÉ':'À ATTEINDRE'}</span><h3>{u.name}</h3><p>{u.description}</p></article>)}</div></details>
    <section className={`exploration-panel ${offer&&xp.level>=offer.level&&save.energy>=offer.cost?'available':''}`}><h2>Voyager avec plus de compagnons</h2><p>{6+save.extraDeckSlots} emplacements de deck disponibles. Chaque achat est permanent.</p>{offer?<><p>Emplacement {7+save.extraDeckSlots} · niveau d’exploration {offer.level} · {fmt(offer.cost)} ✦</p><button disabled={xp.level<offer.level||save.energy<offer.cost||!!save.pending.length} onClick={onSlot}>Acheter le {7+save.extraDeckSlots}e emplacement · {fmt(offer.cost)} ✦</button></>:<strong>Les huit emplacements sont débloqués.</strong>}</section>
    <section className="exploration-panel"><h2>Votre rythme d’ouverture</h2><p>Mode rapide à partir du niveau 12. Les cartes ordinaires s’enchaînent plus vite ; les Mythiques gardent leur animation complète.</p><label className="fast-opening-setting"><input type="checkbox" checked={save.account.fastOpening} disabled={xp.level<12} onChange={onFast}/>Ouverture rapide {xp.level<12?'· niveau 12 requis':''}</label></section>
    <section className="exploration-panel"><h2>Un titre pour votre voyage</h2><div className="title-grid">{TITLES.map(t=><button key={t.id} disabled={!t.unlocked(save)} aria-pressed={save.account.activeTitle===t.id} onClick={()=>onTitle(t.id)}><strong>{save.account.activeTitle===t.id?'✦ ':''}{t.name}</strong><small>{t.description}</small></button>)}</div></section>
    <CollectionSummary save={save}/>
   </>:view==='goals'?<>
    <CollectionSummary save={save}/><p className="progression-hint">Une récompense par objectif. Les boosters gagnés restent disponibles même lorsque le stockage rechargeable est plein.</p>
    <div className="goal-categories" aria-label="Catégories d’objectifs">{['Toutes','Découverte','Collection','Clicker','Booster','Lignées','Experts'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="achievement-grid">{ordered.filter(a=>a.category!=='Lignées'&&(category==='Toutes'||(category==='Experts'?(a.minLevel||1)>1:category===a.category))).map(a=>{
     const count=achievementProgress(save,a),claimed=save.account.claimed.includes(a.id),locked=xp.level<(a.minLevel||1),ready=achievementReady(save,a);
     return <article key={a.id} className={`achievement ${ready?'ready':''} ${claimed?'claimed':''}`}><span className="eyebrow">{a.category}{locked?` · Niveau ${a.minLevel}`:''}</span><h3>{a.title}</h3><p>{a.description}</p><progress value={Math.min(count,a.target)} max={a.target} aria-label={a.title}/><small>{fmt(Math.min(count,a.target))} / {fmt(a.target)}</small><strong>{rewardDescription(a.rewards)}</strong><button disabled={!ready||!!save.pending.length} onClick={()=>onClaim(a.id)}>{claimed?'✓ Récompense reçue':locked?`Niveau ${a.minLevel} requis`:ready?'Réclamer la récompense':'Objectif en cours'}</button></article>;
    })}</div>
    {(category==='Toutes'||category==='Lignées')&&<><h2 className="lineage-section-title">Les 20 lignées de Faerie</h2><LineageGoals save={save} onClaim={onClaim}/></>}
   </>:<>
    {save.account.historicalEstimate&&<p className="progression-hint">Sauvegarde ancienne : énergie et cartes historiques estimées à partir de la progression conservée. Critiques et temps de jeu sont suivis depuis cette mise à jour.</p>}
    <div className="lifetime-stats">{[
      ['Énergie totale générée',fmt(save.account.totals.generatedEnergy)],['Clics totaux',fmt(save.clicks)],['Critiques totaux',fmt(save.account.totals.criticalClicks)],['Boosters ouverts',fmt(save.packs)],['Boosters gratuits utilisés',fmt(save.account.totals.freeOpened)],['Boosters achetés',fmt(save.paidBoostersPurchased)],['Cartes obtenues',fmt(save.account.totals.cardsObtained)],['Doublons obtenus',fmt(save.account.totals.duplicatesObtained)],['Espèces découvertes',`${Object.keys(save.owned).length} / 60`],['Lignées complètes',`${collectionProgress(save).lineages} / 20`],['Cartes au niveau 5',fmt(Object.values(save.cardLevels).filter(l=>l===5).length)],['Temps de jeu actif estimé',`${Math.floor(save.account.totals.playSeconds/3600)} h ${Math.floor(save.account.totals.playSeconds/60)%60} min`],['Objectifs récompensés',`${save.account.claimed.length} / ${ACHIEVEMENTS.length}`],['XP totale',fmt(save.account.xp)]
    ].map(([label,value])=><article key={label}><small>{label}</small><strong>{value}</strong></article>)}</div>
   </>}
  </section>
 </div>;
}
