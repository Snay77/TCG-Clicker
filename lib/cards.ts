export const RARITIES = [
  "Commune",
  "Peu commune",
  "Rare",
  "Épique",
  "Légendaire",
  "Mythique",
] as const;
export type Effect = {
  click?: number;
  auto?: number;
  crit?: number;
  discount?: number;
};
export type Creature = {
  id: string;
  name: string;
  rarity: number;
  type: string;
  stage: string;
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
    effect: { click: 1 },
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
    effect: { auto: 1 },
    description: "+1 énergie par seconde",
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
    effect: { crit: 0.05 },
    description: "+5 % de chance de critique (×3)",
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
    effect: { auto: 2 },
    description: "+2 énergies par seconde",
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
    effect: { click: 4 },
    description: "+4 énergies par clic",
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
    effect: { discount: 0.1 },
    description: "−10 % sur le prix des boosters",
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
    effect: { auto: 6, crit: 0.05 },
    description: "+6 / sec et +5 % de critique",
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
    effect: { click: 10, auto: 8 },
    description: "+10 / clic et +8 / seconde",
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
    effect: { click: 20, auto: 15, discount: 0.1 },
    description: "+20 / clic, +15 / sec, boosters −10 %",
    seed: 97,
    shape: "dragon",
    palette: ["#f4b1f8", "#9c68cf", "#c3fff0"],
  },
];
export const byId = (id: string) => CARDS.find((c) => c.id === id)!;
