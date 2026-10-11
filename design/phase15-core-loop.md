# Phase 15 — Core Loop Refinement

11 octobre 2026. Base : commit `95340ad`, correctifs Phase 14 et rapports du
9 octobre relus. Travail local sur Alpha 0.3.0, sans commit ni déploiement.
Aucun nouveau set, carte, effet avancé, système ou playtest humain.

## Corrections UX

- Choix et remplacement dédiés : petits sprites, nom, rareté, type, niveau,
  capacité, effet avancé et deux différences prioritaires. Comparaison complète
  repliable, y compris effets et synergies gagnés/perdus. Trois candidats entiers
  visibles dans le sélecteur mobile à 390 × 844.
- Fiche desktop : objet TCG de 300 px de large, colonne d'actions rapprochée,
  espacement vertical réduit sans retirer les informations de la carte.
- Amélioration : confirmation persistante pendant la consultation, avec nom,
  niveau réellement acheté et valeurs avant/après ; prochain renforcement
  présenté secondairement. Fermeture manuelle ou fermeture de la fiche.
- Slot près du résumé Deck, confirmation « 7e/8e EMPLACEMENT ACQUIS » ; offre
  suivante uniquement. Le chemin de Progression marque le slot payé « ACQUIS ».
- Recherche ou filtre : acquisitions récentes et résumés secondaires masqués,
  résultats prioritaires. Bouton mobile « FILTRES · n » compte recherche,
  critères actifs et tri non standard ; effacement rétablit le contenu.
- NOUVEAU désigne une espèce découverte dans la dernière ouverture ; RÉCENT
  désigne une acquisition déjà connue. Ces badges transitoires disparaissent
  après consultation et ne nécessitent aucune modification de sauvegarde.
- Notifications multiples regroupées avec détail repliable, lignées nouvelles
  comptées ; aucun empilement de longs textes. Synergies sans carte équipée
  retirées ; types à un compagnon gardés comme proches d'un palier.
- Termes français pour Collection, équipe active et éclats ; accord carte/copie,
  pourcentages et décimales françaises, timers « 3,9 s ».
- L'objectif combo n'est pas proposé avant un bonus combo acquis. Une nouvelle
  partie ne comptabilise son record que lorsque la mécanique est visible. Les
  records et récompenses historiques ne sont pas retirés.

## États des effets

| Mécanique | État et contenu |
| --- | --- |
| Condition échouée | CONDITION MANQUANTE · 3 Sylve requis · 2/3, ou Combo >75 |
| Bonus conditionnel appliqué | ACTIF, condition et effet visible |
| Critique possible, buff absent | PRÊT · Au prochain critique |
| Aucune chance critique | CONDITION MANQUANTE · Une chance critique est requise |
| Buff temporaire réellement appliqué | ACTIF · 3,9 s, puis expiration |
| Clics périodiques | EN CHARGE · 18/25 clics |
| Prochain clic renforcé | CHARGÉ · Prochain clic ×3/×2 |
| Horlogrève / Nacréveil sans ouverture | EN ATTENTE D’UN BOOSTER |
| Doublon ciblé | PRÊT · Au prochain doublon Mycète |

Lièvrille, Moussillon et Velours apparaissent discrètement sur Machine quand
leurs conditions sont remplies, puis disparaissent si elles cessent de l'être.
Les buffs et charges passent avant ces conditions ; la zone reste limitée à
trois lignes. Les bonus permanents de collection/diversité figurent dans le Deck.
Les règles reload/retrait/rééquipement de Phase 13B restent inchangées.

## Ouverture rapide

Le mode normal conserve choix, déchirure et cinq révélations individuelles.
Le mode rapide saute choix et déchirure. Doublons Communs/Peu communs passent
automatiquement, Rare/Épique accélérés puis automatiquement parcourus. Une
nouvelle espèce interrompt ce parcours pour être examinée. Légendaires et
Mythiques conservent suspense complet et validation manuelle, hors préférence
de mouvements réduits. Les cartes sont créditées individuellement une seule
fois, donc une ouverture interrompue reste récupérable.

