import test from "node:test";
import assert from "node:assert/strict";
import { CARDS } from "../lib/legacy-cards";
import { spritePixels, spritePaths, usedSpritePalette } from "../lib/sprites";
import { atmosphere, REVEAL_TIMINGS } from "../lib/visuals";

test("les neuf créatures ont des silhouettes distinctes, même sans couleur", () => {
  const silhouettes = CARDS.map((c) =>
    spritePixels(c)
      .map((p) => `${p.x},${p.y}`)
      .sort()
      .join(";"),
  );
  assert.equal(new Set(silhouettes).size, 9);
});
test("les détails du seed préservent la silhouette et la palette affichée couvre chaque pixel", () => {
  for (const c of CARDS) {
    const a = spritePixels(c, c.seed),
      b = spritePixels(c, c.seed + 12);
    assert.notDeepEqual(a, b);
    assert.deepEqual(
      a.map((p) => [p.x, p.y]),
      b.map((p) => [p.x, p.y]),
    );
    const palette = usedSpritePalette(c);
    assert.ok(a.every((p) => palette.includes(p.color)));
    assert.deepEqual(spritePaths(c), spritePaths(c));
    assert.ok(spritePaths(c).length < 80, "SVG compact par couleur et partie");
  }
});
test("atmosphère déterministe et suspense progressivement plus long", () => {
  assert.deepEqual(atmosphere(97), atmosphere(97));
  assert.notDeepEqual(atmosphere(97), atmosphere(98));
  assert.ok(REVEAL_TIMINGS[2] >= 1000);
  assert.ok(REVEAL_TIMINGS.slice(1).every((v, i) => v > REVEAL_TIMINGS[i]));
});
