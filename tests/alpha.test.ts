import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CARDS } from '../lib/cards';
import { initialSave, openPack, reveal, finishPack, stats, price, type Save } from '../lib/game';
import { recordClick, recordTick, ACHIEVEMENTS, claimAchievement } from '../lib/exploration';
import { rechargeFreePacks } from '../lib/booster-economy';
import { diagnostics, exportSave, findBackup, loadSave, MAX_IMPORT_BYTES, persistSave, replaceSave, validateSave } from '../lib/save-manager';
import { CORRUPT_BACKUP_KEY, REPLACEMENT_BACKUP_KEY, SAVE_KEY, VALID_BACKUP_KEY } from '../lib/save-storage';
import { acquireLease, ownsLease, refreshLease, LEASE_MS } from '../lib/tab-ownership';
import { ALPHA_VERSION, GAME_VERSION, devToolsEnabled } from '../lib/release';
import { GameAudio } from '../lib/game-audio';
class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
}
const now = 2000000000000;
test('valeurs extrêmes importées : gains et récompenses restent finis, sûrs et réexportables', () => {
  const max=Number.MAX_SAFE_INTEGER, fresh=initialSave(now);
  let s:Save={...fresh,energy:max,clicks:max,packs:max,paidBoostersPurchased:max,owned:{'001':max},account:{...fresh.account,xp:max,totals:{...fresh.account.totals,generatedEnergy:max,cardsObtained:max}}};
  s=validateSave(JSON.stringify(s),now);
  s=recordClick(s,100,true,100);s=recordTick(s,5,100,true);s=claimAchievement(s,'cards-100');
  assert.equal(s.energy,max);assert.equal(s.clicks,max);assert.equal(s.account.xp,max);
  assert.equal(recordTick(s,5,Infinity,true),s);
  s=openPack(s,['001','001','001','001','001'],'paid',now);for(let i=0;i<5;i++)s=reveal(s);
  assert.equal(s.owned['001'],max);assert.equal(s.packs,max);
  assert.equal(validateSave(exportSave(s),now).account.xp,max);
  assert.throws(()=>validateSave(JSON.stringify({...fresh,level:1}),now));
});
test('rafale de critiques : synthèse limitée comme les clics ordinaires et mute respecté', () => {
  let oscillators = 0;
  const parameter = { setValueAtTime() {}, exponentialRampToValueAtTime() {} };
  class AudioStub {
    currentTime = 0; state = 'running'; destination = {};
    createOscillator() { oscillators++; return { frequency: parameter, connect() {}, disconnect() {}, start() {}, stop() {} }; }
    createGain() { return { gain: parameter, connect() {}, disconnect() {} }; }
    close() { return Promise.resolve(); }
  }
  const previous = globalThis.AudioContext;
  globalThis.AudioContext = AudioStub as unknown as typeof AudioContext;
  try {
    const engine = new GameAudio();
    for (let i=0;i<100;i++) engine.play('critical', { sound:true, volume:0.35 }, true);
    assert.equal(oscillators, 3);
    engine.play('legendary', { sound:false, volume:1 }, true);assert.equal(oscillators, 3);engine.close();
  } finally { globalThis.AudioContext = previous; }
});
test('export v4 JSON réimportable, ouverture et préférences conservées', () => {
  const s = reveal(openPack({ ...initialSave(now), energy: 1000 }, ['001', '002', '003', '008', '009'], 'paid', now));
  const loaded = validateSave(exportSave(s), now);
  assert.equal(loaded.version, 4); assert.deepEqual(loaded.pending, s.pending);
  assert.equal(loaded.revealed, 1); assert.deepEqual(loaded.owned, s.owned); assert.deepEqual(loaded.ux, s.ux);
});
test('imports invalides refusés : type, taille, version, nombres, collection, deck, compte et préférences', () => {
  for (const raw of ['{', 'null', '[]', 'false', ' '.repeat(MAX_IMPORT_BYTES + 1)]) assert.throws(() => validateSave(raw, now));
  const fresh = initialSave(now);
  for (const patch of [{ version: 99 }, { energy: -1 }, { energy: 1e300 }, { clicks: 0.5 }, { packs: -1 }, { owned: { bad: 1 } }, { owned: { '001': 0 } }, { owned: { '001': 1 }, deck: ['001', '001'] }, { deck: ['001'] }, { account: { ...fresh.account, xp: -1 } }, { ux: { ...fresh.ux, volume: 4 } }, { pending: ['001'], revealed: 1 }, { freeBoosters: 12 }]) assert.throws(() => validateSave(JSON.stringify({ ...fresh, ...patch }), now));
});
test('champs importés non reconnus ne survivent pas à la reconstruction', () => {
  const s = initialSave(now);
  const safe = validateSave(JSON.stringify({ ...s, code: '<script>', account: { ...s.account, secret: 'ignore' }, ux: { ...s.ux, arbitrary: 'ignore' } }), now);
  assert.ok(!JSON.stringify(safe).includes('ignore')); assert.ok(!JSON.stringify(safe).includes('<script>'));
});
test('migration historique sauvegardée avant écriture du format courant', () => {
  const storage = new MemoryStorage();
  const raw = JSON.stringify({ version: 1, energy: 200, owned: { '001': 3 }, deck: ['001'], level: 2, clicks: 40, packs: 1, pending: [], revealed: 0 });
  storage.setItem(SAVE_KEY, raw);
  const loaded = loadSave(storage, now); assert.equal(loaded.kind, 'ready');
  if (loaded.kind === 'ready') { assert.equal(loaded.save.energy, 200); assert.equal(loaded.save.owned['001'], 3); }
  assert.equal(storage.getItem(`${SAVE_KEY}-backup`), raw); assert.equal(storage.getItem(SAVE_KEY), raw);
});
test('principal corrompu ou absent : copie valide proposée, aucun écrasement automatique', () => {
  const storage = new MemoryStorage(), s = { ...initialSave(now), energy: 750 };
  storage.setItem(SAVE_KEY, '{broken'); storage.setItem(VALID_BACKUP_KEY, JSON.stringify(s));
  const loaded = loadSave(storage, now); assert.equal(loaded.kind, 'recovery');
  if (loaded.kind === 'recovery') assert.equal(loaded.backup?.energy, 750);
  assert.equal(storage.getItem(SAVE_KEY), '{broken');
  replaceSave(storage, s, null, '{broken');
  assert.equal(storage.getItem(CORRUPT_BACKUP_KEY), '{broken'); assert.equal(validateSave(storage.getItem(SAVE_KEY)!, now).energy, 750);
  storage.data.delete(SAVE_KEY); assert.equal(loadSave(storage, now).kind, 'recovery');
});
test('backups invalides ignorés et remplacement interdit si copie de secours échoue', () => {
  const storage = new MemoryStorage(); storage.setItem(VALID_BACKUP_KEY, '{bad');
  storage.setItem(REPLACEMENT_BACKUP_KEY, JSON.stringify(initialSave(now)));
  assert.ok(findBackup(storage, now));
  const before = exportSave({ ...initialSave(now), energy: 800 }); storage.setItem(SAVE_KEY, before);
  const failing = { getItem: storage.getItem.bind(storage), setItem(key:string,value:string){if(key===REPLACEMENT_BACKUP_KEY)throw Error('Quota');storage.setItem(key,value);} };
  assert.throws(() => replaceSave(failing, initialSave(now), validateSave(before, now)));
  assert.equal(storage.getItem(SAVE_KEY), before);
});
test('reset et import préservent la partie actuelle et ne détruisent pas les backups', () => {
  const storage = new MemoryStorage(), before = { ...initialSave(now), energy: 1234 };
  storage.setItem(SAVE_KEY, JSON.stringify(before));
  replaceSave(storage, initialSave(now), before);
  assert.equal(validateSave(storage.getItem(REPLACEMENT_BACKUP_KEY)!, now).energy, 1234);
  assert.equal(validateSave(storage.getItem(SAVE_KEY)!, now).energy, 0);
});
test('checkpoint conserve le principal précédent valide, jamais un JSON corrompu', () => {
  const storage = new MemoryStorage(), first = initialSave(now), second = { ...first, energy: 10 };
  storage.setItem(SAVE_KEY, JSON.stringify(first)); persistSave(storage, second, true);
  assert.equal(validateSave(storage.getItem(VALID_BACKUP_KEY)!, now).energy, 0);
  const backup = storage.getItem(VALID_BACKUP_KEY); storage.setItem(SAVE_KEY, '{broken'); persistSave(storage, second, true);
  assert.equal(storage.getItem(VALID_BACKUP_KEY), backup);
});
test('lease : deuxième onglet bloqué, expiration, propriétaire suspendu incapable d’écrire', () => {
  const storage = new MemoryStorage();
  assert.equal(acquireLease(storage, 'a', now), true); assert.equal(acquireLease(storage, 'b', now + 1), false);
  assert.equal(refreshLease(storage, 'a', now + 3000), true);
  assert.equal(acquireLease(storage, 'b', now + LEASE_MS + 4000), true);
  assert.equal(ownsLease(storage, 'a', now + LEASE_MS + 4001), false);
  assert.equal(refreshLease(storage, 'a', now + LEASE_MS + 4001), false);
});
test('diagnostics limités et version issue uniquement du package', () => {
  const s = { ...initialSave(now), owned: { '001': 2 } };
  const d = diagnostics(s, { browser: 'Firefox', width: 390, height: 844 });
  assert.equal(d.version, GAME_VERSION); assert.equal(ALPHA_VERSION, `Alpha ${JSON.parse(readFileSync('package.json','utf8')).version}`);
  assert.equal(d.species, 1); assert.equal(d.viewport, '390×844');
  for (const field of ['owned', 'deck', 'cardLevels', 'claimed', 'pendingIds']) assert.ok(!(field in d));
});
test('atelier interdit en production et test, disponible uniquement en développement', () => {
  assert.equal(devToolsEnabled('production'), false); assert.equal(devToolsEnabled('test'), false); assert.equal(devToolsEnabled(undefined), false); assert.equal(devToolsEnabled('development'), true);
});
function assertFinite(s: Save) {
  function walk(v: unknown) { if (typeof v === 'number') assert.ok(Number.isFinite(v)); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }
  walk(s); assert.ok(Number.isFinite(price(s))); Object.values(stats(s)).forEach(n=>assert.ok(Number.isFinite(n)));
}
for (const hours of [1, 3, 8]) test(`session ${hours}h simulée : clics, passif, boosters, XP, objectifs et checkpoints bornés`, () => {
  let s:Save={ ...initialSave(now), owned: Object.fromEntries(CARDS.map(c=>[c.id,1])), deck:['001','002','003','004','005','008'] };
  let maxBytes=0;
  for (let tick=1;tick<=hours*3600*5;tick++) {
    const epoch=now+tick*200;
    s=recordTick(s,0.2,stats(s).auto,true);
    if (tick%5===0) s=recordClick(s,stats(s).click,false,100);
    if (tick%3000===0) {
      s=rechargeFreePacks(s,epoch);
      s=openPack(s,['001','002','003','008','009'],'free',epoch);
      if(s.pending.length){for(let i=0;i<5;i++)s=reveal(s);s=finishPack(s);}
      for(const goal of ACHIEVEMENTS)s=claimAchievement(s,goal.id);
      assertFinite(s); const raw=JSON.stringify(s);maxBytes=Math.max(maxBytes,raw.length);s=validateSave(raw,epoch);
    }
  }
  assertFinite(s);assert.ok(Math.abs(s.account.totals.playSeconds-hours*3600)<.00001);
  assert.equal(s.clicks,hours*3600);assert.ok(s.packs>=hours*6);assert.ok(s.account.xp>0);
  assert.ok(maxBytes<16000);assert.ok(Object.keys(s.owned).length<=60);assert.ok(s.account.claimed.length<=42);assert.equal(s.pending.length,0);
});
for (const minutes of [10,60,360,1440,10080]) test(`retour ${minutes}min : stockage plafonné, aucune énergie ni temps actif hors ligne`, () => {
  const start={...initialSave(now),energy:700};
  const returned=validateSave(JSON.stringify(start),now+minutes*60000);
  assert.equal(returned.freeBoosters,Math.min(2,Math.floor(minutes/10)));
  assert.equal(returned.energy,start.energy);assert.equal(returned.account.totals.playSeconds,0);assert.equal(price(returned),price(start));
  if(minutes>=20)assert.equal(returned.freeBoosterTimerStartedAt,null);
  assertFinite(returned);
});
