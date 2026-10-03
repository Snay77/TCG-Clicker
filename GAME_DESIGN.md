# TCG Clicker — Game Design Document

**État actuel — Alpha 0.1.0 / Phase 9 (2 octobre 2026) : gameplay Phase 8 gelé, 60 cartes, progression complète et sauvegarde v4. Les sections des phases antérieures constituent l’historique.**

## Alpha navigateur — état actuel

Export/import JSON v4, reset confirmé, diagnostics et récupération sont dans Paramètres ou l’écran de secours. Les copies de sauvegarde restent locales. Une seule session peut jouer par origine : verrou Web Locks, fallback bail localStorage, second onglet en pause. L’atelier est disponible uniquement en développement. L’alpha ne crée aucun nouveau gameplay et conserve les sprites, habitats et finitions du set complet.

Voir `README.md`, `ALPHA_RELEASE_CHECKLIST.md`, `ALPHA_TEST.md` et `design/alpha-audit.md` pour la préparation de publication, les contrôles et les limites. Safari/iOS et les playtests humains restent à valider.


## Concept

Le Set 01 complet est disponible ; ses effets et affinités alimentent les systèmes de progression Phase 3.

TCG Clicker est un jeu de clicker centré sur la collection de créatures à travers des boosters.

Le joueur utilise une machine interdimensionnelle pour produire de l'énergie. Cette énergie permet d'acheter des boosters contenant des cartes de créatures.

Les cartes peuvent ensuite être équipées dans un deck pour améliorer le clicker.

## Plateforme

- Navigateur en priorité
- Steam potentiellement plus tard

## Boucle principale

1. Cliquer sur la machine interdimensionnelle
2. Gagner de l'énergie
3. Acheter des améliorations
4. Acheter des boosters
5. Ouvrir les boosters
6. Collectionner les créatures
7. Équiper des cartes
8. Améliorer les gains du clicker
9. Recommencer

## Machine interdimensionnelle

La machine est l'élément principal du clicker.

Elle doit évoluer visuellement au fil de la progression.

Chaque clic produit de l'énergie.

Les cartes équipées peuvent modifier :
- la puissance des clics
- les critiques
- la production automatique
- le prix des boosters
- les probabilités
- les combos
- d'autres mécaniques futures

## Premier univers

Le premier monde est un univers féerique.

Ambiance :
- forêt magique
- végétation lumineuse
- lucioles
- champignons
- créatures mignonnes
- magie
- couleurs vives
- atmosphère vivante

## Set 01

Le premier set contient 60 cartes jouables, décrites dans `SET_01_FAERIE.md`.

Les cartes représentent principalement des créatures vivantes.

Les créatures peuvent avoir jusqu'à 3 stades :

- Base
- Évolution 1
- Évolution 2

## Raretés

Raretés prévues :

- Commune
- Peu commune
- Rare
- Épique
- Légendaire
- Mythique

Des variantes peuvent également exister :

- normale
- foil
- holographique
- variantes spéciales futures

## Boosters

Un booster contient plusieurs cartes.

Pour le prototype :
- 5 cartes par booster

L'ouverture doit être une partie importante de l'expérience.

Les cartes doivent être révélées une par une avec des animations différentes selon leur rareté.

### Ouverture actuelle

1. Choisir visuellement un sachet dans un carrousel de cinq boosters. Ce choix ne change pas le tirage acheté.
2. Découper horizontalement le haut du sachet à la souris ou au doigt, dans les deux sens. Un bouton et le clavier permettent aussi de l’ouvrir.
3. Détacher la bandelette, retirer l’emballage et faire apparaître la pile. La première carte apparaît automatiquement après une courte anticipation.
4. Toucher la carte pour l’envoyer vers le haut, ou la balayer. La suivante est déjà face visible dessous : aucun retournement ni suspense supplémentaire entre les cartes.
5. Déclencher les effets de rareté à l’arrivée au premier plan, progressivement plus marqués de Rare à Mythique.
6. Afficher les cinq cartes dans un récapitulatif, avec une indication des nouvelles espèces.

La carte en arrière-plan est un aperçu : elle n’est attribuée qu’à son arrivée au premier plan, une seule fois. La sauvegarde conserve les cartes obtenues et reprend à la suivante après rechargement.

