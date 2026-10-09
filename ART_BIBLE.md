# TCG Clicker — Art Bible

**État actuel — Alpha 0.3.0 / Phase 14 (9 octobre 2026) : direction Arcane Brutalism conservée, sprites/habitats/finitions des 60 cartes inchangés. Les sections des phases antérieures constituent l’historique.**

## Phase 14 — lisibilité sans refonte

Résumé Deck compact, capacités avancées visibles au choix, formes manquantes nommées avec silhouette, récap booster mobile à deux colonnes et inspection au toucher. Titre Machine desktop et espaces réduits ; actions Boosters avant le catalogue. Aucun nouvel asset ni modification des cartes ou du Set 01. Captures et détail : `design/phase14-ux-fixes.md`.

## Alpha navigateur — état actuel

Export/import JSON v4, reset confirmé, diagnostics et récupération sont dans Paramètres ou l’écran de secours. Les copies de sauvegarde restent locales. Le blocage multi-onglets est désactivé depuis le 9 octobre 2026 ; les sauvegardes des onglets ne sont pas synchronisées. L’atelier est disponible uniquement en développement. L’alpha ne crée aucun nouveau gameplay et conserve les sprites, habitats et finitions du set complet.

Voir `README.md`, `ALPHA_RELEASE_CHECKLIST.md`, `ALPHA_TEST.md` et `design/alpha-audit.md` pour la préparation de publication, les contrôles et les limites. Safari/iOS et les playtests humains restent à valider.


## Direction générale

Pixel art moderne, coloré et vivant.

Pas de style 8-bit extrêmement limité.

Les graphismes doivent utiliser :
- couleurs saturées
- ombres colorées
- lumières
- particules
- animations
- effets magiques

## Créatures

Les créatures doivent être :
- mignonnes
- immédiatement reconnaissables
- expressives
- simples à lire même en petit

Éviter les designs trop réalistes.

## Pixel Art

Les sprites doivent être générés ou décrits en code.

Le set complet utilise 60 sprites et 25 anatomies sur une grille de 64 × 64 pixels par créature, rendue en SVG sans lissage. Les silhouettes restent distinctes aux tailles de comparaison 48, 80 et 112 px.

La génération est déterministe : une même créature avec le même seed produit le même sprite. Les détails issus du seed préservent sa silhouette. Les parties du sprite permettent de petites animations idle.

Les sprites doivent utiliser :
- contours propres
- ombres simples
- highlights
- palettes limitées par créature

## Monde féerique

Éléments visuels possibles :
- mousse
- fleurs
- champignons
- lucioles
- cristaux
- feuilles
- magie
- clairières
- arbres
- étoiles
- lunes

## Interface

L'interface doit reprendre l'univers de la machine interdimensionnelle.

Mélange entre :
- technologie
- magie
- interfaces mécaniques
- éléments féeriques

## Cartes

Les cartes doivent avoir un aspect premium.

Les raretés élevées peuvent ajouter :
- bordures plus détaillées
- animations
- halos
- motifs
- holographie
- parallaxe

La zone d’illustration associe la créature à un habitat procédural sur plusieurs plans. Nom, type, stade, capacité, rareté et numéro restent lisibles. Les finitions suivent la rareté : Vélin, Satin, Foil, Prismatique, Or solaire et Astral. Elles ne constituent pas des variantes collectionnables distinctes.

## Ouverture des boosters

La scène plein écran utilise un fond clair aqua, des sachets Faerie originaux et une pile au centre. La découpe produit une bandelette détachée, une lumière et le retrait de l’emballage.

Quand une carte s’envole, la suivante est déjà face visible dessous. Conserver cette continuité : aucun dos intermédiaire, aucun fondu depuis la transparence et aucune attente entre deux cartes. Les effets commencent à l’arrivée au premier plan : particules et aura pour les Rares, puis pulsation et halos renforcés pour les raretés supérieures. Seule la première apparition conserve une courte anticipation.

Respecter les animations réduites et conserver des commandes alternatives au glissement.

## Atelier `/dev`

Comparer les neuf créatures sur quatre fonds, à plusieurs tailles et avec zoom. Afficher palette, seed et parties du sprite ; permettre d’arrêter les animations. La vue des cartes et la démonstration d’ouverture comparent les finitions jusqu’à Mythique.

## Production des visuels

Aucun asset graphique externe ni image générée par IA. Sprites, décors, sachets, effets et interface restent produits par les données pixel art, HTML, CSS et SVG du projet. Les sons d’ouverture sont synthétisés via Web Audio, sans fichier audio externe.

## Phase 4 — Direction du Set 01 et pipeline

