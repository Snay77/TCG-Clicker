import { atmosphere } from "../visuals";
import type { HabitatId } from "./model";
export type HabitatProfile = { sky: string; horizon: string; ground: string; glow: string; motif: "trees" | "flowers" | "water" | "crystals" | "mushrooms" | "stars" | "ruins" | "canopy" | "aurora" | "portal"; variant: number };
export const HABITAT_PROFILES: Record<HabitatId, HabitatProfile> = {
  clearing: { sky:"#285e62",horizon:"#629786",ground:"#2e6a53",glow:"#d8eaaa",motif:"trees",variant:0 },
  understory: { sky:"#183e46",horizon:"#365d59",ground:"#244a48",glow:"#9ddca6",motif:"trees",variant:1 },
  meadow: { sky:"#658c91",horizon:"#91b99d",ground:"#517f66",glow:"#ffd0c9",motif:"flowers",variant:0 },
  "ancient-tree": { sky:"#1b424a",horizon:"#446c67",ground:"#315b4e",glow:"#d5efb4",motif:"trees",variant:2 },
  river: { sky:"#3c7c87",horizon:"#84b9b2",ground:"#386b79",glow:"#c5f6ed",motif:"water",variant:0 },
  pond: { sky:"#345e70",horizon:"#77a38c",ground:"#3f878b",glow:"#b6e6d1",motif:"water",variant:1 },
  waterfall: { sky:"#324b77",horizon:"#739aaa",ground:"#466f8a",glow:"#d0f3ed",motif:"water",variant:2 },
  "crystal-cave": { sky:"#202743",horizon:"#495883",ground:"#35475e",glow:"#adf1ed",motif:"crystals",variant:0 },
  "fungal-forest": { sky:"#312d50",horizon:"#656283",ground:"#434863",glow:"#f2b9d5",motif:"mushrooms",variant:0 },
  "star-night": { sky:"#222340",horizon:"#635482",ground:"#343958",glow:"#e2d8ff",motif:"stars",variant:0 },
  ruins: { sky:"#28394e",horizon:"#647782",ground:"#3d5964",glow:"#abe5dd",motif:"ruins",variant:0 },
  canopy: { sky:"#285455",horizon:"#85a68a",ground:"#45696a",glow:"#f5e3b0",motif:"canopy",variant:0 },
  dawn: { sky:"#7e617f",horizon:"#d79e91",ground:"#6f6678",glow:"#ffedb9",motif:"aurora",variant:0 },
  sanctuary: { sky:"#394970",horizon:"#889aaf",ground:"#5b7d91",glow:"#f9edd6",motif:"ruins",variant:1 },
  astral: { sky:"#1b2141",horizon:"#555d8b",ground:"#343f68",glow:"#ece4c3",motif:"portal",variant:0 },
  "ember-orchard": { sky:"#55445b",horizon:"#ac7a74",ground:"#76536a",glow:"#ffe9a3",motif:"flowers",variant:1 },
};
export function habitatDetails(id: HabitatId, seed: number) {
  const profile=HABITAT_PROFILES[id];
  return { ...profile, points: atmosphere(seed, profile.motif==="stars"||profile.motif==="portal"?24:12) };
}
