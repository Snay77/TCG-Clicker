# TCG Clicker — Set 01: Faerie

**État actuel — Phase 5 (2 octobre 2026) : 60 cartes produites et jouables, 25 anatomies, 16 habitats. Les sections des phases précédentes constituent l’historique ; la section Phase 5 décrit le comportement actuel.**

## Informations

Le set complet est intégré. Les 12 références validées et les 48 nouvelles compositions sont rendues par le même moteur dirigé. Le bloc généré ci-dessous contient les effets actifs, lignées, anatomies, habitats et recettes.

Thème :
Monde féerique, forêt magique, créatures mignonnes et mystérieuses.

## Historique — neuf cartes du prototype Phase 3

Le tableau ci-dessous conserve les anciennes valeurs pour référence. Les identités de sauvegarde restent reconnues, mais les effets actuels et les numéros de classeur sont ceux du set complet.

| N° | Créature | Rareté | Type | Stade | Effet | Seed |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | Moussillon | Commune | Sylve | Base | +1 énergie par clic | 17 |
| 002 | Chantignon | Commune | Mycète | Base | +1 / sec, +15 % passif | 28 |
| 003 | Lunailée | Peu commune | Lune | Base | +5 points critique, +0,3 multiplicateur critique | 39 |
| 004 | Roséclair | Peu commune | Rosée | Base | +2 / sec, +20 % passif | 42 |
| 005 | Flamèche | Rare | Étincelle | Base | +4 / clic, +30 % bonus combo | 57 |
| 006 | Sylvérêve | Rare | Sylve | Évolution 1 | Boosters −10 %, poids Rare+ +15 %, +2 éclats / doublon | 61 |
| 007 | Noctipapille | Épique | Lune | Évolution 1 | +20 % clic, +5 points critique, +0,5 multiplicateur critique, +1 éclat / doublon | 73 |
| 008 | Auralis | Légendaire | Aurore | Base | +8 / sec, +30 % passif, +5 % Faerie | 89 |
| 009 | Éon de la clairière | Mythique | Astral | Évolution 2 | Boosters −10 %, poids Rare+ +30 %, +5 éclats / doublon, +10 % Faerie | 97 |

Lignées provisoires : `001 → 006 → 009` et `003 → 007`. L'équipement d'une évolution exige la découverte de son parent immédiat. La carte précédente est conservée. Les autres cartes sont indépendantes. Les doublons augmentent les effets aux seuils 1/3/6/10/15 copies, avec multiplicateurs 1/1,2/1,5/1,8/2 ; chaque doublon rapporte aussi des éclats. Voir `GAME_DESIGN.md` pour les synergies et les plafonds.

## Plan du set complet — 60 cartes, non implémentées

| Groupe | Cartes | Communes | Peu communes | Rares | Épiques | Légendaires | Mythiques |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 12 lignées de 3 cartes | 36 | 12 | 10 | 10 | 2 | 1 | 1 |
| 8 lignées de 2 cartes | 16 | 8 | 4 | 0 | 3 | 1 | 0 |
| 8 créatures uniques | 8 | 4 | 0 | 0 | 1 | 2 | 1 |
| **Total** | **60** | **24** | **14** | **10** | **6** | **4** | **2** |

Les groupes définissent une enveloppe de production, pas les noms finaux ni un ordre strict de rareté par stade. Les lignées doivent varier entre Sylve, Lune, Rosée, Mycète, Étincelle, Aurore et Astral, avec des rôles de clic, idle et collection. Les huit créatures uniques accueillent des silhouettes et effets spécifiques. Les neuf cartes temporaires restent les seules données exécutables de `lib/cards.ts` ; leurs numéros et relations pourront être harmonisés lors de la production du set. Toute répartition future doit conserver les totaux ci-dessus et des parents accessibles pour les évolutions.

## Données et rendu

- `lib/cards.ts` : contenu, effets, seeds et palettes.
- `lib/visuals.ts` : habitats, capacités, textes d’ambiance et finitions.
- `lib/sprites.ts` : anatomies déterministes sur grille 64 × 64.

Les habitats couvrent bosquets, champignons, lune, mare, braises, aurore et monde astral. Tous les sprites et décors sont produits en code.

## Validation

L’atelier `/dev` affiche les neuf créatures et leurs cartes. Le booster de démonstration contient Moussillon, Flamèche, Noctipapille, Auralis et Éon de la clairière, sans modifier la sauvegarde.

Les boosters jouables contiennent cinq cartes, avec une Peu commune ou mieux garantie en cinquième position. Les finitions dépendent de la rareté, sans variantes collectionnables séparées.

<!-- BEGIN:FAERIE-ROSTER -->
## Phase 5 — production complète du Set 01

Roster conçu : 60 cartes, 12 lignées de trois, 8 lignées de deux, 8 uniques. Répartition maintenue : 24 Communes, 14 Peu communes, 10 Rares, 6 Épiques, 4 Légendaires, 2 Mythiques.

Les identifiants `F01-001` à `F01-060` sont des IDs de design, distincts des IDs `001` à `009` jouables. Aucun changement de pool, d'économie, de sauvegarde ou d'ouverture. Les effets ci-dessous sont des propositions à équilibrer ; les capacités conditionnelles ne sont pas actives. Les 12 sprites sont un échantillon artistique à valider, pas des assets définitifs. Les 48 autres restent des fiches, sans sprite de substitution.

Les neuf noms du prototype sont conservés dans le roster avec des numéros de design différents : Moussillon 001 → F01-001 ; Chantignon 002 → F01-010 ; Lunailée 003 → F01-037 ; Roséclair 004 → F01-019 ; Flamèche 005 → F01-039 ; Sylvérêve 006 → F01-002 ; Noctipapille 007 → F01-038 ; Auralis 008 → F01-058 ; Éon 009 → F01-003. Leurs raretés et effets suivent maintenant le set complet ; copies, deck et ouverture partielle conservent leur identité. Le format v2 reste inchangé, et la migration v1 → v2 reste disponible.

Données éditables : `design/set01-faerie.json`. Contrats et validation : `lib/content/model.ts`, `lib/content/roster.ts`. Ce bloc documentaire est généré depuis ces données avec `npx tsx scripts/generate-set-doc.ts`. Les tests vérifient que la référence et les données restent identiques.

### Structure finale

| Groupe | Cartes | Commune | Peu commune | Rare | Épique | Légendaire | Mythique |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 12 lignées de trois | 36 | 12 | 10 | 10 | 2 | 1 | 1 |
| 8 lignées de deux | 16 | 8 | 4 | 0 | 3 | 1 | 0 |
| 8 uniques | 8 | 4 | 0 | 0 | 1 | 2 | 1 |
| **Total** | **60** | **24** | **14** | **10** | **6** | **4** | **2** |

La lignée L20 comprend volontairement deux Communes : une évolution est une transformation de rôle et de silhouette, pas nécessairement une hausse de rareté. L12 comprend une Base Commune et deux formes Rares aux rôles différents. Les parents restent accessibles.

### Les 20 lignées

#### L01 — Mémoire des graines

**Cartes :** Moussillon (F01-001) → Sylvérêve (F01-002) → Éon de la clairière (F01-003).

**Concept :** Une graine transporte les souvenirs de la clairière. **Transformation :** Bulbe sur pattes → cervidé ramifié → arbre-portail enraciné.

**Personnalité :** Timide → curieux et protecteur → patient et accueillant. **Gimmick :** Feuille bifide devenue arche vivante.

**Marqueurs conservés :** Deux oreilles-feuilles, yeux en amande, bourgeon ivoire. **Élément féerique :** Mémoire végétale.

**Palette :** #91df78 / #479e78 / #eaffb1. **Type :** Sylve. **Habitat :** Arbre ancien.

#### L02 — Oreilles du printemps

**Cartes :** Semenotte (F01-004) → Lièvrille (F01-005) → Ramifleur (F01-006).

**Concept :** Un lapereau sème les chemins qu’il explore. **Transformation :** Graine à oreilles → lapin jardinier → lièvre à manteau de ramilles.

**Personnalité :** Hésitant → joueur → intrépide et généreux. **Gimmick :** Oreilles longues à nervure rose.

**Marqueurs conservés :** Deux oreilles asymétriques et trois boutons roses. **Élément féerique :** Sentiers en fleurs.

**Palette :** #c6e987 / #649d80 / #ffd7c4. **Type :** Sylve. **Habitat :** Champ de fleurs.

#### L03 — Jardin des saluts

**Cartes :** Boutonner (F01-007) → Coralève (F01-008) → Floréale (F01-009).

**Concept :** Une fleur apprend à répondre aux voix de la forêt. **Transformation :** Bouton au ras du sol → fleur danseuse → immense bouquet vivant.

**Personnalité :** Réservé → sociable → bienveillant et théâtral. **Gimmick :** Pétales en forme de mains qui saluent.

**Marqueurs conservés :** Cœur corail et trois pétales levés. **Élément féerique :** Floraison musicale.

**Palette :** #ffb6cb / #b96397 / #fff0b2. **Type :** Sylve. **Habitat :** Champ de fleurs.

#### L04 — Chœur du sous-bois

**Cartes :** Chantignon (F01-010) → Sporelle (F01-011) → Mycoralie (F01-012).

**Concept :** Un champignon accorde les sons captés par son chapeau. **Transformation :** Pied chanteur → trompettes jumelles → orchestre de corolles.

**Personnalité :** Bavard → attentif → chef d’orchestre encourageant. **Gimmick :** Chapeau rose à trois taches crème en triangle.

**Marqueurs conservés :** Collerette ivoire et signature à trois taches. **Élément féerique :** Spores sonores.

**Palette :** #fd8aaf / #b14478 / #ffe9bd. **Type :** Mycète. **Habitat :** Forêt de champignons.

#### L05 — Broches du mycélium

**Cartes :** Couspore (F01-013) → Brochignon (F01-014) → Mycélisseur (F01-015).

**Concept :** Un scarabée recoud les passages entre les champignons. **Transformation :** Petite broche ronde → scarabée bijou → artisan aux élytres-jardin.

**Personnalité :** Appliqué → fier → attentionné. **Gimmick :** Élytres cousus d’un X lumineux.

**Marqueurs conservés :** Six petites pattes et couture en X. **Élément féerique :** Mycélium réparateur.

**Palette :** #bc99ec / #6457a1 / #f4ddad. **Type :** Mycète. **Habitat :** Sous-bois.

#### L06 — Coussins de lune

**Cartes :** Somnouchat (F01-016) → Croissombre (F01-017) → Songegarde (F01-018).

**Concept :** Un félin porte les rêves sans les réveiller. **Transformation :** Chaton au croissant → félin au tapis de nuit → gardien des songes.

**Personnalité :** Somnolent → espiègle → rassurant. **Gimmick :** Queue en croissant et paupières étoilées.

**Marqueurs conservés :** Croissant de queue et oreilles rondes à pointe claire. **Élément féerique :** Rêves tranquilles.

**Palette :** #b8b4f3 / #615787 / #ffe2b7. **Type :** Lune. **Habitat :** Nuit étoilée.

#### L07 — Couronnes de source

**Cartes :** Roséclair (F01-019) → Ruisselet (F01-020) → Vasqueroy (F01-021).

**Concept :** Une grenouille transporte les premières gouttes du matin. **Transformation :** Grenouille-goutte → marcheur de rivière → gardien de vasque.

**Personnalité :** Enjoué → serviable → contemplatif. **Gimmick :** Trois gouttes formant une couronne.

**Marqueurs conservés :** Yeux hauts et couronne à trois pointes. **Élément féerique :** Eau recueillie.

**Palette :** #78e8db / #369bab / #d3fff1. **Type :** Rosée. **Habitat :** Mare.

#### L08 — Rubans de cascade

**Cartes :** Filonde (F01-022) → Frangonde (F01-023) → Nympharive (F01-024).

**Concept :** Une salamandre tisse le courant autour des pierres. **Transformation :** Petit ruban mouillé → nageur frangé → salamandre aux nageoires-voiles.

**Personnalité :** Discret → vif → accueillant. **Gimmick :** Franges corail et queue en ruban noué.

**Marqueurs conservés :** Trois branchies corail de chaque côté du visage. **Élément féerique :** Cascade tissée.

**Palette :** #77cfd5 / #376e9c / #ffccad. **Type :** Rosée. **Habitat :** Cascade.

#### L09 — Lanternes de pollen

**Cartes :** Luciolot (F01-025) → Lanterlume (F01-026) → Cortélampe (F01-027).

**Concept :** Une luciole réchauffe les fleurs sans les brûler. **Transformation :** Point lumineux → lanternier ailé → cortège de lumières.

**Personnalité :** Curieux → généreux → rassembleur. **Gimmick :** Abdomen en goutte-lanterne fendu par une nervure.

**Marqueurs conservés :** Deux antennes recourbées et ampoule en poire. **Élément féerique :** Feu doux.

**Palette :** #ffd678 / #be7954 / #fff6ce. **Type :** Étincelle. **Habitat :** Verger de braise.

#### L10 — Messagers du jour

**Cartes :** Aubepiou (F01-028) → Rubanvol (F01-029) → Vitraurore (F01-030).

