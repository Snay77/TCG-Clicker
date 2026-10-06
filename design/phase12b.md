# Phase 12B — UX et validation

La fiche suit désormais cet ordre : carte TCG, capacité, progression, Deck,
puis identité et lignée repliables. Les règles de copies sont derrière `?`.
Une amélioration impossible affiche `1 / 3 copies`, `2 manquantes` et un bouton
secondaire désactivé `AMÉLIORER`. Les actions possibles conservent le contraste
primaire. Aucun calcul de gameplay, coût, probabilité ou effet n'a changé.

## Moments exacts de présentation

Ces conditions sont dérivées de la sauvegarde ; aucun délai n'est ajouté.

| Section | Condition |
| --- | --- |
| Machine | Immédiatement. |
| Améliorations | Première amélioration déjà achetée, ou 60 énergies actuelles / générées au total. Les achats affichés restent limités aux améliorations pertinentes. |
| Boosters | Énergie actuelle suffisante pour le prix actuel, booster gratuit disponible, ou au moins une ouverture déjà effectuée. L'énergie passée puis dépensée ne suffit pas. |
| Collection | Première carte effectivement obtenue, même pendant une ouverture encore en cours. La navigation reste derrière la séquence d'ouverture existante. |
| Deck | Trois espèces possédées, dont au moins deux équipables. Un Deck déjà équipé ou l'étape Deck déjà accomplie conserve cet accès. |
| Progression | Collection accessible et première équipe équipée, niveau 3 atteint, ou objectif réclamable ; une récompense déjà réclamée conserve cet accès. |
| Synergies | Deck accessible et deux espèces équipables d'un même type. |
| Synergies avancées | Deck accessible, trois espèces équipables d'un même type et niveau 3. |
| Statistiques avancées | Progression accessible et niveau 3 ou cinq boosters ouverts. |

Le premier passage d'une condition déclenche un statut court `NOUVEAU` avec le
nom de la section, sans popup. Les sections déjà présentées dans la session
ne répètent pas ce message si la condition redevient vraie. Après une ouverture,
Collection et Deck peuvent être annoncés ensemble au retour à la navigation.

## Validation effectuée

- 112 tests réussis ; `npm run typecheck` et `npm run build` réussis.
- Parcours nouvelle partie desktop et mobile : clic, premier achat, accès
  booster, ouverture réelle des cinq cartes, Collection, équipement d'un compagnon.
- Cinq fiches : commune niveau 1, améliorable, niveau maximum, équipée,
  évolution verrouillée. Actions améliorer / équiper / retirer vérifiées.
- Chrome : 1440 × 1000, 390 × 844 et 360 × 800 ; Edge : 390 × 844.
- Sur les cinq fiches à 390 × 844, carte de 389 px environ ; **aucun défilement
  nécessaire pour rendre entièrement visible le bouton Deck**. Mesure répétée
  sur les deux autres configurations mobiles.
- Absence de débordement horizontal ; focus retenu dans la modale et rendu au
  déclencheur après fermeture. Les aides repliables participent au parcours clavier.
- Contrastes mesurés sur les fiches et les six écrans Machine, Boosters,
  Collection, Deck, Progression et Paramètres. Seuil de 4,5:1 pour texte courant,
  3:1 pour grand texte ; actions désactivées lisibles, sans opacité réduite.
- Sauvegardes de test isolées : aucune sauvegarde utilisateur modifiée.

## Captures

`test-results/phase12b/index.html` : galerie avec **15 comparaisons avant/après**.
`before/` : 15 captures Phase 12A ; `after/` : 37 captures Phase 12B.
`report.json` : mesures, contrôles et inventaire. Ces fichiers sont ignorés par Git.

## Point restant

**Playtest humain non réalisé à ce stade.** Les captures et contrôles automatiques
ne prouvent pas la compréhension par une personne découvrant cette version.
Utiliser `design/phase12b-playtest.md` avec au moins un testeur non familier,
consigner ses sept réponses et les hésitations observées avant validation humaine.
