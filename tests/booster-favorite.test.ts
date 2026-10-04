import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSave, parseSave } from '../lib/game';
import { exportSave, validateSave } from '../lib/save-manager';
import { BOOSTERS, favoriteBooster } from '../lib/boosters';
test('booster favori migré depuis anciennes sauvegardes, sans changer la progression', () => {
  const save=initialSave(1000);delete save.ux.favoriteBooster;save.energy=700;save.owned={'001':3};save.deck=['001'];
  const loaded=parseSave(JSON.stringify(save),1000);
  assert.equal(loaded.ux.favoriteBooster,'faerie');assert.equal(loaded.energy,700);assert.deepEqual(loaded.owned,save.owned);assert.deepEqual(loaded.deck,save.deck);
  assert.equal(BOOSTERS.length,1);assert.equal(favoriteBooster(loaded.ux.favoriteBooster)?.name,'Faerie');
});
test('favori et retrait conservés à l’export/import v4', () => {
  for(const favorite of ['faerie',null] as const) {
    const save=initialSave(1000);save.ux.favoriteBooster=favorite;
    const loaded=validateSave(exportSave(save),1000);
    assert.equal(loaded.ux.favoriteBooster,favorite);assert.equal(loaded.version,4);assert.deepEqual(loaded.upgrades,save.upgrades);
    assert.equal(favoriteBooster(favorite)?.id??null,favorite);
  }
});
test('favoris importés inconnus ou malformés refusés', () => {
  const save=initialSave(1000);
  for(const favorite of ['unknown',1,{},['faerie']])assert.throws(()=>validateSave(JSON.stringify({...save,ux:{...save.ux,favoriteBooster:favorite}}),1000));
});