**Concept :** Un oiseau recueille la lumière avant l’aube. **Transformation :** Oisillon à écharpe → hirondelle à rubans → messager aux ailes vitrail.

**Personnalité :** Confiant → audacieux → délicat. **Gimmick :** Queue en deux rubans et petite écharpe crème.

**Marqueurs conservés :** Queue bifide et plume frontale en losange. **Élément féerique :** Première lumière.

**Palette :** #ffcb85 / #b77776 / #fff4c1. **Type :** Aurore. **Habitat :** Aurore.

#### L11 — Nœuds des étoiles

**Cartes :** Nouétoile (F01-031) → Anneleau (F01-032) → Pontastrie (F01-033).

**Concept :** Un serpent apprend à relier des constellations. **Transformation :** Ruban noué → serpent portant des anneaux → pont stellaire vivant.

**Personnalité :** Distrait → joueur → attentif. **Gimmick :** Nœud ivoire à la nuque, transformé en anneau.

**Marqueurs conservés :** Tête ovale et nœud clair derrière le visage. **Élément féerique :** Constellations reliées.

**Palette :** #9aa4f2 / #51568a / #d9ffe4. **Type :** Astral. **Habitat :** Dimension astrale.

#### L12 — Petits remparts

**Cartes :** Mottignon (F01-034) → Dallardin (F01-035) → Rempartille (F01-036).

**Concept :** Une motte aide les plantes à tenir debout. **Transformation :** Motte trapue → golem de pierres jardinières → rempart mobile à jardins.

**Personnalité :** Dévoué → méthodique → serein. **Gimmick :** Carré de terre au front et bras en branches fourchues.

**Marqueurs conservés :** Front carré et deux mains fourchues. **Élément féerique :** Terre accueillante.

**Palette :** #adb68c / #637a67 / #e4dcb7. **Type :** Sylve. **Habitat :** Ruines féeriques.

#### L13 — Ailes du souvenir

**Cartes :** Lunailée (F01-037) → Noctipapille (F01-038).

**Concept :** Un papillon porte les rêves recueillis par la lune. **Transformation :** Papillon aux croissants → oracle aux ailes tentures.

**Personnalité :** Curieux → calme, écoute les songes oubliés. **Gimmick :** Deux ailes lunaires devenant quatre panneaux ocellés.

**Marqueurs conservés :** Antennes en gouttes et médaillon au thorax. **Élément féerique :** Souvenirs de nuit.

**Palette :** #c0adff / #7666ca / #ffe0fa. **Type :** Lune. **Habitat :** Nuit étoilée.

#### L14 — Flammes câlines

**Cartes :** Flamèche (F01-039) → Braiseloup (F01-040).

**Concept :** Un renard abrite une flamme qui réchauffe ses amis. **Transformation :** Renardeau à queue-bougie → canidé à manteau de braise.

**Personnalité :** Joueur → protecteur. **Gimmick :** Queue flamme retournée comme un point d’interrogation.

**Marqueurs conservés :** Grandes oreilles triangulaires et pointe de queue crème. **Élément féerique :** Braise sans brûlure.

**Palette :** #ffbf78 / #ce7156 / #fff0bb. **Type :** Étincelle. **Habitat :** Verger de braise.

#### L15 — Escaliers d’écorce

**Cartes :** Lentefeuille (F01-041) → Cabacrète (F01-042).

**Concept :** Une limace construit des escaliers avec les feuilles mortes. **Transformation :** Limace feuille → escargot à cabane spiralée.

**Personnalité :** Paisible → hospitalier. **Gimmick :** Deux antennes terminées en feuilles rondes.

**Marqueurs conservés :** Antennes rondes et patin de mousse. **Élément féerique :** Écorce habitée.

**Palette :** #9fcea7 / #587f74 / #edcfa3. **Type :** Sylve. **Habitat :** Sous-bois.

#### L16 — Miroirs de mare

**Cartes :** Bullipin (F01-043) → Roseauvin (F01-044).

**Concept :** Un poisson apprend à lire le ciel dans l’eau. **Transformation :** Poisson rond à bulle → poisson aux nageoires de roseaux.

**Personnalité :** Rêveur → inventif. **Gimmick :** Bulle portée au front et nageoire en feuille.

**Marqueurs conservés :** Bulle frontale et queue à deux feuilles. **Élément féerique :** Reflets inversés.

**Palette :** #b4e8e8 / #628da7 / #ffd5da. **Type :** Rosée. **Habitat :** Ruisseau.

#### L17 — Gardes du pollen

**Cartes :** Pollenpin (F01-045) → Verrélytre (F01-046).

**Concept :** Un scarabée veille sur les fleurs endormies. **Transformation :** Scarabée doré → sentinelle aux ailes-vitrail.

**Personnalité :** Sérieux → tendre derrière sa carapace. **Gimmick :** Carapace en bouclier à fente solaire.

**Marqueurs conservés :** Fente centrale et antennes en demi-cercle. **Élément féerique :** Pollen protégé.

**Palette :** #e6c675 / #947459 / #fff1b9. **Type :** Aurore. **Habitat :** Canopée.

#### L18 — Veilleurs de cristal

**Cartes :** Échomimi (F01-047) → Géodoreille (F01-048).

**Concept :** Une chauve-souris rapporte les notes qui résonnent sous terre. **Transformation :** Chauve-souris ronde → oreillard aux ailes géodes.

**Personnalité :** Sensible → musicien généreux. **Gimmick :** Grandes oreilles en cuillère et ventre triangulaire clair.

**Marqueurs conservés :** Oreilles cuillères et bijou ventral. **Élément féerique :** Résonance minérale.

**Palette :** #aab1e8 / #62699d / #d1fff1. **Type :** Lune. **Habitat :** Grotte cristalline.

#### L19 — Marées de nacre

**Cartes :** Brumelin (F01-049) → Nacréveil (F01-050).

**Concept :** Un petit poisson apprend à porter un lac entier. **Transformation :** Poisson-perle → baleine de brume suspendue.

**Personnalité :** Souriant → paisible et protecteur. **Gimmick :** Perle frontale et nageoires comme des manches.

**Marqueurs conservés :** Perle ivoire au front et deux nageoires arrondies. **Élément féerique :** Marée suspendue.

**Palette :** #8ebfd9 / #607ca7 / #fff0d1. **Type :** Rosée. **Habitat :** Sanctuaire.

#### L20 — Écharpes des brumes

**Cartes :** Brumou (F01-051) → Écharume (F01-052).

**Concept :** Un esprit échange ses écharpes avec les voyageurs. **Transformation :** Goutte flottante → esprit aux deux rubans de brume.

**Personnalité :** Distrait → attentionné. **Gimmick :** Nœud de tissu corail sous le visage.

**Marqueurs conservés :** Nœud corail et yeux en petites virgules. **Élément féerique :** Brume accueillante.

**Palette :** #c5dbdd / #7796a2 / #ffd1c0. **Type :** Rosée. **Habitat :** Clairière.

### Les huit créatures uniques

Brindiboule (F01-053, Commune) ; Goutteline (F01-054, Commune) ; Miettambre (F01-055, Commune) ; Tintabule (F01-056, Commune) ; Azurielle (F01-057, Épique) ; Auralis (F01-058, Légendaire) ; Horlogrève (F01-059, Légendaire) ; Velours d’Entre-mondes (F01-060, Mythique).

### Bibliothèque d'anatomies

25 familles sont produites ; les 60 compositions sont dirigées (le papillon conserve ses deux compositions validées). La compatibilité des composants est dirigée par anatomie, pas un système qui mélange arbitrairement n'importe quelle tête et n'importe quel corps. Les 48 nouvelles recettes possèdent des transformations propres à leur lignée.

| Anatomie | Statut du moteur d'étude | Cartes du roster |
| --- | --- | --- |
| Graine (seed) | Produite | Moussillon, Semenotte |
| Cervidé (deer) | Produite | Sylvérêve |
| Arbre-portail (treeGuardian) | Produite | Éon de la clairière |
| Lapin (rabbit) | Produite | Lièvrille, Ramifleur |
| Fleur (flower) | Produite | Boutonner, Coralève, Floréale |
| Champignon (mushroom) | Produite | Chantignon, Sporelle, Mycoralie |
| Scarabée (beetle) | Produite | Couspore, Brochignon, Mycélisseur, Pollenpin, Verrélytre, Miettambre |
| Félin (cat) | Produite | Somnouchat, Croissombre, Songegarde |
| Grenouille (frog) | Produite | Roséclair, Ruisselet, Vasqueroy |
| Salamandre (salamander) | Produite | Filonde, Frangonde, Nympharive |
| Luciole (firefly) | Produite | Luciolot, Lanterlume, Cortélampe |
| Oiseau (bird) | Produite | Aubepiou, Rubanvol, Vitraurore |
| Serpent (serpent) | Produite | Nouétoile, Anneleau, Pontastrie |
| Golem / automate (golem) | Produite | Mottignon, Dallardin, Rempartille, Horlogrève |
| Papillon (moth) | Produite | Lunailée, Noctipapille |
| Canidé (canine) | Produite | Flamèche, Braiseloup |
| Limace (slug) | Produite | Lentefeuille, Goutteline |
| Escargot (snail) | Produite | Cabacrète |
| Poisson (fish) | Produite | Bullipin, Roseauvin, Brumelin, Azurielle |
| Chauve-souris (bat) | Produite | Échomimi, Géodoreille |
| Baleine (whale) | Produite | Nacréveil |
| Créature ronde (round) | Produite | Brindiboule |
| Esprit flottant (spirit) | Produite | Brumou, Écharume, Tintabule |
| Dragon léger (dragon) | Produite | Auralis |
| Voile astral (manta) | Produite | Velours d’Entre-mondes |

### Habitats construits en code

16 profils distincts : motifs géométriques, palettes, horizons et plans de sol. Le seed varie des détails secondaires déterministes ; le choix d'habitat appartient au design. Les habitats peuplés plus tard restent disponibles dans l'atlas.

| Habitat | Construction | Designs |
| --- | --- | ---: |
| Clairière (clearing) | trees · variante 0 | 3 |
| Sous-bois (understory) | trees · variante 1 | 5 |
| Champ de fleurs (meadow) | flowers · variante 0 | 6 |
| Arbre ancien (ancient-tree) | trees · variante 2 | 3 |
| Ruisseau (river) | water · variante 0 | 2 |
| Mare (pond) | water · variante 1 | 4 |
| Cascade (waterfall) | water · variante 2 | 4 |
| Grotte cristalline (crystal-cave) | crystals · variante 0 | 2 |
| Forêt de champignons (fungal-forest) | mushrooms · variante 0 | 3 |
| Nuit étoilée (star-night) | stars · variante 0 | 5 |
| Ruines féeriques (ruins) | ruins · variante 0 | 4 |
| Canopée (canopy) | canopy · variante 0 | 3 |
| Aurore (dawn) | aurora · variante 0 | 4 |
| Sanctuaire (sanctuary) | ruins · variante 1 | 2 |
| Dimension astrale (astral) | portal · variante 0 | 4 |
| Verger de braise (ember-orchard) | flowers · variante 1 | 6 |

### Échantillon de validation — 12 cartes

Moussillon (F01-001, Graine, Commune) ; Sylvérêve (F01-002, Cervidé, Rare) ; Éon de la clairière (F01-003, Arbre-portail, Mythique) ; Lièvrille (F01-005, Lapin, Peu commune) ; Chantignon (F01-010, Champignon, Commune) ; Frangonde (F01-023, Salamandre, Peu commune) ; Lanterlume (F01-026, Luciole, Peu commune) ; Aubepiou (F01-028, Oiseau, Commune) ; Lunailée (F01-037, Papillon, Peu commune) ; Noctipapille (F01-038, Papillon, Épique) ; Horlogrève (F01-059, Golem / automate, Légendaire) ; Velours d’Entre-mondes (F01-060, Voile astral, Mythique).

Il couvre les sept types, L01 complète en trois stades, L13 complète en deux stades, des membres de cinq autres lignées et deux uniques. Il comprend une Épique, une Légendaire et les deux Mythiques. Les contrôles de /dev comparent 48/64/80/112/160 px, silhouettes, fonds, palettes, parties, seeds, animations et cartes avec habitats. Arrêt manuel des animations et préférence de mouvement réduit sont respectés.

### Fiches complètes des 60 cartes

#### F01-001 — Moussillon

**ID / numéro :** F01-001 · 001 / 060. **Lignée :** L01. **EvolvesFrom :** —. **EvolvesTo :** F01-002. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Graine (seed). **Silhouette :** Goutte basse, deux oreilles latérales et feuille bifide.

**Palette principale :** #91df78. **Palette secondaire :** #479e78. **Lumière :** #eaffb1. **Habitat :** Arbre ancien.

**Personnalité :** Timide, cache ses graines dans la mousse. **Description visuelle :** Bulbe à ventre ivoire, racines-pattes, coiffe à deux feuilles.

**Marqueurs / relations visuelles :** Deux oreilles-feuilles, yeux en amande, bourgeon ivoire.

