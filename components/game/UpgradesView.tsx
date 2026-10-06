import { storageCost } from "../../lib/booster-economy";
import { Save } from "../../lib/game";
import { describeEffect } from "../../lib/effects";
import { MACHINE_TIERS, machineTier, UPGRADES, upgradeCost, UpgradeId } from "../../lib/progression";
import Rune from './Rune';
export default function UpgradesView({ save, ready, onBuy, onBuyStorage, progressive=false }: { save: Save; ready: boolean; onBuy: (id: UpgradeId) => void; onBuyStorage: () => void; progressive?:boolean }) {
  const next = MACHINE_TIERS.find(t => t.level > save.level + 1);
  const upgrades=UPGRADES.filter(u=>!progressive||save.upgrades[u.id]>0||Math.max(save.energy,save.account.totals.generatedEnergy)>=u.base);
  const storageVisible=!progressive||save.freeBoosterCapacity>2||save.energy>=(storageCost(save)??Infinity);
  return <section className="upgrades-panel arcane-upgrades" id="upgrades"><div className="section-title"><div><h2>Les composants du portail</h2><p>Machine niv. {save.level + 1} · {machineTier(save.level).name}{next && ` · prochain palier : ${next.name} au niv. ${next.level}`}</p></div></div>
    {storageVisible&&<div className="upgrade-item storage-upgrade"><Rune kind="storage"/><div><strong>Sac dimensionnel</strong><small>Stockage des boosters · {save.freeBoosterCapacity===10?"10 MAX":`${save.freeBoosterCapacity} → ${save.freeBoosterCapacity+1}`} · recharge inchangée : 10 minutes</small></div><button disabled={!ready||storageCost(save)===null||save.energy<storageCost(save)!} onClick={onBuyStorage}>{storageCost(save)===null?"MAX":`${storageCost(save)!.toLocaleString("fr-FR")} ✦`}</button></div>}
    <div className="upgrade-grid">{upgrades.map(u => <div className={`upgrade-item ${ready && save.energy >= upgradeCost(u.id,save.upgrades) && save.upgrades[u.id]<u.max?"available":""}`} key={u.id}><Rune kind={u.id}/><div><strong>{u.name}</strong><small>Niv. {save.upgrades[u.id]} / {u.max} · Actuel : {describeEffect(Object.fromEntries(Object.entries(u.effect).map(([k,v])=>[k,v*save.upgrades[u.id]])),true)}{u.id === "click" && " · fait évoluer la machine"}</small><small>{save.upgrades[u.id]>=u.max?"Niveau maximum":`Prochain : ${describeEffect(Object.fromEntries(Object.entries(u.effect).map(([k,v])=>[k,v*(save.upgrades[u.id]+1)])))}`}</small></div><button aria-label={`Acheter ${u.name} · ${upgradeCost(u.id,save.upgrades)} éclats`} disabled={!ready || save.energy < upgradeCost(u.id, save.upgrades) || save.upgrades[u.id] >= u.max} onClick={() => onBuy(u.id)}>{save.upgrades[u.id] >= u.max ? "MAX" : `${upgradeCost(u.id, save.upgrades).toLocaleString("fr-FR")} ✦`}</button></div>)}</div>
  </section>;
}