Les sons sont synthétisés en code et désactivables. Les animations respectent la préférence de mouvement réduit. La démonstration de `/dev` ne modifie pas la sauvegarde.

## Collection

Le joueur possède un classeur permettant de voir toutes les cartes du set.

Les cartes non découvertes apparaissent sous forme de silhouette.

Chaque carte possède :
- un numéro
- un nom
- une créature
- une rareté
- un type
- un stade d'évolution
- un effet
- une variante éventuelle

## Deck

Le joueur commence avec 6 emplacements de deck.

Le nombre d'emplacements pourra être amélioré plus tard.

Seules les cartes équipées appliquent leurs effets principaux.

Cela permet au joueur de créer différents builds.

## Doublons

Obtenir plusieurs fois la même carte doit rester utile.

Une carte découverte commence au niveau 1. Les niveaux 2 à 5 coûtent respectivement 2, 3, 4 et 5 doublons de la même carte, consommés manuellement dans le classeur ; une copie reste conservée. Les effets valent respectivement ×1, ×1,2, ×1,5, ×1,8 et ×2. Chaque doublon rapporte immédiatement 1 éclat, augmenté par les effets `duplicateBonus` du deck. Aucun recyclage, poussière ni craft.

## Direction artistique

Le jeu utilise un pixel art moderne.

La direction doit être :
- colorée
- vivante
- lumineuse
- mignonne
- lisible
- dynamique

Le jeu ne doit pas avoir une apparence rétro 8-bit fade.

Les créatures doivent avoir :
- une silhouette facilement reconnaissable
- de grandes formes lisibles
- beaucoup de personnalité
- des animations idle légères

## Cartes

Les cartes doivent évoquer la sensation d'un vrai TCG de monstres tout en possédant une identité originale.

Structure générale :

- nom en haut
- informations de type et d'évolution
- grande illustration de la créature
- rareté
- numéro de collection
- effet de gameplay
- informations supplémentaires en bas

Les cartes rares peuvent avoir :
- reflets animés
- holographie
- particules
- halos
- motifs spéciaux
- animations

## Graphismes

Règle fondamentale :

Aucun asset graphique externe.

Aucune image générée par intelligence artificielle.

Les graphismes doivent être créés directement dans le projet à l'aide de :

- HTML
- CSS
- Canvas
- SVG
- données de pixel art
- effets procéduraux
- shaders si nécessaire

Les créatures doivent notamment pouvoir être produites ou assemblées en code.

## Technologie

Stack prévue :

- Next.js
- React
- TypeScript
- HTML/CSS
- Canvas
- SVG
- GSAP lorsque nécessaire

## Première version

La première version ne doit pas immédiatement contenir les 60 cartes.

Créer d'abord une vertical slice contenant :

- clicker
- machine interdimensionnelle
- énergie
- quelques améliorations
- boosters
- ouverture de booster
- 6 à 10 cartes temporaires
- collection
- deck
- effets des cartes
- système de rareté
- premiers sprites de créatures

L'objectif est de valider le gameplay et surtout la direction artistique avant de produire le Set 01 complet.

## Phase 3 — progression permanente

Les sept familles sont configurées dans `lib/progression.ts`. Coût du niveau suivant : arrondi supérieur de `base × croissance^niveauActuel`.

| Famille | Coût initial | Croissance | Limite | Gain par niveau |
| --- | ---: | ---: | ---: | --- |
| Amplificateur sylvestre | 75 | 1,17 | 100 | +1 / clic |
| Luciole mécanique | 60 | 1,20 | 100 | +1,5 / sec |
| Lentille lunaire | 180 | 1,35 | 25 | +1 point critique |
| Prisme de résonance | 250 | 1,30 | 30 | +0,15 multiplicateur critique |
| Cadence du portail | 120 | 1,30 | 20 | +5 % bonus de combo |
| Cœur interdimensionnel | 350 | 1,40 | 30 | +5 % énergie globale |
| Pacte de la clairière | 200 | 1,32 | 30 | +4 % énergie Faerie |

Chaque achat d'Amplificateur sylvestre augmente le niveau de machine d'un cran ; les autres familles améliorent ses statistiques. Le champ `level` conserve ce compteur historique ; le niveau affiché vaut `level + 1`. Paliers visuels cumulatifs : niveau 1 portail initial, 5 cristaux accordés, 10 lianes et fleurs intégrées au cadre, 20 runes, 35 anneaux et stabilisateurs dimensionnels, 50 cœur lumineux renforcé. Ils restent entièrement en SVG/CSS. Ce lien à la progression du clic évite de parcourir tous les paliers visuels en achetant seulement les premiers niveaux peu coûteux des sept familles.

