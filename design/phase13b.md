# Phase 13B — Équilibre et lisibilité des effets

**Validation technique terminée ; validation humaine non réalisée.** Aucun
testeur n'est disponible pour le moment. Le plaisir de jeu n'est donc pas validé
et la généralisation aux 60 cartes reste bloquée.

## Changements

- Moussillon : Sylve ×3 passe de +15 % à **+10 % clic**.
- Lièvrille : combo >75 passe de +10 % à **+5 % clic**.
- Les autres effets avancés, bonus statiques, coûts, probabilités, XP, recharge,
  progression et synergies existantes restent inchangés. L'échantillon reste
  limité aux mêmes douze cartes.
- Machine possède une seule zone `EFFETS`, sans popup ni annonce répétitive.
  Trois effets au maximum : priorité aux durées actives, puis charges prêtes,
  puis compteurs utiles. Les effets temporaires affichent le bonus et une durée
  décimale, par exemple `+15 % clic · ACTIF · 3.2 s`, avec une jauge discrète.
- Luciolot n'affiche son compteur sur Machine qu'à partir de **13/25** ou quand
  la charge est prête. Deck conserve le compteur complet, même au début.
- Deck sépare visuellement **nom / condition / état** ; conditions impossibles
  repliées, état `PRÊT`, compteur ou durée. Pas de nouveau système ni refonte.

## Reload et changement de Deck

| État | Reload | Retrait / remplacement de sa carte | Autre compagnon changé |
| --- | --- | --- | --- |
| Bonus temporaire | Perdu | Perdu | Conservé jusqu'à expiration |
| Progression périodique de Luciolot | Conservée | Effacée | Conservée |
| Prochain clic périodique déjà prêt | Conservé, consommé une seule fois | Effacé | Conservé |
| Charge d'Horlogrève après booster | Perdue | Effacée | Conservée dans la session |

Remettre une carte ne restaure aucun ancien état. Monter son niveau ne remet pas
ses effets à zéro ; leurs valeurs avancées restent fixes. Réordonner le même
Deck ne remet rien à zéro. Les conditions de type, collection ou lignée sont
recalculées immédiatement.

Ajout strictement nécessaire : champ optionnel `advancedClicks` dans la sauvegarde
v4. Il contient uniquement la progression périodique de cartes équipées : 0 à 24,
ou 25 pour une charge prête. Les anciens fichiers sans ce champ restent valides.
Imports invalides, valeurs hors limites et charges de cartes non équipées sont
refusés. Aucun buff, horodatage ou charge de booster n'est sérialisé. Les compteurs
utilisent la sauvegarde normale, son flush au reload et la protection d'onglet
existante, sans stockage parallèle.

## Simulations de collection partielle

Commande : `npm run simulate:balance`.
Rapport détaillé : `test-results/phase13b/simulation.json`.

Les cinq archétypes sont testés à **10, 20, 30, 45 et 60 espèces**, sur huit graines
et deux protocoles :

1. **Build disponible** : les six compagnons et leurs formes requises sont connus,
   puis la collection est complétée par tirages pondérés. Ce protocole isole
   l'utilité d'un effet lorsque son build est réellement assemblable.
2. **Collection naturelle commune** : les mêmes espèces initiales sont tirées
   pour chaque archétype. Seuls les compagnons possédés et équipables sont utilisés,
   avec des remplaçants choisis selon le rôle. Ce protocole révèle l'indisponibilité
   réelle des cartes rares et de leurs lignées.

Cela représente 400 essais de rendement par booster, 800 sessions économiques
actives / idle, plus 80 témoins Clic sans effets avancés. Les témoins conservent
strictement leurs effets de base. Les améliorations de Machine et l'XP initiale
sont fixées : une collection partielle ne prétend pas reproduire une nouvelle partie.

### Utilité avant complétion

- Chantignon fournit +1 / +2 / +3 / +4 / +6 % passif aux cinq états de collection,
  s'il est équipé. Les copies consommées en amélioration ne réduisent pas le nombre
  d'espèces possédées.
- La diversité dépend des **types équipés**, pas des 60 espèces. Aubepiou et les
  conditions de trois types fonctionnent dès que les compagnons nécessaires sont
  disponibles ; compléter le Set n'est pas un prérequis.
- La lignée Rosée nécessite deux membres équipés et leurs prérequis réels, jamais
  une lignée simplement découverte. Son bénéfice s'applique dès cette paire.
- Le supplément de Mycélisseur fonctionne sur un vrai doublon Mycète à tous les
  états. Une première découverte ne rapporte pas ce supplément.
- Dans les tirages naturels à 10 espèces, les cœurs des cinq builds sont encore
  très incomplets. Leurs performances proches à ce stade ne valident pas un choix
  d'archétype complet dès le début. Aucune carte inconnue n'est équipée artificiellement.

### Collection : rendement par booster

À **30 espèces**, dans le protocole naturel commun, sur 100 boosters payants :

