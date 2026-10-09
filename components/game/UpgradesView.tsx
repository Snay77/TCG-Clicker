import {storageCost} from '../../lib/booster-economy';
import {stats,type Save} from '../../lib/game';
import {amount,decimal,percent} from '../../lib/game-ux';
import {comboFactor} from '../../lib/progression';
import {MACHINE_TIERS,machineTier,UPGRADES,upgradeCost,type UpgradeId} from '../../lib/progression';
import Rune from './Rune';
export default function UpgradesView({save,ready,onBuy,onBuyStorage,progressive=false}:{save:Save;ready:boolean;onBuy:(id:UpgradeId)=>void;onBuyStorage:()=>void;progressive?:boolean}){
 const next=MACHINE_TIERS.find(t=>t.level>save.level+1),power=stats(save);
 const upgrades=UPGRADES.filter(u=>!progressive||save.upgrades[u.id]>0||Math.max(save.energy,save.account.totals.generatedEnergy)>=u.base);
 const storageVisible=!progressive||save.freeBoosterCapacity>2||save.packs>=5;
 return <section className="upgrades-panel arcane-upgrades" id="upgrades"><div className="section-title"><div><h2>Les composants du portail</h2><p>Machine niveau {save.level+1} · {machineTier(save.level).name}{next&&` · prochain palier : ${next.name} au niveau ${next.level}`}</p><strong>Vos éclats : {amount(save.energy)} ✦</strong></div></div>
  <div className="upgrade-grid">{upgrades.map(u=>{
   const future=stats({...save,upgrades:{...save.upgrades,[u.id]:save.upgrades[u.id]+1}});
   const average=(p:typeof power)=>p.click*(1+p.crit*(p.critMultiplier-1));
   const values:Record<UpgradeId,[string,string]>={click:[decimal(power.click)+' / clic',decimal(future.click)+' / clic'],auto:[decimal(power.auto)+' / s',decimal(future.auto)+' / s'],critChance:[percent(power.crit),percent(future.crit)],critMultiplier:['×'+decimal(power.critMultiplier),'×'+decimal(future.critMultiplier)],combo:['×'+decimal(comboFactor(100,power.comboBonus)),'×'+decimal(comboFactor(100,future.comboBonus))],global:[percent(save.upgrades.global*.05),percent((save.upgrades.global+1)*.05)],faerie:[percent(save.upgrades.faerie*.04),percent((save.upgrades.faerie+1)*.04)]};
   const max=save.upgrades[u.id]>=u.max,cost=upgradeCost(u.id,save.upgrades);
   return <div className={`upgrade-item ${ready&&save.energy>=cost&&!max?'available':''}`} key={u.id}><Rune kind={u.id}/><div><strong>{u.name}</strong><small>Niveau composant {save.upgrades[u.id]} / {u.max} · {values[u.id][0]}{!max&&values[u.id][0]!==values[u.id][1]&&' → '+values[u.id][1]}</small>{u.id==='combo'?<small>Bonus maximal du combo · paliers actifs facultatifs, passif conservé.</small>:<small>{(max||Math.abs(average(power)-average(future))>.005)&&<>Clic moyen : {decimal(average(power))}{!max&&' → '+decimal(average(future))} ✦</>}{(u.id==='auto'||u.id==='global'||u.id==='faerie')&&Math.abs(power.auto-future.auto)>.005?` · Passif : ${decimal(power.auto)}${!max?' → '+decimal(future.auto):''} / s`:''}</small>}{u.id==='global'&&<small>Bonus universel au clic et au passif, dans tous les mondes.</small>}{u.id==='faerie'&&<small>Bonus de Faerie. Dans Set 01, tout vient de Faerie : il renforce aussi clic et passif. Les deux bonus se cumulent.</small>}{u.id==='critChance'&&<small>Chance de recevoir le multiplicateur critique sur un clic.</small>}{u.id==='critMultiplier'&&<small>Montant d’un clic critique ; sa probabilité ne change pas.</small>}</div><button aria-label={`Acheter ${u.name} · ${amount(cost)} éclats`} disabled={!ready||save.energy<cost||max} onClick={()=>onBuy(u.id)}>{max?'MAX':amount(cost)+' ✦'}</button></div>;
  })}</div>
  {storageVisible&&<details className="storage-section"><summary>Sac dimensionnel · préparer votre retour</summary><p>Conserve plus de boosters gratuits pendant vos absences. Ne produit pas d’éclats hors ligne et n’accélère pas la recharge.</p><div className="upgrade-item storage-upgrade"><Rune kind="storage"/><div><strong>Sac dimensionnel</strong><small>Stockage : {save.freeBoosterCapacity}{save.freeBoosterCapacity<10&&' → '+(save.freeBoosterCapacity+1)} · recharge 10 minutes</small><small>Vos éclats : {amount(save.energy)} ✦</small></div><button disabled={!ready||storageCost(save)===null||save.energy<storageCost(save)!} onClick={onBuyStorage}>{storageCost(save)===null?'MAX':amount(storageCost(save)!)+' ✦'}</button></div></details>}
 </section>;
}