`design/set01-faerie.json` porte les 60 designs et les 20 lignées. Chaque évolution modifie proportions, posture, masse ou structure, en conservant un marqueur écrit dans la lignée. Une évolution n'est jamais obtenue en agrandissant le même sprite ou en changeant uniquement sa couleur. Les palettes communes sont volontaires ; les silhouettes restent distinctes.

La bibliothèque prévoit 25 familles anatomiques : graine, cervidé, arbre-portail, lapin, fleur, champignon, coléoptère, chat, grenouille, salamandre, luciole, oiseau, serpent, golem, papillon, canidé, limace, escargot, poisson, chauve-souris, baleine, créature ronde, esprit, dragon et voile astral. Onze sont réalisées dans les douze échantillons ; les quatorze autres sont des directions de production explicites.

`lib/content/directed-sprites.ts` construit les pixels sur une grille 64 × 64 par recette dirigée. Les neuf parties sont queue, ailes, corps, tête, oreilles, coiffe, visage, accessoire et aura. La recette choisit anatomie, variantes de corps/tête, oreilles, cornes, ailes, queue, couronne, yeux, marques, accessoire et idle. Les variantes sont adaptées aux anatomies implémentées, pas des combinaisons arbitraires universelles. Une anatomie sans recette implémentée ne reçoit aucun sprite de remplacement.

La seed ne définit jamais le corps ni la silhouette : elle varie uniquement des marques secondaires dans des pixels déjà présents. Les chemins SVG regroupent couleur et partie. L'inspection des parties permet de vérifier le montage ; les animations peuvent être arrêtées et respectent `prefers-reduced-motion`.

### Échantillon avant production

Douze rendus : Moussillon, Sylvérêve, Éon de la clairière, Lièvrille, Chantignon, Frangonde, Lanterlume, Aubepiou, Lunailée, Noctipapille, Horlogrève et Velours d'Entre-mondes. Comparer à 48, 64, 80, 112 et 160 px, en silhouette, sur parchemin, nuit et quadrillage. L01 et L13 montrent deux transformations complètes. `/dev` contient aussi les 60 fiches, les 20 lignées et les cartes d'étude avec habitat.

La production des 48 sprites restants attend la validation visuelle de ces douze échantillons. Les neuf sprites du prototype jouable sont conservés séparément.

### Signatures des raretés hautes

Éon devient une arche d'arbre vivante, avec racines étalées, vide central, cœur flottant et pulsation des racines. Velours d'Entre-mondes est un voile astral plié en losange, avec boucle centrale, ruban asymétrique et graine orbitale. Leurs compositions, habitats, auras et idles sont distincts ; aucun des deux n'est un grand dragon lumineux.