Le combo gagne 4 points par clic, plafonné à 100. Après 1 seconde sans clic, il perd 18 points par seconde. Son multiplicateur continu vaut `1 + charge/100 × min(1, bonusCombo)`, soit ×1 initialement et ×2 au maximum. Les paliers 25/50/75/100 ont un retour visuel. Le passif ne dépend jamais du combo ; le combo n'est pas sauvegardé.

## Effets, builds et synergies

`lib/effects.ts` centralise le cumul de `clickFlat`, `clickMultiplier`, `autoFlat`, `autoMultiplier`, `critChance`, `critMultiplier`, `boosterDiscount`, `comboMultiplier`, `faerieBonus`, `rareChance`, `duplicateBonus`, `energyMultiplier`. Les pourcentages se cumulent par catégorie ; 0,1 représente +10 %. Le niveau de carte multiplie toutes ses contributions. Les synergies ont un bonus fixe.

Clic = `(1 + clics plats) × (1 + bonus clic) × (1 + énergie globale) × (1 + Faerie)`. Passif = `passif plat × (1 + bonus passif) × (1 + énergie globale) × (1 + Faerie)`. Critique initial : 0 % ; multiplicateur ×3 une fois la chance débloquée ; chance plafonnée à 75 %. Réduction booster plafonnée à 50 %. `rareChance` augmente les poids de Rare à Mythique, avec un maximum de +75 %, puis renormalise toutes les probabilités. La cinquième carte reste Peu commune ou mieux. Les probabilités exactes du deck sont affichées en boutique.

Les trois propositions de six compagnons dans `lib/synergies.ts` utilisent les neuf cartes existantes : Clic privilégie Flamèche et les deux Lune ; Idle privilégie Chantignon, Roséclair et Auralis ; Collection combine les deux évolutions Sylve/Astral, Noctipapille et Auralis pour les doublons, les tirages et une production d'appoint. Les builds partagent certains compagnons : c'est volontaire avec seulement neuf espèces. Les améliorations permanentes complètent leur spécialisation.

Synergies temporaires accessibles : Sylve ×2 → +10 % énergie globale ; Lune ×2 → +5 points critique ; Mycète ×1 et Rosée ×1 → chacun +5 % passif ; Étincelle ×1 → +5 % clic. Les seuils à une carte sont des affinités provisoires : le prototype ne possède qu'une carte de ces types. Les règles sont data-driven, prêtes pour des seuils plus élevés dans le set complet.

Le Deck présente les emplacements, les niveaux, les bonus du deck, les statistiques permanentes, les synergies actives/proches et les builds proposés. Un emplacement sélectionné permet un remplacement atomique avec prévisualisation des variations de clic, passif, critique, multiplicateur critique et réduction booster. `deckCapacity(save)` est l'unique règle de capacité : six emplacements initiaux, plus `extraDeckSlots` (0 à 2), sans achat de capacité dans cette phase.

## Lignées et sauvegarde

Moussillon → Sylvérêve → Éon de la clairière ; Lunailée → Noctipapille. `evolvesFrom` et `evolvesTo` relient des cartes indépendantes ; les formes non découvertes sont des silhouettes. L'équipement exige la découverte du parent immédiat, sans le consommer ni l'obliger à rester équipé.

Sauvegarde v2 : anciens champs conservés, ajout de `upgrades` (sept niveaux) et `extraDeckSlots`. Les niveaux de carte dérivent de `owned`. La clé `tcg-faerie-v1` reste identique pour retrouver les parties existantes. Migration automatique : ancien `level` conservé et reporté dans `upgrades.click`, nouvelles familles à zéro, cartes/deck/énergie/clics/boosters/ouverture préservés. Une copie brute v1 est gardée sous `tcg-faerie-v1-backup` avant écriture v2. Les évolutions déjà équipées en v1 restent actives ; les prérequis s'appliquent aux nouveaux équipements. Une sauvegarde illisible ou future est conservée sans écrasement, avec message visible et session temporaire non persistée.

