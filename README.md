# TCG Clicker — Faerie · Phase 3

**État actuel — Phase 6 (2 octobre 2026) : Set 01 complet, recharge de boosters et sauvegarde v3. Les sections antérieures constituent l’historique ; la section Phase 6 décrit le comportement actuel.**

Prototype local Next.js / React / TypeScript, sans service externe, police téléchargée, asset graphique externe ou image générée par IA. Les trois documents de conception à la racine restent la source de vérité.

## Lancer

Node.js 22 recommandé.

```powershell
npm install
npm run dev
```

Ouvrir http://127.0.0.1:3000 ; atelier des sprites : http://127.0.0.1:3000/dev.

```powershell
npm test
npm run typecheck
npm run build
```

## Boucle jouable

Le portail rapporte 1 éclat par clic au départ, sans critique ni bonus de combo gratuits. Sept familles d'améliorations permanentes développent clic, passif, critiques, combo, énergie globale et bonus Faerie. Les coûts croissent exponentiellement. Les achats d'Amplificateur sylvestre enrichissent visuellement la machine aux paliers 1/5/10/20/35/50.

Le combo augmente avec les clics rapprochés et décroît après une pause ; il multiplie uniquement les clics. Les boosters coûtent initialement 100 éclats, contiennent cinq cartes, et garantissent une Peu commune ou mieux en cinquième position. Les cartes se renforcent manuellement dans le classeur : 2/3/4/5 doublons consommés pour les niveaux 2/3/4/5, avec une copie toujours conservée ; chaque doublon rapporte aussi de l'énergie. Le classeur montre les lignées et silhouettes ; les évolutions exigent la découverte du parent pour être équipées.

L'écran Deck présente six emplacements, statistiques, bonus cumulés, synergies, trois exemples de builds et prévisualisation des remplacements. La capacité est centralisée, prête pour sept/huit places ultérieures. Les cartes sont numérotées /060, avec soixante espèces disponibles. Les règles chiffrées et le plan des 60 cartes sont documentés dans GAME_DESIGN.md et SET_01_FAERIE.md.

La sauvegarde est maintenant en version 2, toujours sous la clé locale `tcg-faerie-v1` pour retrouver les anciennes parties. La migration conserve énergie, machine, copies, deck et ouverture en cours, initialise les nouvelles familles et garde une copie v1 sous `tcg-faerie-v1-backup`. Une sauvegarde illisible ou d'une version future n'est jamais écrasée : le message indique que la session ne sera pas persistée. Le combo se réinitialise au rechargement. Pas de production hors ligne ni de synchronisation multi-onglets : jouer dans un seul onglet.

## Modifier le prototype

- `lib/cards.ts` : contenu, raretés, palettes, seeds et effets.
- `lib/game.ts` : statistiques, économie, tirage pondéré, équipement/remplacement atomique, capacité et migration v1 → v2 ; fonctions pures testées.
- `lib/effects.ts` : catalogue typé des effets, résolution centrale et descriptions numériques.
- `lib/progression.ts` : sept améliorations, coûts, niveaux de cartes, combo et paliers de machine.
- `lib/synergies.ts` : seuils de type et propositions de builds Clic, Idle et Collection.
- `components/game/` : vues Collection, Deck, Améliorations et jauge de combo.
- `app/progression.css` : mise en page responsive et retour visuel de progression.
- `lib/sprites.ts` : rasterisation déterministe sur grille 64 × 64, neuf anatomies, détails basés sur seed et séparation des parties (corps, queue, ailes, coiffe, visage).
- `lib/visuals.ts` : habitats, noms de capacités, textes d'ambiance, finitions et durées de suspense. Aucun changement des effets du jeu.
- `components/Sprite.tsx` : pixels regroupés en chemins SVG par couleur et partie, animations idle. Pas d'image ni de dépendance graphique.
- `components/CardArt.tsx` : décors procéduraux en plans successifs, atmosphère déterministe et créature au premier plan.
- `components/Card.tsx` : cadre de collection, typographie, foil, holographie et reflet au pointeur. Les finitions dépendent de la rareté, sans nouvelle variante de gameplay.
- `components/Machine.tsx` : forêt vivante, vortex, cristaux, runes et végétation. Réactions au clic et au critique dans `Game`.
- `components/BoosterOpening.tsx` : carrousel, découpe au doigt/souris, pile avec carte suivante face visible, retrait des cartes et récapitulatif. Anticipation à la première apparition uniquement ; effets de rareté au premier plan. Temporisations annulées au démontage et attribution unique de chaque carte.
- `components/BoosterPack.tsx` : sachet commun à la boutique et à l'ouverture.
- `components/Game.tsx` : orchestration de la partie et persistance.
- `app/dev/page.tsx` : neuf sprites comparés simultanément à 48/80/112 px, zoom ×2/×3/×4, quatre fonds, palette exacte, seed, isolation des parties et arrêt des animations. Vue des cartes et ouverture de démonstration couvrant Commune, Rare, Épique, Légendaire et Mythique ; aucune modification de la sauvegarde.
- `app/globals.css` : structure de l'interface ; `app/polish.css` : surfaces, décors et chorégraphie de la phase 2. Respect de `prefers-reduced-motion` et bouton pour passer le suspense.