Résumé des doublons : nombre, éclats réellement crédités (suppléments inclus),
cartes obtenues améliorables et celles à une copie du prochain niveau. Les
compteurs nuls sont masqués. Un doublon répété dans un pack compte chaque fois ;
une première espèce répétée ne compte comme nouvelle qu'une fois.

## Diagnostic avant ajustement

Trois politiques de nouvelle partie, 16 graines appariées chacune. Relevés à
5/10/20/30 minutes, mêmes décisions avant/après. Revenus mesurés sur les
transitions réelles `playClick`, `playTick`, `claimAchievement`, `reveal` ;
chaque source est créditée une seule fois. Dépenses séparées : boosters,
améliorations de Machine, slots et stockage. Une assertion vérifie à chaque
échéance **revenus − dépenses = solde**.

- Lecture : deux clics/s au début puis courtes séquences, booster toutes les
  150 s lorsqu'il est payable ; environ 330 clics sur 30 minutes.
- Actif : deux clics/s pendant 35 s/min ; booster recherché toutes les 40 s.
- Idle : seulement les clics initiaux ; booster recherché toutes les 180 s.
- Décisions toutes les 20 s ; au plus une amélioration de Machine toutes les
  40 s. Deck composé avec les cartes connues ; achats de slots si accessibles et
  payables, stockage après 15 min si marge suffisante.
- Passif pendant les ouvertures, lectures et menus ; aucun revenu hors ligne.
  Ouvertures occupent 20 s, puis 5 s après huit packs. Ce temps est identique
  avant/après pour isoler l'économie, et ne mesure pas le gain UX du nouveau mode.

Dans le parcours Lecture avant changement, à 30 min : **49 721 éclats passifs**,
**4 169 de clics**, **1 475 d'objectifs**, **588 de lignées**, **27 de doublons**.
Le passif représente environ **89 %** de ces revenus : c'est la source dominante,
renforcée par cartes, synergies et bonus universels. Les récompenses ne sont pas
la cause principale ; aucun nerf général de leurs montants n'est appliqué.
Les critiques, combo et pouvoirs avancés sont inclus dans les clics ; les bonus
de passif dans le passif ; Mycélisseur dans les doublons. Il n'existe pas d'autre
injection d'éclats indépendante dans cette boucle. Niveaux donnent de l'XP ou
ouvrent des achats, sans injection directe d'éclats.

Ce modèle achète et équipe plus efficacement que le testeur : il ne reproduit
pas les stocks humains ~3 000/8 000/12 000. Ses résultats sont des comparaisons
contrôlées, pas des prédictions de plaisir ni des résultats de playtest humain.

## Ajustements ciblés

| Source / achat | Avant → après |
| --- | --- |
| Deux premières Lucioles | +1,5/s chacune conservées ; coûts 60 puis 72 conservés |
| Lucioles suivantes | +1,5/s → +1,25/s ; progression de coût ×1,20 → ×1,25 après le premier achat |
| Cœur / Pacte à partir du 4e achat | Surcoût progressif ×1,12 par niveau, plafonné à ×1,12⁴ (environ +57 %) ; effets inchangés |
| Boosters payants | Six premiers prix conservés ; ensuite croissance ×1,18 jusqu'à une prime maximale ×2,5 sur la courbe ancienne ×1,12 |
| 7e slot au niveau 8 | 5 000 → 15 000 éclats |
| 8e slot au niveau 15 | 25 000 → 30 000 éclats |

Recharge gratuite, stockage, coûts de cartes, XP, probabilités, cartes et
récompenses monétaires sont conservés. La disponibilité initiale de l'objectif
combo change pour sa compréhension. Luciolot, Flamèche, charges, critique et
les amplitudes des 12 effets avancés ne sont pas diminués.

Le slot 7 est payable dès l'accès dans **9/48 parcours** après changement,
contre **35/48** avant : Lecture 2/16, Actif 0/16, Idle 7/16. Les délais moyens
d'épargne après accès sont respectivement environ 116 s, 330 s et 68 s. Le
premier booster arrive vers 90–108 s, contre 90–91 s avant. Pas de délai ajouté
au jeu : ces délais découlent des dépenses décidées par le modèle.