| Build | Éclats de doublons | Cartes Rare+ | Montées de niveau |
| --- | ---: | ---: | ---: |
| Clic | 708,56 | 133,88 | 135,88 |
| Idle | 630,46 | 134,50 | 135,75 |
| Critique | 818,58 | 133,88 | 135,88 |
| Collection | **2 580,97** | **154,25** | **136,25** |
| Mixte | 624,76 | 132,75 | 135,88 |

Collection rapporte donc **25,81 éclats de doublons et 1,54 carte Rare+ par booster**,
contre 7,09 et 1,34 pour Clic : environ **×3,64 éclats** et **+15,2 % Rare+**.
Les montées de niveau sont presque identiques ; aucune accélération importante
des niveaux ne peut être revendiquée à nombre de boosters égal.

Le bénéfice Rare+ provient des capacités statiques et synergies déjà présentes,
renforcées par les niveaux de carte ordinaires. Cette phase ne change pas les
poids de rareté. L'ajout avancé propre aux doublons est le supplément ciblé de
Mycélisseur, pas une nouvelle ressource ou règle de progression.

Dans ce protocole, la complétion prend en moyenne 72,5 boosters supplémentaires
avec Collection contre 92,38 avec Clic, soit environ 21,5 % de moins. Les essais
sont plafonnés à 600 boosters et la moyenne restreinte conserve les cas censurés.
Ces huit graines constituent un signal de prototype, pas une garantie statistique
de vitesse. Le rendement à nombre égal de boosters est financé indépendamment
du prix ; il ne doit pas être confondu avec une vitesse en minutes réelles.

### Temps de jeu identique : Clic conserve une spécialité

À 30 espèces, avec les builds assemblés, après quinze minutes à deux clics/s :

| Build | Boosters payants | XP gagnée | Nouvelles espèces | Cartes Rare+ | Boosters payants sans clic |
| --- | ---: | ---: | ---: | ---: | ---: |
| Clic | 41,88 | 4 119,38 | 28,38 | 59,38 | 21 |
| Idle | 37 | 3 679,38 | 28 | 56,88 | **32,25** |
| Critique | 40,25 | 3 965,38 | 28,25 | 57 | 21 |
| Collection | 32,25 | 3 257,13 | 28 | 56,75 | 22,25 |
| Mixte | 38,63 | 3 806,13 | 28,13 | 55,38 | 23,75 |

Clic reste premier en activité, notamment pour XP et quantité d'ouvertures.
Il ne gagne pas le rendement par booster ni l'usage sans clic. Avec ses seuls
effets statiques, il achète déjà **39,88 boosters** et gagne **3 928,63 XP**.
Les effets avancés ajustés ajoutent environ **deux achats**, **4,9 % XP** et
**0,13 espèce** dans cette comparaison. Le rang du build ne provient donc pas
uniquement de sa couche avancée.

Les ouvertures sont instantanées dans cette simulation économique, les montées
de niveau sont automatiquement achetées selon les coûts existants, les objectifs
ne sont pas réclamés, et les améliorations de Machine ne sont pas rachetées.
Les temps d'animation, hésitations et préférences de joueur restent à playtester.
Les coûts effectivement débités et les gains de doublons sont mesurés séparément.

## Validation technique

- **130 tests réussis**, typecheck et build réussis.
- Sauvegarde de 18/25, sauvegarde d'une charge prête, consommation unique après
  reload, perte des buffs et retrait ciblé vérifiés dans Chrome sur
  **1440 × 1000** et **390 × 844**.
- Le gain réel du clic chargé correspond au gain annoncé sur Machine.
- Maximum trois lignes, jauges, secondes décimales et absence de compteur inutile
  vérifiés. Aucune erreur console ou page ; aucun débordement horizontal.
- Dix captures et galerie : `test-results/phase13b/index.html`.
- Cinq sauvegardes humaines comparables préparées dans `playtest/`, avec une
  collection commune de 30 espèces, mêmes améliorations, deux boosters gratuits
  et 500 énergies. Les captures et essais utilisent des contextes isolés ; aucune
  vraie sauvegarde utilisateur n'est modifiée.

## Décision de généralisation

| Critère | État |
| --- | --- |
| Aucun build ne domine tous les usages mesurés | Vérifié dans ces protocoles, à confirmer humainement |
| Collection a une valeur claire | Rendement de doublons / Rare+ établi ; niveaux presque inchangés |
| Temporaires lisibles | Présentation et durées vérifiées ; compréhension spontanée non testée |
| Charges compréhensibles | Compteur, charge prête et consommation vérifiés ; compréhension non testée |
| Règles reload / Deck fixées | Implémentées, documentées et testées |
| Playtest humain réalisé | **Non — aucun testeur disponible** |

**Ne pas généraliser.** Utiliser `design/phase13b-playtest.md` pour les cinq courtes
sessions et les six questions demandées. Le caractère fun, la puissance perçue,
la clarté et l'envie de changer d'équipe n'ont reçu aucune réponse humaine.