Les choix de prix, noms et effets sont des valeurs de test de cette vertical slice, pas le contenu définitif du set. Animations CSS/SVG : GSAP n'était pas nécessaire.

## Validation visuelle

Ouvrir `/dev`, comparer les silhouettes sur les fonds clair et sombre, puis consulter « Cartes & finitions ». « Tester l'ouverture » permet de voir les révélations sans attendre un tirage rare. La carte suivante est déjà face visible sous celle que l’on retire. Elle arrive directement au premier plan avec les effets de sa rareté, sans dos ni suspense intermédiaire. Seule la première apparition conserve une courte anticipation, raccourcie à 50 ms avec les animations réduites.

La phase 3 conserve les neuf identifiants, les sprites, la clé de sauvegarde et les gestes de booster. Les effets ont été rééquilibrés pour les trois builds. Aucun asset externe, image IA ou package ajouté.

## Documents du projet

- `GAME_DESIGN.md` : boucle, périmètre et comportement actuel de l’ouverture.
- `ART_BIBLE.md` : rendu 64 × 64, cartes, finitions, continuité de la pile et atelier.
- `SET_01_FAERIE.md` : référence des 60 cartes jouables et historique du prototype.
- `VERIFICATION.md` : derniers contrôles et historique des validations.

## Ouverture tactile — 2 octobre 2026

L’ouverture reprend les gestes de collection de Pokémon TCG Pocket avec les graphismes originaux Faerie : carrousel de sachets, découpe horizontale du haut, bandelette détachée, apparition d’une pile, première carte automatique, puis balayage ou toucher pour retirer la carte visible. Le choix du sachet est uniquement visuel et ne relance jamais le tirage payé. Les nouvelles espèces sont signalées « NOUVEAU » et les cinq cartes apparaissent au récapitulatif.

- `app/opening.css` : scène plein écran, pile, glissements, découpe et récapitulatif responsive.
- `lib/pack-audio.ts` : déchirure, souffle et carillon synthétisés via Web Audio. Le son commence uniquement après interaction et peut être coupé dans l’ouverture. Aucun fichier audio externe.
- Souris, tactile, clavier et boutons alternatifs sont pris en charge. Une découpe incomplète revient à zéro ; un déplacement court replace la carte ; les actions rapides ne doublent pas l’attribution.
- La sauvegarde conserve toujours les cartes déjà révélées et reprend à la suivante. Le mode atelier reste indépendant de la partie.

Référence de gestes : https://corporate.pokemon.co.jp/en/topics/detail/t-28/ . Il s’agit d’une adaptation au monde Faerie, sans reprise des assets Pokémon.

## Phase 4 — Roster et échantillon visuel

