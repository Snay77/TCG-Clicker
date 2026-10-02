# TCG Clicker — Game Design Document

## Concept

État au 2 octobre 2026 : phase 3, boucle de progression jouable. Le périmètre reste limité à neuf créatures temporaires ; les 60 cartes sont un objectif ultérieur.

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

Le premier set complet prévoit 60 cartes. Le prototype en contient neuf, décrites dans `SET_01_FAERIE.md`.

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

Les niveaux 1 à 5 demandent 1, 3, 6, 10 et 15 copies cumulées. Les effets valent respectivement ×1, ×1,2, ×1,5, ×1,8 et ×2. Les copies ne sont jamais consommées. Chaque doublon rapporte immédiatement 1 éclat, augmenté par les effets `duplicateBonus` du deck. Aucun recyclage, poussière ni craft.

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
| Amplificateur sylvestre | 75 | 1,17 | 100 | +2 / clic |
| Luciole mécanique | 60 | 1,20 | 100 | +1,5 / sec |
| Lentille lunaire | 180 | 1,35 | 25 | +1 point critique |
| Prisme de résonance | 250 | 1,30 | 30 | +0,15 multiplicateur critique |
| Cadence du portail | 120 | 1,30 | 20 | +5 % bonus de combo |
| Cœur interdimensionnel | 350 | 1,40 | 30 | +5 % énergie globale |
| Pacte de la clairière | 200 | 1,32 | 30 | +4 % énergie Faerie |

Chaque achat d'Amplificateur sylvestre augmente le niveau de machine d'un cran ; les autres familles améliorent ses statistiques. Le champ `level` conserve ce compteur historique ; le niveau affiché vaut `level + 1`. Paliers visuels cumulatifs : niveau 1 portail initial, 5 cristaux accordés, 10 lianes et fleurs intégrées au cadre, 20 runes, 35 anneaux et stabilisateurs dimensionnels, 50 cœur lumineux renforcé. Ils restent entièrement en SVG/CSS. Ce lien à la progression du clic évite de parcourir tous les paliers visuels en achetant seulement les premiers niveaux peu coûteux des sept familles.

Le combo gagne 4 points par clic, plafonné à 100. Après 1 seconde sans clic, il perd 18 points par seconde. Son multiplicateur continu vaut `1 + charge/100 × min(1, 0,5 × (1 + bonusCombo))`, soit ×1,5 initialement et ×2 au maximum. Les paliers 25/50/75/100 ont un retour visuel. Le passif ne dépend jamais du combo ; le combo n'est pas sauvegardé.

## Effets, builds et synergies

`lib/effects.ts` centralise le cumul de `clickFlat`, `clickMultiplier`, `autoFlat`, `autoMultiplier`, `critChance`, `critMultiplier`, `boosterDiscount`, `comboMultiplier`, `faerieBonus`, `rareChance`, `duplicateBonus`, `energyMultiplier`. Les pourcentages se cumulent par catégorie ; 0,1 représente +10 %. Le niveau de carte multiplie toutes ses contributions. Les synergies ont un bonus fixe.

Clic = `(5 + clics plats) × (1 + bonus clic) × (1 + énergie globale) × (1 + Faerie)`. Passif = `passif plat × (1 + bonus passif) × (1 + énergie globale) × (1 + Faerie)`. Critique initial : 5 % et ×3 ; chance plafonnée à 75 %. Réduction booster plafonnée à 50 %. `rareChance` augmente les poids de Rare à Mythique, avec un maximum de +75 %, puis renormalise toutes les probabilités. La cinquième carte reste Peu commune ou mieux. Les probabilités exactes du deck sont affichées en boutique.

Les trois propositions de six compagnons dans `lib/synergies.ts` utilisent les neuf cartes existantes : Clic privilégie Flamèche et les deux Lune ; Idle privilégie Chantignon, Roséclair et Auralis ; Collection combine les deux évolutions Sylve/Astral, Noctipapille et Auralis pour les doublons, les tirages et une production d'appoint. Les builds partagent certains compagnons : c'est volontaire avec seulement neuf espèces. Les améliorations permanentes complètent leur spécialisation.

Synergies temporaires accessibles : Sylve ×2 → +10 % énergie globale ; Lune ×2 → +5 points critique ; Mycète ×1 et Rosée ×1 → chacun +5 % passif ; Étincelle ×1 → +5 % clic. Les seuils à une carte sont des affinités provisoires : le prototype ne possède qu'une carte de ces types. Les règles sont data-driven, prêtes pour des seuils plus élevés dans le set complet.

Le Deck présente les emplacements, les niveaux, les bonus du deck, les statistiques permanentes, les synergies actives/proches et les builds proposés. Un emplacement sélectionné permet un remplacement atomique avec prévisualisation des variations de clic, passif, critique, multiplicateur critique et réduction booster. `deckCapacity(save)` est l'unique règle de capacité : six emplacements initiaux, plus `extraDeckSlots` (0 à 2), sans achat de capacité dans cette phase.

## Lignées et sauvegarde

Moussillon → Sylvérêve → Éon de la clairière ; Lunailée → Noctipapille. `evolvesFrom` et `evolvesTo` relient des cartes indépendantes ; les formes non découvertes sont des silhouettes. L'équipement exige la découverte du parent immédiat, sans le consommer ni l'obliger à rester équipé.

Sauvegarde v2 : anciens champs conservés, ajout de `upgrades` (sept niveaux) et `extraDeckSlots`. Les niveaux de carte dérivent de `owned`. La clé `tcg-faerie-v1` reste identique pour retrouver les parties existantes. Migration automatique : ancien `level` conservé et reporté dans `upgrades.click`, nouvelles familles à zéro, cartes/deck/énergie/clics/boosters/ouverture préservés. Une copie brute v1 est gardée sous `tcg-faerie-v1-backup` avant écriture v2. Les évolutions déjà équipées en v1 restent actives ; les prérequis s'appliquent aux nouveaux équipements. Une sauvegarde illisible ou future est conservée sans écrasement, avec message visible et session temporaire non persistée.

`Game.tsx` garde orchestration, timers, persistance et scène principale ; `components/game/` contient `CollectionView`, `DeckView`, `UpgradesView`, `ComboBar`. Les composants de cartes et boosters gardent leurs chemins pour limiter le refactor. Aucun asset, image IA ou dépendance ajouté. Les interactions souris/tactiles/clavier, Web Audio, animations réduites, sprites déterministes et `/dev` restent pris en charge.
