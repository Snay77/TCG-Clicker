import { Save } from "../../lib/game";
import { describeEffect } from "../../lib/effects";
import { MACHINE_TIERS, machineTier, UPGRADES, upgradeCost, UpgradeId } from "../../lib/progression";
export default function UpgradesView({ save, ready, onBuy }: { save: Save; ready: boolean; onBuy: (id: UpgradeId) => void }) {
  const next = MACHINE_TIERS.find(t => t.level > save.level + 1);
  return <section className="upgrades-panel"><div className="section-title"><div><h2>Atelier de progression</h2><p>Machine niv. {save.level + 1} · {machineTier(save.level).name}{next && ` · prochain palier : ${next.name} au niv. ${next.level}`}</p></div></div>
    <div className="upgrade-grid">{UPGRADES.map(u => <div className="upgrade-item" key={u.id}><div><strong>{u.name}</strong><small>Niv. {save.upgrades[u.id]} / {u.max} · {describeEffect(u.effect)} par niveau{u.id === "click" && " · fait évoluer la machine"}</small></div><button disabled={!ready || save.energy < upgradeCost(u.id, save.upgrades) || save.upgrades[u.id] >= u.max} onClick={() => onBuy(u.id)}>{save.upgrades[u.id] >= u.max ? "MAX" : `${upgradeCost(u.id, save.upgrades).toLocaleString("fr-FR")} ✦`}</button></div>)}</div>
  </section>;
}
