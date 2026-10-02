import { byId, runtimeId } from "./cards";
import type { Effect } from "./effects";
export type Synergy = { type: string; required: number; effect: Effect };
export const SYNERGIES: Synergy[] = [
 {type:"Sylve",required:2,effect:{energyMultiplier:.1}},
 {type:"Lune",required:2,effect:{critChance:.05}},
 {type:"Mycète",required:2,effect:{autoMultiplier:.12,duplicateBonus:.5}},
 {type:"Rosée",required:2,effect:{autoMultiplier:.12}},
 {type:"Étincelle",required:2,effect:{clickMultiplier:.1,comboMultiplier:.1}},
 {type:"Aurore",required:2,effect:{energyMultiplier:.08}},
 {type:"Astral",required:2,effect:{rareChance:.08,duplicateBonus:.5}},
];
export function synergies(deck: string[]) {
 return SYNERGIES.map(s=>{const count=[...new Set(deck)].filter(id=>byId(id)?.type===s.type).length;return {...s,count,active:count>=s.required};});
}
const ids = (...numbers:number[])=>numbers.map(n=>runtimeId(`F01-${String(n).padStart(3,"0")}`));
export const BUILD_ARCHETYPES = [
 {name:"Clic",ids:ids(16,17,18,25,26,27),description:"Chats de lune et lanternes : critiques, cadence et combo."},
 {name:"Idle",ids:ids(10,11,12,19,20,21),description:"Chœur mycélien et bassin de rosée : production passive."},
 {name:"Collection",ids:ids(10,15,31,32,59,60),description:"Mycète et Astral : boosters, rencontres rares et doublons."},
];

// Basic pairs remain available from the start. Triples add a modest exploration reward.
export function advancedSynergies(deck:string[],level:number) {
 return SYNERGIES.map(s=>{const count=[...new Set(deck)].filter(id=>byId(id)?.type===s.type).length;
  return {type:s.type,required:3,count,unlocked:level>=3,active:level>=3&&count>=3,effect:{energyMultiplier:.03}};
 });
}
