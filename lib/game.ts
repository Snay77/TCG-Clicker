import { byId, CARDS } from "./cards";
export type Save = {
  version: 1;
  energy: number;
  owned: Record<string, number>;
  deck: string[];
  level: number;
  clicks: number;
  packs: number;
  pending: string[];
  revealed: number;
};
export const initialSave = (): Save => ({
  version: 1,
  energy: 0,
  owned: {},
  deck: [],
  level: 0,
  clicks: 0,
  packs: 0,
  pending: [],
  revealed: 0,
});
export function stats(s: Save) {
  return s.deck.reduce(
    (a, id) => {
      const e = byId(id).effect;
      return {
        click: a.click + (e.click || 0),
        auto: a.auto + (e.auto || 0),
        crit: Math.min(0.75, a.crit + (e.crit || 0)),
        discount: Math.min(0.5, a.discount + (e.discount || 0)),
      };
    },
    { click: 5 + s.level * 2, auto: 0, crit: 0.05, discount: 0 },
  );
}
export const price = (s: Save) => Math.ceil(100 * (1 - stats(s).discount));
export const upgradePrice = (s: Save) => 75 * (s.level + 1) ** 2;
export function drawPack(random: () => number = Math.random): string[] {
  const weights = [50, 27, 14, 6, 2.5, 0.5];
  return Array.from({ length: 5 }, (_, slot) => {
    const allowed = CARDS.filter((c) => slot < 4 || c.rarity >= 1);
    const total = allowed.reduce(
      (n, c) =>
        n +
        weights[c.rarity] / CARDS.filter((x) => x.rarity === c.rarity).length,
      0,
    );
    let roll = random() * total;
    return (
      allowed.find(
        (c) =>
          (roll -=
            weights[c.rarity] /
            CARDS.filter((x) => x.rarity === c.rarity).length) < 0,
      ) || allowed.at(-1)!
    ).id;
  });
}
export function buyPack(s: Save, cards: string[]): Save {
  if (s.pending.length || s.energy < price(s)) return s;
  return {
    ...s,
    energy: s.energy - price(s),
    packs: s.packs + 1,
    pending: cards,
    revealed: 0,
  };
}
export function reveal(s: Save): Save {
  if (s.revealed >= s.pending.length) return s;
  const id = s.pending[s.revealed];
  return {
    ...s,
    revealed: s.revealed + 1,
    owned: { ...s.owned, [id]: (s.owned[id] || 0) + 1 },
  };
}
export function equip(s: Save, id: string): Save {
  if (!s.owned[id]) return s;
  return {
    ...s,
    deck: s.deck.includes(id)
      ? s.deck.filter((x) => x !== id)
      : s.deck.length < 6
        ? [...s.deck, id]
        : s.deck,
  };
}
export function parseSave(raw: string): Save {
  const s = JSON.parse(raw);
  const num = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) && n >= 0;
  if (
    s.version !== 1 ||
    !num(s.energy) ||
    !Number.isInteger(s.level) ||
    s.level < 0 ||
    s.level > 100 ||
    !num(s.clicks) ||
    !num(s.packs) ||
    !s.owned ||
    typeof s.owned !== "object" ||
    !Array.isArray(s.deck) ||
    !Array.isArray(s.pending)
  )
    throw Error("Sauvegarde invalide");
  const owned: Record<string, number> = {};
  for (const c of CARDS)
    if (Number.isSafeInteger(s.owned[c.id]) && s.owned[c.id] > 0)
      owned[c.id] = s.owned[c.id];
  const pending = s.pending;
  if (
    (pending.length !== 0 && pending.length !== 5) ||
    pending.some((id: unknown) => !CARDS.some((c) => c.id === id)) ||
    !Number.isInteger(s.revealed) ||
    s.revealed < 0 ||
    s.revealed > pending.length
  )
    throw Error("Booster invalide");
  return {
    ...s,
    owned,
    deck: [...new Set<string>(s.deck.filter((id: string) => owned[id]))].slice(
      0,
      6,
    ),
  };
}
