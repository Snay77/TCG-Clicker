import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import reference from '../design/phase45-reference.json';
import {CARDS,LEGACY_DESIGN_IDS,byId,runtimeId} from '../lib/cards';
import {ROSTER,SAMPLE,LINEAGES} from '../lib/content/roster';
import {contentPixels} from '../lib/content/directed-sprites';
import {initialSave,parseSave,drawPack,equip,stats,reveal} from '../lib/game';
import {SYNERGIES,synergies,BUILD_ARCHETYPES} from '../lib/synergies';
import {TYPES} from '../lib/content/model';

test('les douze recettes et pixels validés sont conservés exactement',()=>{
 assert.equal(reference.length,12);
 for(const c of SAMPLE){const frozen=reference.find(x=>x.id===c.id)!;assert.deepEqual(c.sprite,frozen.recipe);assert.equal(createHash('sha256').update(JSON.stringify(contentPixels(c))).digest('hex'),frozen.hash,c.name);}
});
test('bijection runtime/design, numéros du classeur et cinquante-deux relations',()=>{
 assert.equal(CARDS.length,60);assert.equal(new Set(CARDS.map(c=>c.id)).size,60);
 for(const c of CARDS){assert.equal(c.id,runtimeId(c.design!.id));assert.equal(c.number,c.design!.number);assert.equal(c.effect,c.design!.plannedEffects);assert.ok(TYPES.includes(c.type as typeof TYPES[number]));if(c.evolvesTo)assert.equal(byId(c.evolvesTo).evolvesFrom,c.id);}
 for(const [id,design] of Object.entries(LEGACY_DESIGN_IDS))assert.equal(byId(id).design!.id,design);
 assert.equal(ROSTER.filter(c=>c.status==='produced').length,48);assert.equal(LINEAGES.flatMap(l=>l.cardIds).length,52);
});
test('pool complet accessible, cinq cartes et cinquième Peu commune+',()=>{
 let seed=128;const random=()=>(seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;const seen=new Set();
 for(let i=0;i<6000;i++){const pack=drawPack(random);assert.equal(pack.length,5);assert.ok(byId(pack[4]).rarity>=1);pack.forEach(id=>seen.add(id));}
 assert.equal(seen.size,60);
});
test('ancienne sauvegarde v2 et booster partiel restent intacts',()=>{
 const old={...initialSave(),version:2,energy:412,owned:Object.fromEntries(Object.keys(LEGACY_DESIGN_IDS).map((id,i)=>[id,i+1])),deck:['001','006','009','002','004','003'],pending:['001','005','007','008','009'],revealed:2,clicks:300,packs:12};
 const read=parseSave(JSON.stringify(old));for(const key of ["energy","owned","deck","pending","revealed","clicks","packs"] as const)assert.deepEqual(read[key],old[key]);assert.equal(read.version,4);assert.equal(read.paidBoostersPurchased,12);assert.equal(Object.keys(read.owned).length,9);assert.equal(reveal(read).owned['007'],old.owned['007']+1);
});
test('six raretés équipables, nouvelles cartes persistées et sept synergies naturelles',()=>{
 const owned=Object.fromEntries(CARDS.map(c=>[c.id,1]));let s={...initialSave(),owned};
 for(let rarity=0;rarity<6;rarity++)s=equip(s,CARDS.find(c=>c.rarity===rarity)!.id);
 assert.equal(s.deck.length,6);assert.equal(new Set(s.deck.map(id=>byId(id).rarity)).size,6);assert.deepEqual(parseSave(JSON.stringify(s)),s);
 assert.deepEqual(SYNERGIES.map(x=>x.type).sort(),[...TYPES].sort());
 for(const t of TYPES){const cards=CARDS.filter(c=>c.type===t).slice(0,2);assert.equal(synergies([cards[0].id]).find(x=>x.type===t)!.active,false);assert.equal(synergies(cards.map(c=>c.id)).find(x=>x.type===t)!.active,true);}
 const builds=BUILD_ARCHETYPES.map(b=>stats({...s,deck:b.ids}));assert.ok(builds[0].click>builds[1].click);assert.ok(builds[1].auto>builds[2].auto);assert.ok(builds[2].rareChance>builds[0].rareChance);
});