Le Set 01 possède 60 fiches complètes, 20 lignées, 8 uniques et une répartition exacte 24/14/10/6/4/2. Le prototype jouable conserve ses neuf cartes et son économie. Les identifiants de design `F01-*` et les capacités futures ne sont jamais injectés dans la partie.

Ouvrir `/dev`, puis **Set 01 — Roster** : douze sprites d'étude, cartes avec habitat, vingt lignées, soixante fiches filtrables et atlas de seize décors. Comparer à 48/64/80/112/160 px, afficher silhouettes, palettes, seeds ou parties, et arrêter les animations. Les 48 sprites supplémentaires attendent la validation visuelle de l'échantillon.

- `design/set01-faerie.json` : source des fiches, évolutions, palettes, seeds, signatures et recettes de l'échantillon.
- `lib/content/model.ts` et `roster.ts` : taxonomie, conditions futures et validation de contenu.
- `lib/content/directed-sprites.ts` : vingt-cinq anatomies implémentées, neuf parties dirigées et marques secondaires déterministes.
- `lib/content/habitats.ts` et `components/content/` : décors, sprites, cartes d'étude et atelier de contenu.
- `app/roster.css` : présentation et idles, avec animations réduites.
- `scripts/generate-set-doc.ts` : régénère la référence des 60 fiches à partir des données, sans toucher au tableau du prototype Phase 3.
- `tests/content.test.ts` : structure, relations, silhouettes, palettes, seeds, composants, signatures et séparation du gameplay.

Après modification des données, exécuter `npx --no-install tsx scripts/generate-set-doc.ts`, puis `npm test`, `npm run typecheck` et `npm run build`. La documentation générée est contrôlée par les tests. `SET_01_FAERIE.md` décrit désormais l'ensemble du roster ; `ART_BIBLE.md` décrit le pipeline et la validation avant production.

## Phase 4.5 — Comparaison artistique

Dans `/dev`, ouvrir **Set 01 — Style Validation**. Douze fiches comparent silhouettes noires et sprites couleur à 48/112 px, avec anatomie, posture, rapport tête/corps, visage et idle. Activer les cinq tailles pour vérifier 48/64/80/112/160 px. Les boutons Avant/Après confrontent le moteur courant au témoin exact Phase 4, conservé en données vectorielles générées par le code.

`lib/content/style-validation.ts` définit les notes, mesures et huit études extrêmes ; `components/content/StyleValidation.tsx` présente la grille. `design/phase4-sprite-baseline.json` est une référence figée à conserver. Cinq études temporaires de proportions restent hors des 60 cartes. Douze animations spécifiques, dix postures et huit modes de regard sont représentés. Les 48 sprites supplémentaires attendent toujours la validation visuelle ; aucun changement d'économie, booster, sauvegarde ou probabilité.


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

Fichiers principaux : `design/set01-faerie.json`, `lib/cards.ts`, `lib/content/production-shapes.ts`, `lib/content/directed-sprites.ts`, `lib/synergies.ts`, `components/CardArt.tsx`, `components/Sprite.tsx`, `components/game/CollectionView.tsx`, `components/content/RosterWorkbench.tsx`, `app/roster.css`. Les anciens sprites restent uniquement comme référence historique, dans les tests et les témoins de style.


## Phase 6 — Recharge et économie des boosters

Une nouvelle partie commence à **0/2 boosters gratuits**, zéro énergie et une machine de niveau 1. Le premier booster acheté coûte 100 éclats ; le premier gratuit arrive après dix minutes. Aucune carte supplémentaire n’est ajoutée.

### Recharge et stockage

Un cycle vaut `600000` ms. Le calcul utilise la date sauvegardée, jamais le nombre de ticks d’interface : `cycles = floor((maintenant − débutDuCycle) / intervalle)`, puis `stock = min(capacité, stock + cycles)`. Tant que le stock reste inférieur à la capacité, le timestamp avance du nombre de cycles complets et conserve le reliquat.

