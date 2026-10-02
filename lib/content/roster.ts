import data from "../../design/set01-faerie.json";
import { describeEffect, EFFECT_KEYS } from "../effects";
import { ANATOMIES, HABITATS, TYPES, POSTURES, type CardDesign, type LineageDesign, type PlannedCondition } from "./model";

export const ROSTER = data.cards as CardDesign[];
export const LINEAGES = data.lineages as LineageDesign[];
export const SAMPLE = ROSTER.filter(c => c.status === "sample");
export const designById = (id: string) => ROSTER.find(c => c.id === id);
export const STAGES = ["Base", "Évolution 1", "Évolution 2"];
export function describeCondition(c: PlannedCondition): string {
  switch (c.kind) {
    case "equippedType": return `${describeEffect(c.effect)} si ${c.atLeast} ${c.type} équipées`;
    case "absentType": return `${describeEffect(c.effect)} sans ${c.type} équipée`;
    case "equippedLineage": return `${describeEffect(c.effect)} si ${c.atLeast} membres de ${c.lineage} équipés`;
    case "comboAtLeast": return `${describeEffect(c.effect)} lorsque le combo ≥ ${c.value}`;
    case "discoveredSpecies": return `${describeEffect(c.perSpecies)} par espèce découverte, plafond +${c.cap * 100} %`;
    case "everyNthClick": return `Chaque ${c.every}e clic produit ×${c.multiplier}`;
  }
}
export function validateRoster(cards = ROSTER, lineages = LINEAGES): string[] {
  const errors: string[] = [];
  const ids = new Set(cards.map(c => c.id));
  if (cards.length !== 60 || ids.size !== 60 || new Set(cards.map(c => c.name)).size !== 60) errors.push("60 identifiants et noms uniques attendus");
  const counts = [24, 14, 10, 6, 4, 2];
  counts.forEach((count, rarity) => { if (cards.filter(c => c.rarity === rarity).length !== count) errors.push(`Rareté ${rarity} : ${count} attendues`); });
  if (lineages.filter(l => l.cardIds.length === 3).length !== 12 || lineages.filter(l => l.cardIds.length === 2).length !== 8 || cards.filter(c => !c.lineage).length !== 8) errors.push("Structure 12×3 + 8×2 + 8 attendue");
  const memberships = lineages.flatMap(l => l.cardIds);
  if (new Set(memberships).size !== 52 || memberships.length !== 52) errors.push("52 cartes liées sans doublon attendues");
  const validEffects = (effect: CardDesign["plannedEffects"]) => Object.entries(effect).every(([key, value]) => EFFECT_KEYS.includes(key as typeof EFFECT_KEYS[number]) && typeof value === "number" && Number.isFinite(value) && value >= 0);
  for (const [index, c] of cards.entries()) {
    if (c.number !== index + 1 || c.id !== `F01-${String(c.number).padStart(3, "0")}`) errors.push(`${c.id} : numéro invalide`);
    if (!["name", "silhouette", "personality", "visual", "flavor", "sharedMarkers"].every(key => typeof c[key as keyof CardDesign] === "string" && String(c[key as keyof CardDesign]).length > 5)) errors.push(`${c.id} : fiche incomplète`);
    if (!ANATOMIES[c.anatomy] || !HABITATS[c.habitat] || !TYPES.includes(c.type) || !["Clic", "Idle", "Collection", "Synergie"].includes(c.role)) errors.push(`${c.id} : taxonomie invalide`);
    if (!Object.values(c.palette).every(color => /^#[0-9a-f]{6}$/i.test(color)) || !Number.isSafeInteger(c.seed)) errors.push(`${c.id} : palette/seed invalide`);
    if (!validEffects(c.plannedEffects)) errors.push(`${c.id} : effet invalide`);
    if (!c.sprite) errors.push(`${c.id} : recette absente`);
    if(c.sprite && (!POSTURES[c.sprite.posture] || Object.values(c.sprite.proportions).some(v=>!Number.isFinite(v)||v<=0||v>1.6)
      || !Number.isInteger(c.sprite.face.spacing)||c.sprite.face.spacing<0||c.sprite.face.spacing>22))errors.push(`${c.id} : direction artistique invalide`);
    if (c.status === "designed" && c.sprite) errors.push(`${c.id} : sprite hors échantillon`);
    if (c.rarity >= 4 && (!c.signature || Object.values(c.signature).some(value => !value))) errors.push(`${c.id} : signature rare incomplète`);
    if (!c.lineage && (c.evolvesFrom || c.evolvesTo || c.stage !== 0)) errors.push(`${c.id} : unique avec évolution`);
    for (const condition of c.conditions) {
      if ("effect" in condition && !validEffects(condition.effect)) errors.push(`${c.id} : effet conditionnel invalide`);
      if (condition.kind === "equippedLineage" && !lineages.some(l => l.id === condition.lineage)) errors.push(`${c.id} : lignée conditionnelle inconnue`);
      if (condition.kind === "everyNthClick" && (!Number.isInteger(condition.every) || condition.every < 1 || condition.multiplier < 1)) errors.push(`${c.id} : déclencheur invalide`);
    }
  }
  for (const l of lineages) l.cardIds.forEach((id, index) => {
    const c = cards.find(c => c.id === id);
    if (!c || c.lineage !== l.id || c.stage !== index || c.evolvesFrom !== (l.cardIds[index - 1] || null) || c.evolvesTo !== (l.cardIds[index + 1] || null) || c.sharedMarkers !== l.marker) errors.push(`${l.id} : relation ou marqueur invalide (${id})`);
  });
  return errors;
}
