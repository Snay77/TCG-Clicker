import test from "node:test";
import assert from "node:assert/strict";
import { CARDS, byId } from "../lib/cards";
import { describeEffect, EFFECT_KEYS, resolveEffects } from "../lib/effects";
import { buyPack, buyUpgrade, changeDeck, deckCapacity, deckEffects, drawPack, equip, equipBlockedReason, initialSave, parseSave, price, rarityProbabilities, reveal, stats } from "../lib/game";
import { advanceCombo, cardLevel, CARD_LEVEL_THRESHOLDS, comboFactor, decayCombo, initialCombo, leveledEffect, machineTier, UPGRADES, upgradeCost } from "../lib/progression";
import { BUILD_ARCHETYPES, synergies } from "../lib/synergies";
const ownedSave = () => ({ ...initialSave(), owned: Object.fromEntries(CARDS.map(c => [c.id, 1])) });
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);

test("v1 → v2 conserve énergie, copies, deck, machine et ouverture partielle", () => {
  const legacy = { version: 1, energy: 231.5, owned: { "001": 6, "006": 2, "009": 1 }, deck: ["001", "006", "009"], level: 12, clicks: 456, packs: 7, pending: ["001", "006", "009", "004", "003"], revealed: 3 };
  const migrated = parseSave(JSON.stringify(legacy));
  assert.equal(migrated.version, 2);
  for (const key of ["energy", "owned", "deck", "level", "clicks", "packs", "pending", "revealed"] as const) assert.deepEqual(migrated[key], legacy[key]);
  assert.equal(migrated.upgrades.click, 12);
  assert.equal(migrated.upgrades.auto, 0);
  assert.equal(deckCapacity(migrated), 6);
  assert.deepEqual(parseSave(JSON.stringify(migrated)), migrated);
  assert.equal(reveal(migrated).owned["004"], 1);
  const oldEvolution = parseSave(JSON.stringify({ ...legacy, owned: { "009": 1 }, deck: ["009"] }));
  assert.deepEqual(oldEvolution.deck, ["009"]);
  assert.equal(equip(equip(oldEvolution, "009"), "009").deck.length, 0);
});
test("migration aux limites et données nouvelles invalides refusées", () => {
  assert.equal(parseSave(JSON.stringify({ ...initialSave(), version: 1, level: 100 })).upgrades.click, 100);
  for (const patch of [{ version: 3 }, { upgrades: {} }, { extraDeckSlots: 3 }, { owned: [] }, { level: -1 }]) assert.throws(() => parseSave(JSON.stringify({ ...initialSave(), ...patch })));
  assert.throws(() => parseSave("null"));
});
test("niveaux et effets exacts, seuils configurables, copies jamais consommées", () => {
  assert.equal(cardLevel(0), 0);
  CARD_LEVEL_THRESHOLDS.forEach((threshold, i) => {
    assert.equal(cardLevel(threshold), i + 1);
    assert.equal(cardLevel(threshold - 1), i);
  });
  assert.equal(cardLevel(999), 5);
  [1, 1.2, 1.5, 1.8, 2].forEach((expected, i) => near(leveledEffect(byId("001").effect, CARD_LEVEL_THRESHOLDS[i]).clickFlat!, expected));
  const s = { ...ownedSave(), owned: { "001": 15 }, deck: ["001"] };
  assert.equal(stats(s).click, 7);
  assert.equal(s.owned["001"], 15);
});
test("résolution de tous les effets, cumul et formules multiplicatives", () => {
  const all = Object.fromEntries(EFFECT_KEYS.map(k => [k, 0.1]));
  const resolved = resolveEffects([all, all]);
  for (const key of EFFECT_KEYS) near(resolved[key], 0.2);
  assert.ok(describeEffect(resolved).includes("Faerie"));
  const s = { ...ownedSave(), deck: ["001", "002", "004", "006"] };
  const e = deckEffects(s);
  near(e.clickFlat, 1);
  near(e.autoFlat, 3);
  near(e.autoMultiplier, 0.45);
  near(e.energyMultiplier, 0.1);
  near(stats(s).click, 6 * 1.1);
  near(stats(s).auto, 3 * 1.45 * 1.1);
  assert.equal(price(s), 90);
});
test("synergies actives et proches, pas de double comptage d’une espèce", () => {
  assert.equal(synergies(["001"])[0].active, false);
  assert.equal(synergies(["001", "001"])[0].count, 1);
  assert.equal(synergies(["001", "006"])[0].active, true);
  const s = { ...ownedSave(), deck: ["003", "007"] };
  near(stats(s).crit, 0.2);
  near(stats(s).critMultiplier, 3.8);
  near(stats(equip(s, "007")).crit, 0.1);
});
test("capacité centralisée 6, 7, 8, remplacement atomique et unique", () => {
  for (const extraDeckSlots of [0, 1, 2]) {
    let s = { ...ownedSave(), extraDeckSlots };
    for (const c of CARDS) s = equip(s, c.id);
    assert.equal(s.deck.length, deckCapacity(s));
    assert.equal(s.deck.length, 6 + extraDeckSlots);
    assert.deepEqual(parseSave(JSON.stringify(s)).deck, s.deck);
  }
  let s = ownedSave();
  for (const id of ["001", "002", "003", "004", "005", "006"]) s = equip(s, id);
  const replaced = changeDeck(s, "007", "002");
  assert.equal(replaced.deck.length, 6);
  assert.ok(!replaced.deck.includes("002") && replaced.deck.includes("007"));
  const restricted = { ...s, owned: { ...s.owned, "003": 0 } };
  assert.equal(changeDeck(restricted, "007", "002"), restricted);
});
test("évolutions découvertes indépendamment, parent découvert obligatoire à l’équipement", () => {
  const s = { ...initialSave(), owned: { "009": 1, "007": 1 } };
  assert.equal(equip(s, "009"), s);
  assert.ok(equipBlockedReason(s, "007")?.includes("Lunailée"));
  const discovered = { ...s, owned: { ...s.owned, "006": 1, "003": 1 } };
  assert.ok(equip(discovered, "009").deck.includes("009"));
  assert.ok(equip(discovered, "007").deck.includes("007"));
  assert.equal(discovered.owned["006"], 1);
  for (const c of CARDS) if (c.evolvesTo) assert.equal(byId(c.evolvesTo).evolvesFrom, c.id);
});
test("sept améliorations : coûts croissants, plafonds, débit unique et persistance", () => {
  for (const u of UPGRADES) {
    const s = { ...initialSave(), energy: 1e12 };
    const upgraded = buyUpgrade(s, u.id);
    assert.equal(upgraded.energy, s.energy - upgradeCost(u.id, s.upgrades));
    assert.equal(upgraded.upgrades[u.id], 1);
    assert.equal(upgraded.level, u.id === "click" ? 1 : 0);
    assert.ok(upgradeCost(u.id, upgraded.upgrades) > upgradeCost(u.id, s.upgrades));
    assert.deepEqual(parseSave(JSON.stringify(upgraded)), upgraded);
    const capped = { ...s, upgrades: { ...s.upgrades, [u.id]: u.max } };
    assert.equal(buyUpgrade(capped, u.id), capped);
    assert.equal(buyUpgrade(initialSave(), u.id).upgrades[u.id], 0);
    assert.notDeepEqual(stats(upgraded), stats(s));
  }
});
test("combo borné, délai et décroissance indépendants de la fréquence de ticks", () => {
  let combo = initialCombo();
  for (let i = 0; i < 40; i++) combo = advanceCombo(combo, 1000 + i * 100);
  assert.equal(combo.charge, 100);
  assert.equal(comboFactor(combo.charge, 0), 1.5);
  assert.equal(comboFactor(combo.charge, 10), 2);
  assert.equal(decayCombo(combo, combo.lastClick + 1000).charge, 100);
  near(decayCombo(combo, combo.lastClick + 2000).charge, 82);
  let ticked = combo;
  for (let time = combo.lastClick + 200; time <= combo.lastClick + 4000; time += 200) ticked = decayCombo(ticked, time);
  near(ticked.charge, decayCombo(combo, combo.lastClick + 4000).charge);
  assert.equal(decayCombo(combo, combo.lastClick + 10000).charge, 0);
  assert.equal(comboFactor(-20, 0), 1);
});
test("paliers de machine aux niveaux 1, 5, 10, 20, 35, 50", () => {
  for (const level of [1, 5, 10, 20, 35, 50]) assert.equal(machineTier(level - 1).level, level);
  assert.equal(machineTier(3).level, 1);
  assert.equal(machineTier(48).level, 35);
});
test("doublon positif dès la 2e copie, gain et niveau appliqués une seule fois", () => {
  let s = buyPack({ ...initialSave(), energy: 100, owned: { "001": 1 }, deck: ["001"] }, Array(5).fill("001"));
  s = reveal(s);
  assert.equal(s.energy, 1);
  assert.equal(cardLevel(s.owned["001"]), 1);
  s = reveal(s);
  near(stats(s).click, 6.2);
  for (let i = 0; i < 5; i++) s = reveal(s);
  assert.equal(s.owned["001"], 6);
  assert.equal(s.energy, 5);
  assert.equal(reveal(s), s);
  const collection = { ...ownedSave(), deck: ["006", "007", "009"] };
  assert.equal(stats(collection).duplicateBonus, 9);
});
test("probabilités normalisées, bonus Rare+ plafonné et cinquième garantie", () => {
  for (const guaranteed of [false, true]) {
    const base = rarityProbabilities(0, guaranteed);
    const boosted = rarityProbabilities(0.75, guaranteed);
    near(boosted.reduce((a, b) => a + b, 0), 1);
    assert.ok(boosted.slice(2).reduce((a, b) => a + b) > base.slice(2).reduce((a, b) => a + b));
    assert.deepEqual(rarityProbabilities(100, guaranteed), boosted);
    if (guaranteed) assert.equal(boosted[0], 0);
  }
  for (const value of [0, 0.1, 0.6, 0.999, 1]) {
    const pack = drawPack(() => value, 0.75);
    assert.equal(pack.length, 5);
    assert.ok(pack.every(id => !!byId(id)));
    assert.ok(byId(pack[4]).rarity >= 1);
  }
  const s = { ...initialSave(), energy: 100 };
  assert.equal(buyPack(s, ["001"]), s);
});
test("trois builds distincts jouables avec neuf cartes, spécialités effectives", () => {
  const builds = BUILD_ARCHETYPES.map(b => ({ ...ownedSave(), deck: [...b.ids] }));
  assert.equal(new Set(builds.map(s => s.deck.join())).size, 3);
  builds.forEach(s => {
    assert.equal(s.deck.length, deckCapacity(s));
    s.deck.forEach(id => assert.equal(equipBlockedReason(s, id), null));
  });
  const [click, idle, collection] = builds.map(stats);
  assert.ok(click.click > idle.click && click.crit > idle.crit);
  assert.ok(idle.auto > click.auto && idle.auto > collection.auto);
  assert.ok(collection.discount > 0 && collection.rareChance > 0);
  assert.ok(collection.duplicateBonus > idle.duplicateBonus);
});
