import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE, ROSTER } from '../lib/content/roster';
import { contentPixels, ANATOMY_FACE_RULES } from '../lib/content/directed-sprites';
import { POSTURES, type CardDesign } from '../lib/content/model';
import { PHASE4_BASELINE, EXTREME_STUDIES, headRatio } from '../lib/content/style-validation';

test('Phase 4.5 : toutes les silhouettes changent, référence Phase 4 complète et figée',()=>{
 assert.equal(PHASE4_BASELINE.length,12);
 for(const c of SAMPLE){const old=PHASE4_BASELINE.find(b=>b.id===c.id)!;assert.ok(old.paths.length>0);assert.equal(old.name,c.name);assert.ok(!('face' in old.recipe));}
 for(const c of SAMPLE){
  const old=PHASE4_BASELINE.find(b=>b.id===c.id)!;const coords=new Set<string>();
  for(const p of old.paths)for(const m of p.d.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g))for(let x=Number(m[1]);x<Number(m[1])+Number(m[3]);x++)coords.add(`${x},${m[2]}`);
  assert.notDeepEqual([...coords].sort(),contentPixels(c).map(p=>`${p.x},${p.y}`).sort(),`${c.name} : silhouette inchangée`);
 }
 assert.equal(ROSTER.filter(c=>c.sprite).length,60);
 assert.equal(new Set(SAMPLE.map(c=>c.sprite!.face.eyes)).size,8);
 assert.equal(new Set(SAMPLE.map(c=>JSON.stringify(c.sprite!.face))).size,11);
});
test('règles de visage par anatomie : portails et voiles sans visage, oiseaux avec bec',()=>{
 for(const c of SAMPLE){const r=c.sprite!,rules=ANATOMY_FACE_RULES[c.anatomy]!;assert.ok(rules.eyes.includes(r.face.eyes));assert.ok(rules.mouths.includes(r.face.mouth));}
 for(const c of SAMPLE.filter(c=>['treeGuardian','manta'].includes(c.anatomy))){assert.equal(contentPixels(c).filter(p=>p.part==='face').length,0);assert.throws(()=>contentPixels({...c,sprite:{...c.sprite!,face:{...c.sprite!.face,eyes:'round'}}}),/visage incompatible/);}
 const bird=SAMPLE.find(c=>c.anatomy==='bird')!;assert.equal(bird.sprite!.face.mouth,'beak');
});
test('yeux, espacement, masque et museau sont des composants dirigés réels',()=>{
 const rabbit=SAMPLE.find(c=>c.anatomy==='rabbit')!;
 const face=(c:CardDesign)=>contentPixels(c).filter(p=>p.part==='face');
 for(const patch of [{eyes:'narrow'},{spacing:6},{mouth:'none'},{mask:true},{asymmetric:false}] as const){const changed={...rabbit,sprite:{...rabbit.sprite!,face:{...rabbit.sprite!.face,...patch}}};assert.notDeepEqual(face(changed),face(rabbit));}
 assert.throws(()=>contentPixels({...rabbit,sprite:{...rabbit.sprite!,posture:'unknown' as never}}),/posture/);
});
test('proportions et postures dirigées, extrêmes hors roster, idles spécifiques',()=>{
 assert.equal(Object.keys(POSTURES).length,10);assert.equal(new Set(SAMPLE.map(c=>c.sprite!.posture)).size,10);
 assert.equal(new Set(SAMPLE.map(c=>c.sprite!.idle)).size,12);
 assert.equal(EXTREME_STUDIES.length,8);const temporary=EXTREME_STUDIES.filter(s=>s.card.id.startsWith('STUDY-'));assert.equal(temporary.length,5);assert.ok(temporary.every(s=>!ROSTER.some(c=>c.id===s.card.id)));
 for(const {card} of EXTREME_STUDIES){const p=contentPixels(card);assert.ok(p.length>30);assert.ok(p.every(p=>p.x>=0&&p.x<64&&p.y>=0&&p.y<64));}
 const seed=SAMPLE[0];const tall={...seed,sprite:{...seed.sprite!,proportions:{...seed.sprite!.proportions,height:1}}};assert.notDeepEqual(contentPixels(seed),contentPixels(tall));
 assert.ok(headRatio(SAMPLE.find(c=>c.anatomy==='firefly')!).includes('tête/corps'));
});
