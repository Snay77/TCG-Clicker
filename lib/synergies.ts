import { byId } from "./cards";
import { Effect } from "./effects";
export type Synergy = { type: string; required: number; effect: Effect };
export const SYNERGIES: Synergy[] = [
  { type: "Sylve", required: 2, effect: { energyMultiplier: 0.1 } },
  { type: "Lune", required: 2, effect: { critChance: 0.05 } },
  { type: "Mycète", required: 1, effect: { autoMultiplier: 0.05 } },
  { type: "Rosée", required: 1, effect: { autoMultiplier: 0.05 } },
  { type: "Étincelle", required: 1, effect: { clickMultiplier: 0.05 } },
];
export function synergies(deck: string[]) {
  return SYNERGIES.map(s => {
    const count = [...new Set(deck)].filter(id => byId(id)?.type === s.type).length;
    return { ...s, count, active: count >= s.required };
  });
}
export const BUILD_ARCHETYPES = [
  { name: "Clic", ids: ["001", "003", "005", "006", "007", "009"], description: "Cadence, critiques et puissance du clic." },
  { name: "Idle", ids: ["001", "002", "004", "006", "008", "009"], description: "Production stable et multiplicateurs passifs." },
  { name: "Collection", ids: ["001", "003", "006", "007", "008", "009"], description: "Boosters, raretés et récompenses de doublons. Privilégiez les améliorations globales et Faerie." },
] as const;