Quand le stockage devient plein, le timestamp devient `null` : recharge suspendue, affichage **Stockage plein**, aucun temps accumulé. Consommer une réserve pleine relance exactement dix minutes à la date de consommation. Consommer une réserve partielle conserve le cycle courant. Agrandir une réserve pleine démarre un nouveau cycle ; agrandir une réserve partielle conserve son reliquat. Un recul de l’horloge locale relance le cycle sans attribuer de booster.

Au chargement, au retour de visibilité et avant une consommation, le jeu recalcule la recharge. Le jeu fermé peut remplir la réserve jusqu’à sa capacité ; il ne produit ni énergie ni cartes hors ligne. À capacité 2, une absence de 35 minutes depuis 0/2 donne 2/2. Une absence de 12 minutes depuis 1/2 donne 2/2.

Le **Sac dimensionnel** augmente la capacité de 2 à 10, avec huit achats d’énergie. Il n’accélère pas la recharge et ne débloque aucun emplacement de deck.

| Capacité | Coût en éclats |
| --- | ---: |
| 2 → 3 | 500 |
| 3 → 4 | 1 200 |
| 4 → 5 | 2 800 |
| 5 → 6 | 6 500 |
| 6 → 7 | 15 000 |
| 7 → 8 | 34 000 |
| 8 → 9 | 76 000 |
| 9 → 10 | 170 000 |

### Prix payant retenu

Pour `n` boosters déjà achetés avec l’énergie et une réduction `d` : **`prix = ceil(100 × 1.12^n × (1 − clamp(d, 0, 0.5)))`**. Le calcul applique d’abord la croissance brute, puis la réduction du deck plafonnée à 50 %, puis l’arrondi supérieur. Les imprécisions décimales JavaScript sont neutralisées à quatorze chiffres significatifs ; un plafond numérique à `Number.MAX_SAFE_INTEGER` évite l’infini aux compteurs extrêmes. Aucun plafond de prix jouable ni remise à zéro quotidienne n’est ajouté.

Seuls les achats avec l’énergie augmentent `paidBoostersPurchased`. La consommation gratuite ne débite aucune énergie, ne change ni ce compteur ni le prix suivant. Les deux sources utilisent exactement le même tirage de cinq cartes, les mêmes probabilités du deck et la même garantie Peu commune+ en cinquième position.

Comparaison préalable, prix bruts sans discount (numéro d’achat, et non compteur avant achat) :

| Courbe | 1 | 2 | 5 | 10 | 20 | 30 | 50 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ×1.08 | 100 | 108 | 137 | 200 | 432 | 932 | 4 343 |
| ×1.10 | 100 | 110 | 147 | 236 | 612 | 1 587 | 10 672 |
| ×1.12 | 100 | 112 | 158 | 278 | 862 | 2 675 | 25 804 |
| ×1.15 | 100 | 115 | 175 | 352 | 1 424 | 5 758 | 94 232 |

×1,08 laisse environ 134 boosters totaux au profil actif optimisé sur deux heures ; ×1,15 rend le 50e achat quatre fois plus cher que ×1,12. ×1,12 est retenu comme compromis initial : les dix premiers achats restent accessibles, mais l’investissement croît ensuite. Ce choix est destiné au playtest, pas considéré comme un équilibre définitif.

### Boutique et ouverture

La boutique distingue **Ouvrir un booster disponible** (une réserve gratuite) et **Acheter et ouvrir** (prix d’énergie explicite). Le stock, sa capacité et le compte à rebours restent visibles. Le bouton gratuit devient principal lorsqu’il est disponible.

L’ouverture indique discrètement sa provenance et le stock restant. Le récapitulatif conserve les cinq cartes et propose, par priorité : **Ouvrir le booster suivant** si une réserve gratuite reste ; sinon **Acheter et ouvrir un autre** avec son prix si l’énergie suffit. Cette action est absente lorsque les deux ressources manquent. **Retour à la machine** et **Voir ma collection** sont toujours disponibles. Aucune redirection automatique vers Collection.

