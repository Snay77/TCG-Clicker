# TCG Clicker — Art Bible

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

Le prototype utilise une grille de 64 × 64 pixels par créature, rendue en SVG sans lissage. Les neuf anatomies doivent rester distinctes aux tailles de comparaison 48, 80 et 112 px.

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
