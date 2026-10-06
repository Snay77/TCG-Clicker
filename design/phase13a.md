# Phase 13A — Prototype d'effets avancés

Les 12 cartes ci-dessous reçoivent une capacité complémentaire. Leurs bonus de
base et leur progression restent inchangés. Les 48 autres cartes ne reçoivent
aucun nouvel effet. Identifiants, Set, probabilités, coût des boosters, recharge,
XP, progression globale et PWA sont conservés.

## Échantillon

| Carte (numéro du Set) | Type / rareté | Effet avancé |
| --- | --- | --- |
| Moussillon · 001 | Sylve / Commune | Sylve ×3 : +15 % clic. |
| Lièvrille · 005 | Sylve / Peu commune | Combo >75 : +10 % clic. |
| Chantignon · 010 | Mycète / Commune | +1 % passif par 10 espèces découvertes, maximum +6 %. |
| Mycélisseur · 015 | Mycète / Rare | Doublons Mycète : +2 éclats, seulement sur une copie déjà possédée. |
| Songegarde · 018 | Lune / Épique | Après un critique : +10 % clic pendant 4 s. |
| Roséclair · 019 | Rosée / Commune | Deux membres de sa lignée équipés : +15 % à leurs bonus de base. |
| Luciolot · 025 | Étincelle / Commune | Tous les 25 clics : prochain clic ×3. |
| Aubepiou · 028 | Aurore / Commune | +1,5 % énergie par type équipé, maximum sept types. |
| Flamèche · 039 | Étincelle / Commune | Après un critique : +15 % clic pendant 4 s. |
| Nacréveil · 050 | Rosée / Légendaire | Après un booster : +20 % passif pendant 8 s. |
| Horlogrève · 059 | Astral / Légendaire | Après un booster : prochain clic ×2. |
| Velours d’Entre-mondes · 060 | Astral / Mythique | Trois types équipés : +15 % passif. |

Les sept types, six raretés et dix lignées sont représentés. Les deux cartes
Astral sont des créatures sans lignée.

## Architecture et règles

- `lib/advanced-card-design.ts` : données typées, indexées par identifiant du Set.
  Catégories : condition, bonus proportionnel, amplification de lignée, charge
  du prochain clic, bonus temporaire et doublon ciblé. Aucun `if` par carte.
- Conditions : nombre de cartes d'un type, seuil strict de combo, types uniques,
  membres d'une lignée. Métriques proportionnelles : types et espèces découvertes.
- Déclencheurs : clic, critique, fin d'ouverture d'un booster et doublon.
- `lib/advanced-effects.ts` : résolution de cette couche additive, indépendante
  des synergies existantes. Le bonus de lignée concerne uniquement les effets
  de base de ses membres équipés, après application du niveau de carte.
- `lib/play-effects.ts` : transitions pures utilisées par la Machine réelle et
  la simulation ; intégration du passif aux frontières d'expiration.
- Compteurs, charges et durées restent en mémoire, sans ajout à la sauvegarde.
  Un changement d'équipe ou du niveau d'un compagnon, un import et un rechargement
  les réinitialisent. L'ordre des mêmes cartes dans le Deck ne les réinitialise pas.
- Les bonus avancés sont fixes à tous les niveaux de carte. Les bonus de base
  continuent de progresser selon les règles existantes.
- Après un critique, le bonus s'applique aux clics suivants ; sa durée se
  rafraîchit sans s'accumuler. Une charge se consomme une fois. Deux charges
  simultanées utilisent la plus forte et se consomment ensemble.
- Les effets de fin d'ouverture démarrent en quittant le récapitulatif ou en
  enchaînant un booster, après validation des cinq révélations. Aucun bonus
  n'est accordé à un achat refusé.
- Plafonds de la couche avancée : +35 % clic, +40 % passif, +12 % énergie ;
  charge maximale ×3. Les anciens bonus et synergies conservent leurs règles.

Le Deck affiche les effets équipés dont la condition est remplie et les
déclencheurs prêts, avec un statut explicite. Les conditions non remplies sont
repliées. Machine affiche une rune et un court compteur près du portail ; le
gain annoncé inclut la charge du prochain clic. L'ouverture signale le supplément
de doublon dans le feedback existant. Aucun écran général n'a été refondu.

## Exemples de builds

