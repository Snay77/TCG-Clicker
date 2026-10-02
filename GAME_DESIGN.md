# TCG Clicker — Game Design Document

## Concept

État au 2 octobre 2026 : vertical slice jouable et prototype de finition visuelle disponibles. Le périmètre actuel reste limité à neuf créatures temporaires ; les 60 cartes sont un objectif ultérieur.

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

Les doublons pourront notamment permettre :
- d'améliorer une carte
- d'augmenter son niveau
- de produire une ressource secondaire

Le système exact sera défini plus tard.

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
