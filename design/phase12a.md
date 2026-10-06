# Phase 12A — Progressive Disclosure & Card UX

Cette phase modifie exclusivement la présentation. Les calculs de gain, prix,
recharge, récompenses, synergies, améliorations et équipement restent identiques.
Le format de sauvegarde reste v4. Aucun ajout de progression persistante.

## Présentation progressive

Les conditions sont centralisées dans `lib/disclosure.ts` et dérivées de la
sauvegarde existante. Une nouvelle partie présente seulement Machine, l’énergie
et le clic. Les conseils se limitent aux systèmes déjà utiles.

- Améliorations : premier achat accessible (60 éclats), achat déjà réalisé ou
  historique de génération suffisant. Les composants apparaissent progressivement.
- Boosters : paquet gratuit / récompense disponible, achat accessible ou ouverture
  déjà réalisée. L’historique évite de remasquer la boutique après une dépense.
- Collection : première ouverture terminée ; les sauvegardes anciennes ayant des
  cartes y accèdent immédiatement.
- Deck : trois espèces différentes ; une équipe existante reste accessible.
- Progression : équipe formée, niveau 3 ou récompense réellement disponible après
  des rencontres. Statistiques : niveau 3 ou cinq boosters ouverts.
- Synergies : au moins une paire du même type réellement équipable. Les triples
  apparaissent uniquement avec trois cartes équipables et le niveau 3. Seuls les
  types et styles utilisables sont présentés.
- Stockage, ouverture rapide et emplacements supplémentaires : présentés au
  moment où l’option devient utile. Les déblocages détaillés restent consultables
  dans une aide repliée.

Les nouvelles sections sont annoncées par une notification courte. La navigation
ne contient pas d’onglets verrouillés. Les animations respectent les préférences
de mouvement réduit. Les notifications ne modifient aucune récompense.
Le combo n’est affiché qu’avec un bonus effectif ; sa charge et son suivi dans les
objectifs continuent à fonctionner sans changement des calculs.

## Objet TCG et inspection

`Card` ne reçoit plus de contenu enfant : aucun bouton ni compteur de copies
dans la carte. Nom, illustration, type, stade, rareté, capacité, flavor et numéro
restent sur l’objet. L’action Examiner se trouve en dehors de la carte du classeur.

L’inspection affiche l’objet puis quatre sections : Identité, Capacité,
Progression, Deck. Les règles de consommation et la lignée sont repliées.
Les états disponibles, insuffisants, max, équipé et évolution verrouillée sont
explicites. Les informations et actions restent séparées de l’illustration.

Le coût du niveau 1 → 2 reste **deux doublons**. L’indicateur des copies affiche
donc **1 / 3** avec une carte possédée : trois exemplaires nécessaires au total,
dont un conservé. Les points pleins / vides reflètent ce total sans changer le coût.

Sur mobile : carte compacte, identité / capacité, progression, deck. La fermeture
reste visible pendant le défilement. Les contrôles conservent le focus piégé,
Échap et le retour au bouton ayant ouvert la fiche.

## Validation reproductible

`npm test`, `npm run typecheck`, `npm run build`.

Avec Playwright accessible via `PLAYWRIGHT_PATH` et un serveur sur le port 3116 :
`node scripts/verify-phase12.cjs`.

Le script crée uniquement des contextes de navigateur temporaires. Il teste les
cinq états de carte sur Chrome desktop / mobile / 360 px et Edge mobile,
améliore une carte (trois copies → une copie / niveau 2), équipe / retire,
contrôle le focus et les débordements. Le contraste des trois niveaux de texte et
des boutons, y compris désactivés, est contrôlé à au moins 4,5:1.

Le parcours nouvelle partie est joué via de vrais clics : 75 clics, premier
Amplificateur, 50 clics supplémentaires, achat et ouverture de cinq cartes,
constitution d’une équipe. Aucun saut de ressources ni compte utilisateur utilisé.

Captures et rapport ignorés par Git : `test-results/phase12a/`.
Galerie : `test-results/phase12a/index.html` (25 captures).