**Rôle gameplay :** Clic. **Effet actif :** +1 / clic. **Données d'effet :** `{"clickFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il emporte un printemps entier dans sa fourrure. » **Seed :** 1037. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=bulb ; headVariant=round ; ears=leaf ; horns=none ; wings=none ; tail=sprig ; crown=splitLeaf ; markings=freckles ; accessory=none ; aura=none ; idle=seedBounce ; posture=curled ; proportions={"head":1.2,"width":0.78,"height":0.8} ; face={"eyes":"round","spacing":12,"mouth":"smile","mask":false,"asymmetric":false}.

#### F01-002 — Sylvérêve

**ID / numéro :** F01-002 · 002 / 060. **Lignée :** L01. **EvolvesFrom :** F01-001. **EvolvesTo :** F01-003. **Stade :** Évolution 1.

**Rareté :** Rare. **Type :** Sylve. **Anatomie :** Cervidé (deer). **Silhouette :** Profil de cervidé élancé, ramures ouvertes en V.

**Palette principale :** #91df78. **Palette secondaire :** #479e78. **Lumière :** #eaffb1. **Habitat :** Arbre ancien.

**Personnalité :** Curieux, guide les enfants hors des ronces. **Description visuelle :** Quatre jambes fines, collerette de feuilles, ramure à bourgeons ivoire.

**Marqueurs / relations visuelles :** Deux oreilles-feuilles, yeux en amande, bourgeon ivoire.

**Rôle gameplay :** Synergie. **Effet actif :** +6 % énergie Faerie. **Données d'effet :** `{"faerieBonus":0.06}`.

**Capacité future, non active :** +20 % clic si 3 Sylve équipées.

**Flavor text :** « Les sentiers oubliés refleurissent sous ses pas. » **Seed :** 1074. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=slender ; headVariant=long ; ears=leaf ; horns=branch ; wings=none ; tail=leaf ; crown=buds ; markings=freckles ; accessory=leafScarf ; aura=none ; idle=leafSway ; posture=quadruped ; proportions={"head":0.78,"width":0.84,"height":1} ; face={"eyes":"almond","spacing":9,"mouth":"muzzle","mask":false,"asymmetric":false}.

#### F01-003 — Éon de la clairière

**ID / numéro :** F01-003 · 003 / 060. **Lignée :** L01. **EvolvesFrom :** F01-002. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Mythique. **Type :** Sylve. **Anatomie :** Arbre-portail (treeGuardian). **Silhouette :** Arche d’arbre creuse, canopée désaxée, branche latérale basse, racines et feuilles satellites.

**Palette principale :** #91df78. **Palette secondaire :** #479e78. **Lumière :** #eaffb1. **Habitat :** Arbre ancien.

**Personnalité :** Patient, offre un abri aux souvenirs égarés. **Description visuelle :** Un arbre-portail sans visage classique. La canopée monte à gauche et descend à droite ; un cœur-graine lumineux flotte dans l’arche, entouré de feuilles détachées. Les deux branches en V et la feuille bifide rappellent ses premiers stades.

**Marqueurs / relations visuelles :** Deux oreilles-feuilles, yeux en amande, bourgeon ivoire.

**Rôle gameplay :** Synergie. **Effet actif :** +8 % énergie Faerie · +2 éclats / doublon. **Données d'effet :** `{"faerieBonus":0.08,"duplicateBonus":2}`.

**Capacité future, non active :** +1 % énergie globale par espèce découverte, plafond +60 %.

**Flavor text :** « La clairière rêvait de lui avant la première étoile. » **Seed :** 1111. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=portalTree ; headVariant=portal ; ears=leaf ; horns=branch ; wings=none ; tail=roots ; crown=canopy ; markings=runes ; accessory=seedCore ; aura=rootPulse ; idle=rootPulse ; posture=rooted ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"none","spacing":0,"mouth":"none","mask":false,"asymmetric":false}.

**Signature composition :** Tronc ancré en bas, arche ouverte au centre, branches débordant en haut.

**Signature idle :** Racines qui respirent, noyau qui pulse, tronc stable.

**Signature habitatDetail :** Arbre ancien creux et racines en passerelles, souvenirs-lucioles.

**Signature aura :** Pulsation de racines ivoire, halo vert intérieur.

**Signature narrative :** Le premier arbre de Faerie accueille les souvenirs des mondes traversés.

#### F01-004 — Semenotte

**ID / numéro :** F01-004 · 004 / 060. **Lignée :** L02. **EvolvesFrom :** —. **EvolvesTo :** F01-005. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Graine (seed). **Silhouette :** Petit noyau vertical sous deux feuilles longues.

**Palette principale :** #c6e987. **Palette secondaire :** #649d80. **Lumière :** #ffd7c4. **Habitat :** Champ de fleurs.

**Personnalité :** Prudent, écoute sous la terre. **Description visuelle :** Graine crème en coque verte, feuilles comme oreilles encore pliées.

**Marqueurs / relations visuelles :** Deux oreilles asymétriques et trois boutons roses.

**Rôle gameplay :** Clic. **Effet actif :** +1 / clic. **Données d'effet :** `{"clickFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Elle connaît le chemin avant le premier pas. » **Seed :** 1148. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=kernel ; headVariant=round ; posture=curled ; proportions={"head":0.8,"width":0.7,"height":0.85} ; face={"eyes":"round","spacing":8,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=seedBounce.

#### F01-005 — Lièvrille

**ID / numéro :** F01-005 · 005 / 060. **Lignée :** L02. **EvolvesFrom :** F01-004. **EvolvesTo :** F01-006. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Sylve. **Anatomie :** Lapin (rabbit). **Silhouette :** Grandes oreilles verticales, corps assis court, queue ronde.

**Palette principale :** #c6e987. **Palette secondaire :** #649d80. **Lumière :** #ffd7c4. **Habitat :** Champ de fleurs.

**Personnalité :** Joueur, distribue ses fleurs sans compter. **Description visuelle :** Lapin menthe, une oreille couchée, manchettes de feuilles et boutons roses.

**Marqueurs / relations visuelles :** Deux oreilles asymétriques et trois boutons roses.

**Rôle gameplay :** Clic. **Effet actif :** +15 % combo. **Données d'effet :** `{"comboMultiplier":0.15}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Son oreille gauche a toujours une fleur d’avance. » **Seed :** 1185. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=seated ; headVariant=round ; ears=long ; horns=none ; wings=none ; tail=pom ; crown=buds ; markings=freckles ; accessory=leafScarf ; aura=none ; idle=earTwitch ; posture=seated ; proportions={"head":1.15,"width":0.95,"height":0.95} ; face={"eyes":"round","spacing":17,"mouth":"muzzle","mask":false,"asymmetric":true}.

#### F01-006 — Ramifleur

**ID / numéro :** F01-006 · 006 / 060. **Lignée :** L02. **EvolvesFrom :** F01-005. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Sylve. **Anatomie :** Lapin (rabbit). **Silhouette :** Lièvre penché, oreilles en boucle, cape végétale triangulaire.

**Palette principale :** #c6e987. **Palette secondaire :** #649d80. **Lumière :** #ffd7c4. **Habitat :** Champ de fleurs.

**Personnalité :** Intrépide, attend toujours le plus petit compagnon. **Description visuelle :** Oreilles devenues rubans de fleurs, grandes pattes et capeline de rameaux.

**Marqueurs / relations visuelles :** Deux oreilles asymétriques et trois boutons roses.

**Rôle gameplay :** Synergie. **Effet actif :** +2 / clic. **Données d'effet :** `{"clickFlat":2}`.

**Capacité future, non active :** +20 % combo lorsque le combo ≥ 75.

**Flavor text :** « Il ouvre les haies sans casser une branche. » **Seed :** 1222. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=runner ; headVariant=round ; posture=leaning ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"almond","spacing":10,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=earTwitch.

#### F01-007 — Boutonner

**ID / numéro :** F01-007 · 007 / 060. **Lignée :** L03. **EvolvesFrom :** —. **EvolvesTo :** F01-008. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Fleur (flower). **Silhouette :** Bouton rond sur tige très courte, deux feuilles-pieds.

**Palette principale :** #ffb6cb. **Palette secondaire :** #b96397. **Lumière :** #fff0b2. **Habitat :** Champ de fleurs.

**Personnalité :** Réservé, s’ouvre aux compliments. **Description visuelle :** Pétales fermés corail, bouche en sourire dans une fente du bouton.

**Marqueurs / relations visuelles :** Cœur corail et trois pétales levés.

**Rôle gameplay :** Idle. **Effet actif :** +0.8 / sec. **Données d'effet :** `{"autoFlat":0.8}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Un bonjour suffit pour qu’il s’éveille. » **Seed :** 1259. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=bud ; headVariant=round ; posture=rooted ; proportions={"head":1,"width":0.65,"height":0.7} ; face={"eyes":"round","spacing":8,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=petalDance.

#### F01-008 — Coralève

**ID / numéro :** F01-008 · 008 / 060. **Lignée :** L03. **EvolvesFrom :** F01-007. **EvolvesTo :** F01-009. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Sylve. **Anatomie :** Fleur (flower). **Silhouette :** Fleur debout, cinq pétales larges, tige souple en S.

**Palette principale :** #ffb6cb. **Palette secondaire :** #b96397. **Lumière :** #fff0b2. **Habitat :** Champ de fleurs.

**Personnalité :** Sociable, danse pour les abeilles. **Description visuelle :** Visage pêche encadré de mains-pétales, feuille-écharpe.

**Marqueurs / relations visuelles :** Cœur corail et trois pétales levés.

**Rôle gameplay :** Idle. **Effet actif :** +12 % passif. **Données d'effet :** `{"autoMultiplier":0.12}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Elle applaudit même les chansons les plus timides. » **Seed :** 1296. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=dancer ; headVariant=round ; posture=leaning ; proportions={"head":1,"width":0.85,"height":1} ; face={"eyes":"round","spacing":11,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=petalDance.

#### F01-009 — Floréale

**ID / numéro :** F01-009 · 009 / 060. **Lignée :** L03. **EvolvesFrom :** F01-008. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Légendaire. **Type :** Sylve. **Anatomie :** Fleur (flower). **Silhouette :** Éventail floral géant, trois corolles sur une tige arquée.

**Palette principale :** #ffb6cb. **Palette secondaire :** #b96397. **Lumière :** #fff0b2. **Habitat :** Champ de fleurs.

**Personnalité :** Bienveillante, dirige les fêtes du sous-bois. **Description visuelle :** Bouquet à trois visages doux, corolle centrale comme une scène, rubans de pollen.

**Marqueurs / relations visuelles :** Cœur corail et trois pétales levés.

**Rôle gameplay :** Synergie. **Effet actif :** +4 / sec · +6 % énergie Faerie. **Données d'effet :** `{"autoFlat":4,"faerieBonus":0.06}`.

**Capacité future, non active :** +20 % passif sans Étincelle équipée.

**Flavor text :** « Tout le jardin se penche pour l’écouter. » **Seed :** 1333. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=ceremony ; headVariant=round ; posture=rooted ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"luminous","spacing":7,"mouth":"none","mask":true,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=moonHalo ; idle=flowerCeremony.

**Signature composition :** Direction prévue : corolle cérémonielle très large, tige fine penchée, deux pétales latéraux inégaux, stigmate masqué au centre ; aucun corps animal ajouté.

**Signature idle :** Direction prévue : la tige ploie lentement tandis que deux pétales satellites décrivent un cycle plus long ; lumière du stigmate au second cycle.

**Signature habitatDetail :** Amphithéâtre de fleurs et public de pollen.

**Signature aura :** Rubans de pollen corail.

**Signature narrative :** La forêt retrouve sa voix lors de ses floraisons.

#### F01-010 — Chantignon

**ID / numéro :** F01-010 · 010 / 060. **Lignée :** L04. **EvolvesFrom :** —. **EvolvesTo :** F01-011. **Stade :** Base.

**Rareté :** Commune. **Type :** Mycète. **Anatomie :** Champignon (mushroom). **Silhouette :** Grand chapeau horizontal, pied court, collerette à pointes.

**Palette principale :** #fd8aaf. **Palette secondaire :** #b14478. **Lumière :** #ffe9bd. **Habitat :** Forêt de champignons.

**Personnalité :** Bavard, fredonne au lever du brouillard. **Description visuelle :** Coiffe rose ample, lamelles miel, petit pied crème avec bras mous.

**Marqueurs / relations visuelles :** Collerette ivoire et signature à trois taches.

**Rôle gameplay :** Idle. **Effet actif :** +1 / sec. **Données d'effet :** `{"autoFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Sa chanson ne se répète jamais deux fois. » **Seed :** 1370. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=shortStem ; headVariant=cap ; ears=none ; horns=none ; wings=none ; tail=none ; crown=scallopCap ; markings=spores ; accessory=ruff ; aura=none ; idle=sporeFall ; posture=leaning ; proportions={"head":1,"width":0.9,"height":0.9} ; face={"eyes":"narrow","spacing":9,"mouth":"none","mask":false,"asymmetric":false}.

#### F01-011 — Sporelle

