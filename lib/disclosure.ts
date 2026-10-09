import { byId } from './cards';
import { equipBlockedReason, price, type Save } from './game';
import { ACHIEVEMENTS, achievementReady, explorationLevel, freePackCount } from './exploration';
import { UPGRADES } from './progression';
import { SYNERGIES } from './synergies';

// Presentation only. No unlock changes the rules, rewards or save format.
export function visibleSystems(save: Save) {
 const species=Object.keys(save.owned).filter(id=>save.owned[id]>0);
 const collection=species.length>0;
 const eligible=species.filter(id=>!equipBlockedReason({...save,deck:[]},id));
 const deck=collection&&(species.length>=3&&eligible.length>=2||save.deck.length>0||save.ux.completed.includes(4));
 const progression=collection&&(save.deck.length>0||explorationLevel(save.account.xp)>=3||ACHIEVEMENTS.some(a=>achievementReady(save,a)))||save.account.claimed.length>0;
 const pairs=SYNERGIES.some(s=>eligible.filter(id=>byId(id).type===s.type).length>=s.required);
 const triples=SYNERGIES.some(s=>eligible.filter(id=>byId(id).type===s.type).length>=3);
 const known=new Set(save.ux.discoveredSystems||[]);
 const shown={
  machine:true,
  upgrades:Object.values(save.upgrades).some(n=>n>0)||Math.max(save.energy,save.account.totals.generatedEnergy)>=Math.min(...UPGRADES.map(u=>u.base)),
  boosters:save.packs>0||freePackCount(save)>0||save.energy>=price(save),
  collection,deck,progression,
  synergies:deck&&pairs,
  advancedSynergies:deck&&triples&&explorationLevel(save.account.xp)>=3,
  statistics:progression&&(explorationLevel(save.account.xp)>=3||save.packs>=5),
 };
 return Object.fromEntries(Object.entries(shown).map(([key,value])=>[key,value||known.has(key)])) as typeof shown;
}
