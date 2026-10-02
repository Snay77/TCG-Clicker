# TCG Clicker — Set 01: Faerie

## Informations

Objectif du set complet : 60 cartes. Au 2 octobre 2026, le prototype contient uniquement neuf créatures temporaires. Ne pas étendre le set pendant cette phase de finition visuelle.

Thème :
Monde féerique, forêt magique, créatures mignonnes et mystérieuses.

## Cartes

Les noms, effets et numéros ci-dessous sont provisoires et ne définissent pas encore les 60 cartes finales. Les effets s’appliquent lorsque la carte est équipée.

| N° | Créature | Rareté | Type | Stade | Effet | Seed |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | Moussillon | Commune | Sylve | Base | +1 énergie par clic | 17 |
| 002 | Chantignon | Commune | Mycète | Base | +1 énergie par seconde | 28 |
| 003 | Lunailée | Peu commune | Lune | Base | +5 points de chance de critique | 39 |
| 004 | Roséclair | Peu commune | Rosée | Base | +2 énergies par seconde | 42 |
| 005 | Flamèche | Rare | Étincelle | Base | +4 énergies par clic | 57 |
| 006 | Sylvérêve | Rare | Sylve | Évolution 1 | Boosters −10 % | 61 |
| 007 | Noctipapille | Épique | Lune | Évolution 1 | +6 énergies par seconde et +5 points de chance de critique | 73 |
| 008 | Auralis | Légendaire | Aurore | Base | +10 énergies par clic et +8 par seconde | 89 |
| 009 | Éon de la clairière | Mythique | Astral | Évolution 2 | +20 énergies par clic, +15 par seconde et boosters −10 % | 97 |

Les stades sont des informations de carte : aucune mécanique d’évolution n’est implémentée. Les doublons sont comptés, sans amélioration de carte pour le moment.

## Données et rendu

- `lib/cards.ts` : contenu, effets, seeds et palettes.
- `lib/visuals.ts` : habitats, capacités, textes d’ambiance et finitions.
- `lib/sprites.ts` : anatomies déterministes sur grille 64 × 64.

Les habitats couvrent bosquets, champignons, lune, mare, braises, aurore et monde astral. Tous les sprites et décors sont produits en code.

## Validation

L’atelier `/dev` affiche les neuf créatures et leurs cartes. Le booster de démonstration contient Moussillon, Flamèche, Noctipapille, Auralis et Éon de la clairière, sans modifier la sauvegarde.

Les boosters jouables contiennent cinq cartes, avec une Peu commune ou mieux garantie en cinquième position. Les finitions dépendent de la rareté, sans variantes collectionnables séparées.
