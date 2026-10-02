export const RARITIES = [
  "Commune",
  "Peu commune",
  "Rare",
  "Épique",
  "Légendaire",
  "Mythique",
] as const;
import data from "../design/set01-faerie.json";
import type { CardDesign } from "./content/model";
import { describeEffect } from "./effects";
import type { Effect } from "./effects";
export type { Effect } from "./effects";
export type Creature = {
  id: string;
  number?: number;
  design?: CardDesign;
  name: string;
  rarity: number;
  type: string;
  stage: string;
  evolvesFrom?: string;
  evolvesTo?: string;
  effect: Effect;
  description: string;
  seed: number;
  shape: "sprout" | "mushroom" | "moth" | "fox" | "frog" | "dragon";
  palette: [string, string, string];
};

// Save identities from the nine-card prototype remain stable.
export const LEGACY_DESIGN_IDS: Record<string,string> = {"001":"F01-001","002":"F01-010","003":"F01-037","004":"F01-019","005":"F01-039","006":"F01-002","007":"F01-038","008":"F01-058","009":"F01-003"};
const legacyByDesign = Object.fromEntries(Object.entries(LEGACY_DESIGN_IDS).map(([id,design])=>[design,id]));
export const runtimeId = (designId: string) => legacyByDesign[designId] || designId;
export const CARDS: Creature[] = (data.cards as CardDesign[]).map(design=>({
 id:runtimeId(design.id),number:design.number,design,name:design.name,rarity:design.rarity,type:design.type,
 stage:["Base","Évolution 1","Évolution 2"][design.stage],
 evolvesFrom:design.evolvesFrom ? runtimeId(design.evolvesFrom):undefined,
 evolvesTo:design.evolvesTo ? runtimeId(design.evolvesTo):undefined,
 effect:design.plannedEffects,description:describeEffect(design.plannedEffects),seed:design.seed,
 shape:design.anatomy==="mushroom"?"mushroom":design.anatomy==="moth"?"moth":design.anatomy==="frog"?"frog":design.anatomy==="dragon"?"dragon":design.anatomy==="canine"?"fox":"sprout",
 palette:[design.palette.primary,design.palette.secondary,design.palette.light],
}));
const indexed = new Map(CARDS.map(c=>[c.id,c]));
export const byId = (id: string) => indexed.get(id)!;