Les quatre légendaires ont des signatures prévues dans leurs fiches : Floréale (fleur cérémonielle), Nacréveil (baleine de brume), Auralis (dragon de rubans d'aurore), Horlogrève (portique horloger). Seul Horlogrève est rendu dans cet échantillon ; les trois autres restent à produire après validation.

### Habitats du contenu

Seize profils construits en SVG : clairière, sous-bois, prairie fleurie, arbre ancien, rivière, mare, cascade, grotte cristalline, forêt de champignons, nuit étoilée, ruines féeriques, canopée, aurore, sanctuaire, dimension astrale et verger de braise. Couleurs, plans, motifs et petits détails sont déterministes. Un atlas expose tous les habitats dans l'atelier ; les cartes mythiques possèdent un détail de décor et une aura de signature.

## Phase 4.5 — Validation artistique du moteur

L'échantillon reste limité aux douze créatures. La seed demeure secondaire ; aucun visage ni aucune posture n'est tiré au hasard. Les 48 sprites finaux ne sont pas produits.

Les recettes possèdent une direction faciale typée : yeux ronds, étroits, en amande, croissants, lumineux, œil unique, profil ou absence de visage ; espacement, bouche absente, sourire, museau, bec, masque et asymétrie sont indépendants. `ANATOMY_FACE_RULES` impose les combinaisons autorisées par anatomie, en plus des ancrages faciaux propres à chaque corps. Les portails et voiles refusent un visage animal classique ; les oiseaux imposent profil et bec.

Les proportions distinguent taille de tête, largeur et hauteur. Dix postures dirigées sont représentées : assis, debout, quadrupède, flottant, ailes ouvertes, recroquevillé, tourné, penché, suspendu et enraciné. Elles s'appuient sur la géométrie de l'anatomie, les rapports de proportions et, pour les poses penchées/tournées/flottantes/suspendues, une déformation ou un décalage raster explicite. Ce n'est pas un système de rig universel : un quadrupède ne devient pas un bipède en changeant uniquement une étiquette. L'ombrage oppose une poche d'ombre basse à droite et une lumière haute à gauche.

La vue `/dev` **Set 01 — Style Validation** expose silhouette noire, couleurs à 48/112 px, anatomie, posture, ratio mesuré largeur tête/corps (visage inclus), recette faciale et idle. Les cinq tailles peuvent être déployées. Le mode Avant montre les pixels exacts de Phase 4 conservés dans `design/phase4-sprite-baseline.json`, sans animation ; le mode Après utilise le moteur courant. Cette référence figée ne doit pas être régénérée lors des prochaines corrections.

| Créature | Changement Phase 4.5 |
| --- | --- |
| Moussillon | Petit volume replié, tête dominante, yeux ronds, rebond et feuille mobile. |
| Sylvérêve | Corps plus étroit, petite tête, longues pattes, yeux en amande, museau et ramures mobiles. |
| Éon de la clairière | Portail sans visage, canopée désaxée, cœur suspendu et feuilles satellites. Racines, feuillage et cœur ont des mouvements distincts. |
| Lièvrille | Tête plus grande, yeux très espacés, clin d'œil asymétrique, museau et oreilles mobiles. |
| Chantignon | Pied penché, yeux étroits sans bouche, ombrage du chapeau et spores qui descendent. |
| Frangonde | Tête large, pose tournée, regard espacé, museau et queue ondulante. |
| Lanterlume | Petite tête masquée, yeux lumineux rapprochés, suspension et pulsation de lanterne. |
| Aubepiou | Corps plus petit, grosse tête, œil de profil, bec et regard bref avec clignement. |
| Lunailée | Papillon compact, grosse tête, yeux fermés en croissant, respiration lente des ailes. |
| Noctipapille | Quatre ailes verticales, abdomen allongé, petite tête masquée et regard lumineux asymétrique. Présence nettement supérieure à la Base. |
| Horlogrève | Portique flottant, œil unique, mains détachées décalées, pendule, aiguilles et halo horloger. |
| Velours d'Entre-mondes | Voile sans visage, aile gauche plus haute, deux pointes libres dissymétriques, graine et ruban orbital. |

Les quatre signatures légendaires sont précisées dans le roster : Floréale (corolle cérémonielle inclinée et pétales satellites), Nacréveil (baleine horizontale et nageoires détachées), Auralis (dragon diagonal aux ailes-rubans inégales), Horlogrève (portique flottant à œil unique). Les trois premières restent des directions prévues ; seule la quatrième est rendue dans l'échantillon.

La planche extrême réunit huit cas. Cinq études temporaires réutilisent les anatomies et testent rondeur, finesse, largeur, hauteur et petite taille ; trois cas reprennent asymétrie, absence de visage et structure flottante des échantillons. Ces études `STUDY-*` ne sont ni des cartes finales, ni des membres du roster, ni des tirages de booster. Les animations sont propres à chaque échantillon et se figent avec le contrôle manuel ou la préférence de mouvement réduit.


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

Les 48 compositions supplémentaires sont construites dans `lib/content/production-shapes.ts`, avec posture et proportions dirigées, visages compatibles, parties distinctes et marques de seed secondaires. Aucune évolution ne se contente d’agrandir la base. Floréale déploie une couronne cérémonielle, Nacréveil une marée de nacre, Auralis un envol auroral. Leurs idles sont distincts des deux mythiques et d’Éon. `design/phase45-reference.json` fige les douze recettes et leurs empreintes de pixels ; les tests empêchent toute régression involontaire. Aucun asset externe ni image IA.


Les six illustrations peintes proposées le 2 octobre 2026 ont été archivées dans `design/archive/2026-10-02-prestige-art/` pour une éventuelle utilisation ultérieure. Le style actif reste celui des sprites, habitats et cadres antérieurs.

## Phase 8 — Lisibilité et sensations

Les sprites, habitats et cadres restent ceux du Set 01. Aucun nouvel asset ni image générée. La première arrivée utilise la machine existante sur une surface sombre, avec illumination brève et deux actions immédiates. Le clic produit un recul court, un flash, des particules et un montant flottant ; le critique renforce ces mêmes signes. Les paliers de combo sont lumineux mais la scène demeure lisible.

Achats possibles, synergies et récompenses utilisent les verts doux, l’or pâle et les couleurs des types ; aucun badge rouge. L’inspection agrandit la vraie carte et montre la lignée en sprites. À 390/430 px, le dialogue défile verticalement, la carte reste au centre et les actions gardent leur place. Navigation avec compteurs et points discrets, focus doré visible, labels explicites.

Les enveloppes Web Audio sont courtes et légères. Chaque famille possède ses notes, les quatre raretés hautes une séquence distincte. Pas de musique ni fichier audio. Sons et volume suivent les paramètres communs au jeu et au booster. Les animations réduites (forcées ou système) retirent déplacements, pulsations et transitions ; les temporisations d’ouverture suivent la même préférence. Spécification UX : `design/phase8-ux.md`.
