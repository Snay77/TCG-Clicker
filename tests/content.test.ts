import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CARDS } from "../lib/cards";
import { drawPack, initialSave, stats } from "../lib/game";
import { ANATOMIES, HABITATS, TYPES, type CardDesign } from "../lib/content/model";
import { ROSTER, LINEAGES, SAMPLE, validateRoster, describeCondition } from "../lib/content/roster";
import { CONTENT_PARTS, contentPixels, contentPaths, IMPLEMENTED_ANATOMIES, usedContentPalette } from "../lib/content/directed-sprites";
import { habitatDetails, HABITAT_PROFILES } from "../lib/content/habitats";
import { buildRosterDocumentation, ROSTER_DOC_START, ROSTER_DOC_END } from "../lib/content/documentation";

test("roster : 60 fiches complètes et répartition exacte, 12×3 + 8×2 + 8", () => {
  assert.deepEqual(validateRoster(),[]);
  assert.equal(ROSTER.length,60);
  assert.deepEqual(Array.from({length:6},(_,i)=>ROSTER.filter(c=>c.rarity===i).length),[24,14,10,6,4,2]);
  assert.equal(LINEAGES.length,20);
  assert.equal(new Set(ROSTER.map(c=>c.seed)).size,60);
  const malformed=structuredClone(ROSTER);
  malformed[1].evolvesFrom=null;
  assert.ok(validateRoster(malformed).some(e=>e.includes("relation")));
});
test("échantillon : 12 rendus, tous les types, deux lignées complètes et les deux Mythiques", () => {
  assert.equal(SAMPLE.length,12);
  assert.equal(new Set(SAMPLE.map(c=>c.type)).size,TYPES.length);
  assert.ok(LINEAGES.some(l=>l.cardIds.length===3&&l.cardIds.every(id=>SAMPLE.some(c=>c.id===id))));
  assert.ok(LINEAGES.some(l=>l.cardIds.length===2&&l.cardIds.every(id=>SAMPLE.some(c=>c.id===id))));
  assert.ok(SAMPLE.some(c=>!c.lineage));
  for(const rarity of [3,4,5])assert.ok(SAMPLE.some(c=>c.rarity===rarity));
  assert.equal(SAMPLE.filter(c=>c.rarity===5).length,2);
  assert.ok(Object.keys(ANATOMIES).length>=12);
  assert.equal(new Set(ROSTER.map(c=>c.anatomy)).size,IMPLEMENTED_ANATOMIES.length);
  assert.ok(ROSTER.every(c=>!!c.sprite));
});
test("60 silhouettes distinctes et pixels bornés, palette exacte et SVG compact", () => {
  const silhouettes=new Set<string>();
  for(const c of ROSTER){
    const pixels=contentPixels(c);
    assert.ok(pixels.length>250,`${c.name} : dessin incomplet`);
    assert.ok(pixels.every(p=>Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.x<64&&p.y>=0&&p.y<64));
    assert.equal(new Set(pixels.map(p=>`${p.x},${p.y}`)).size,pixels.length);
    const palette=usedContentPalette(c);
    assert.ok(pixels.every(p=>palette.includes(p.color)));
    assert.ok(contentPaths(c).length<90);
    assert.deepEqual(contentPaths(c),contentPaths(c));
    silhouettes.add(pixels.map(p=>`${p.x},${p.y}`).sort().join(";"));
  }
  assert.equal(silhouettes.size,60);
});
test("seed secondaire : identité, silhouette et composants fixes conservés", () => {
  for(const c of ROSTER){
    const a=contentPixels(c), b=contentPixels(c,c.seed+13);
    assert.deepEqual(a,contentPixels(c));
    assert.ok(JSON.stringify(a)!==JSON.stringify(b),`${c.name} : aucune marque secondaire`);
    assert.deepEqual(a.map(p=>[p.x,p.y,p.part]),b.map(p=>[p.x,p.y,p.part]));
    for(const part of ["head","ears","crown","face","accessory"]){
      assert.deepEqual(a.filter(p=>p.part===part),b.filter(p=>p.part===part));
    }
  }
});
test("composants dirigés réels et rejet des anatomies non produites", () => {
  const rabbit=SAMPLE.find(c=>c.anatomy==="rabbit")!;
  const noEars:CardDesign={...rabbit,sprite:{...rabbit.sprite!,ears:"none"}};
  assert.ok(contentPixels(rabbit).some(p=>p.part==="ears"));
  assert.ok(!contentPixels(noEars).some(p=>p.part==="ears"));
  const moth=SAMPLE.find(c=>c.anatomy==="moth")!;
  const noWings:CardDesign={...moth,sprite:{...moth.sprite!,wings:"none"}};
  assert.ok(contentPixels(noWings).length<contentPixels(moth).length);
  const longHead:CardDesign={...moth,sprite:{...moth.sprite!,headVariant:"long"}};
  assert.notDeepEqual(contentPixels(longHead).filter(p=>p.part==="head"),contentPixels(moth).filter(p=>p.part==="head"));
  assert.throws(()=>contentPixels({...moth,sprite:{...moth.sprite!,bodyVariant:"unknown"}}),/variante non produite/);
  for(const c of ROSTER.filter(c=>!c.sprite))assert.throws(()=>contentPixels(c),/non produite/);
  assert.deepEqual(CONTENT_PARTS,["tail","wings","body","head","ears","crown","face","accessory","aura"]);
});
test("signatures des 4 Légendaires et 2 Mythiques, silhouettes et idle distincts", () => {
  const special=ROSTER.filter(c=>c.rarity>=4);
  assert.equal(special.length,6);
  assert.equal(new Set(special.map(c=>c.silhouette)).size,6);
  assert.equal(new Set(special.map(c=>c.sprite!.idle)).size,6);
  special.forEach(c=>assert.ok(c.signature?.composition&&c.signature.idle&&c.signature.habitatDetail&&c.signature.aura&&c.signature.narrative));
  const mythics=SAMPLE.filter(c=>c.rarity===5);
  assert.equal(new Set(mythics.map(c=>c.anatomy)).size,2);
  assert.equal(new Set(mythics.map(c=>c.sprite!.idle)).size,2);
  assert.ok(mythics.every(c=>c.anatomy!=="dragon"));
});
test("16 habitats cohérents et variations secondaires déterministes", () => {
  assert.equal(Object.keys(HABITATS).length,16);
  assert.equal(Object.keys(HABITAT_PROFILES).length,16);
  assert.equal(new Set(Object.values(HABITAT_PROFILES).map(p=>JSON.stringify(p))).size,16);
  for(const c of ROSTER){
    assert.ok(HABITAT_PROFILES[c.habitat]);
    assert.deepEqual(habitatDetails(c.habitat,c.seed),habitatDetails(c.habitat,c.seed));
    assert.notDeepEqual(habitatDetails(c.habitat,c.seed),habitatDetails(c.habitat,c.seed+1));
  }
});
test("six familles de capacités futures déclaratives, sans activation du gameplay", () => {
  const conditions=ROSTER.flatMap(c=>c.conditions);
  assert.equal(new Set(conditions.map(c=>c.kind)).size,6);
  assert.ok(conditions.every(c=>describeCondition(c).length>15));
  assert.equal(CARDS.length,60);
  assert.equal(CARDS.filter(c=>c.id.startsWith("F01-")).length,51);
  for(let i=0;i<30;i++)assert.ok(drawPack().every(id=>CARDS.some(c=>c.id===id)));
  assert.deepEqual(stats(initialSave()),{click:1,auto:0,crit:0,critMultiplier:3,discount:0,comboBonus:0,rareChance:0,duplicateBonus:1});
});
test("document de référence identique aux données de design", () => {
  const source=readFileSync("SET_01_FAERIE.md","utf8").replace(/\r\n/g,"\n");
  const start=source.indexOf(ROSTER_DOC_START), end=source.indexOf(ROSTER_DOC_END)+ROSTER_DOC_END.length;
  assert.ok(start>=0);
  assert.equal(source.slice(start,end),buildRosterDocumentation());
  assert.equal((source.match(/#### F01-\d{3} —/g)||[]).length,60);
});
