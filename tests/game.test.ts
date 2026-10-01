import test from "node:test";
import assert from "node:assert/strict";
import { CARDS, byId } from "../lib/cards";
import {
  buyPack,
  drawPack,
  equip,
  initialSave,
  parseSave,
  price,
  reveal,
  stats,
} from "../lib/game";
import { spritePixels, SPRITE_SIZE } from "../lib/sprites";
test("un achat débite une seule fois et révèle exactement cinq cartes", () => {
  const ids = ["001", "001", "003", "008", "009"];
  const start = { ...initialSave(), energy: 100 };
  let s = buyPack(start, ids);
  assert.equal(s.energy, 0);
  assert.equal(s.packs, 1);
  assert.deepEqual(s.owned, {});
  assert.equal(buyPack(s, ids), s);
  s = reveal(s);
  s = parseSave(JSON.stringify(s));
  for (let i = 0; i < 8; i++) s = reveal(s);
  assert.equal(s.revealed, 5);
  assert.equal(
    Object.values(s.owned).reduce((a, b) => a + b, 0),
    5,
  );
  assert.equal(s.owned["001"], 2);
  assert.equal(buyPack(initialSave(), ids).packs, 0);
});
test("deck limité, possession obligatoire et effets réversibles", () => {
  let s = initialSave();
  assert.equal(equip(s, "009"), s);
  s.owned = Object.fromEntries(CARDS.map((c) => [c.id, 1]));
  for (const c of CARDS) s = equip(s, c.id);
  assert.equal(s.deck.length, 6);
  assert.equal(stats(s).click, 10);
  assert.equal(stats(s).auto, 3);
  assert.equal(price(s), 90);
  s = equip(s, "006");
  assert.equal(price(s), 100);
  s = equip(s, "009");
  assert.equal(stats(s).auto, 18);
  s = equip(s, "009");
  assert.equal(stats(s).auto, 3);
});
test("chaque booster garantit une peu commune ou mieux en cinquième position", () => {
  let seed = 41;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const seen = new Set<number>();
  for (let i = 0; i < 2000; i++) {
    const pack = drawPack(random);
    assert.equal(pack.length, 5);
    assert.ok(byId(pack[4]).rarity >= 1);
    pack.forEach((id) => seen.add(byId(id).rarity));
  }
  assert.equal(seen.size, 6);
});
test("sprites déterministes, distincts et bornés à la grille", () => {
  const signatures = new Set();
  for (const c of CARDS) {
    const a = spritePixels(c);
    assert.deepEqual(a, spritePixels(c));
    assert.ok(
      a.every(
        (p) => p.x >= 0 && p.x < SPRITE_SIZE && p.y >= 0 && p.y < SPRITE_SIZE,
      ),
    );
    signatures.add(JSON.stringify(a));
  }
  assert.equal(signatures.size, CARDS.length);
});
test("sauvegardes invalides refusées et deck nettoyé", () => {
  assert.throws(() => parseSave("{"));
  assert.throws(() =>
    parseSave(JSON.stringify({ ...initialSave(), energy: -1 })),
  );
  assert.throws(() =>
    parseSave(JSON.stringify({ ...initialSave(), pending: ["bad"] })),
  );
  const s = parseSave(
    JSON.stringify({
      ...initialSave(),
      owned: { "001": 2 },
      deck: ["001", "001", "009", "bad"],
    }),
  );
  assert.deepEqual(s.deck, ["001"]);
});
