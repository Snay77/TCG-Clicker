import type { Effect } from "../effects";

export const ANATOMIES = {
  seed: "Graine", deer: "Cervidé", treeGuardian: "Arbre-portail", rabbit: "Lapin",
  flower: "Fleur", mushroom: "Champignon", beetle: "Scarabée", cat: "Félin",
  frog: "Grenouille", salamander: "Salamandre", firefly: "Luciole", bird: "Oiseau",
  serpent: "Serpent", golem: "Golem / automate", moth: "Papillon", canine: "Canidé",
  slug: "Limace", snail: "Escargot", fish: "Poisson", bat: "Chauve-souris",
  whale: "Baleine", round: "Créature ronde", spirit: "Esprit flottant",
  dragon: "Dragon léger", manta: "Voile astral",
} as const;
export type Anatomy = keyof typeof ANATOMIES;
export const TYPES = ["Sylve", "Mycète", "Lune", "Rosée", "Étincelle", "Aurore", "Astral"] as const;
export type FaerieType = typeof TYPES[number];
export const HABITATS = {
  clearing: "Clairière", understory: "Sous-bois", meadow: "Champ de fleurs",
  "ancient-tree": "Arbre ancien", river: "Ruisseau", pond: "Mare",
  waterfall: "Cascade", "crystal-cave": "Grotte cristalline",
  "fungal-forest": "Forêt de champignons", "star-night": "Nuit étoilée",
  ruins: "Ruines féeriques", canopy: "Canopée", dawn: "Aurore",
  sanctuary: "Sanctuaire", astral: "Dimension astrale", "ember-orchard": "Verger de braise",
} as const;
export type HabitatId = keyof typeof HABITATS;
// Declarations for a future runtime. They never enter the Phase 3 stat resolver.
export type PlannedCondition =
  | { kind: "equippedType"; type: FaerieType; atLeast: number; effect: Effect }
  | { kind: "absentType"; type: FaerieType; effect: Effect }
  | { kind: "equippedLineage"; lineage: string; atLeast: number; effect: Effect }
  | { kind: "comboAtLeast"; value: number; effect: Effect }
  | { kind: "discoveredSpecies"; perSpecies: Effect; cap: number }
  | { kind: "everyNthClick"; every: number; multiplier: number };
export type SpriteRecipe = {
  posture: Posture;
  proportions: { head: number; width: number; height: number };
  face: FaceRecipe;
  bodyVariant: string; headVariant: string;
  ears: "none" | "leaf" | "long" | "gills" | "antennae";
  horns: "none" | "branch";
  wings: "none" | "glass" | "feather" | "crescent" | "curtain" | "cloth";
  tail: "none" | "sprig" | "leaf" | "roots" | "pom" | "ribbon" | "forked" | "mobius";
  crown: "none" | "splitLeaf" | "buds" | "canopy" | "scallopCap" | "crest" | "clockHands";
  markings: "freckles" | "runes" | "spores" | "scales" | "pollen" | "feathers" | "moonDust" | "ocelli" | "constellations";
  accessory: "none" | "leafScarf" | "seedCore" | "ruff" | "lantern" | "scarf" | "medallion" | "pendulum";
  aura: "none" | "rootPulse" | "firelight" | "moonHalo" | "foldOrbit" | "clockHalo";
  idle: "breathe" | "earTwitch" | "tailWave" | "wingBeat" | "rootPulse" | "clockTick" | "foldOrbit" | "seedBounce" | "leafSway" | "sporeFall" | "lanternPulse" | "birdPeek" | "moonFlutter" | "petalDance" | "tideFloat" | "ringFlow" | "emberMantle" | "shellRock" | "geodeEcho" | "bellSwing" | "flowerCeremony" | "nacreTide" | "auroraFlight";
};
export const POSTURES = {
  seated: "Assis", standing: "Debout", quadruped: "Quadrupède", floating: "Flottant",
  openWings: "Ailes ouvertes", curled: "Recroquevillé", turned: "Tourné", leaning: "Penché",
  suspended: "Suspendu", rooted: "Enraciné",
} as const;
export type Posture = keyof typeof POSTURES;
export type FaceRecipe = {
  eyes: "round" | "narrow" | "almond" | "crescent" | "single" | "luminous" | "profile" | "none";
  spacing: number; mouth: "smile" | "none" | "muzzle" | "beak";
  mask: boolean; asymmetric: boolean;
};
export type CardDesign = {
  id: string; number: number; name: string; lineage: string | null;
  evolvesFrom: string | null; evolvesTo: string | null; stage: 0 | 1 | 2;
  rarity: number; type: FaerieType; anatomy: Anatomy; silhouette: string;
  palette: { primary: string; secondary: string; light: string };
  habitat: HabitatId; personality: string; visual: string;
  role: "Clic" | "Idle" | "Collection" | "Synergie";
  plannedEffects: Effect; conditions: PlannedCondition[]; flavor: string; seed: number;
  sharedMarkers: string; status: "designed" | "sample" | "produced"; sprite?: SpriteRecipe;
  signature?: { composition: string; idle: string; habitatDetail: string; aura: string; narrative: string };
};
export type LineageDesign = {
  id: string; name: string; cardIds: string[]; concept: string; transformation: string;
  personality: string; gimmick: string; marker: string; faerie: string;
  palette: string[]; habitat: HabitatId; type: FaerieType;
};
