import { Effect } from "./effects";
export const CARD_LEVEL_THRESHOLDS = [1, 3, 6, 10, 15] as const;
export const CARD_LEVEL_MULTIPLIERS = [1, 1.2, 1.5, 1.8, 2] as const;
export function cardLevel(copies: number): number {
  return CARD_LEVEL_THRESHOLDS.filter(threshold => copies >= threshold).length;
}
export const CARD_UPGRADE_COSTS = [2, 3, 4, 5] as const;
export function cardUpgradeCost(level: number): number | null {
  return CARD_UPGRADE_COSTS[level - 1] ?? null;
}
export function leveledEffect(effect: Effect, level: number): Effect {
  const scale = CARD_LEVEL_MULTIPLIERS[Math.max(0, Math.min(4, level - 1))];
  return Object.fromEntries(Object.entries(effect).map(([key, value]) => [key, value * scale]));
}
export const UPGRADES = [
  { id: "click", name: "Amplificateur sylvestre", base: 75, growth: 1.17, max: 100, effect: { clickFlat: 1 } },
  { id: "auto", name: "Luciole mécanique", base: 60, growth: 1.2, max: 100, effect: { autoFlat: 1.5 } },
  { id: "critChance", name: "Lentille lunaire", base: 180, growth: 1.35, max: 25, effect: { critChance: 0.01 } },
  { id: "critMultiplier", name: "Prisme de résonance", base: 250, growth: 1.3, max: 30, effect: { critMultiplier: 0.15 } },
  { id: "combo", name: "Cadence du portail", base: 120, growth: 1.3, max: 20, effect: { comboMultiplier: 0.05 } },
  { id: "global", name: "Cœur interdimensionnel", base: 350, growth: 1.4, max: 30, effect: { energyMultiplier: 0.05 } },
  { id: "faerie", name: "Pacte de la clairière", base: 200, growth: 1.32, max: 30, effect: { faerieBonus: 0.04 } },
] as const satisfies readonly { id: string; name: string; base: number; growth: number; max: number; effect: Effect }[];
export type UpgradeId = typeof UPGRADES[number]["id"];
export type UpgradeLevels = Record<UpgradeId, number>;
export const initialUpgrades = (): UpgradeLevels => Object.fromEntries(UPGRADES.map(u => [u.id, 0])) as UpgradeLevels;
export function upgradeCost(id: UpgradeId, levels: UpgradeLevels): number {
  const u = UPGRADES.find(u => u.id === id)!;
  return Math.ceil(u.base * u.growth ** levels[id]);
}
export function upgradeEffects(levels: UpgradeLevels): Effect[] {
  return UPGRADES.map(u => Object.fromEntries(Object.entries(u.effect).map(([key, value]) => [key, value * levels[u.id]])));
}
export const MACHINE_TIERS = [
  { level: 1, name: "Portail naissant" }, { level: 5, name: "Cristaux accordés" },
  { level: 10, name: "Symbiose végétale" }, { level: 20, name: "Runes éveillées" },
  { level: 35, name: "Anneaux dimensionnels" }, { level: 50, name: "Cœur de Faerie" },
] as const;
export function machineTier(level: number) { return MACHINE_TIERS.filter(t => t.level <= level + 1).at(-1)!; }
export type Combo = { charge: number; lastClick: number; updatedAt: number };
export const initialCombo = (): Combo => ({ charge: 0, lastClick: 0, updatedAt: 0 });
export function decayCombo(combo: Combo, now: number): Combo {
  const start = Math.max(combo.updatedAt, combo.lastClick + 2000);
  return { ...combo, charge: Math.max(0, combo.charge - Math.max(0, now - start) / 1000 * 10), updatedAt: now };
}
export function advanceCombo(combo: Combo, now: number): Combo {
  const decayed = decayCombo(combo, now);
  return { charge: Math.min(100, decayed.charge + 4), lastClick: now, updatedAt: now };
}
export function comboFactor(charge: number, bonus: number): number {
  return 1 + Math.min(100, Math.max(0, charge)) / 100 * (bonus>0?Math.min(1,.15+bonus):0);
}
