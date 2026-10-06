import type { Effect } from './effects';

export type AdvancedCondition =
 | { kind:'deckTypeCount'; type:string; minimum:number }
 | { kind:'comboAbove'; threshold:number }
 | { kind:'uniqueTypes'; minimum:number }
 | { kind:'lineageCount'; minimum:number };
export type AdvancedRule =
 | { kind:'conditional'; condition:AdvancedCondition; bonus:Effect }
 | { kind:'scaled'; metric:'uniqueTypes'|'speciesDiscovered'; per:number; maximum:number; bonus:Effect }
 | { kind:'lineage'; minimum:number; multiplier:number }
 | { kind:'nextClick'; trigger:'onClick'; every:number; multiplier:number }
 | { kind:'nextClick'; trigger:'onBoosterOpen'; multiplier:number }
 | { kind:'temporary'; trigger:'onCritical'|'onBoosterOpen'; durationMs:number; bonus:Effect }
 | { kind:'duplicate'; trigger:'onDuplicate'; type:string; bonus:number };
export type AdvancedCardDesign = { designId:string; text:string; rule:AdvancedRule };

// Only this sample receives additional effects. Magnitudes do not scale with card
// levels: the existing base ability still does, keeping this first trial bounded.
export const ADVANCED_CARDS: readonly AdvancedCardDesign[] = [
 {designId:'F01-001',text:'Sylve ×3 : +10 % clic.',rule:{kind:'conditional',condition:{kind:'deckTypeCount',type:'Sylve',minimum:3},bonus:{clickMultiplier:.1}}},
 {designId:'F01-005',text:'Combo >75 : +5 % clic.',rule:{kind:'conditional',condition:{kind:'comboAbove',threshold:75},bonus:{clickMultiplier:.05}}},
 {designId:'F01-010',text:'+1 % passif par 10 espèces découvertes.',rule:{kind:'scaled',metric:'speciesDiscovered',per:10,maximum:6,bonus:{autoMultiplier:.01}}},
 {designId:'F01-015',text:'Doublons Mycète : +2 éclats.',rule:{kind:'duplicate',trigger:'onDuplicate',type:'Mycète',bonus:2}},
 {designId:'F01-018',text:'Après un critique : +10 % clic pendant 4 s.',rule:{kind:'temporary',trigger:'onCritical',durationMs:4000,bonus:{clickMultiplier:.1}}},
 {designId:'F01-019',text:'Lignée ×2 : +15 % aux bonus de base de la lignée.',rule:{kind:'lineage',minimum:2,multiplier:.15}},
 {designId:'F01-025',text:'Tous les 25 clics : prochain clic ×3.',rule:{kind:'nextClick',trigger:'onClick',every:25,multiplier:3}},
 {designId:'F01-028',text:'+1,5 % énergie par type équipé.',rule:{kind:'scaled',metric:'uniqueTypes',per:1,maximum:7,bonus:{energyMultiplier:.015}}},
 {designId:'F01-039',text:'Après un critique : +15 % clic pendant 4 s.',rule:{kind:'temporary',trigger:'onCritical',durationMs:4000,bonus:{clickMultiplier:.15}}},
 {designId:'F01-050',text:'Après un booster : +20 % passif pendant 8 s.',rule:{kind:'temporary',trigger:'onBoosterOpen',durationMs:8000,bonus:{autoMultiplier:.2}}},
 {designId:'F01-059',text:'Après un booster : prochain clic ×2.',rule:{kind:'nextClick',trigger:'onBoosterOpen',multiplier:2}},
 {designId:'F01-060',text:'3 types équipés : +15 % passif.',rule:{kind:'conditional',condition:{kind:'uniqueTypes',minimum:3},bonus:{autoMultiplier:.15}}},
];
const indexed=new Map(ADVANCED_CARDS.map(c=>[c.designId,c]));
export const advancedDesign=(designId:string|undefined)=>designId?indexed.get(designId):undefined;
