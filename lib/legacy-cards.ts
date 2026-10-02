export const RARITIES = [
  "Commune",
  "Peu commune",
  "Rare",
  "Épique",
  "Légendaire",
  "Mythique",
] as const;
import type { Effect } from "./effects";
export type { Effect } from "./effects";
export type Creature = {
  id: string;
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
export const CARDS: Creature[] = [
  {
    id: "001",
    name: "Moussillon",
    rarity: 0,
    type: "Sylve",
    stage: "Base",
    evolvesTo: "006",
    effect: { clickFlat: 1 },
    description: "+1 énergie par clic",
    seed: 17,
    shape: "sprout",
    palette: ["#91df78", "#479e78", "#d9ffc0"],
  },
  {
    id: "002",
    name: "Chantignon",
    rarity: 0,
    type: "Mycète",
    stage: "Base",
    effect: { autoFlat: 1, autoMultiplier: 0.15 },
    description: "+1 / sec et +15 % production passive",
    seed: 28,
    shape: "mushroom",
    palette: ["#fd8aaf", "#b14478", "#ffe9bd"],
  },
  {
    id: "003",
    name: "Lunailée",
    rarity: 1,
    type: "Lune",
    stage: "Base",
    evolvesTo: "007",
    effect: { critChance: 0.05, critMultiplier: 0.3 },
    description: "+5 points critique et +0,3 multiplicateur critique",
    seed: 39,
    shape: "moth",
    palette: ["#c0adff", "#7666ca", "#e9dcff"],
  },
  {
    id: "004",
    name: "Roséclair",
    rarity: 1,
    type: "Rosée",
    stage: "Base",
    effect: { autoFlat: 2, autoMultiplier: 0.2 },
    description: "+2 / sec et +20 % production passive",
    seed: 42,
    shape: "frog",
    palette: ["#78e8db", "#369bab", "#d3fff1"],
  },
  {
    id: "005",
    name: "Flamèche",
    rarity: 2,
    type: "Étincelle",
    stage: "Base",
    effect: { clickFlat: 4, comboMultiplier: 0.3 },
    description: "+4 / clic et +30 % bonus de combo",
    seed: 57,
    shape: "fox",
    palette: ["#ffbf78", "#ce7156", "#fff0bb"],
  },
  {
    id: "006",
    name: "Sylvérêve",
    rarity: 2,
    type: "Sylve",
    stage: "Évolution 1",
    evolvesFrom: "001",
    evolvesTo: "009",
    effect: { boosterDiscount: 0.1, rareChance: 0.15, duplicateBonus: 2 },
    description: "Boosters −10 %, poids Rare+ +15 %, +2 éclats / doublon",
    seed: 61,
    shape: "sprout",
    palette: ["#70e4bb", "#388f91", "#eaffb1"],
  },
  {
    id: "007",
    name: "Noctipapille",
    rarity: 3,
    type: "Lune",
    stage: "Évolution 1",
    evolvesFrom: "003",
    effect: { clickMultiplier: 0.2, critChance: 0.05, critMultiplier: 0.5, duplicateBonus: 1 },
    description: "+20 % clic, +5 points critique, +0,5 critique, +1 éclat / doublon",
    seed: 73,
    shape: "moth",
    palette: ["#cf8df5", "#8451be", "#ffe0fa"],
  },
  {
    id: "008",
    name: "Auralis",
    rarity: 4,
    type: "Aurore",
    stage: "Base",
    effect: { autoFlat: 8, autoMultiplier: 0.3, faerieBonus: 0.05 },
    description: "+8 / sec, +30 % passif et +5 % énergie Faerie",
    seed: 89,
    shape: "dragon",
    palette: ["#ffd97e", "#cd9654", "#fff9d4"],
  },
  {
    id: "009",
    name: "Éon de la clairière",
    rarity: 5,
    type: "Astral",
    stage: "Évolution 2",
    evolvesFrom: "006",
    effect: { boosterDiscount: 0.1, rareChance: 0.3, duplicateBonus: 5, faerieBonus: 0.1 },
    description: "Boosters −10 %, poids Rare+ +30 %, +5 éclats / doublon, +10 % Faerie",
    seed: 97,
    shape: "dragon",
    palette: ["#f4b1f8", "#9c68cf", "#c3fff0"],
  },
];
export const byId = (id: string) => CARDS.find((c) => c.id === id)!;