| Build | Six compagnons |
| --- | --- |
| Clic | Moussillon, Semenotte, Lièvrille, Ramifleur, Luciolot, Flamèche |
| Idle | Chantignon, Sporelle, Roséclair, Ruisselet, Nacréveil, Velours d’Entre-mondes |
| Critique | Somnouchat, Croissombre, Songegarde, Luciolot, Flamèche, Verrélytre |
| Collection | Couspore, Mycélisseur, Nouétoile, Anneleau, Horlogrève, Velours d’Entre-mondes |
| Mixte | Moussillon, Chantignon, Roséclair, Luciolot, Aubepiou, Flamèche |

## Simulation reproductible

Commande : `npm run simulate:effects`.
Résultats : `test-results/phase13a/simulation.json`.

360 comparaisons appariées (720 essais) : cinq builds, niveaux uniformes 1 et 5,
trois comportements, douze graines. Chaque essai dure cinq minutes simulées.
Même collection complète et améliorations pour tous ; mêmes jets de critique
et mêmes tirages pour chaque paire avant/après. Cinq boosters payants sont ouverts
à cadence fixe. Les débits sont deux clics/s, zéro clic, ou cinq clics/s pendant
dix secondes sur trente. Les effets avancés sont désactivés dans le témoin.

La mesure est l'énergie brute des clics, du passif et des doublons. Les coûts
des boosters sont exclus de ce total ; ils sont effectivement débités et
vérifiés identiques, ainsi que l'XP et les ouvertures. Ce protocole mesure un
gain de puissance à progression égale, pas la vitesse d'une nouvelle partie.

| Build | Gain actif, niveau 1 | Gain sans clic, niveau 1 | Gain en rafales, niveau 1 | Gain actif, niveau 5 |
| --- | --- | --- | --- | --- |
| Clic | +32,69 % | 0 % | +31,06 % | +34,46 % |
| Idle | +9,13 % | +16,91 % | +10,09 % | +10,44 % |
| Critique | +22,94 % | 0 % | +23,10 % | +24,49 % |
| Collection | +0,48 % | +0,24 % | +0,59 % | +0,47 % |
| Mixte | +21,44 % | +13,13 % | +23,48 % | +21,69 % |

Maximum individuel observé : +36,96 %, dans le build Clic niveau 5.
Clic gagne en jeu actif ; Idle gagne sans clic. Le rapport de production
Clic / Critique reste inférieur à 1,5 sur les deux niveaux. Aucun build ne gagne
dans tous les comportements testés. Des assertions rejettent un gain individuel
supérieur à 45 % sur ce protocole. Les combinaisons à huit emplacements sont
également couvertes par des tests des plafonds.

Le premier réglage donnait +54,99 % au build Clic niveau 1 : ses amplitudes ont
été réduites avant validation. Le rapport initial est conservé séparément dans
`simulation-initial.json` pour expliquer ce réglage.

## Validation et captures

- 125 tests réussis ; typecheck et build réussis.
- Chrome desktop 1440 × 1000 et mobile 390 × 844 : cinq decks, charge après
  25 clics, consommation unique, critique, expiration, retour de booster et
  réinitialisation au rechargement. Aucune erreur console ou page détectée.
- 28 captures : dix Deck complets, dix vues des effets actifs, six Machine et
  deux inspections. Galerie : `test-results/phase13a/index.html`.
- Contextes navigateur isolés ; aucune vraie sauvegarde utilisateur modifiée.

## Avant généralisation

1. Mesurer la progression réelle depuis une collection partielle et plusieurs
   fréquences d'ouverture. La collection complète est une condition contrôlée,
   pas une estimation du début de partie.
2. Collection a un supplément faible en énergie globale dans ce protocole :
   +2 éclats ciblés ne concernent qu'une fraction des vingt-cinq doublons.
   Son rôle doit être jugé sur les séances d'ouverture, sans augmenter les
   probabilités ou toucher aux coûts pour masquer ce résultat.
3. Clic reste le build le plus renforcé (+33 à +34 % en moyenne). Confirmer ce
   rythme en playtest avant d'étendre des conditions semblables à d'autres cartes.
4. Tester les combinaisons supplémentaires : les cinq builds et tests de plafond
   ne constituent pas une recherche exhaustive des 60 cartes et huit emplacements.
5. Valider la compréhension des plafonds, de la consommation conjointe des
   charges et du reset au rechargement. Décider d'une éventuelle persistance
   seulement si les retours la rendent nécessaire.
6. Les effets avancés fixes permettent un essai borné ; leur progression par
   niveau doit faire l'objet d'un équilibrage séparé avant d'être généralisée.