Une ouverture successive clôt proprement le booster terminé et lance le suivant dans la même transition d’état. Une ouverture incomplète ne peut être remplacée ; les doubles actions ne consomment pas deux ressources. Chaque booster conserve présentation/choix, déchirure, cinq révélations et résumé. Aucun mode rapide ni ouverture multiple instantanée.

### Sauvegarde v3 et nouvelle partie de test

La clé `tcg-faerie-v1` reste conservée. La v3 ajoute `freeBoosters`, `freeBoosterCapacity`, `freeBoosterTimerStartedAt`, `paidBoostersPurchased` et `pendingSource`. Les migrations v1/v2 préservent énergie, collection, copies, deck équipé, niveaux, améliorations, clics et ouverture partielle. Les anciens boosters étant tous achetés, le compteur payant reprend `floor(packs)` et une ouverture historique reçoit la provenance payée. Aucun prix antérieur n’est débité rétroactivement.

Les anciennes parties commencent avec une réserve 0/2 et un cycle démarré à la migration ; aucun passé gratuit n’est inventé sans timestamp fiable. Une copie brute v1 reste sous `tcg-faerie-v1-backup`, une copie brute v2 sous `tcg-faerie-v1-backup-v2`, avant la première écriture v3. Une sauvegarde future ou invalide reste conservée sans écrasement.

Dans `/dev`, **Réinitialiser complètement la sauvegarde** demande confirmation, puis crée une vraie nouvelle partie v3 et efface les copies de secours connues. Annuler laisse la progression intacte. Ce contrôle n’apparaît pas dans la partie normale. Le jeu conserve la limite pratique d’un seul onglet actif pour une sauvegarde locale.

### Simulations préparatoires

Reproduction : `npm run simulate:economy`. Source : `scripts/simulate-booster-economy.ts` ; données : `design/phase6-economy-simulation.json`. Les quatre courbes sont testées sur 30/60/120 minutes, deux profils et trois seeds (41, 128, 902), soit 72 trajectoires.

Actif : deux clics/seconde hors ouverture. Mixte : deux minutes actives sur cinq, puis passif. Les critiques sont moyennés ; le combo utilise les règles réelles. Une ouverture dure douze secondes, sans clics, avec passif maintenu. Décisions toutes les dix secondes : meilleur rendement marginal d’amélioration par coût, priorité au booster abordable toutes les vingt secondes, puis composition automatique du deck à six cartes. Stockage maintenu à deux pour comparer les courbes. Les fonctions réelles de tirage, niveaux, effets, consommation et améliorations sont utilisées ; seul le coût payant varie entre candidats.

Moyennes des trois seeds, courbe ×1,12. Les boosters payants accessibles sont ceux effectivement achetés selon cette stratégie ; ils ne représentent pas toutes les dépenses alternatives possibles. Les occasions gratuites perdues sont les cycles théoriques sans place de stockage, pas une monnaie réellement générée puis retirée.

| Profil | Durée | Gratuits | Occasions perdues | Payants | Total | Prix suivant après discount | Machine niv. | Énergie restante | Espèces |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Actif | 30 min | 3 | 0 | 53 | 56 | 40 603 | 26 | 19 752,7 | 58/60 |
| Actif | 60 min | 6 | 0 | 68,7 | 74,7 | 241 088 | 51,7 | 171 280,3 | 59/60 |
| Actif | 120 min | 12 | 0 | 86,3 | 98,3 | 1 777 393 | 65,7 | 1 405 424,7 | 59,7/60 |
| Mixte | 30 min | 3 | 0 | 43,3 | 46,3 | 13 596 | 25,7 | 3 091,3 | 56,7/60 |
| Mixte | 60 min | 6 | 0 | 57 | 63 | 64 163,3 | 42,3 | 24 649,7 | 59/60 |
| Mixte | 120 min | 12 | 0 | 71,7 | 83,7 | 337 212,7 | 54,3 | 267 565 | 59/60 |

Profil retour, départ 0/2 et aucune production active :