`Game.tsx` garde orchestration, timers, persistance et scène principale ; `components/game/` contient `CollectionView`, `DeckView`, `UpgradesView`, `ComboBar`. Les composants de cartes et boosters gardent leurs chemins pour limiter le refactor. Aucun asset, image IA ou dépendance ajouté. Les interactions souris/tactiles/clavier, Web Audio, animations réduites, sprites déterministes et `/dev` restent pris en charge.

## Phase 4 — Contenu du Set 01

Le roster complet est une couche de design séparée dans `design/set01-faerie.json`, exposée uniquement dans l'atelier. Ses identifiants `F01-001` à `F01-060` ne remplacent pas les neuf identifiants du jeu. Les effets, rôles et six familles de conditions futures sont des propositions déclaratives : type équipé, type absent, lignée équipée, combo minimum, espèces découvertes, chaque nième clic. Aucune n'est branchée sur le calcul des statistiques ou le tirage actuel.

Les 12 lignées de trois cartes, 8 lignées de deux cartes et 8 uniques totalisent 60 espèces : 24 Communes, 14 Peu communes, 10 Rares, 6 Épiques, 4 Légendaires et 2 Mythiques. Douze échantillons servent à valider les silhouettes et les évolutions avant la production des 48 autres. `SET_01_FAERIE.md` reste la référence complète. Les paramètres Phase 3 de clic, combo, prix, améliorations, machine, deck, sauvegarde et ouverture ne changent pas.

## Points à tester en playtest

La simulation optimiste Phase 3 suggère une machine autour de 28 à 5 minutes, 44 à 15 minutes et 53 à 30 minutes, avec jusqu'à environ 89 boosters en 30 minutes. Ces chiffres ne représentent pas une session humaine ; aucune valeur n'est modifiée à ce stade.

- Vitesse réelle de progression de la machine et perception de ses paliers visuels.
- Fréquence réelle d'achat des boosters, selon clics, passif et pauses.
- Fatigue liée aux ouvertures répétées et souhait de les accélérer.
- Valeur ressentie des doublons : énergie, niveaux et utilité après saturation.
- Frustration lorsqu'une évolution arrive avant son parent et compréhension du prérequis.
- Temps nécessaire pour compléter six emplacements, puis construire un deck spécialisé.

L'équilibrage sera revu à partir de vraies sessions après stabilisation du Set 01.


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


### Ajustement de progression — clic et consommation des doublons

Une partie neuve commence à exactement 1 éclat par clic. Aucun critique ni combo multiplicatif avant acquisition des bonus. L’amplificateur donne +1 par niveau (1 → 2 → 3…).

Les niveaux de carte sont désormais persistés séparément des copies (sauvegarde v4). Amélioration manuelle dans le classeur : 2, 3, 4, puis 5 doublons de la même carte consommés. Une copie est toujours conservée ; carte équipée, découverte et prérequis d’évolution restent valides. Effets permanents : ×1 / ×1,2 / ×1,5 / ×1,8 / ×2 aux niveaux 1–5. Un nouveau doublon ne monte plus automatiquement le niveau. Migration v1–v3 : niveaux déjà acquis et copies conservés, sauvegarde brute de secours.

Les mesures de simulation Phase 6 ci-dessus sont historiques (base de clic 5) ; elles ne valident pas l’équilibrage actuel. Le script utilise désormais la base 1 et le combo acquis.


### Illustrations de prestige archivées

À la demande du joueur, les six illustrations peintes et leur habillage sont conservés dans `design/archive/2026-10-02-prestige-art/` pour plus tard. Le rendu actif revient aux sprites et habitats en pixels, avec les cadres et titres de capacités précédents. Les améliorations de progression restent actives.


## Phase 7 — Objectifs, progression et déblocages

Spécification de l’implémentation dans `design/phase7-progression.md`. Courbe : 100 + 50 × (niveau − 1) XP par niveau ; niveau global indépendant. Activités : booster 20 XP, découverte 25, Rare+ 8, achat d’amélioration 5, niveau de carte N : 15 × N. Pas d’XP par clic seul. 42 objectifs déclaratifs, dont 20 lignées ; récompenses uniques en énergie, XP et boosters dans une réserve séparée. Milestones 10/25/40/50/60 ; à 60/60, 10 000 éclats + 2 000 XP + 5 boosters, animation et titre Gardien du Portail.

