# TCG Clicker — Set 01: Faerie

## Informations

Objectif du set complet : 60 cartes. Au 2 octobre 2026, la phase 3 conserve uniquement neuf créatures temporaires. Les cartes portent désormais une numérotation `/060` ; le classeur affiche séparément les neuf espèces disponibles.

Thème :
Monde féerique, forêt magique, créatures mignonnes et mystérieuses.

## Cartes

Les noms, effets et numéros ci-dessous sont provisoires et ne définissent pas encore les 60 cartes finales. Les effets s’appliquent lorsque la carte est équipée.

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
