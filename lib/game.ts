import { byId, CARDS } from "./cards";
import { resolveEffects } from "./effects";
import { initialUpgrades, leveledEffect, UPGRADES, upgradeCost, upgradeEffects, UpgradeId, UpgradeLevels } from "./progression";
import { synergies } from "./synergies";
export type Save = {
  version: 2; energy: number; owned: Record<string, number>; deck: string[];
  level: number; clicks: number; packs: number; pending: string[]; revealed: number;
  upgrades: UpgradeLevels; extraDeckSlots: number;
};
export const initialSave = (): Save => ({
  version: 2, energy: 0, owned: {}, deck: [], level: 0, clicks: 0, packs: 0,
  pending: [], revealed: 0, upgrades: initialUpgrades(), extraDeckSlots: 0,
});
export const BASE_DECK_CAPACITY = 6;
export const deckCapacity = (s: Save) => BASE_DECK_CAPACITY + s.extraDeckSlots;
export function deckEffects(s: Save) {
  return resolveEffects([
    ...s.deck.map(id => leveledEffect(byId(id).effect, s.owned[id] || 1)),
    ...synergies(s.deck).filter(x => x.active).map(x => x.effect),
  ]);
}
export function stats(s: Save) {
  const e = resolveEffects([deckEffects(s), ...upgradeEffects(s.upgrades)]);
  const global = (1 + e.energyMultiplier) * (1 + e.faerieBonus);
  return {
    click: (5 + e.clickFlat) * (1 + e.clickMultiplier) * global,
    auto: e.autoFlat * (1 + e.autoMultiplier) * global,
    crit: Math.min(0.75, 0.05 + e.critChance),
    critMultiplier: 3 + e.critMultiplier,
    discount: Math.min(0.5, e.boosterDiscount),
    comboBonus: e.comboMultiplier,
    rareChance: Math.min(0.75, e.rareChance),
    duplicateBonus: 1 + e.duplicateBonus,
  };
}
export const price = (s: Save) => Math.ceil(100 * (1 - stats(s).discount));
export const upgradePrice = (s: Save) => upgradeCost("click", s.upgrades);
export function buyUpgrade(s: Save, id: UpgradeId): Save {
  const u = UPGRADES.find(u => u.id === id)!;
  const cost = upgradeCost(id, s.upgrades);
  if (s.energy < cost || s.upgrades[id] >= u.max) return s;
  return { ...s, energy: s.energy - cost, level: s.level + (id === "click" ? 1 : 0), upgrades: { ...s.upgrades, [id]: s.upgrades[id] + 1 } };
}
export const RARITY_WEIGHTS = [50, 27, 14, 6, 2.5, 0.5];
export function rarityProbabilities(rareChance = 0, guaranteed = false): number[] {
  const weights = RARITY_WEIGHTS.map((w, i) => guaranteed && i === 0 ? 0 : w * (i >= 2 ? 1 + Math.min(0.75, Math.max(0, rareChance)) : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / total);
}
export function drawPack(random: () => number = Math.random, rareChance = 0): string[] {
  return Array.from({ length: 5 }, (_, slot) => {
    const probabilities = rarityProbabilities(rareChance, slot === 4);
    const allowed = CARDS.filter(c => slot < 4 || c.rarity >= 1);
    let roll = Math.min(1, Math.max(0, random()));
    return (allowed.find(c => (roll -= probabilities[c.rarity] / CARDS.filter(x => x.rarity === c.rarity).length) < 0) || allowed.at(-1)!).id;
  });
}
export function buyPack(s: Save, cards: string[]): Save {
  if (s.pending.length || s.energy < price(s) || cards.length !== 5 || cards.some(id => !byId(id))) return s;
  return { ...s, energy: s.energy - price(s), packs: s.packs + 1, pending: [...cards], revealed: 0 };
}
export function reveal(s: Save): Save {
  if (s.revealed >= s.pending.length) return s;
  const id = s.pending[s.revealed];
  return { ...s, revealed: s.revealed + 1, energy: s.energy + (s.owned[id] ? stats(s).duplicateBonus : 0), owned: { ...s.owned, [id]: (s.owned[id] || 0) + 1 } };
}
export function equipBlockedReason(s: Save, id: string): string | null {
  if (s.deck.includes(id)) return null;
  const card = byId(id);
  if (!card || !s.owned[id]) return "Créature non découverte";
  if (card.evolvesFrom && !s.owned[card.evolvesFrom]) return `Découvrez ${byId(card.evolvesFrom).name} pour équiper cette évolution`;
  if (s.deck.length >= deckCapacity(s)) return "Deck complet : retirez un compagnon";
  return null;
}
export function equip(s: Save, id: string): Save {
  if (equipBlockedReason(s, id)) return s;
  return { ...s, deck: s.deck.includes(id) ? s.deck.filter(x => x !== id) : [...s.deck, id] };
}
export function changeDeck(s: Save, id: string, replaceId?: string): Save {
  const candidate = replaceId && !s.deck.includes(id) && s.deck.includes(replaceId)
    ? { ...s, deck: s.deck.filter(x => x !== replaceId) } : s;
  if (equipBlockedReason(candidate, id)) return s;
  return equip(candidate, id);
}
export function parseSave(raw: string): Save {
  const s = JSON.parse(raw);
  const num = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0;
  if (!s || (s.version !== 1 && s.version !== 2) || !num(s.energy) || !Number.isSafeInteger(s.level) || s.level < 0 || s.level > (s.version === 1 ? 100 : 500) || !num(s.clicks) || !num(s.packs) || !s.owned || typeof s.owned !== "object" || Array.isArray(s.owned) || !Array.isArray(s.deck) || !Array.isArray(s.pending)) throw Error("Sauvegarde invalide ou version non prise en charge");
  const owned: Record<string, number> = {};
  for (const c of CARDS) if (Number.isSafeInteger(s.owned[c.id]) && s.owned[c.id] > 0) owned[c.id] = s.owned[c.id];
  const pending = s.pending;
  if ((pending.length !== 0 && pending.length !== 5) || pending.some((id: unknown) => typeof id !== "string" || !byId(id)) || !Number.isInteger(s.revealed) || s.revealed < 0 || s.revealed > pending.length) throw Error("Booster invalide");
  const upgrades = initialUpgrades();
  if (s.version === 1) upgrades.click = s.level;
  else {
    if (!s.upgrades || !Number.isInteger(s.extraDeckSlots) || s.extraDeckSlots < 0 || s.extraDeckSlots > 2) throw Error("Progression invalide");
    for (const u of UPGRADES) {
      const value = s.upgrades[u.id];
      if (!Number.isInteger(value) || value < 0 || value > u.max) throw Error("Amélioration invalide");
      upgrades[u.id] = value;
    }
  }
  const migrated: Save = { version: 2, energy: s.energy, level: s.level, clicks: s.clicks, packs: s.packs, pending: [...pending], revealed: s.revealed, owned, deck: [], upgrades, extraDeckSlots: s.version === 1 ? 0 : s.extraDeckSlots };
  // Keep already-equipped v1 evolutions: prerequisites apply to future equipment.
  migrated.deck = [...new Set<string>(s.deck.filter((id: unknown) => typeof id === "string" && owned[id]))].slice(0, deckCapacity(migrated));
  return migrated;
}