Déblocages : 3 triples de type (+3 % énergie), 5 objectifs experts, 8 slot 7 (5 000), 12 ouverture rapide, 15 slot 8 (25 000), 20 maîtrise du set. Les paires de type et les coûts actuels des boosters et du stockage sont conservés. Temps actif uniquement visible et avec focus ; compteurs de cartes obtenues persistants malgré consommation des doublons. V4 étendue avec compte au format 1, compatible versions précédentes et v4 de cartes manuelles. Aucun nouvel asset.

## Phase 8 — Onboarding, UX & Game Feel (2 octobre 2026)

La première arrivée présente le portail avec deux actions immédiates : Éveiller ou passer. Elle ne se rejoue pas. Les six conseils contextuels suivent clics, amélioration abordable, prix du booster, première collection, compagnons et exploration. Chaque conseil se ferme ; Passer les conseils est permanent. Les premiers pas mémorisent cinq actions, sans récompense : produire, améliorer, finir un booster, découvrir cinq espèces, équiper. La checklist disparaît après ces cinq actions ; le dernier conseil peut encore être consulté.

La machine conserve la priorité visuelle : recul court, flash, particules, montant et critique distinct. Combo chiffré sur 100, multiplicateur réel et délai avant décroissance. Les sept améliorations affichent leur contribution cumulée actuelle (y compris zéro) et celle du prochain niveau, niveau et prix. Les achats accessibles et réserves disponibles ont des contours doux ; Machine et Progression portent un point, Collection et Deck leurs compteurs sur ordinateur et mobile.

Classeur : recherche, type, rareté, découverte, améliorables, tri numéro/rareté et regroupement par lignée. Examiner ouvre une vraie carte pixel en grand, avec niveau, copies, lore, effets, lignée et actions. Amélioration : niveau actuel → suivant, effet avant/après, coût consommé et copie conservée. Une forme inconnue reste une silhouette. Le booster montre les copies avant → après, en tenant compte des doublons du même sachet et d’une reprise ; « Amélioration disponible » apparaît seulement lors du franchissement du coût.

Deck : type, symbole, niveau et effet dans chaque slot, synergies colorées actives ou à un compagnon du seuil, comparaison clic/passif avant → après et variations complémentaires. Progression : XP totale / prochain seuil, prochain déblocage et objectif prioritaire ; catégories Découverte, Collection, Clicker, Booster, Lignées et Experts. Les objectifs prêts précèdent les proches, les verrouillés puis les récompensés. Plusieurs niveaux gagnés sont regroupés avec tous les déblocages traversés.

Récompenses et niveaux utilisent une bannière animée sans modal. Le booster rechargeable prêt produit un message discret et un point de navigation. Ces messages attendent la fermeture de l’ouverture, y compris en chaîne. Sons synthétiques Web Audio : clic, critique, amélioration, réserve prête, découpe, balayage, Rare, Épique, Légendaire, Mythique, objectif et niveau. Enveloppes douces, clics rapprochés limités ; aucun fichier audio ou musique. Le navigateur autorise le démarrage audio après une interaction.

Paramètres dans un petit dialogue : sons, volume effets 0–100 %, ouverture rapide à partir du niveau 12, animations réduites ou préférence système. Le bouton son du booster modifie le même réglage. Réduction prioritaire dans CSS et temporisations d’ouverture. Dialogues natifs : focus contenu, Échap, restitution du focus, défilement interne sur mobile. Commandes alternatives aux gestes et focus visible conservés.

V4 étendue par `ux` au format 1 : introduction vue, conseils fermés/ignorés, étapes terminées et paramètres. V1–V4 anciennes : progression intacte, introduction considérée vue, étapes déduites des actions conservées. V4 Phase 7 copiée avant migration sous `tcg-faerie-v1-backup-v4-before-phase8`. Le reset de test existant efface aussi cette copie. Format futur ou préférences invalides : brut conservé sans écrasement. Aucun changement des gains, coûts, tirages, XP, réserve, consommation des doublons ou déblocages.

Implémentation : `lib/ux.ts`, `lib/game-audio.ts`, `components/game/Onboarding.tsx`, `Settings.tsx`, `Modal.tsx`, `CardInspection.tsx`, `app/ux.css`. Aucun nouvel asset, image IA, dépendance, contenu de carte ou système économique.