| Absence | Boosters stockés | Occasions non stockées | Payants accessibles | Prix suivant | Machine | Énergie | Collection avant ouverture | Estimation après ouverture des réserves |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 10 min | 1 | 0 | 0 | 100 | 1 | 0 | 0/60 | 4.8/60 |
| 30 min | 2 | 1 | 0 | 100 | 1 | 0 | 0/60 | 9.2/60 |
| 60 min | 2 | 4 | 0 | 100 | 1 | 0 | 0/60 | 9.2/60 |
| 180 min | 2 | 16 | 0 | 100 | 1 | 0 | 0/60 | 9.2/60 |

Le premier achat survient à vingt secondes dans ces profils automatisés. Les résultats sont optimistes : deck choisi immédiatement, décisions efficaces, aucune hésitation humaine et ouverture estimée à douze secondes. Le bot découvre déjà environ 57–58 espèces en trente minutes, ce qui signale une saturation rapide potentielle à surveiller. Aucun gain de collection n’est attribué avant d’ouvrir les réserves au retour. Leur estimation après ouverture utilise les probabilités exactes de chaque espèce et de la cinquième carte garantie, sans bonus de deck.

### Playtest humain à réaliser

Nouvelle partie, trente minutes sans triche, puis éventuellement une heure. Noter le nombre de boosters gratuits/payants, les prix et les choix entre amélioration et booster ; les moments d’ennui ou de manque/surplus d’énergie ; la satisfaction des doublons et les changements de deck ; la durée ressentie des dix minutes.

Mesurer après combien d’ouvertures successives les gestes deviennent répétitifs. Examiner ensuite l’intérêt d’étapes plus courtes, d’un mode rapide ou d’une ouverture multiple ; aucune de ces solutions n’est implémentée maintenant. Tester aussi les huit coûts de stockage, la visibilité de la provenance, l’impact du compteur historique des sauvegardes migrées et la saturation de collection. Les slots Deck 7/8 restent sans moyen de déblocage.

Fichiers principaux de Phase 6 : `lib/booster-economy.ts`, `lib/game.ts`, `lib/save-storage.ts`, `components/Game.tsx`, `components/game/BoosterShop.tsx`, `components/game/UpgradesView.tsx`, `components/BoosterOpening.tsx`, `components/content/PlaytestReset.tsx`, `app/economy.css`, `app/dev/page.tsx`, `app/layout.tsx`, `scripts/simulate-booster-economy.ts`, `design/phase6-economy-simulation.json`, `tests/booster-economy.test.ts`, `tests/production.test.ts`, `tests/progression.test.ts`, `package.json`.


Les illustrations peintes des six cartes de prestige sont mises de côté dans `design/archive/2026-10-02-prestige-art/`. Le jeu utilise à nouveau ses illustrations en pixels et ses cadres précédents.

Sauvegarde actuelle v4 : `cardLevels` conserve les niveaux permanents séparément du stock de copies. Les anciennes sauvegardes gardent leurs niveaux acquis et leurs copies, avec une copie brute de secours avant migration. Les résultats de simulation Phase 6 ci-dessus datent de la base de clic 5 et doivent être relus comme historiques.


## Phase 7 — Progression long terme

Une vue **Progression** regroupe Niveau, Objectifs et Statistiques. Niveau d’exploration indépendant, 42 objectifs dont 20 lignées, milestones 10/25/40/50/60 espèces, titres cosmétiques et récompenses uniques. Les boosters gagnés disposent d’une réserve hors du stockage rechargeable. Slots de deck 7/8 : niveaux 8/15 et achats de 5 000/25 000 éclats. Ouverture rapide optionnelle au niveau 12, animation mythique conservée. Le temps actif exclut les périodes sans visibilité ou focus.

La v4 est étendue avec `account` au format 1 ; les sauvegardes v1–v4 antérieures sont migrées avec copie brute de secours. Les statistiques historiques impossibles à reconstruire sont signalées comme estimées. Style en pixels conservé. Courbe d’XP, objectifs, récompenses, statistiques et migrations : [bilan Phase 7](design/phase7-progression.md).
