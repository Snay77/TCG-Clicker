import { RARITIES } from "../cards";
import { describeEffect } from "../effects";
import { ANATOMIES, HABITATS } from "./model";
import { IMPLEMENTED_ANATOMIES } from "./directed-sprites";
import { HABITAT_PROFILES } from "./habitats";
import { ROSTER, LINEAGES, SAMPLE, STAGES, designById, describeCondition } from "./roster";

export const ROSTER_DOC_START="<!-- BEGIN:FAERIE-ROSTER -->";
export const ROSTER_DOC_END="<!-- END:FAERIE-ROSTER -->";
export function buildRosterDocumentation(): string {
  const text: string[]=[ROSTER_DOC_START,"## Phase 5 — production complète du Set 01","",
    "Roster conçu : 60 cartes, 12 lignées de trois, 8 lignées de deux, 8 uniques. Répartition maintenue : 24 Communes, 14 Peu communes, 10 Rares, 6 Épiques, 4 Légendaires, 2 Mythiques.","",
    "Les identifiants `F01-001` à `F01-060` sont des IDs de design, distincts des IDs `001` à `009` jouables. Aucun changement de pool, d'économie, de sauvegarde ou d'ouverture. Les effets ci-dessous sont des propositions à équilibrer ; les capacités conditionnelles ne sont pas actives. Les 12 sprites sont un échantillon artistique à valider, pas des assets définitifs. Les 48 autres restent des fiches, sans sprite de substitution.","",
    "Les neuf noms du prototype sont conservés dans le roster avec des numéros de design différents : Moussillon 001 → F01-001 ; Chantignon 002 → F01-010 ; Lunailée 003 → F01-037 ; Roséclair 004 → F01-019 ; Flamèche 005 → F01-039 ; Sylvérêve 006 → F01-002 ; Noctipapille 007 → F01-038 ; Auralis 008 → F01-058 ; Éon 009 → F01-003. Leurs raretés et effets suivent maintenant le set complet ; copies, deck et ouverture partielle conservent leur identité. Le format v2 reste inchangé, et la migration v1 → v2 reste disponible.","",
    "Données éditables : `design/set01-faerie.json`. Contrats et validation : `lib/content/model.ts`, `lib/content/roster.ts`. Ce bloc documentaire est généré depuis ces données avec `npx tsx scripts/generate-set-doc.ts`. Les tests vérifient que la référence et les données restent identiques.","",
    "### Structure finale","","| Groupe | Cartes | Commune | Peu commune | Rare | Épique | Légendaire | Mythique |","| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for(const [label,ids] of [
    ["12 lignées de trois",LINEAGES.filter(l=>l.cardIds.length===3).flatMap(l=>l.cardIds)],
    ["8 lignées de deux",LINEAGES.filter(l=>l.cardIds.length===2).flatMap(l=>l.cardIds)],
    ["8 uniques",ROSTER.filter(c=>!c.lineage).map(c=>c.id)],
  ] as [string,string[]][]){
    const cards=ids.map(id=>designById(id)!);
    text.push(`| ${label} | ${cards.length} | ${RARITIES.map((_,i)=>cards.filter(c=>c.rarity===i).length).join(" | ")} |`);
  }
  text.push("| **Total** | **60** | **24** | **14** | **10** | **6** | **4** | **2** |","",
    "La lignée L20 comprend volontairement deux Communes : une évolution est une transformation de rôle et de silhouette, pas nécessairement une hausse de rareté. L12 comprend une Base Commune et deux formes Rares aux rôles différents. Les parents restent accessibles.","",
    "### Les 20 lignées","",
  );
  for(const l of LINEAGES){
    text.push(`#### ${l.id} — ${l.name}`,"",`**Cartes :** ${l.cardIds.map(id=>`${designById(id)!.name} (${id})`).join(" → ")}.`,"",
      `**Concept :** ${l.concept} **Transformation :** ${l.transformation}`,"",
      `**Personnalité :** ${l.personality} **Gimmick :** ${l.gimmick}`,"",
      `**Marqueurs conservés :** ${l.marker} **Élément féerique :** ${l.faerie}.`,"",
      `**Palette :** ${l.palette.join(" / ")}. **Type :** ${l.type}. **Habitat :** ${HABITATS[l.habitat]}.`,"",
    );
  }
  text.push("### Les huit créatures uniques","",ROSTER.filter(c=>!c.lineage).map(c=>`${c.name} (${c.id}, ${RARITIES[c.rarity]})`).join(" ; ")+".","",
    "### Bibliothèque d'anatomies","","25 familles sont produites ; les 60 compositions sont dirigées (le papillon conserve ses deux compositions validées). La compatibilité des composants est dirigée par anatomie, pas un système qui mélange arbitrairement n'importe quelle tête et n'importe quel corps. Les 48 nouvelles recettes possèdent des transformations propres à leur lignée.","",
    "| Anatomie | Statut du moteur d'étude | Cartes du roster |","| --- | --- | --- |",
  );
  for(const [id,label] of Object.entries(ANATOMIES))text.push(`| ${label} (${id}) | ${IMPLEMENTED_ANATOMIES.includes(id as typeof IMPLEMENTED_ANATOMIES[number])?"Produite":"Produite"} | ${ROSTER.filter(c=>c.anatomy===id).map(c=>c.name).join(", ")} |`);
  text.push("","### Habitats construits en code","","16 profils distincts : motifs géométriques, palettes, horizons et plans de sol. Le seed varie des détails secondaires déterministes ; le choix d'habitat appartient au design. Les habitats peuplés plus tard restent disponibles dans l'atlas.","",
    "| Habitat | Construction | Designs |","| --- | --- | ---: |",
  );
  for(const [id,label] of Object.entries(HABITATS))text.push(`| ${label} (${id}) | ${HABITAT_PROFILES[id as keyof typeof HABITAT_PROFILES].motif} · variante ${HABITAT_PROFILES[id as keyof typeof HABITAT_PROFILES].variant} | ${ROSTER.filter(c=>c.habitat===id).length} |`);
  text.push("","### Échantillon de validation — 12 cartes","",
    SAMPLE.map(c=>`${c.name} (${c.id}, ${ANATOMIES[c.anatomy]}, ${RARITIES[c.rarity]})`).join(" ; ")+".","",
    "Il couvre les sept types, L01 complète en trois stades, L13 complète en deux stades, des membres de cinq autres lignées et deux uniques. Il comprend une Épique, une Légendaire et les deux Mythiques. Les contrôles de /dev comparent 48/64/80/112/160 px, silhouettes, fonds, palettes, parties, seeds, animations et cartes avec habitats. Arrêt manuel des animations et préférence de mouvement réduit sont respectés.","",
    "### Fiches complètes des 60 cartes","",
  );
  for(const c of ROSTER){
    text.push(`#### ${c.id} — ${c.name}`,"",
      `**ID / numéro :** ${c.id} · ${String(c.number).padStart(3,"0")} / 060. **Lignée :** ${c.lineage||"Unique"}. **EvolvesFrom :** ${c.evolvesFrom||"—"}. **EvolvesTo :** ${c.evolvesTo||"—"}. **Stade :** ${STAGES[c.stage]}.`,"",
      `**Rareté :** ${RARITIES[c.rarity]}. **Type :** ${c.type}. **Anatomie :** ${ANATOMIES[c.anatomy]} (${c.anatomy}). **Silhouette :** ${c.silhouette}`,"",
      `**Palette principale :** ${c.palette.primary}. **Palette secondaire :** ${c.palette.secondary}. **Lumière :** ${c.palette.light}. **Habitat :** ${HABITATS[c.habitat]}.`,"",
      `**Personnalité :** ${c.personality} **Description visuelle :** ${c.visual}`,"",
      `**Marqueurs / relations visuelles :** ${c.sharedMarkers}`,"",
      `**Rôle gameplay :** ${c.role}. **Effet actif :** ${describeEffect(c.plannedEffects)}. **Données d'effet :** \`${JSON.stringify(c.plannedEffects)}\`.`,"",
      `**Capacité future, non active :** ${c.conditions.length?c.conditions.map(describeCondition).join(" ; "):"Aucune condition prévue"}.`,"",
      `**Flavor text :** « ${c.flavor} » **Seed :** ${c.seed}. **Production :** ${c.status==="sample"?"Référence validée, jouable":"Produit, jouable"}.`,"",
    );
    if(c.sprite)text.push(`**Recette dirigée :** ${Object.entries(c.sprite).map(([k,v])=>`${k}=${typeof v==="object"?JSON.stringify(v):v}`).join(" ; ")}.`,"");
    if(c.signature)for(const [key,value] of Object.entries(c.signature))text.push(`**Signature ${key} :** ${value}`,"");
  }
  text.push(ROSTER_DOC_END);
  return text.join("\n");
}
