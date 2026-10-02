export const EFFECT_KEYS = ["clickFlat", "clickMultiplier", "autoFlat", "autoMultiplier", "critChance", "critMultiplier", "boosterDiscount", "comboMultiplier", "faerieBonus", "rareChance", "duplicateBonus", "energyMultiplier"] as const;
export type EffectKey = typeof EFFECT_KEYS[number];
export type Effect = Partial<Record<EffectKey, number>>;
export type ResolvedEffects = Record<EffectKey, number>;
// All percentage multipliers are additive bonuses (0.1 means +10%).
export function resolveEffects(effects: Effect[]): ResolvedEffects {
  const result = Object.fromEntries(EFFECT_KEYS.map(key => [key, 0])) as ResolvedEffects;
  for (const effect of effects) for (const key of EFFECT_KEYS) result[key] += effect[key] ?? 0;
  return result;
}
const labels: Record<EffectKey, string> = {
  clickFlat: "/ clic", clickMultiplier: "% clic", autoFlat: "/ sec", autoMultiplier: "% passif",
  critChance: "points critique", critMultiplier: "multiplicateur critique", boosterDiscount: "% réduction booster",
  comboMultiplier: "% combo", faerieBonus: "% énergie Faerie", rareChance: "% poids Rare+",
  duplicateBonus: "éclats / doublon", energyMultiplier: "% énergie globale",
};
export function describeEffect(effect: Effect, includeZero = false): string {
  return EFFECT_KEYS.filter(key => includeZero ? effect[key] !== undefined : effect[key]).map(key => {
    const value = effect[key]!;
    const percentage = !["clickFlat", "autoFlat", "critMultiplier", "duplicateBonus"].includes(key);
    return `+${Number((value * (percentage ? 100 : 1)).toFixed(2))} ${labels[key]}`;
  }).join(" · ");
}
