import type {Save} from '../../lib/game';
import {parsePortal,portalUnlocked,portalDeck,type PortalRuntime} from '../../lib/living-portal';
import {timer} from '../../lib/game-ux';
export default function PortalControls({save,runtime,now,onActivate,onStabilize}:{save:Save;runtime:PortalRuntime;now:number;onActivate:()=>void;onStabilize:()=>void}){
 const p=parsePortal(save.portal),unlocked=portalUnlocked(save),active=runtime.until>now,prepared=runtime.preparedUntil>now;
 const remaining=Math.max(0,(runtime.until-now)/1000);
 if(!unlocked&&!p.anomaly)return null;
 return <div className="portal-periphery">
  {unlocked&&<section className={`portal-charge ${active?'is-active':''}`} aria-label="Surcharge arcanique">
   <div><span>SURCHARGE {active?'ACTIVE':p.charge>=100?'DISPONIBLE':''}</span><strong>{active?timer(remaining)+' s':Math.floor(p.charge)+' / 100'}</strong></div>
   <progress max={active?8:100} value={active?remaining:p.charge} aria-label={active?'Durée de surcharge':'Charge de surcharge'}/>
   {p.charge>=100&&!active?<button onClick={onActivate}>DÉCLENCHER {prepared?'· ACCORD LUNAIRE':''}<span>↗</span></button>:<small>{active?`+${Math.round(runtime.bonus*100)} % du clic ordinaire · passif inchangé`:prepared?`Songegarde · synchronisez pendant ${timer((runtime.preparedUntil-now)/1000)} s`:'Les impulsions chargent le portail. Gardez la puissance pour votre moment.'}</small>}
  </section>}
  {p.anomaly&&<button className="portal-anomaly" onClick={onStabilize} disabled={active} aria-label="Stabiliser la fissure dimensionnelle">
   <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M29 3 38 19 27 25 35 35 22 42 28 58"/><path d="M32 18 44 13M28 26 17 20M26 40 40 45"/></svg><span><strong>FISSURE DIMENSIONNELLE</strong><small>{active?'En attente · conservée après surcharge':unlocked?'Stabiliser · +15 charge':'Stabiliser le passage'}</small></span><b>↗</b>
  </button>}
  {unlocked&&portalDeck(save).length>0&&<details className="portal-connections"><summary>Accords du portail · {portalDeck(save).length}</summary>{portalDeck(save).map(c=><p key={c.designId}><strong>{c.name}</strong> · {c.text}</p>)}</details>}
 </div>;
}