## Vérification et limites

166 tests automatisés, typecheck et build réussis pour la version finale. Navigateur Edge,
desktop 1440 × 1000 et mobile tactile émulé 390 × 844 : états, trois candidats,
fiche améliorée, replacement compact, slot acheté, parcours rapide ordinaire,
nouveauté, Légendaire/Mythique, crédits uniques, charge Horlogrève consommée,
recherche prioritaire et badge actif. Captures et rapports dans
`test-results/phase15/` (ignoré par Git).

La baisse du stock n'est pas universelle : un parcours actif peut reporter le
slot et accumuler plus d'éclats à une échéance intermédiaire. La lecture/idle
peut encore accumuler après les gros achats. Ne pas déduire une attente
frustrante ou un équilibre humain validé de cette simulation. Les effets avancés
restent limités à 12 cartes ; aucune validation humaine supplémentaire réalisée.
Téléphones physiques, Safari et parties dépassant 30 minutes non rejoués.


## Impacts chiffrés — moyennes de 16 graines par parcours

Soldes après tous les achats du modèle, et non recettes brutes. Les deux états
ont les mêmes politiques de décision ; les achats peuvent se décaler.

| Parcours | Minute | Solde avant → après | Revenus bruts avant → après | Dépenses avant → après | Prix prochain booster avant → après | Packs avant → après |
| --- | --- | --- | --- | --- | --- | --- |
| lecture | 5 | 1 602 → 1 214 | 2 517 → 2 077 | 915 → 863 | 125 → 125 | 2 → 2 |
| lecture | 10 | 5 743 → 4 895 | 8 015 → 7 162 | 2 273 → 2 267 | 140 → 140 | 4 → 4 |
| lecture | 20 | 14 878 → 4 122 | 27 669 → 25 180 | 12 791 → 21 059 | 160 → 160 | 8 → 8 |
| lecture | 30 | 39 941 → 25 814 | 55 979 → 52 087 | 16 038 → 26 273 | 222 → 246 | 12 → 12 |
| actif | 5 | 2 398 → 2 119 | 3 493 → 3 204 | 1 095 → 1 085 | 158 → 158 | 6 → 6 |
| actif | 10 | 7 772 → 11 032 | 16 409 → 14 873 | 8 637 → 3 841 | 307 → 396 | 13 → 13 |
| actif | 20 | 19 827 → 22 526 | 60 862 → 56 621 | 41 036 → 34 095 | 806 → 1 628 | 28 → 28 |
| actif | 30 | 53 616 → 6 511 | 124 145 → 116 611 | 70 528 → 110 101 | 3 759 → 8 598 | 43 → 43 |
| idle | 5 | 1 592 → 957 | 2 401 → 1 820 | 809 → 863 | 125 → 125 | 2 → 2 |
| idle | 10 | 3 238 → 3 002 | 7 870 → 6 783 | 4 632 → 3 781 | 132 → 132 | 3 → 3 |
| idle | 20 | 12 940 → 11 766 | 25 061 → 22 205 | 12 121 → 10 439 | 154 → 154 | 7 → 7 |
| idle | 30 | 32 976 → 18 570 | 48 640 → 44 459 | 15 664 → 25 889 | 177 → 177 | 10 → 10 |

## Breakdown des revenus à 30 min

Chaque colonne correspond à une source distincte, sans double comptage.
Les bonus appliqués sont inclus dans leur source réelle.

| Parcours | Clic avant → après | Passif avant → après | Objectifs avant → après | Lignées avant → après | Doublons avant → après |
| --- | --- | --- | --- | --- | --- |
| lecture | 4 169 → 4 573 | 49 721 → 45 474 | 1 475 → 1 425 | 588 → 588 | 27 → 27 |
| actif | 40 876 → 40 057 | 75 580 → 69 003 | 5 725 → 5 600 | 1 788 → 1 781 | 176 → 170 |
| idle | 90 → 90 | 46 780 → 42 649 | 1 306 → 1 256 | 444 → 444 | 20 → 20 |