**ID / numéro :** F01-011 · 011 / 060. **Lignée :** L04. **EvolvesFrom :** F01-010. **EvolvesTo :** F01-012. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Mycète. **Anatomie :** Champignon (mushroom). **Silhouette :** Deux chapeaux inclinés, pied élancé et bras de mousse.

**Palette principale :** #fd8aaf. **Palette secondaire :** #b14478. **Lumière :** #ffe9bd. **Habitat :** Forêt de champignons.

**Personnalité :** Attentive, écoute les racines. **Description visuelle :** Deux trompettes roses reliées par une collerette, taches triangulaires communes.

**Marqueurs / relations visuelles :** Collerette ivoire et signature à trois taches.

**Rôle gameplay :** Idle. **Effet actif :** +1.5 / sec · +8 % passif. **Données d'effet :** `{"autoFlat":1.5,"autoMultiplier":0.08}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Elle conserve chaque note dans une spore. » **Seed :** 1407. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=trumpets ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.95,"height":1} ; face={"eyes":"crescent","spacing":10,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=sporeFall.

#### F01-012 — Mycoralie

**ID / numéro :** F01-012 · 012 / 060. **Lignée :** L04. **EvolvesFrom :** F01-011. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Mycète. **Anatomie :** Champignon (mushroom). **Silhouette :** Trois chapeaux en cascade, socle de racines large.

**Palette principale :** #fd8aaf. **Palette secondaire :** #b14478. **Lumière :** #ffe9bd. **Habitat :** Forêt de champignons.

**Personnalité :** Encourageante, laisse chanter les débutants. **Description visuelle :** Orchestre de coiffes superposées, baguettes de mycélium, visage bas sous le grand chapeau.

**Marqueurs / relations visuelles :** Collerette ivoire et signature à trois taches.

**Rôle gameplay :** Synergie. **Effet actif :** +15 % passif. **Données d'effet :** `{"autoMultiplier":0.15}`.

**Capacité future, non active :** +20 % passif si 3 Mycète équipées.

**Flavor text :** « Les silences sont aussi des instruments. » **Seed :** 1444. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=orchestra ; headVariant=round ; posture=rooted ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"narrow","spacing":10,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=sporeFall.

#### F01-013 — Couspore

**ID / numéro :** F01-013 · 013 / 060. **Lignée :** L05. **EvolvesFrom :** —. **EvolvesTo :** F01-014. **Stade :** Base.

**Rareté :** Commune. **Type :** Mycète. **Anatomie :** Scarabée (beetle). **Silhouette :** Ovale compact, six pattes courtes et antennes en boucle.

**Palette principale :** #bc99ec. **Palette secondaire :** #6457a1. **Lumière :** #f4ddad. **Habitat :** Sous-bois.

**Personnalité :** Appliqué, répare les feuilles abîmées. **Description visuelle :** Élytres lilas avec couture ivoire, tête basse et outils en brindilles.

**Marqueurs / relations visuelles :** Six petites pattes et couture en X.

**Rôle gameplay :** Collection. **Effet actif :** +0.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":0.5}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Aucun trou n’est trop petit pour son attention. » **Seed :** 1481. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=brooch ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.7,"height":0.75} ; face={"eyes":"round","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=shellRock.

#### F01-014 — Brochignon

**ID / numéro :** F01-014 · 014 / 060. **Lignée :** L05. **EvolvesFrom :** F01-013. **EvolvesTo :** F01-015. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Mycète. **Anatomie :** Scarabée (beetle). **Silhouette :** Carapace en losange, antennes recourbées, sac dorsal.

**Palette principale :** #bc99ec. **Palette secondaire :** #6457a1. **Lumière :** #f4ddad. **Habitat :** Sous-bois.

**Personnalité :** Fier de son premier jardin. **Description visuelle :** Sac de spores posé sur une broche chitineuse, couture en X plus large.

**Marqueurs / relations visuelles :** Six petites pattes et couture en X.

**Rôle gameplay :** Collection. **Effet actif :** +3 % réduction booster. **Données d'effet :** `{"boosterDiscount":0.03}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il ferme son sac avec une étoile de fil. » **Seed :** 1518. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=satchel ; headVariant=round ; posture=standing ; proportions={"head":0.9,"width":0.85,"height":1} ; face={"eyes":"almond","spacing":9,"mouth":"none","mask":false,"asymmetric":true} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=shellRock.

#### F01-015 — Mycélisseur

**ID / numéro :** F01-015 · 015 / 060. **Lignée :** L05. **EvolvesFrom :** F01-014. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Mycète. **Anatomie :** Scarabée (beetle). **Silhouette :** Élytres ouverts portant deux jardins, six pattes fines.

**Palette principale :** #bc99ec. **Palette secondaire :** #6457a1. **Lumière :** #f4ddad. **Habitat :** Sous-bois.

**Personnalité :** Attentionné, partage ses outils. **Description visuelle :** Plateaux de champignons sur les ailes rigides, pinces douces en forme d’aiguilles.

**Marqueurs / relations visuelles :** Six petites pattes et couture en X.

**Rôle gameplay :** Synergie. **Effet actif :** +1.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":1.5}`.

**Capacité future, non active :** +2 éclats / doublon si 2 membres de L05 équipés.

