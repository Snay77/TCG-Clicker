"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CARDS, RARITIES, byId } from "../lib/cards";
import {
  openPack,
  chainPack,
  finishPack,
  buyStorage,
  upgradeCard,
  savedCardLevel,
  type PackSource,
  drawPack,
  changeDeck,
  deckCapacity,
  equipBlockedReason,
  buyUpgrade,
  rarityProbabilities,
  initialSave,
  price,
  reveal,
  Save,
  stats,
} from "../lib/game";
import { rechargeFreePacks, freePackRemaining } from "../lib/booster-economy";
import BoosterShop from "./game/BoosterShop";
import ProgressionView from "./game/ProgressionView";
import { ACHIEVEMENTS, achievementReady, completedLineages, explorationLevel, freePackCount, claimAchievement, buyDeckSlot, selectTitle, toggleFastOpening, recordClick, recordTick, TITLES } from "../lib/exploration";
import Sprite from "./Sprite";
import Machine from "./Machine";
import BoosterPack from "./BoosterPack";
import BoosterOpening from "./BoosterOpening";
import CollectionView from "./game/CollectionView";
import DeckView, { statImpact } from "./game/DeckView";
import UpgradesView from "./game/UpgradesView";
import ComboBar from "./game/ComboBar";
import { advanceCombo, decayCombo, comboFactor, initialCombo, machineTier, leveledEffect } from "../lib/progression";
import { describeEffect } from "../lib/effects";
import Onboarding, { PortalIntro } from './game/Onboarding';
import Settings from './game/Settings';
import { completedSteps, contextualTip, dismissTip, markIntroSeen, type UX } from '../lib/ux';
import { GameAudio, type SoundKind } from '../lib/game-audio';
import { UNLOCKS, rewardDescription } from '../lib/exploration';
import { ALPHA_VERSION, devToolsEnabled } from '../lib/release';
import { useSaveSession } from './game/useSaveSession';
import SaveGate from './game/SaveGate';
import { useMobileLayout } from './game/useMobileLayout';
import BottomSheet from './game/BottomSheet';
import MobileBooster from './game/MobileBooster';
import BoostersView from './game/BoostersView';
import Rune from './game/Rune';
import { usePWA } from './game/usePWA';
const fmt = (n: number) => Math.floor(n).toLocaleString("fr-FR");
export default function Game() {
  const mobile = useMobileLayout();
  const [upgradesOpen, setUpgradesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const pwa = usePWA();
  const [save, setSave] = useState<Save>(() => initialSave());
  const [wallTime,setWallTime]=useState(0);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const audioEngine=useRef<GameAudio|null>(null);
  function playSound(kind:SoundKind,gesture=false) { audioEngine.current ??= new GameAudio();audioEngine.current.play(kind,latest.current.ux,gesture); }
  function updateSettings(change:Partial<UX>) { setSave(s=>({...s,ux:{...s.ux,...change}})); }
  function navigate(target:string) {
    if (target === 'booster') { setTab('boosters'); window.scrollTo({top:0}); return; }
    if (mobile && target === 'upgrades') { setTab('machine'); setUpgradesOpen(true); return; }
    if(target==='upgrades'||target==='booster') {setTab('machine');requestAnimationFrame(()=>document.getElementById(target)?.scrollIntoView({behavior:latest.current.ux.motion==='reduce'?'instant':'smooth',block:'center'}));}
    else setTab(target);
  }
  const session = useSaveSession(save, setSave);
  const ready = session.status === 'active';
  const [tab, setTab] = useState("machine");
  const [notice, setNotice] = useState("");
  const storageOk = session.storageOk;
  const [combo, setCombo] = useState(initialCombo);
  const comboRef = useRef(initialCombo());
  const [sparks, setSparks] = useState<
    { id: number; born: number; x: number; y: number; gain: number; crit: boolean }[]
  >([]);
  const serial = useRef(0);
  const latest = useRef(save); latest.current = save;
  const progressBaseline = useRef<{level:number;ready:Set<string>;species:number;lineages:number;free:number;claimed:string[]}|null>(null);
  const queuedFeedback = useRef<string[]>([]);
  const queuedLevels=useRef<{from:number;to:number}|null>(null);


  useEffect(() => {
    if (!ready) return;
    let last = performance.now();
    const resetClock = () => { last = performance.now(); };
    window.addEventListener("focus",resetClock);
    document.addEventListener("visibilitychange",resetClock);
    const t = setInterval(() => {
      if (!session.writable()) return;
      const now = performance.now();
      const epoch = Date.now();
      const elapsed = Math.min((now - last) / 1000, 5);
      last = now;
      const nextCombo = decayCombo(comboRef.current, now);
      comboRef.current = nextCombo;
      setCombo(previous => previous.charge === nextCombo.charge ? previous : nextCombo);
      setSave((s) => {
        const current=rechargeFreePacks(s,epoch);
        const passive = stats(current).auto;
        return recordTick(current,elapsed,passive,document.visibilityState === "visible" && document.hasFocus());
      });
    }, 200);
    return () => { clearInterval(t);window.removeEventListener("focus",resetClock);document.removeEventListener("visibilitychange",resetClock); };
  }, [ready]);
  useEffect(() => {
    if(!ready)return;
    const update=()=>{if (!session.writable()) return;const now=Date.now();setWallTime(now);setSave(s=>rechargeFreePacks(s,now));};
    const timer=setInterval(update,1000);
    window.addEventListener("focus",update);document.addEventListener("visibilitychange",update);
    return ()=>{clearInterval(timer);window.removeEventListener("focus",update);document.removeEventListener("visibilitychange",update);};
  },[ready]);
  useEffect(() => {
    const t = setInterval(
      () => setSparks((s) => s.length ? s.filter((x) => Date.now() - x.born < 950) : s),
      300,
    );
    return () => clearInterval(t);
  }, []);
  const opening = save.pending.length > 0;
  useEffect(()=>{
    if(!ready)return;
    const completed=completedSteps(save);
    if(completed.join()!==save.ux.completed.join())setSave(s=>({...s,ux:{...s.ux,completed:completedSteps(s)}}));
  },[ready,save.clicks,save.upgrades,save.packs,save.pending.length,save.revealed,save.owned,save.deck,save.ux.completed]);
  useEffect(()=>{
    document.documentElement.dataset.motion=save.ux.motion;
    return()=>{delete document.documentElement.dataset.motion;};
  },[save.ux.motion]);
  useEffect(()=>()=>audioEngine.current?.close(),[]);
  useEffect(() => {
    if(!ready)return;
    const state=latest.current;
    const snapshot={level:explorationLevel(state.account.xp),ready:new Set(ACHIEVEMENTS.filter(a=>achievementReady(state,a)).map(a=>a.id)),species:Object.keys(state.owned).length,lineages:completedLineages(state),free:state.freeBoosters,claimed:state.account.claimed};
    const before=progressBaseline.current;
    if(before){
      if(snapshot.level>before.level){
        queuedLevels.current={from:queuedLevels.current?.from??before.level,to:snapshot.level};
      }
      if(snapshot.free>before.free)queuedFeedback.current.push('Un nouveau booster est disponible.');
      for(const id of snapshot.claimed.filter(id=>!before.claimed.includes(id))){const a=ACHIEVEMENTS.find(a=>a.id===id);if(a)queuedFeedback.current.push(`Récompense · ${a.title} : ${rewardDescription(a.rewards)}`);}
      const newlyReady=[...snapshot.ready].filter(id=>!before.ready.has(id));
      if(snapshot.species===60&&before.species<60)queuedFeedback.current.push('60/60 · Faerie est complète ! Récompense et titre Gardien du Portail dans les objectifs.');
      else if(snapshot.lineages>before.lineages)queuedFeedback.current.push(`Lignée complétée · ${snapshot.lineages} / 20. Votre badge et votre récompense vous attendent.`);
      else if(newlyReady.length)queuedFeedback.current.push('Objectifs accomplis · récompenses à réclamer dans Progression.');
    }
    progressBaseline.current=snapshot;
    if(!opening&&state.ux.introSeen&&(queuedFeedback.current.length||queuedLevels.current)){const levels=queuedLevels.current;const unlocks=levels?UNLOCKS.filter(u=>u.level>levels.from&&u.level<=levels.to).map(u=>u.name):[];const messages=[...new Set(queuedFeedback.current)];if(levels)messages.push(`Exploration niveau ${levels.to} · ${unlocks.length?'Nouveau déblocage : '+unlocks.join(' · '):'Votre voyage continue.'}`);queuedLevels.current=null;setNotice(messages.slice(-4).join(' '));playSound(messages.some(m=>m.startsWith('Exploration niveau'))?'level':messages.some(m=>m.startsWith('Récompense'))?'goal':'ready');queuedFeedback.current=[];}
  },[ready,opening,save.account.xp,save.owned,save.level,save.cardLevels,save.packs,save.account.claimed,save.freeBoosters,save.ux.introSeen,save.account.totals.maxCombo,save.account.totals.criticalClicks,Math.floor(save.account.totals.generatedEnergy/10000)]);
  function claim(id:string) { setSave(s=>claimAchievement(s,id)); }

  const power = stats(save);
  const discovered = Object.keys(save.owned).length;
  function click(e: React.MouseEvent<HTMLButtonElement>) {
    if (!session.writable()) return;
    const current = latest.current;
    const currentPower = stats(current);
    const nextCombo = advanceCombo(comboRef.current, performance.now());
    comboRef.current = nextCombo;
    setCombo(nextCombo);
    const critical = Math.random() < currentPower.crit;
    const gain = currentPower.click * comboFactor(nextCombo.charge, currentPower.comboBonus) * (critical ? currentPower.critMultiplier : 1);
    playSound(critical?"critical":"click",true);
    const box = e.currentTarget.getBoundingClientRect();
    setSave((s) => recordClick(s,gain,critical,nextCombo.charge));
    setSparks((s) => [
      ...s.slice(-18),
      {
        id: serial.current++,
        born: Date.now(),
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
  function startPack(source:PackSource,chain=false) {
    if (!session.writable()) return;
    const now=Date.now();
    const cards=drawPack(Math.random,stats(latest.current).rareChance);
    setSave(s=>{
      const current=rechargeFreePacks(s,now);
      return chain ? chainPack(current,cards,source,now) : openPack(current,cards,source,now);
    });
  }
  const available=rechargeFreePacks(save,wallTime || Date.now());
  const nextSource:PackSource|null=freePackCount(available)>0?"free":available.energy>=price(available)?"paid":null;
  if (!ready) return <SaveGate session={session}/>;
  return (
    <div className={`app-shell tab-${tab} ${contextualTip(save)==='click'?'onboarding-machine':''}`}>
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
            ["boosters", "▣", "Boosters"],
            ["collection", "▦", "Collection"],
            ["deck", "▤", "Mon deck"],
            ["progression", "✧", "Progression"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              aria-current={tab===id?"page":undefined}
              onClick={() => {setTab(id);window.scrollTo({top:0});if(id==='collection'||id==='deck'||id==='progression')setSave(s=>dismissTip(s,id));}}
            >
              <span>{icon}</span>
              <span className="nav-label">{mobile ? ({machine:'Machine',boosters:'Boosters',collection:'Collection',deck:'Deck',progression:'Voyage'}[id]) : label}</span>
              {(((id==='machine'||id==='boosters')&&freePackCount(save)>0)||(id==='progression'&&ACHIEVEMENTS.some(a=>achievementReady(save,a))))&&<i className="availability-dot" aria-label={id!=='progression'?'Booster gratuit disponible':'Récompense disponible'}/>}
              {id === "collection" && <small>{discovered}/{CARDS.length}</small>}
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
          {devToolsEnabled(process.env.NODE_ENV) && <><Link href="/dev">⌘ Atelier des sprites ↗</Link>
          <Link className="playtest-reset-link" href="/dev#playtest-reset">↺ Réinitialiser la sauvegarde · test</Link></>}
          <small>EXPLORATION · niv. {explorationLevel(save.account.xp)}</small>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div className="mobile-resources"><strong aria-label="Énergie">✦ {fmt(save.energy)}</strong><button onClick={() => setTab('progression')}>Nv. {explorationLevel(save.account.xp)}</button><span aria-label="Boosters disponibles">▣ {freePackCount(available)}</span></div>
          <span>
            La Clairière{" "}
            <span className="muted">
              /{" "}
              {tab === "machine"
                ? "Portail interdimensionnel"
                : tab === "boosters" ? "Choix des boosters"
                : tab === "deck"
                  ? "Compagnons actifs"
                  : tab === "progression" ? "Votre voyage" : "Classeur de créatures"}
            </span>
          </span>
          <button className="settings-button" onClick={()=>setSettingsOpen(true)} aria-label="Paramètres">⚙ Paramètres</button><span className="save-status">
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
                  : tab === "boosters" ? "Une rencontre dans chaque paquet."
                  : tab === "deck"
                    ? "De petites créatures. De grands pouvoirs."
                    : tab === "progression" ? "Chaque rencontre ouvre un chemin." : "Votre petit monde prend vie."}
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
          <div className="exploration-strip"><button onClick={()=>setTab("progression")}>✧ Exploration niv. {explorationLevel(save.account.xp)} · {TITLES.find(t=>t.id===save.account.activeTitle)?.name}</button></div>
          {notice && (
            <div key={notice} className={`notice ${notice.includes("60/60")?"completion-notice":""}`} role="status">
              {notice}
              <button
                onClick={() => setNotice("")}
                aria-label="Fermer le message"
              >
                ×
              </button>
            </div>
          )}
          {ready&&!opening&&!mobile&&<div className="onboarding-container"><Onboarding save={save} onDismiss={id=>setSave(s=>dismissTip(s,id))} onSkip={()=>setSave(s=>({...s,ux:{...s.ux,skipTips:true}}))} onNavigate={navigate}/></div>}
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
                      <span key={sparks.at(-1)?.id||0} className={`machine-recoil ${sparks.at(-1)?.crit?'critical-recoil':''}`}><Machine level={save.level} /></span>
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
                  {mobile && <><div className="mobile-machine-actions"><button onClick={() => setUpgradesOpen(true)}><Rune/>Améliorations <span>↗</span></button><button aria-label="Conseils" onClick={() => setHelpOpen(true)}>?</button><small>+{Number(power.click.toFixed(2))} / clic · {power.auto.toFixed(1)} / sec</small></div><MobileBooster save={available} remaining={freePackRemaining(available,wallTime || Date.now())} rareChance={power.rareChance} onBrowse={()=>{setTab("boosters");window.scrollTo({top:0});}} onOpen={source => startPack(source)}/></>}
                </section>
                <section className={`shop-panel ${nextSource?'pack-available':''}`} id="booster">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">UNE NOUVELLE RENCONTRE</span>
                      <h2>Booster Faerie</h2>
                      <button className="desktop-booster-browse" onClick={()=>setTab("boosters")}>Choisir un booster →</button>
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
                  <BoosterShop save={available} ready={ready} opening={opening} remaining={ready?freePackRemaining(available,wallTime):null} onOpen={source=>startPack(source)} />
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
              {(!mobile || upgradesOpen) && (mobile ? <BottomSheet title="Améliorations" onClose={() => setUpgradesOpen(false)}><UpgradesView save={save} ready={ready} onBuy={id => {if(buyUpgrade(latest.current,id)!==latest.current)playSound('upgrade',true);setSave(s=>buyUpgrade(s,id));}} onBuyStorage={() => {if(buyStorage(latest.current)!==latest.current)playSound('upgrade',true);setSave(buyStorage);}}/></BottomSheet> : <UpgradesView save={save} ready={ready} onBuy={id => {if(buyUpgrade(latest.current,id)!==latest.current)playSound("upgrade",true);setSave(s=>buyUpgrade(s,id));}} onBuyStorage={()=>{if(buyStorage(latest.current)!==latest.current)playSound("upgrade",true);setSave(s=>buyStorage(s));}} />)}
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
                        <small>Niv. {savedCardLevel(save, c.id)} · {describeEffect(leveledEffect(c.effect, savedCardLevel(save, c.id)))}</small>
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
          ) : tab === "boosters" ? (
            <BoostersView save={available} remaining={freePackRemaining(available,wallTime || Date.now())} rareChance={power.rareChance} onFavorite={id=>updateSettings({favoriteBooster:id})} onOpen={(id,source)=>{if(id==='faerie')startPack(source);}}/>
          ) : tab === "progression" ? (
            <ProgressionView save={save} onClaim={claim} onSlot={()=>{if(buyDeckSlot(latest.current)!==latest.current)playSound("upgrade",true);setSave(buyDeckSlot);}} onTitle={id=>setSave(s=>selectTitle(s,id))} onFast={()=>setSave(toggleFastOpening)}/>
          ) : tab === "deck" ? (
            <DeckView save={save} onEquip={toggle} />
          ) : (
            <CollectionView save={save} onEquip={toggle} onUpgrade={id => {if(upgradeCard(latest.current,id)!==latest.current)playSound("upgrade",true);setSave(s=>upgradeCard(s,id));}} onClaim={claim} />
          )}
          {devToolsEnabled(process.env.NODE_ENV) && <><Link className="mobile-dev-link" href="/dev">
            ⌘ Atelier des sprites ↗
          </Link>
          <Link className="mobile-dev-link playtest-reset-link" href="/dev#playtest-reset">
            ↺ Réinitialiser la sauvegarde · test
          </Link>
          </>}
          <footer className="page-footer">
            <span>{ALPHA_VERSION} · Une petite machine pour de grandes découvertes.</span>
            <span>
              {fmt(save.clicks)} clics · {save.packs} boosters ouverts
            </span>
          </footer>
        </div>
      </main>
      {mobile && helpOpen && !opening && <BottomSheet title="Premiers pas" onClose={() => setHelpOpen(false)}><Onboarding save={save} onDismiss={id=>setSave(s=>dismissTip(s,id))} onSkip={()=>setSave(s=>({...s,ux:{...s.ux,skipTips:true}}))} onNavigate={target=>{setHelpOpen(false);navigate(target);}}/><p>Cliquer sur le portail produit de l’énergie. Les boosters contiennent vos compagnons ; équipez-les dans le Deck et réclamez vos récompenses dans Voyage.</p></BottomSheet>}
      {ready&&!opening&&!save.ux.introSeen&&<PortalIntro onDone={()=>{playSound('level',true);setSave(markIntroSeen);}}/>}
      {settingsOpen&&!opening&&<Settings save={save} pwa={pwa} beforeReload={session.saveBeforeReload} onReplace={next=>{session.replace(next);comboRef.current=initialCombo();setCombo(initialCombo());progressBaseline.current=null;queuedFeedback.current=[];queuedLevels.current=null;setSparks([]);setNotice('Sauvegarde remplacée.');setTab('machine');}} onChange={updateSettings} onFast={()=>setSave(toggleFastOpening)} onClose={()=>setSettingsOpen(false)}/>}
      {opening && (
        <BoosterOpening
          key={save.packs}
          save={save}
          fast={save.account.fastOpening && explorationLevel(save.account.xp)>=12}
          audioSettings={save.ux}
          onSoundChange={sound=>updateSettings({sound})}
          onSound={playSound}
          onReveal={() => {if(session.writable())setSave(reveal);}}
          economy={{freeBoosters:available.freeBoosters,rewardBoosters:available.account.rewardBoosters,capacity:available.freeBoosterCapacity,price:price(available),nextSource}}
          onNext={source=>startPack(source,true)}
          onClose={destination => {
            setSave(finishPack);
            setTab(destination || "machine");
          }}
        />
      )}
    </div>
  );
}
