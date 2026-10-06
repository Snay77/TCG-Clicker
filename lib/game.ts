import { boundedTotal } from './numbers';
import { initialFreePacks, rechargeFreePacks, progressivePackPrice, storageCost, MAX_FREE_CAPACITY, type FreePackState } from "./booster-economy";
import { byId, CARDS } from "./cards";
import { resolveEffects } from "./effects";
import { cardLevel, cardUpgradeCost, initialUpgrades, leveledEffect, UPGRADES, upgradeCost, upgradeEffects, UpgradeId, UpgradeLevels } from "./progression";
import { synergies, advancedSynergies } from "./synergies";
import { initialAccount, parseAccount, explorationLevel, freePackCount, XP, type Account } from "./exploration";
import { initialUX, parseUX, type UX } from './ux';
import { advancedBonuses, advancedDuplicateBonus, parseAdvancedProgress, type AdvancedContext } from './advanced-effects';
export type PackSource = "free" | "paid";
export type Save = FreePackState & {
  advancedClicks?:Record<string,number>;
  account: Account;
  ux: UX;
  version: 4; energy: number; owned: Record<string, number>; cardLevels: Record<string, number>; deck: string[];
  level: number; clicks: number; packs: number; pending: string[]; revealed: number;
  upgrades: UpgradeLevels; extraDeckSlots: number;
  paidBoostersPurchased: number; pendingSource: PackSource | null;
};
export const initialSave = (now = Date.now()): Save => ({
  ux: initialUX(), account: initialAccount(), version: 4, energy: 0, owned: {}, cardLevels: {}, deck: [], level: 0, clicks: 0, packs: 0,
  pending: [], revealed: 0, upgrades: initialUpgrades(), extraDeckSlots: 0,
  ...initialFreePacks(now), paidBoostersPurchased: 0, pendingSource: null,
});
export const BASE_DECK_CAPACITY = 6;
export const deckCapacity = (s: Save) => BASE_DECK_CAPACITY + s.extraDeckSlots;
export const savedCardLevel = (s: Save, id: string) => s.owned[id] ? s.cardLevels[id] || 1 : 0;
export function upgradeCard(s: Save, id: string): Save {
  if (!byId(id) || !s.owned[id] || s.pending.length) return s;
  const level = savedCardLevel(s, id), cost = cardUpgradeCost(level);
  if (cost === null || s.owned[id] - 1 < cost) return s;
  return { ...s, owned: { ...s.owned, [id]: s.owned[id] - cost },
    cardLevels: { ...s.cardLevels, [id]: level + 1 },
    account: { ...s.account, xp: boundedTotal(s.account.xp + XP.cardLevel * (level + 1)) } };
}
export function deckEffects(s: Save, context:AdvancedContext={}) {
  return resolveEffects([
    ...s.deck.map(id => leveledEffect(byId(id).effect, savedCardLevel(s, id))),
    ...synergies(s.deck).filter(x => x.active).map(x => x.effect),
    ...advancedSynergies(s.deck, explorationLevel(s.account.xp)).filter(x => x.active).map(x => x.effect),
    advancedBonuses(s,context),
  ]);
}
export function stats(s: Save, context:AdvancedContext={}) {
  const e = resolveEffects([deckEffects(s,context), ...upgradeEffects(s.upgrades)]);
  const global = (1 + e.energyMultiplier) * (1 + e.faerieBonus);
  return {
    click: (1 + e.clickFlat) * (1 + e.clickMultiplier) * global,
    auto: e.autoFlat * (1 + e.autoMultiplier) * global,
    crit: Math.min(0.75, e.critChance),
    critMultiplier: 3 + e.critMultiplier,
    discount: Math.min(0.5, e.boosterDiscount),
    comboBonus: e.comboMultiplier,
    rareChance: Math.min(0.75, e.rareChance),
    duplicateBonus: 1 + e.duplicateBonus,
  };
}
export const price = (s: Save) => progressivePackPrice(s.paidBoostersPurchased, stats(s).discount);
export const upgradePrice = (s: Save) => upgradeCost("click", s.upgrades);
export function buyUpgrade(s: Save, id: UpgradeId): Save {
  const u = UPGRADES.find(u => u.id === id)!;
  const cost = upgradeCost(id, s.upgrades);
  if (s.energy < cost || s.upgrades[id] >= u.max) return s;
  return { ...s, energy: s.energy - cost, level: s.level + (id === "click" ? 1 : 0), upgrades: { ...s.upgrades, [id]: s.upgrades[id] + 1 }, account: { ...s.account, xp: boundedTotal(s.account.xp + XP.upgrade) } };
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
export function buyPack(s: Save, cards: string[], now = Date.now()): Save {
  return openPack(s, cards, "paid", now);
}
export function openPack(s: Save, cards: string[], source: PackSource, now = Date.now()): Save {
  if (s.pending.length || cards.length !== 5 || cards.some(id => !byId(id))) return s;
  const current = rechargeFreePacks(s, now);
  if (source === "free" ? freePackCount(current) < 1 : current.energy < price(current)) return s;
  const full = current.freeBoosters === current.freeBoosterCapacity;
  const useReward = source === "free" && current.account.rewardBoosters > 0;
  return {...current,energy:current.energy-(source === "paid" ? price(current) : 0),
    freeBoosters:current.freeBoosters-(source === "free" && !useReward ? 1 : 0),
    freeBoosterTimerStartedAt:source === "free" && !useReward && full ? now : current.freeBoosterTimerStartedAt,
    paidBoostersPurchased:boundedTotal(current.paidBoostersPurchased+(source === "paid" ? 1 : 0)),
    account:{...current.account,xp:boundedTotal(current.account.xp+XP.booster),rewardBoosters:current.account.rewardBoosters-(useReward?1:0),totals:{...current.account.totals,freeOpened:boundedTotal(current.account.totals.freeOpened+(source==="free"?1:0))}},
    packs:boundedTotal(current.packs+1),pending:[...cards],revealed:0,pendingSource:source};
}
export function finishPack(s: Save): Save {
  return s.pending.length && s.revealed === 5 ? {...s,pending:[],revealed:0,pendingSource:null}:s;
}
export function chainPack(s: Save, cards: string[], source: PackSource, now = Date.now()): Save {
  if (s.pending.length !== 5 || s.revealed !== 5) return s;
  const closed=finishPack(s), next=openPack(closed,cards,source,now);
  return next===closed?s:next;
}
export function buyStorage(s: Save, now = Date.now()): Save {
  const cost=storageCost(s);
  if (cost === null || s.freeBoosterCapacity >= MAX_FREE_CAPACITY || s.energy < cost) return s;
  const current=rechargeFreePacks(s,now);
  return {...current,energy:current.energy-cost,freeBoosterCapacity:current.freeBoosterCapacity+1,
    freeBoosterTimerStartedAt:current.freeBoosters===current.freeBoosterCapacity?now:current.freeBoosterTimerStartedAt};
}
export function reveal(s: Save): Save {
  if (s.revealed >= s.pending.length) return s;
  const id = s.pending[s.revealed];
  const duplicate = !!s.owned[id];
  return { ...s, revealed: s.revealed + 1, energy: boundedTotal(s.energy + (duplicate ? stats(s).duplicateBonus + advancedDuplicateBonus(s,id) : 0)), owned: { ...s.owned, [id]: boundedTotal((s.owned[id] || 0) + 1) },
    account: { ...s.account, xp: boundedTotal(s.account.xp + (duplicate ? 0 : XP.discovery) + (byId(id).rarity >= 2 ? XP.rare : 0)),
      totals: { ...s.account.totals, cardsObtained:boundedTotal(s.account.totals.cardsObtained+1), duplicatesObtained:boundedTotal(s.account.totals.duplicatesObtained+(duplicate?1:0)) } } };

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
  const deck=s.deck.includes(id)?s.deck.filter(x=>x!==id):[...s.deck,id];
  return { ...s, deck, advancedClicks:Object.fromEntries(Object.entries(s.advancedClicks||{}).filter(([cid])=>deck.includes(cid))) };
}
export function changeDeck(s: Save, id: string, replaceId?: string): Save {
  const candidate = replaceId && !s.deck.includes(id) && s.deck.includes(replaceId)
    ? { ...s, deck: s.deck.filter(x => x !== replaceId),advancedClicks:Object.fromEntries(Object.entries(s.advancedClicks||{}).filter(([cid])=>cid!==replaceId)) } : s;
  if (equipBlockedReason(candidate, id)) return s;
  return equip(candidate, id);
}
export function parseSave(raw: string, now = Date.now()): Save {
  const s = JSON.parse(raw);
  const num = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0;
  if (!s || (s.version !== 1 && s.version !== 2 && s.version !== 3 && s.version !== 4) || !num(s.energy) || !Number.isSafeInteger(s.level) || s.level < 0 || s.level > (s.version === 1 ? 100 : 500) || !Number.isSafeInteger(s.clicks) || s.clicks < 0 || !Number.isSafeInteger(s.packs) || s.packs < 0 || !s.owned || typeof s.owned !== "object" || Array.isArray(s.owned) || !Array.isArray(s.deck) || !Array.isArray(s.pending)) throw Error("Sauvegarde invalide ou version non prise en charge");
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
  const migrated: Save = { ux:initialUX(), account:initialAccount(), version: 4, cardLevels: {}, energy: s.energy, level: s.level, clicks: s.clicks, packs: s.packs, pending: [...pending], revealed: s.revealed, owned, deck: [], upgrades, extraDeckSlots: s.version === 1 ? 0 : s.extraDeckSlots, ...initialFreePacks(now), paidBoostersPurchased: Math.floor(s.packs), pendingSource:pending.length?"paid":null };
  if (s.version >= 3) {
    const capacity=s.freeBoosterCapacity,count=s.freeBoosters,timer=s.freeBoosterTimerStartedAt;
    if (!Number.isInteger(capacity)||capacity<2||capacity>10||!Number.isInteger(count)||count<0||count>capacity
      || (timer!==null&&(!Number.isSafeInteger(timer)||timer<0)) || (count<capacity&&timer===null)
      || (count===capacity&&timer!==null) || !Number.isSafeInteger(s.paidBoostersPurchased)||s.paidBoostersPurchased<0
      || s.paidBoostersPurchased>s.packs || (pending.length ? !["free","paid"].includes(s.pendingSource) : s.pendingSource!==null)) throw Error("Économie booster invalide");
    Object.assign(migrated,{freeBoosters:count,freeBoosterCapacity:capacity,freeBoosterTimerStartedAt:timer,paidBoostersPurchased:s.paidBoostersPurchased,pendingSource:s.pendingSource});
  }
  if (s.version === 4) {
    if (!s.cardLevels || typeof s.cardLevels !== "object" || Array.isArray(s.cardLevels)) throw Error("Niveaux de carte invalides");
    for (const [id, level] of Object.entries(s.cardLevels)) {
      if (!byId(id) || !owned[id] || !Number.isInteger(level) || (level as number) < 1 || (level as number) > 5) throw Error("Niveau de carte invalide");
      migrated.cardLevels[id] = level as number;
    }
  } else {
    // Preserve earned levels and copies; upgrades now spend only future duplicates.
    for (const [id, copies] of Object.entries(owned)) migrated.cardLevels[id] = cardLevel(copies);
  }
  // Keep already-equipped v1 evolutions: prerequisites apply to future equipment.
  migrated.deck = [...new Set<string>(s.deck.filter((id: unknown) => typeof id === "string" && owned[id]))].slice(0, deckCapacity(migrated));
  if(s.advancedClicks!==undefined)migrated.advancedClicks=parseAdvancedProgress(s.advancedClicks,migrated);
  migrated.account = parseAccount(s.version===4?s.account:undefined,migrated);
  migrated.ux = parseUX(s.ux,migrated);
  return rechargeFreePacks(migrated,now);
}