**Flavor text :** « Son ouvrage relie les coins oubliés du monde. » **Seed :** 1555. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=gardens ; headVariant=round ; posture=openWings ; proportions={"head":0.75,"width":1,"height":1} ; face={"eyes":"narrow","spacing":9,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=leafSway.

#### F01-016 — Somnouchat

**ID / numéro :** F01-016 · 016 / 060. **Lignée :** L06. **EvolvesFrom :** —. **EvolvesTo :** F01-017. **Stade :** Base.

**Rareté :** Commune. **Type :** Lune. **Anatomie :** Félin (cat). **Silhouette :** Chaton roulé en virgule, tête large et queue croissant.

**Palette principale :** #b8b4f3. **Palette secondaire :** #615787. **Lumière :** #ffe2b7. **Habitat :** Nuit étoilée.

**Personnalité :** Somnolent, ronronne dans les poches. **Description visuelle :** Pelage lavande, masque crème et coussin d’ombre sous les pattes.

**Marqueurs / relations visuelles :** Croissant de queue et oreilles rondes à pointe claire.

**Rôle gameplay :** Clic. **Effet actif :** +2 points critique. **Données d'effet :** `{"critChance":0.02}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il rêve pour ceux qui ont oublié de dormir. » **Seed :** 1592. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=kitten ; headVariant=round ; posture=curled ; proportions={"head":1.2,"width":0.75,"height":0.8} ; face={"eyes":"crescent","spacing":10,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=breathe.

#### F01-017 — Croissombre

**ID / numéro :** F01-017 · 017 / 060. **Lignée :** L06. **EvolvesFrom :** F01-016. **EvolvesTo :** F01-018. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Lune. **Anatomie :** Félin (cat). **Silhouette :** Félin de profil, queue en arc haute, longues pattes souples.

**Palette principale :** #b8b4f3. **Palette secondaire :** #615787. **Lumière :** #ffe2b7. **Habitat :** Nuit étoilée.

**Personnalité :** Espiègle, cache les mauvaises pensées. **Description visuelle :** Masque ivoire et cape nocturne ponctuée de lunes, oreilles arrondies.

**Marqueurs / relations visuelles :** Croissant de queue et oreilles rondes à pointe claire.

**Rôle gameplay :** Clic. **Effet actif :** +0.2 multiplicateur critique. **Données d'effet :** `{"critMultiplier":0.2}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Une ombre douce précède chacun de ses bonds. » **Seed :** 1629. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=prowler ; headVariant=round ; posture=quadruped ; proportions={"head":0.8,"width":0.95,"height":1} ; face={"eyes":"almond","spacing":8,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=tailWave.

#### F01-018 — Songegarde

**ID / numéro :** F01-018 · 018 / 060. **Lignée :** L06. **EvolvesFrom :** F01-017. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Épique. **Type :** Lune. **Anatomie :** Félin (cat). **Silhouette :** Félin couché sur large coussin flottant, queue formant un halo.

**Palette principale :** #b8b4f3. **Palette secondaire :** #615787. **Lumière :** #ffe2b7. **Habitat :** Nuit étoilée.

**Personnalité :** Rassurant, surveille les rêves des plus petits. **Description visuelle :** Crinière de velours, coussin astral tenu par la queue en croissant.

**Marqueurs / relations visuelles :** Croissant de queue et oreilles rondes à pointe claire.

**Rôle gameplay :** Synergie. **Effet actif :** +3 points critique · +10 % combo. **Données d'effet :** `{"critChance":0.03,"comboMultiplier":0.1}`.

**Capacité future, non active :** +0.5 multiplicateur critique lorsque le combo ≥ 75.

**Flavor text :** « Les cauchemars deviennent des histoires près de lui. » **Seed :** 1666. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=dreamCushion ; headVariant=round ; posture=floating ; proportions={"head":0.9,"width":1,"height":1} ; face={"eyes":"crescent","spacing":9,"mouth":"muzzle","mask":true,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=moonHalo ; idle=tideFloat.

#### F01-019 — Roséclair

**ID / numéro :** F01-019 · 019 / 060. **Lignée :** L07. **EvolvesFrom :** —. **EvolvesTo :** F01-020. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Grenouille (frog). **Silhouette :** Corps trapu, yeux hauts, cuisses larges en triangle.

**Palette principale :** #78e8db. **Palette secondaire :** #369bab. **Lumière :** #d3fff1. **Habitat :** Mare.

**Personnalité :** Enjoué, collectionne les gouttes rondes. **Description visuelle :** Grenouille turquoise à couronne de rosée, ventre lait et doigts en éventail.

**Marqueurs / relations visuelles :** Yeux hauts et couronne à trois pointes.

**Rôle gameplay :** Idle. **Effet actif :** +1.2 / sec. **Données d'effet :** `{"autoFlat":1.2}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Chaque goutte est un minuscule ciel à protéger. » **Seed :** 1703. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=dropFrog ; headVariant=round ; posture=seated ; proportions={"head":1,"width":0.8,"height":0.8} ; face={"eyes":"round","spacing":18,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=seedBounce.

#### F01-020 — Ruisselet

**ID / numéro :** F01-020 · 020 / 060. **Lignée :** L07. **EvolvesFrom :** F01-019. **EvolvesTo :** F01-021. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Rosée. **Anatomie :** Grenouille (frog). **Silhouette :** Grenouille debout aux jambes fines, manteau d’eau triangulaire.

**Palette principale :** #78e8db. **Palette secondaire :** #369bab. **Lumière :** #d3fff1. **Habitat :** Mare.

**Personnalité :** Serviable, accompagne les traversées. **Description visuelle :** Couronne élargie, longues jambes et cape liquide tendue entre les bras.

**Marqueurs / relations visuelles :** Yeux hauts et couronne à trois pointes.

**Rôle gameplay :** Idle. **Effet actif :** +10 % passif. **Données d'effet :** `{"autoMultiplier":0.1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il trouve toujours un gué pour ses amis. » **Seed :** 1740. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=waterWalker ; headVariant=round ; posture=standing ; proportions={"head":0.8,"width":0.85,"height":1} ; face={"eyes":"almond","spacing":12,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-021 — Vasqueroy

**ID / numéro :** F01-021 · 021 / 060. **Lignée :** L07. **EvolvesFrom :** F01-020. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Rosée. **Anatomie :** Grenouille (frog). **Silhouette :** Large grenouille assise dans une vasque de lotus, bras ouverts.

**Palette principale :** #78e8db. **Palette secondaire :** #369bab. **Lumière :** #d3fff1. **Habitat :** Mare.

**Personnalité :** Contemplatif, garde les eaux silencieuses. **Description visuelle :** Trois pointes de couronne comme fontaines, lotus porté sous le ventre.

**Marqueurs / relations visuelles :** Yeux hauts et couronne à trois pointes.

**Rôle gameplay :** Synergie. **Effet actif :** +2.5 / sec. **Données d'effet :** `{"autoFlat":2.5}`.

**Capacité future, non active :** +15 % passif sans Étincelle équipée.

**Flavor text :** « Les rivières ralentissent pour lui raconter leur voyage. » **Seed :** 1777. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=lotusBasin ; headVariant=round ; posture=seated ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"luminous","spacing":18,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-022 — Filonde

**ID / numéro :** F01-022 · 022 / 060. **Lignée :** L08. **EvolvesFrom :** —. **EvolvesTo :** F01-023. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Salamandre (salamander). **Silhouette :** Corps horizontal mince, quatre petites pattes, longue queue en S.

**Palette principale :** #77cfd5. **Palette secondaire :** #376e9c. **Lumière :** #ffccad. **Habitat :** Cascade.

**Personnalité :** Discret, se glisse sous les galets. **Description visuelle :** Salamandre bleu d’eau, ventre pêche et trois franges encore courtes.

**Marqueurs / relations visuelles :** Trois branchies corail de chaque côté du visage.

**Rôle gameplay :** Idle. **Effet actif :** +0.8 / sec. **Données d'effet :** `{"autoFlat":0.8}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Elle noue les courants sans les arrêter. » **Seed :** 1814. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=streamlet ; headVariant=round ; posture=quadruped ; proportions={"head":0.85,"width":0.8,"height":0.8} ; face={"eyes":"round","spacing":10,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tailWave.

#### F01-023 — Frangonde

**ID / numéro :** F01-023 · 023 / 060. **Lignée :** L08. **EvolvesFrom :** F01-022. **EvolvesTo :** F01-024. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Rosée. **Anatomie :** Salamandre (salamander). **Silhouette :** Tête large et basse, queue sinueuse, éventails de branchies.

**Palette principale :** #77cfd5. **Palette secondaire :** #376e9c. **Lumière :** #ffccad. **Habitat :** Cascade.

**Personnalité :** Vif, dessine des rubans dans l’écume. **Description visuelle :** Six branchies corail, long dos turquoise et queue ivoire bordée de bleu.

**Marqueurs / relations visuelles :** Trois branchies corail de chaque côté du visage.

**Rôle gameplay :** Idle. **Effet actif :** +15 % passif. **Données d'effet :** `{"autoMultiplier":0.15}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Sa queue écrit des lettres que seule l’eau sait lire. » **Seed :** 1851. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=ribbon ; headVariant=wide ; ears=gills ; horns=none ; wings=none ; tail=ribbon ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tailWave ; posture=turned ; proportions={"head":1.1,"width":1,"height":1} ; face={"eyes":"almond","spacing":15,"mouth":"muzzle","mask":false,"asymmetric":false}.

#### F01-024 — Nympharive

**ID / numéro :** F01-024 · 024 / 060. **Lignée :** L08. **EvolvesFrom :** F01-023. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Rosée. **Anatomie :** Salamandre (salamander). **Silhouette :** Corps en S étiré, nageoires latérales comme deux voiles.

**Palette principale :** #77cfd5. **Palette secondaire :** #376e9c. **Lumière :** #ffccad. **Habitat :** Cascade.

**Personnalité :** Accueillante, ouvre les chemins de cascade. **Description visuelle :** Franges devenues voilages, visage calme au bout d’un long ruban d’eau.

**Marqueurs / relations visuelles :** Trois branchies corail de chaque côté du visage.

**Rôle gameplay :** Synergie. **Effet actif :** +2 / sec · +3 % énergie Faerie. **Données d'effet :** `{"autoFlat":2,"faerieBonus":0.03}`.

**Capacité future, non active :** +20 % passif si 3 Rosée équipées.

**Flavor text :** « Elle laisse un passage sec au cœur des torrents. » **Seed :** 1888. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=riverSails ; headVariant=round ; posture=turned ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"almond","spacing":12,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-025 — Luciolot

**ID / numéro :** F01-025 · 025 / 060. **Lignée :** L09. **EvolvesFrom :** —. **EvolvesTo :** F01-026. **Stade :** Base.

**Rareté :** Commune. **Type :** Étincelle. **Anatomie :** Luciole (firefly). **Silhouette :** Petit insecte en poire, tête fine et abdomen lumineux.

**Palette principale :** #ffd678. **Palette secondaire :** #be7954. **Lumière :** #fff6ce. **Habitat :** Verger de braise.

**Personnalité :** Curieux, approche les fenêtres ouvertes. **Description visuelle :** Lanterne citron, ailes translucides courtes et antennes en boucle.

**Marqueurs / relations visuelles :** Deux antennes recourbées et ampoule en poire.

**Rôle gameplay :** Clic. **Effet actif :** +1 / clic. **Données d'effet :** `{"clickFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Sa lumière attend que vous souriiez. » **Seed :** 1925. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=sparkPear ; headVariant=round ; posture=suspended ; proportions={"head":0.9,"width":0.6,"height":0.75} ; face={"eyes":"round","spacing":5,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=lanternPulse.

#### F01-026 — Lanterlume

**ID / numéro :** F01-026 · 026 / 060. **Lignée :** L09. **EvolvesFrom :** F01-025. **EvolvesTo :** F01-027. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Étincelle. **Anatomie :** Luciole (firefly). **Silhouette :** Grosse lanterne suspendue à deux ailes en gouttes.

**Palette principale :** #ffd678. **Palette secondaire :** #be7954. **Lumière :** #fff6ce. **Habitat :** Verger de braise.

**Personnalité :** Généreux, éclaire les pétales fermés. **Description visuelle :** Abdomen miel compartimenté, deux ailes lilas et petit visage sombre sous les antennes.

**Marqueurs / relations visuelles :** Deux antennes recourbées et ampoule en poire.

**Rôle gameplay :** Clic. **Effet actif :** +15 % combo. **Données d'effet :** `{"comboMultiplier":0.15}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il n’allume jamais une fleur sans lui demander. » **Seed :** 1962. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=lantern ; headVariant=small ; ears=antennae ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=pollen ; accessory=lantern ; aura=firelight ; idle=lanternPulse ; posture=suspended ; proportions={"head":0.7,"width":0.78,"height":0.9} ; face={"eyes":"luminous","spacing":4,"mouth":"none","mask":true,"asymmetric":false}.

#### F01-027 — Cortélampe

**ID / numéro :** F01-027 · 027 / 060. **Lignée :** L09. **EvolvesFrom :** F01-026. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Étincelle. **Anatomie :** Luciole (firefly). **Silhouette :** Insecte fin au centre d’un éventail de lanternes satellites.

**Palette principale :** #ffd678. **Palette secondaire :** #be7954. **Lumière :** #fff6ce. **Habitat :** Verger de braise.

**Personnalité :** Rassembleur, guide les fêtes nocturnes. **Description visuelle :** Ailes étroites, abdomen principal et trois lampes reliées par des filaments de pollen.

**Marqueurs / relations visuelles :** Deux antennes recourbées et ampoule en poire.

**Rôle gameplay :** Synergie. **Effet actif :** +10 % clic. **Données d'effet :** `{"clickMultiplier":0.1}`.

**Capacité future, non active :** Chaque 25e clic produit ×10.

**Flavor text :** « Une procession joyeuse suit chacun de ses départs. » **Seed :** 1999. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=procession ; headVariant=round ; posture=floating ; proportions={"head":0.7,"width":1,"height":1} ; face={"eyes":"luminous","spacing":5,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=lanternPulse.

#### F01-028 — Aubepiou

**ID / numéro :** F01-028 · 028 / 060. **Lignée :** L10. **EvolvesFrom :** —. **EvolvesTo :** F01-029. **Stade :** Base.

**Rareté :** Commune. **Type :** Aurore. **Anatomie :** Oiseau (bird). **Silhouette :** Poitrine ronde, tête décalée, deux longues plumes de queue.

**Palette principale :** #ffcb85. **Palette secondaire :** #b77776. **Lumière :** #fff4c1. **Habitat :** Aurore.

**Personnalité :** Confiant, salue tous les nuages. **Description visuelle :** Oisillon pêche, bec court, ailes en lames et écharpe crème.

**Marqueurs / relations visuelles :** Queue bifide et plume frontale en losange.

**Rôle gameplay :** Clic. **Effet actif :** +1.2 / clic. **Données d'effet :** `{"clickFlat":1.2}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il annonce même les matins encore endormis. » **Seed :** 2036. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=perched ; headVariant=beaked ; ears=none ; horns=none ; wings=feather ; tail=forked ; crown=crest ; markings=feathers ; accessory=scarf ; aura=none ; idle=birdPeek ; posture=standing ; proportions={"head":1.22,"width":0.78,"height":0.82} ; face={"eyes":"profile","spacing":0,"mouth":"beak","mask":false,"asymmetric":false}.

#### F01-029 — Rubanvol

**ID / numéro :** F01-029 · 029 / 060. **Lignée :** L10. **EvolvesFrom :** F01-028. **EvolvesTo :** F01-030. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Aurore. **Anatomie :** Oiseau (bird). **Silhouette :** Hirondelle oblique, ailes arquées, queue bifide très longue.

**Palette principale :** #ffcb85. **Palette secondaire :** #b77776. **Lumière :** #fff4c1. **Habitat :** Aurore.

**Personnalité :** Audacieux, joue avec le vent. **Description visuelle :** Plumes pêche et ivoire, écharpe devenue ruban double porté sous les ailes.

**Marqueurs / relations visuelles :** Queue bifide et plume frontale en losange.

**Rôle gameplay :** Clic. **Effet actif :** +8 % clic. **Données d'effet :** `{"clickMultiplier":0.08}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Le vent lui emprunte parfois sa signature. » **Seed :** 2073. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=swallow ; headVariant=beaked ; posture=leaning ; proportions={"head":0.75,"width":1,"height":1} ; face={"eyes":"profile","spacing":0,"mouth":"beak","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=feather ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=wingBeat.

#### F01-030 — Vitraurore

**ID / numéro :** F01-030 · 030 / 060. **Lignée :** L10. **EvolvesFrom :** F01-029. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Épique. **Type :** Aurore. **Anatomie :** Oiseau (bird). **Silhouette :** Large éventail d’ailes ajourées, petite tête et queue pendante.

**Palette principale :** #ffcb85. **Palette secondaire :** #b77776. **Lumière :** #fff4c1. **Habitat :** Aurore.

**Personnalité :** Délicat, porte les couleurs avec soin. **Description visuelle :** Ailes en panneaux transparents corail-or, deux rubans identiques au premier stade.

**Marqueurs / relations visuelles :** Queue bifide et plume frontale en losange.

**Rôle gameplay :** Synergie. **Effet actif :** +0.35 multiplicateur critique. **Données d'effet :** `{"critMultiplier":0.35}`.

**Capacité future, non active :** +5 points critique si 2 Aurore équipées.

**Flavor text :** « L’aube passe à travers ses plumes comme un vitrail. » **Seed :** 2110. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=stainedFan ; headVariant=beaked ; posture=openWings ; proportions={"head":0.75,"width":1,"height":1} ; face={"eyes":"profile","spacing":0,"mouth":"beak","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=feather ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=moonHalo ; idle=wingBeat.

#### F01-031 — Nouétoile

**ID / numéro :** F01-031 · 031 / 060. **Lignée :** L11. **EvolvesFrom :** —. **EvolvesTo :** F01-032. **Stade :** Base.

**Rareté :** Commune. **Type :** Astral. **Anatomie :** Serpent (serpent). **Silhouette :** Serpent court en boucle ouverte, petite tête ovale.

**Palette principale :** #9aa4f2. **Palette secondaire :** #51568a. **Lumière :** #d9ffe4. **Habitat :** Dimension astrale.

**Personnalité :** Distrait, noue sa queue en rêvant. **Description visuelle :** Ruban indigo à nœud ivoire, joues claires et étoile sur le front.

**Marqueurs / relations visuelles :** Tête ovale et nœud clair derrière le visage.

**Rôle gameplay :** Collection. **Effet actif :** +0.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":0.5}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il oublie ses nœuds mais jamais ses amis. » **Seed :** 2147. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=looseKnot ; headVariant=round ; posture=curled ; proportions={"head":1,"width":0.75,"height":0.8} ; face={"eyes":"round","spacing":8,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=ringFlow.

#### F01-032 — Anneleau

**ID / numéro :** F01-032 · 032 / 060. **Lignée :** L11. **EvolvesFrom :** F01-031. **EvolvesTo :** F01-033. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Astral. **Anatomie :** Serpent (serpent). **Silhouette :** Serpent en S vertical traversant deux anneaux.

**Palette principale :** #9aa4f2. **Palette secondaire :** #51568a. **Lumière :** #d9ffe4. **Habitat :** Dimension astrale.

**Personnalité :** Joueur, bondit entre les étoiles. **Description visuelle :** Anneaux de nacre autour d’un corps lisse, nœud frontal encore visible.

**Marqueurs / relations visuelles :** Tête ovale et nœud clair derrière le visage.

**Rôle gameplay :** Collection. **Effet actif :** +8 % poids Rare+. **Données d'effet :** `{"rareChance":0.08}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Chaque cercle ouvre une fenêtre sur une autre nuit. » **Seed :** 2184. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=doubleRing ; headVariant=round ; posture=standing ; proportions={"head":0.85,"width":0.85,"height":1} ; face={"eyes":"almond","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=ringFlow.

#### F01-033 — Pontastrie

**ID / numéro :** F01-033 · 033 / 060. **Lignée :** L11. **EvolvesFrom :** F01-032. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Astral. **Anatomie :** Serpent (serpent). **Silhouette :** Long arc horizontal soutenu par trois nœuds lumineux.

**Palette principale :** #9aa4f2. **Palette secondaire :** #51568a. **Lumière :** #d9ffe4. **Habitat :** Dimension astrale.

**Personnalité :** Attentif, rapproche les voyageurs séparés. **Description visuelle :** Corps étiré comme une passerelle, trois anneaux d’appui et visage souriant à une extrémité.

**Marqueurs / relations visuelles :** Tête ovale et nœud clair derrière le visage.

**Rôle gameplay :** Synergie. **Effet actif :** +4 % énergie Faerie. **Données d'effet :** `{"faerieBonus":0.04}`.

**Capacité future, non active :** +15 % poids Rare+ si 2 Astral équipées.

**Flavor text :** « Il raccourcit les distances, jamais les histoires. » **Seed :** 2221. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=starBridge ; headVariant=round ; posture=floating ; proportions={"head":0.75,"width":1,"height":1} ; face={"eyes":"luminous","spacing":7,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=ringFlow.

#### F01-034 — Mottignon

**ID / numéro :** F01-034 · 034 / 060. **Lignée :** L12. **EvolvesFrom :** —. **EvolvesTo :** F01-035. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Golem / automate (golem). **Silhouette :** Cube mou sur deux racines, bras très courts.

**Palette principale :** #adb68c. **Palette secondaire :** #637a67. **Lumière :** #e4dcb7. **Habitat :** Ruines féeriques.

**Personnalité :** Dévoué, soutient les pousses qui penchent. **Description visuelle :** Petite motte à pierres rondes, carré clair au front et racines comme chaussures.

**Marqueurs / relations visuelles :** Front carré et deux mains fourchues.

**Rôle gameplay :** Idle. **Effet actif :** +1 / sec. **Données d'effet :** `{"autoFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il garde une place pour la prochaine graine. » **Seed :** 2258. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=soilCube ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.7,"height":0.75} ; face={"eyes":"round","spacing":10,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=leafSway.

#### F01-035 — Dallardin

**ID / numéro :** F01-035 · 035 / 060. **Lignée :** L12. **EvolvesFrom :** F01-034. **EvolvesTo :** F01-036. **Stade :** Évolution 1.

**Rareté :** Rare. **Type :** Sylve. **Anatomie :** Golem / automate (golem). **Silhouette :** Rectangle debout, deux bras en branches, jardinière ventrale.

**Palette principale :** #adb68c. **Palette secondaire :** #637a67. **Lumière :** #e4dcb7. **Habitat :** Ruines féeriques.

**Personnalité :** Méthodique, range les cailloux par chanson. **Description visuelle :** Plaques de pierre couvertes de mousse et jardinière au ventre.

**Marqueurs / relations visuelles :** Front carré et deux mains fourchues.

**Rôle gameplay :** Idle. **Effet actif :** +15 % passif. **Données d'effet :** `{"autoMultiplier":0.15}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Même ses poches ont un coin d’ombre. » **Seed :** 2295. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=planter ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.85,"height":1} ; face={"eyes":"single","spacing":0,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=leafSway.

#### F01-036 — Rempartille

**ID / numéro :** F01-036 · 036 / 060. **Lignée :** L12. **EvolvesFrom :** F01-035. **EvolvesTo :** —. **Stade :** Évolution 2.

**Rareté :** Rare. **Type :** Sylve. **Anatomie :** Golem / automate (golem). **Silhouette :** Large mur bas en arc, bras ouverts et deux jardinières hautes.

**Palette principale :** #adb68c. **Palette secondaire :** #637a67. **Lumière :** #e4dcb7. **Habitat :** Ruines féeriques.

**Personnalité :** Serein, laisse passer les hérissons. **Description visuelle :** Rempart sur racines-pieds, fenêtres fleuries et front carré de la première motte.

**Marqueurs / relations visuelles :** Front carré et deux mains fourchues.

**Rôle gameplay :** Synergie. **Effet actif :** +2.5 / sec. **Données d'effet :** `{"autoFlat":2.5}`.

**Capacité future, non active :** +20 % passif si 2 membres de L12 équipés.

**Flavor text :** « Un refuge n’a pas besoin de porte fermée. » **Seed :** 2332. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=gardenWall ; headVariant=round ; posture=rooted ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"luminous","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=rootPulse.

#### F01-037 — Lunailée

**ID / numéro :** F01-037 · 037 / 060. **Lignée :** L13. **EvolvesFrom :** —. **EvolvesTo :** F01-038. **Stade :** Base.

**Rareté :** Peu commune. **Type :** Lune. **Anatomie :** Papillon (moth). **Silhouette :** Ailes arrondies horizontales, antennes en gouttes.

**Palette principale :** #c0adff. **Palette secondaire :** #7666ca. **Lumière :** #ffe0fa. **Habitat :** Nuit étoilée.

**Personnalité :** Curieuse, suit les reflets de lune. **Description visuelle :** Deux grandes ailes lilas gravées de croissants, corps court et médaillon ivoire.

**Marqueurs / relations visuelles :** Antennes en gouttes et médaillon au thorax.

**Rôle gameplay :** Clic. **Effet actif :** +3 points critique. **Données d'effet :** `{"critChance":0.03}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Un battement d’ailes, et la nuit retient son souffle. » **Seed :** 2369. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=moonWings ; headVariant=round ; ears=antennae ; horns=none ; wings=crescent ; tail=none ; crown=none ; markings=moonDust ; accessory=medallion ; aura=none ; idle=moonFlutter ; posture=openWings ; proportions={"head":1.12,"width":0.83,"height":0.84} ; face={"eyes":"crescent","spacing":12,"mouth":"none","mask":false,"asymmetric":false}.

#### F01-038 — Noctipapille

**ID / numéro :** F01-038 · 038 / 060. **Lignée :** L13. **EvolvesFrom :** F01-037. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Épique. **Type :** Lune. **Anatomie :** Papillon (moth). **Silhouette :** Quatre panneaux d’ailes verticaux comme une cape ouverte.

**Palette principale :** #c0adff. **Palette secondaire :** #7666ca. **Lumière :** #ffe0fa. **Habitat :** Nuit étoilée.

**Personnalité :** Calme, écoute les rêves oubliés. **Description visuelle :** Ailes devenues tentures d’oracle, grands ocelles, antennes conservées et médaillon central.

**Marqueurs / relations visuelles :** Antennes en gouttes et médaillon au thorax.

**Rôle gameplay :** Synergie. **Effet actif :** +0.3 multiplicateur critique · +1 éclats / doublon. **Données d'effet :** `{"critMultiplier":0.3,"duplicateBonus":1}`.

**Capacité future, non active :** +0.4 multiplicateur critique lorsque le combo ≥ 75.

**Flavor text :** « Ses ailes gardent les constellations disparues. » **Seed :** 2406. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=oracle ; headVariant=long ; ears=antennae ; horns=none ; wings=curtain ; tail=none ; crown=none ; markings=ocelli ; accessory=medallion ; aura=moonHalo ; idle=wingBeat ; posture=openWings ; proportions={"head":0.82,"width":1,"height":1} ; face={"eyes":"luminous","spacing":8,"mouth":"none","mask":true,"asymmetric":true}.

#### F01-039 — Flamèche

**ID / numéro :** F01-039 · 039 / 060. **Lignée :** L14. **EvolvesFrom :** —. **EvolvesTo :** F01-040. **Stade :** Base.

**Rareté :** Commune. **Type :** Étincelle. **Anatomie :** Canidé (canine). **Silhouette :** Renardeau assis, oreilles hautes et queue-flamme en crochet.

**Palette principale :** #ffbf78. **Palette secondaire :** #ce7156. **Lumière :** #fff0bb. **Habitat :** Verger de braise.

**Personnalité :** Joueur, souffle sur les doigts froids. **Description visuelle :** Fourrure abricot, plastron ivoire et queue douce aux trois langues de feu.

**Marqueurs / relations visuelles :** Grandes oreilles triangulaires et pointe de queue crème.

**Rôle gameplay :** Clic. **Effet actif :** +1.5 / clic. **Données d'effet :** `{"clickFlat":1.5}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Le feu de sa queue ne brûle que la peur. » **Seed :** 2443. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=foxling ; headVariant=round ; posture=seated ; proportions={"head":1.1,"width":0.8,"height":0.85} ; face={"eyes":"round","spacing":11,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=emberMantle.

#### F01-040 — Braiseloup

**ID / numéro :** F01-040 · 040 / 060. **Lignée :** L14. **EvolvesFrom :** F01-039. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Étincelle. **Anatomie :** Canidé (canine). **Silhouette :** Canidé en marche, manteau de braise large et queue en crochet.

**Palette principale :** #ffbf78. **Palette secondaire :** #ce7156. **Lumière :** #fff0bb. **Habitat :** Verger de braise.

**Personnalité :** Protecteur, escorte les voyageurs de nuit. **Description visuelle :** Oreilles conservées, longues pattes et crinière de flammes basses comme une couverture.

**Marqueurs / relations visuelles :** Grandes oreilles triangulaires et pointe de queue crème.

**Rôle gameplay :** Clic. **Effet actif :** +20 % combo. **Données d'effet :** `{"comboMultiplier":0.2}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il entretient le feu qui permet de rentrer chez soi. » **Seed :** 2480. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=emberWolf ; headVariant=round ; posture=quadruped ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"narrow","spacing":8,"mouth":"muzzle","mask":false,"asymmetric":true} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=emberMantle.

#### F01-041 — Lentefeuille

**ID / numéro :** F01-041 · 041 / 060. **Lignée :** L15. **EvolvesFrom :** —. **EvolvesTo :** F01-042. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Limace (slug). **Silhouette :** Ruban bas, dos en feuille, deux antennes rondes.

**Palette principale :** #9fcea7. **Palette secondaire :** #587f74. **Lumière :** #edcfa3. **Habitat :** Sous-bois.

**Personnalité :** Paisible, ne presse jamais ses amis. **Description visuelle :** Limace menthe portant une feuille sèche en couverture, patin de mousse.

**Marqueurs / relations visuelles :** Antennes rondes et patin de mousse.

**Rôle gameplay :** Idle. **Effet actif :** +0.7 / sec. **Données d'effet :** `{"autoFlat":0.7}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Le monde est moins pressé à sa hauteur. » **Seed :** 2517. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=leafSlug ; headVariant=round ; posture=leaning ; proportions={"head":1,"width":0.85,"height":0.75} ; face={"eyes":"round","spacing":7,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=leafSway.

#### F01-042 — Cabacrète

**ID / numéro :** F01-042 · 042 / 060. **Lignée :** L15. **EvolvesFrom :** F01-041. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Sylve. **Anatomie :** Escargot (snail). **Silhouette :** Spirale de cabane sur corps horizontal, antennes hautes.

**Palette principale :** #9fcea7. **Palette secondaire :** #587f74. **Lumière :** #edcfa3. **Habitat :** Sous-bois.

**Personnalité :** Hospitalier, prête son toit quand il pleut. **Description visuelle :** Coquille d’écorce en escalier, porte minuscule et feuilles-antennes conservées.

**Marqueurs / relations visuelles :** Antennes rondes et patin de mousse.

**Rôle gameplay :** Idle. **Effet actif :** +10 % passif. **Données d'effet :** `{"autoMultiplier":0.1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Chaque étage accueille une autre saison. » **Seed :** 2554. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=barkHouse ; headVariant=round ; posture=turned ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"round","spacing":7,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=shellRock.

#### F01-043 — Bullipin

**ID / numéro :** F01-043 · 043 / 060. **Lignée :** L16. **EvolvesFrom :** —. **EvolvesTo :** F01-044. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Poisson (fish). **Silhouette :** Poisson en goutte horizontale, bouche ronde, queue fourchue.

**Palette principale :** #b4e8e8. **Palette secondaire :** #628da7. **Lumière :** #ffd5da. **Habitat :** Ruisseau.

**Personnalité :** Rêveur, regarde les arbres à l’envers. **Description visuelle :** Écailles nacrées, bulle rose au front et nageoires-feuilles.

**Marqueurs / relations visuelles :** Bulle frontale et queue à deux feuilles.

**Rôle gameplay :** Collection. **Effet actif :** +4 % poids Rare+. **Données d'effet :** `{"rareChance":0.04}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il croit que le ciel pousse au fond des mares. » **Seed :** 2591. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=bubbleFish ; headVariant=round ; posture=floating ; proportions={"head":1,"width":0.75,"height":0.75} ; face={"eyes":"profile","spacing":0,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-044 — Roseauvin

**ID / numéro :** F01-044 · 044 / 060. **Lignée :** L16. **EvolvesFrom :** F01-043. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Peu commune. **Type :** Rosée. **Anatomie :** Poisson (fish). **Silhouette :** Poisson allongé, deux nageoires ramifiées hautes.

**Palette principale :** #b4e8e8. **Palette secondaire :** #628da7. **Lumière :** #ffd5da. **Habitat :** Ruisseau.

**Personnalité :** Inventif, dessine des cartes dans les reflets. **Description visuelle :** Nageoires devenues roseaux, bulle frontale comme une lentille et queue-feuille inchangée.

**Marqueurs / relations visuelles :** Bulle frontale et queue à deux feuilles.

**Rôle gameplay :** Collection. **Effet actif :** +3 % réduction booster. **Données d'effet :** `{"boosterDiscount":0.03}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Les chemins sont plus clairs quand on les voit deux fois. » **Seed :** 2628. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=reedFish ; headVariant=round ; posture=floating ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"profile","spacing":0,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-045 — Pollenpin

**ID / numéro :** F01-045 · 045 / 060. **Lignée :** L17. **EvolvesFrom :** —. **EvolvesTo :** F01-046. **Stade :** Base.

**Rareté :** Commune. **Type :** Aurore. **Anatomie :** Scarabée (beetle). **Silhouette :** Bouclier rond, six pattes rayonnantes.

**Palette principale :** #e6c675. **Palette secondaire :** #947459. **Lumière :** #fff1b9. **Habitat :** Canopée.

**Personnalité :** Sérieux, compte les grains tombés au sol. **Description visuelle :** Carapace miel à fente claire, petites joues et antennes recourbées.

**Marqueurs / relations visuelles :** Fente centrale et antennes en demi-cercle.

**Rôle gameplay :** Clic. **Effet actif :** +0.1 multiplicateur critique. **Données d'effet :** `{"critMultiplier":0.1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il considère chaque grain comme un petit soleil. » **Seed :** 2665. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=pollenShield ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.8,"height":0.8} ; face={"eyes":"almond","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=shellRock.

#### F01-046 — Verrélytre

**ID / numéro :** F01-046 · 046 / 060. **Lignée :** L17. **EvolvesFrom :** F01-045. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Épique. **Type :** Aurore. **Anatomie :** Scarabée (beetle). **Silhouette :** Bouclier central, deux grands élytres vitrail ouverts en V.

**Palette principale :** #e6c675. **Palette secondaire :** #947459. **Lumière :** #fff1b9. **Habitat :** Canopée.

**Personnalité :** Tendre, protège les siestes du jardin. **Description visuelle :** Élytres ajourés ambrés, antennes rondes et fente solaire conservées.

**Marqueurs / relations visuelles :** Fente centrale et antennes en demi-cercle.

**Rôle gameplay :** Synergie. **Effet actif :** +10 % clic · +2 points critique. **Données d'effet :** `{"clickMultiplier":0.1,"critChance":0.02}`.

**Capacité future, non active :** Chaque 25e clic produit ×4.

**Flavor text :** « Sa plus grande victoire est une fleur reposée. » **Seed :** 2702. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=glassGuard ; headVariant=round ; posture=openWings ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"luminous","spacing":8,"mouth":"none","mask":true,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=moonHalo ; idle=wingBeat.

#### F01-047 — Échomimi

**ID / numéro :** F01-047 · 047 / 060. **Lignée :** L18. **EvolvesFrom :** —. **EvolvesTo :** F01-048. **Stade :** Base.

**Rareté :** Commune. **Type :** Lune. **Anatomie :** Chauve-souris (bat). **Silhouette :** Boule suspendue, grandes oreilles, petites ailes triangulaires.

**Palette principale :** #aab1e8. **Palette secondaire :** #62699d. **Lumière :** #d1fff1. **Habitat :** Grotte cristalline.

**Personnalité :** Sensible, rougit à chaque écho. **Description visuelle :** Fourrure pervenche, oreilles nacrées et ventre clair en triangle.

**Marqueurs / relations visuelles :** Oreilles cuillères et bijou ventral.

**Rôle gameplay :** Collection. **Effet actif :** +0.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":0.5}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il répète les mots qui font du bien. » **Seed :** 2739. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=echoBall ; headVariant=round ; posture=suspended ; proportions={"head":1,"width":0.8,"height":0.85} ; face={"eyes":"round","spacing":10,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=feather ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=geodeEcho.

#### F01-048 — Géodoreille

**ID / numéro :** F01-048 · 048 / 060. **Lignée :** L18. **EvolvesFrom :** F01-047. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Épique. **Type :** Lune. **Anatomie :** Chauve-souris (bat). **Silhouette :** Ailes larges en facettes, oreilles hautes comme deux calices.

**Palette principale :** #aab1e8. **Palette secondaire :** #62699d. **Lumière :** #d1fff1. **Habitat :** Grotte cristalline.

**Personnalité :** Généreux, offre des concerts aux pierres. **Description visuelle :** Membranes devenues géodes creuses, oreilles-cuillères et bijou ventral conservés.

**Marqueurs / relations visuelles :** Oreilles cuillères et bijou ventral.

**Rôle gameplay :** Synergie. **Effet actif :** +12 % poids Rare+. **Données d'effet :** `{"rareChance":0.12}`.

**Capacité future, non active :** +15 % poids Rare+ si 3 Lune équipées.

**Flavor text :** « Les cristaux lui rendent toujours son salut. » **Seed :** 2776. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=geodeWings ; headVariant=round ; posture=openWings ; proportions={"head":0.85,"width":1,"height":1} ; face={"eyes":"luminous","spacing":8,"mouth":"none","mask":true,"asymmetric":false} ; ears=none ; horns=none ; wings=feather ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=moonHalo ; idle=geodeEcho.

#### F01-049 — Brumelin

**ID / numéro :** F01-049 · 049 / 060. **Lignée :** L19. **EvolvesFrom :** —. **EvolvesTo :** F01-050. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Poisson (fish). **Silhouette :** Poisson-perle rond, nageoires courtes comme deux mains.

**Palette principale :** #8ebfd9. **Palette secondaire :** #607ca7. **Lumière :** #fff0d1. **Habitat :** Sanctuaire.

**Personnalité :** Souriant, répond aux gouttes de pluie. **Description visuelle :** Dos bleu perle, ventre ivoire et petite perle frontale.

**Marqueurs / relations visuelles :** Perle ivoire au front et deux nageoires arrondies.

**Rôle gameplay :** Idle. **Effet actif :** +1 / sec. **Données d'effet :** `{"autoFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il sourit même quand la pluie tombe à l’envers. » **Seed :** 2813. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=pearlFish ; headVariant=round ; posture=floating ; proportions={"head":1,"width":0.8,"height":0.8} ; face={"eyes":"crescent","spacing":9,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-050 — Nacréveil

**ID / numéro :** F01-050 · 050 / 060. **Lignée :** L19. **EvolvesFrom :** F01-049. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Légendaire. **Type :** Rosée. **Anatomie :** Baleine (whale). **Silhouette :** Longue baleine horizontale, deux grandes nageoires et queue ouverte.

**Palette principale :** #8ebfd9. **Palette secondaire :** #607ca7. **Lumière :** #fff0d1. **Habitat :** Sanctuaire.

**Personnalité :** Paisible, porte les îles qui dérivent. **Description visuelle :** Corps nacré traversé de mares minuscules, perle frontale et nageoires-manches conservées.

**Marqueurs / relations visuelles :** Perle ivoire au front et deux nageoires arrondies.

**Rôle gameplay :** Synergie. **Effet actif :** +3 / sec · +15 % passif. **Données d'effet :** `{"autoFlat":3,"autoMultiplier":0.15}`.

**Capacité future, non active :** +25 % passif sans Étincelle équipée.

**Flavor text :** « Un lac entier peut dormir contre son cœur. » **Seed :** 2850. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=mistWhale ; headVariant=round ; posture=floating ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"crescent","spacing":9,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=moonHalo ; idle=nacreTide.

**Signature composition :** Direction prévue : baleine horizontale basse, nageoires de nacre séparées du corps, nuage dorsal creux et petit œil en croissant ; contraste avec la grande masse de brume.

**Signature idle :** Direction prévue : houle lente du ventre, nageoires détachées qui flottent à contretemps, souffle de brume discret.

**Signature habitatDetail :** Sanctuaire inondé et îles de brume.

**Signature aura :** Ondes nacrées sous le ventre.

**Signature narrative :** Elle abrite les îles qui perdent leurs rivages.

#### F01-051 — Brumou

**ID / numéro :** F01-051 · 051 / 060. **Lignée :** L20. **EvolvesFrom :** —. **EvolvesTo :** F01-052. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Esprit flottant (spirit). **Silhouette :** Goutte flottante sans jambes, courte écharpe au cou.

**Palette principale :** #c5dbdd. **Palette secondaire :** #7796a2. **Lumière :** #ffd1c0. **Habitat :** Clairière.

**Personnalité :** Distrait, oublie son écharpe sur les branches. **Description visuelle :** Corps de brume bleu pâle, nœud pêche et yeux en virgule.

**Marqueurs / relations visuelles :** Nœud corail et yeux en petites virgules.

**Rôle gameplay :** Idle. **Effet actif :** +0.6 / sec. **Données d'effet :** `{"autoFlat":0.6}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Il laisse ses pensées sécher au soleil. » **Seed :** 2887. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=mistDrop ; headVariant=round ; posture=floating ; proportions={"head":1,"width":0.65,"height":0.75} ; face={"eyes":"crescent","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-052 — Écharume

**ID / numéro :** F01-052 · 052 / 060. **Lignée :** L20. **EvolvesFrom :** F01-051. **EvolvesTo :** —. **Stade :** Évolution 1.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Esprit flottant (spirit). **Silhouette :** Deux rubans en S sous une petite tête flottante.

**Palette principale :** #c5dbdd. **Palette secondaire :** #7796a2. **Lumière :** #ffd1c0. **Habitat :** Clairière.

**Personnalité :** Attentionné, enveloppe les doigts glacés. **Description visuelle :** Écharpe devenue corps rubané, nœud corail conservé, extrémités translucides.

**Marqueurs / relations visuelles :** Nœud corail et yeux en petites virgules.

**Rôle gameplay :** Idle. **Effet actif :** +7 % passif. **Données d'effet :** `{"autoMultiplier":0.07}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Sa seule richesse est la chaleur qu’il partage. » **Seed :** 2924. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=mistScarves ; headVariant=round ; posture=floating ; proportions={"head":0.8,"width":1,"height":1} ; face={"eyes":"crescent","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=ringFlow.

#### F01-053 — Brindiboule

**ID / numéro :** F01-053 · 053 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Commune. **Type :** Sylve. **Anatomie :** Créature ronde (round). **Silhouette :** Boule aplatie sous une brindille en travers.

**Palette principale :** #d0dd8e. **Palette secondaire :** #809366. **Lumière :** #fff3ce. **Habitat :** Clairière.

**Personnalité :** Optimiste, roule vers les nouveaux chemins. **Description visuelle :** Pompon mousse à pattes cachées, brindille-écharpe horizontale.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Clic. **Effet actif :** +1 / clic. **Données d'effet :** `{"clickFlat":1}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Elle transforme les détours en jeux. » **Seed :** 2961. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=mossBall ; headVariant=round ; posture=curled ; proportions={"head":1,"width":0.85,"height":0.75} ; face={"eyes":"round","spacing":14,"mouth":"smile","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=seedBounce.

#### F01-054 — Goutteline

**ID / numéro :** F01-054 · 054 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Commune. **Type :** Rosée. **Anatomie :** Limace (slug). **Silhouette :** Limace basse au dos comme trois gouttes.

**Palette principale :** #8addcc. **Palette secondaire :** #529b9c. **Lumière :** #e8ffe9. **Habitat :** Mare.

**Personnalité :** Méticuleuse, polit les pierres de sa mare. **Description visuelle :** Trois gouttes menthe en selle, visage au bout d’un long cou bas.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Idle. **Effet actif :** +0.8 / sec. **Données d'effet :** `{"autoFlat":0.8}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Chaque pierre mérite un reflet propre. » **Seed :** 2998. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=tripleDrop ; headVariant=round ; posture=leaning ; proportions={"head":0.9,"width":1,"height":0.8} ; face={"eyes":"almond","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=tideFloat.

#### F01-055 — Miettambre

**ID / numéro :** F01-055 · 055 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Commune. **Type :** Étincelle. **Anatomie :** Scarabée (beetle). **Silhouette :** Scarabée carré tenant une miette lumineuse.

**Palette principale :** #ecb879. **Palette secondaire :** #a27558. **Lumière :** #fff0b9. **Habitat :** Verger de braise.

**Personnalité :** Économe, partage les dernières braises. **Description visuelle :** Carapace caramel à angles doux, grande miette jaune entre les pattes.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Collection. **Effet actif :** +0.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":0.5}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « La plus petite braise fait déjà un grand dîner. » **Seed :** 3035. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=crumbCarrier ; headVariant=round ; posture=standing ; proportions={"head":1,"width":0.75,"height":0.85} ; face={"eyes":"narrow","spacing":8,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=spores ; accessory=none ; aura=none ; idle=lanternPulse.

#### F01-056 — Tintabule

**ID / numéro :** F01-056 · 056 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Commune. **Type :** Aurore. **Anatomie :** Esprit flottant (spirit). **Silhouette :** Clochette renversée flottante, deux rubans courts.

**Palette principale :** #edd895. **Palette secondaire :** #9d9279. **Lumière :** #e4fff1. **Habitat :** Canopée.

**Personnalité :** Joyeux, aime les silences qu’il peut ponctuer. **Description visuelle :** Corps-cloche citron, battant de feuille et deux yeux en croissant.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Clic. **Effet actif :** +2 points critique. **Données d'effet :** `{"critChance":0.02}`.

**Capacité future, non active :** Aucune condition prévue.

**Flavor text :** « Son rire annonce les amis avant leurs pas. » **Seed :** 3072. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=leafBell ; headVariant=round ; posture=floating ; proportions={"head":1,"width":0.8,"height":0.85} ; face={"eyes":"crescent","spacing":8,"mouth":"none","mask":false,"asymmetric":true} ; ears=none ; horns=none ; wings=none ; tail=none ; crown=none ; markings=freckles ; accessory=none ; aura=none ; idle=bellSwing.

#### F01-057 — Azurielle

**ID / numéro :** F01-057 · 057 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Épique. **Type :** Rosée. **Anatomie :** Poisson (fish). **Silhouette :** Poisson vertical aux nageoires comme une robe en cascade.

**Palette principale :** #8bb8ee. **Palette secondaire :** #5b75b4. **Lumière :** #ffe7c4. **Habitat :** Cascade.

**Personnalité :** Curieuse, regarde au-delà de sa rivière. **Description visuelle :** Trois voiles d’eau empilés, tête ovale, perle en boucle à la queue.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Synergie. **Effet actif :** +12 % passif · +6 % poids Rare+. **Données d'effet :** `{"autoMultiplier":0.12,"rareChance":0.06}`.

**Capacité future, non active :** +10 % poids Rare+ si 3 Rosée équipées.

**Flavor text :** « Elle garde une fenêtre ouverte dans chaque cascade. » **Seed :** 3109. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=cascadeDress ; headVariant=round ; posture=floating ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"profile","spacing":0,"mouth":"none","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=glass ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=moonHalo ; idle=tideFloat.

#### F01-058 — Auralis

**ID / numéro :** F01-058 · 058 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Légendaire. **Type :** Aurore. **Anatomie :** Dragon léger (dragon). **Silhouette :** Dragon léger en diagonale, longues ailes en croissant.

**Palette principale :** #ffd97e. **Palette secondaire :** #cd9654. **Lumière :** #fff9d4. **Habitat :** Aurore.

**Personnalité :** Joueur, apprend la lumière aux nuages. **Description visuelle :** Dragon ivoire-or au cou souple, ailes ajourées, queue portant un soleil creux.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Synergie. **Effet actif :** +3 / sec · +5 % énergie Faerie. **Données d'effet :** `{"autoFlat":3,"faerieBonus":0.05}`.

**Capacité future, non active :** +15 % énergie Faerie si 3 Aurore équipées.

**Flavor text :** « Le soleil se lève un peu plus tôt pour le voir jouer. » **Seed :** 3146. **Production :** Produit, jouable.

**Recette dirigée :** bodyVariant=auroraDragon ; headVariant=round ; posture=openWings ; proportions={"head":0.75,"width":1,"height":1} ; face={"eyes":"almond","spacing":8,"mouth":"muzzle","mask":false,"asymmetric":false} ; ears=none ; horns=none ; wings=feather ; tail=none ; crown=none ; markings=scales ; accessory=none ; aura=moonHalo ; idle=auroraFlight.

**Signature composition :** Direction prévue : dragon léger orienté en diagonale, long cou et petite tête, ailes rubans déployées sur des hauteurs différentes, queue spiralée laissant un vide central.

**Signature idle :** Direction prévue : ailes-rubans qui ondulent séparément, tête calme, lumière qui voyage du cou vers la pointe de la queue.

**Signature habitatDetail :** Canopée ouverte aux bandes d’aurore.

**Signature aura :** Rayons ivoire et or doux.

**Signature narrative :** Il apprend aux jours nouveaux à ne pas effrayer la nuit.

#### F01-059 — Horlogrève

**ID / numéro :** F01-059 · 059 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Légendaire. **Type :** Astral. **Anatomie :** Golem / automate (golem). **Silhouette :** Portique carré creux, bras détachés, trois aiguilles en couronne.

**Palette principale :** #a5d8d3. **Palette secondaire :** #507b8b. **Lumière :** #ffe4ab. **Habitat :** Ruines féeriques.

**Personnalité :** Patient, remet les horloges à l’heure du repos. **Description visuelle :** Automate de pierre bleu-vert, visage-orbe dans son cadre, pieds blocs et aiguilles dorées.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Synergie. **Effet actif :** +8 % poids Rare+ · +1.5 éclats / doublon. **Données d'effet :** `{"duplicateBonus":1.5,"rareChance":0.08}`.

**Capacité future, non active :** Chaque 25e clic produit ×6.

**Flavor text :** « Il laisse toujours une minute pour une dernière histoire. » **Seed :** 3183. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=gateFrame ; headVariant=orb ; ears=none ; horns=none ; wings=none ; tail=none ; crown=clockHands ; markings=runes ; accessory=pendulum ; aura=clockHalo ; idle=clockTick ; posture=floating ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"single","spacing":0,"mouth":"none","mask":false,"asymmetric":false}.

**Signature composition :** Portique horloger en lévitation, œil unique dans un vide central, mains détachées à des hauteurs différentes, aiguilles en couronne et pendule libre.

**Signature idle :** Aiguilles en trois étapes, pendule en balancier, œil dont la lumière pulse sur un cycle distinct.

**Signature habitatDetail :** Ruines de cadrans mécaniques et pierres suspendues.

**Signature aura :** Runes cyan ponctuées.

**Signature narrative :** Le portail l’a construit pour garder du temps aux rencontres.

#### F01-060 — Velours d’Entre-mondes

**ID / numéro :** F01-060 · 060 / 060. **Lignée :** Unique. **EvolvesFrom :** —. **EvolvesTo :** —. **Stade :** Base.

**Rareté :** Mythique. **Type :** Astral. **Anatomie :** Voile astral (manta). **Silhouette :** Voile asymétrique en losange ouvert, pointe basse à gauche, appendice haut à droite, ruban de Möbius.

**Palette principale :** #94b9e8. **Palette secondaire :** #536b9e. **Lumière :** #f7edcd. **Habitat :** Dimension astrale.

**Personnalité :** Doux et curieux, recueille les voyageurs perdus. **Description visuelle :** Un textile astral vivant sans visage, plus ample d’un côté, traversé par une graine orbitale. Deux pointes détachent la silhouette de toute anatomie animale ; la boucle de Möbius reste son ancrage visuel.

**Marqueurs / relations visuelles :** Créature unique : aucune relation d’évolution.

**Rôle gameplay :** Synergie. **Effet actif :** +6 % réduction booster · +12 % poids Rare+. **Données d'effet :** `{"boosterDiscount":0.06,"rareChance":0.12}`.

**Capacité future, non active :** +8 % réduction booster si 2 Astral équipées.

**Flavor text :** « Les mondes sont des couvertures qu’il replie avec soin. » **Seed :** 3220. **Production :** Référence validée, jouable.

**Recette dirigée :** bodyVariant=openMantle ; headVariant=seed ; ears=none ; horns=none ; wings=cloth ; tail=mobius ; crown=none ; markings=constellations ; accessory=seedCore ; aura=foldOrbit ; idle=foldOrbit ; posture=floating ; proportions={"head":1,"width":1,"height":1} ; face={"eyes":"none","spacing":0,"mouth":"none","mask":false,"asymmetric":false}.

**Signature composition :** Voile oblique asymétrique, boucle ouverte et noyau-graine dans le vide.

**Signature idle :** Draperies en vagues opposées et orbite du noyau ; corps stable.

**Signature habitatDetail :** Plans stellaires pliés, seuil en ruban, étoiles cousues aux bords.

**Signature aura :** Filaments ivoire en boucle de Möbius.

**Signature narrative :** Il replie les mondes pour offrir une couverture aux voyageurs égarés.

<!-- END:FAERIE-ROSTER -->


## Phase 5 — Set 01 complet

60 cartes produites et intégrées : 12 références préservées exactement et 48 nouvelles recettes. 24 Communes, 14 Peu communes, 10 Rares, 6 Épiques, 4 Légendaires et 2 Mythiques. Structure : 12 lignées de trois, 8 lignées de deux, 8 uniques. Types : Sylve, Mycète, Lune, Rosée, Étincelle, Aurore, Astral.

Le booster utilise les 60 identités, cinq cartes par achat et une cinquième Peu commune ou mieux. Les poids de rareté, prix, améliorations, combo, machine et gestes d’ouverture restent ceux de Phase 3. Les cartes gardent leurs niveaux et évolutions indépendantes ; découvrir le parent immédiat autorise un nouvel équipement.

La sauvegarde conserve sa clé et son format v2. Les neuf IDs historiques sont liés aux designs par `LEGACY_DESIGN_IDS` ; les 51 nouveaux IDs utilisent `F01-xxx`. Le numéro du classeur est indépendant de l’ID de sauvegarde. Copies, deck déjà équipé et ouverture partielle v1/v2 restent conservés. Aucune migration d’identité n’est nécessaire. La migration v1 → v2 et sa copie de secours restent disponibles. Les valeurs des effets et raretés suivent le contenu final.

Les effets simples sont actifs, les six familles de conditions restent déclaratives. La collection affiche les 60 rencontres, leurs silhouettes inconnues, filtres et vingt lignées repliables. Le deck accepte toutes les raretés. `/dev` → **Set 01 — Full Roster** compare les 60 sprites en 48/64/80/112/160 px avec filtres type, rareté, anatomie et habitat, puis les lignées, cartes et décors. **Style Validation** conserve les douze références et les études hors set.

### Affinités retenues

| Type | Cartes distinctes requises | Bonus |
| --- | ---: | --- |
| Sylve | 2 | +10 % énergie globale |
| Lune | 2 | +5 points critique |
| Mycète | 2 | +12 % passif · +0.5 éclats / doublon |
| Rosée | 2 | +12 % passif |
| Étincelle | 2 | +10 % clic · +10 % combo |
| Aurore | 2 | +8 % énergie globale |
| Astral | 2 | +8 % poids Rare+ · +0.5 éclats / doublon |

### Builds indicatifs

- **Clic** : Somnouchat · Croissombre · Songegarde · Luciolot · Lanterlume · Cortélampe. Chats de lune et lanternes : critiques, cadence et combo.
- **Idle** : Chantignon · Sporelle · Mycoralie · Roséclair · Ruisselet · Vasqueroy. Chœur mycélien et bassin de rosée : production passive.
- **Collection** : Chantignon · Mycélisseur · Nouétoile · Anneleau · Horlogrève · Velours d’Entre-mondes. Mycète et Astral : boosters, rencontres rares et doublons.

Premier réglage de contenu : les effets simples sont ceux des fiches validées, les synergies à une seule carte sont remplacées par deux compagnons distincts. Les tests confirment les spécialités des trois builds. Un équilibrage de sessions de 30–60 minutes reste à faire : rythme des boosters, valeur des doublons, rendement aux niveaux 4/5, intérêt de deck 7/8 et fatigue d’ouverture. Aucun nouveau système conditionnel n’est activé.

### Anatomies effectivement produites

Graine ; Cervidé ; Arbre-portail ; Lapin ; Fleur ; Champignon ; Scarabée ; Félin ; Grenouille ; Salamandre ; Luciole ; Oiseau ; Serpent ; Golem / automate ; Papillon ; Canidé ; Limace ; Escargot ; Poisson ; Chauve-souris ; Baleine ; Créature ronde ; Esprit flottant ; Dragon léger ; Voile astral.

### Habitats

Clairière ; Sous-bois ; Champ de fleurs ; Arbre ancien ; Ruisseau ; Mare ; Cascade ; Grotte cristalline ; Forêt de champignons ; Nuit étoilée ; Ruines féeriques ; Canopée ; Aurore ; Sanctuaire ; Dimension astrale ; Verger de braise.

### Lignées complètes

- **L01 — Mémoire des graines** : Moussillon → Sylvérêve → Éon de la clairière.
- **L02 — Oreilles du printemps** : Semenotte → Lièvrille → Ramifleur.
- **L03 — Jardin des saluts** : Boutonner → Coralève → Floréale.
- **L04 — Chœur du sous-bois** : Chantignon → Sporelle → Mycoralie.
- **L05 — Broches du mycélium** : Couspore → Brochignon → Mycélisseur.
- **L06 — Coussins de lune** : Somnouchat → Croissombre → Songegarde.
- **L07 — Couronnes de source** : Roséclair → Ruisselet → Vasqueroy.
- **L08 — Rubans de cascade** : Filonde → Frangonde → Nympharive.
- **L09 — Lanternes de pollen** : Luciolot → Lanterlume → Cortélampe.
- **L10 — Messagers du jour** : Aubepiou → Rubanvol → Vitraurore.
- **L11 — Nœuds des étoiles** : Nouétoile → Anneleau → Pontastrie.
- **L12 — Petits remparts** : Mottignon → Dallardin → Rempartille.
- **L13 — Ailes du souvenir** : Lunailée → Noctipapille.
- **L14 — Flammes câlines** : Flamèche → Braiseloup.
- **L15 — Escaliers d’écorce** : Lentefeuille → Cabacrète.
- **L16 — Miroirs de mare** : Bullipin → Roseauvin.
- **L17 — Gardes du pollen** : Pollenpin → Verrélytre.
- **L18 — Veilleurs de cristal** : Échomimi → Géodoreille.
- **L19 — Marées de nacre** : Brumelin → Nacréveil.
- **L20 — Écharpes des brumes** : Brumou → Écharume.

### Créatures uniques

Brindiboule ; Goutteline ; Miettambre ; Tintabule ; Azurielle ; Auralis ; Horlogrève ; Velours d’Entre-mondes.
