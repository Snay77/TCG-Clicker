# Faerie Field Journal × Arcane Machine

## Périmètre — prototype 11A

Machine et Voyage uniquement, sur la base Alpha 0.2.0. La Collection, le Deck, les cinq onglets, les paramètres et le booster restent des références avant 11B. Aucun changement de données, de règles, de sauvegarde ou de police. Le portail et ses habitats ne sont pas redessinés. Une validation visuelle du propriétaire est requise avant d’étendre cette direction à 11B.

## Palette et tokens

Les tokens sont définis dans `app/art-direction.css`. Ils ne remplacent pas les variables historiques des cartes et du booster.

| Token | Valeur | Usage |
| --- | --- | --- |
| `--night-0` | `#0d171b` | vide, fond profond |
| `--night-1` | `#142429` | métal et registre |
| `--night-2` | `#1c3032` | profondeur de surface |
| `--faerie-green` | `#bbd999` | action disponible, état actif |
| `--faerie-green-muted` | `#8ca58a` | repères secondaires |
| `--ancient-gold` | `#d8bd82` | niveau, parcours, récompense |
| `--astral-violet` | `#bba8dd` | réserve Astral/Mythique ; pas de panneau ordinaire violet |
| `--danger` | `#e6a59a` | erreur uniquement |
| `--ink` / `--ink-muted` | `#e7ebdb` / `#bac8bb` | texte principal / secondaire |
| `--rule` | `#50645d` | traits discrets |

## Trois familles

**Arcane :** plaque sombre, angles droits ou coins gravés, doubles traits courts, rune symétrique. Ressources et composants de la machine. Une commande ressemble à une touche du dispositif. Aucun clip-path sur les boutons : le focus et la zone tactile restent intacts.

**Carnet :** espace ouvert, filets dorés, axe de parcours, petit repère végétal. Les missions sont des lignes, les statistiques un registre. Pas de conteneur rempli autour de chaque donnée. L’or marque un repère ; le vert marque une action.

**TCG :** référence aux cadres des cartes et aux marque-pages. Définition pour 11B ; aucune modification des cartes durant 11A.

## Géométrie, bordures et motifs

Un seul cadre extérieur par dispositif ; surfaces secondaires ouvertes. Rayon de commande 2 px, champ natif conservé. Les pseudo-éléments dessinent quatre petits angles plutôt que quatre nouveaux nœuds. La ligne de voyage porte des losanges et de courtes ramifications. Les motifs sont des SVG originaux à traits de 1.5–2 unités, viewBox 24 × 24, sans asset distant. Maximum un symbole par amélioration, un emblème par niveau.

## Typographie

Pas de téléchargement de police. Display : Georgia uniquement sur les grands titres narratifs, 26–34 px desktop, 23–28 px mobile. UI : pile système, 13–14 px, casse normale. Data : chiffres tabulaires, 16–28 px, niveau jusqu’à 44 px. Les petites capitales restent réservées aux gravures et catégories (10 px minimum), pas à chaque titre. Le texte utile reste au minimum à 12 px, hors libellés compacts préexistants de la Machine.

## Espacement et composition

Échelle 4 / 8 / 12 / 16 / 24 / 32 / 48 px. Desktop : davantage de vide autour du portail, journal avec chemin et annotations en deux colonnes ; missions en lignes sur toute la largeur. Mobile : journal vertical, deux rails courts pour les étapes futures, annotations sous le chemin. Pas de hausse des cinq rangées de la Machine ; mêmes hauteur de header/navigation et mêmes safe areas. L’illustration, son bouton et la forêt gardent leurs dimensions et leur position.

## Boutons et états

Commande principale : fond vert réservé à l’action disponible, texte sombre. Commande secondaire : métal sombre, filet ; montant tabulaire. Hover : éclaircir le filet, sans glow permanent. Focus : contour doré 3 px, décalage 3 px ; conserver clavier et contrôles natifs. Disabled : opacity 0.45 et texte d’état existant, aucune suppression du bouton. Zone tactile ≥44 px. Les actions de récompense portent aussi un libellé, jamais seulement une couleur.

## Animation et lumière

Pas d’animation de décor permanente ajoutée. Transition de commande 140 ms sur couleur uniquement. Lumière forte réservée au portail, critique, récompense et Rare+. Le parcours, les missions et les statistiques ne brillent pas au repos. `prefers-reduced-motion` et le choix sauvegardé désactivent les transitions ajoutées. Les animations de cartes/ouverture restent intactes.

## Composants 11A

- `Rune` : symbole SVG original de commande/composant (cristal, lentille, prisme, cadence, cœur, pacte, sac).
- `ExplorationPath` : vue du niveau actuel, des deux prochains niveaux et du prochain déblocage réel. Seuils calculés par le moteur existant ; aucun gain inventé.
- Compteur gravé : présentation CSS du compteur existant ; aucune deuxième source de données.
- Améliorations : liste de composants avec rune et séparateur, dans le sheet existant.
- Missions : lignes avec état textuel, progression et action existante.
- Registre : paires libellé/valeur alignées, pas de grille KPI.

## Validation

`ui-audit` demeure le BEFORE intact. `ui-redesign` rejoue les mêmes fixtures et captures, ajoute une comparaison côte à côte. Vérifier Machine sans scroll aux formats Phase 10, 5 onglets, sheets/focus, achats, récompenses, filtres/deck inchangés, ouvertures gratuites/payantes et sauvegarde, mouvement réduit, tests/TypeScript/build. Aucun commit, push ou 11B avant la validation artistique.
