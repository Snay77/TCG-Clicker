# TCG Clicker — Faerie · Phase 3

Prototype local Next.js / React / TypeScript, sans service externe, police téléchargée, asset graphique externe ou image générée par IA. Les trois documents de conception à la racine restent la source de vérité.

## Lancer

Node.js 22 recommandé.

```powershell
npm install
npm run dev
```

Ouvrir http://127.0.0.1:3000 ; atelier des sprites : http://127.0.0.1:3000/dev.

```powershell
npm test
npm run typecheck
npm run build
```

## Boucle jouable

Le portail rapporte 5 éclats par clic au départ, avec 5 % de critiques ×3. Sept familles d'améliorations permanentes développent clic, passif, critiques, combo, énergie globale et bonus Faerie. Les coûts croissent exponentiellement. Les achats d'Amplificateur sylvestre enrichissent visuellement la machine aux paliers 1/5/10/20/35/50.

Le combo augmente avec les clics rapprochés et décroît après une pause ; il multiplie uniquement les clics. Les boosters coûtent initialement 100 éclats, contiennent cinq cartes, et garantissent une Peu commune ou mieux en cinquième position. Les cartes montent automatiquement de niveau à 1/3/6/10/15 copies ; chaque doublon rapporte aussi de l'énergie. Le classeur montre les lignées et silhouettes ; les évolutions exigent la découverte du parent pour être équipées.

L'écran Deck présente six emplacements, statistiques, bonus cumulés, synergies, trois exemples de builds et prévisualisation des remplacements. La capacité est centralisée, prête pour sept/huit places ultérieures. Les cartes sont numérotées /060, avec seulement neuf espèces disponibles. Les règles chiffrées et le plan des 60 cartes sont documentés dans GAME_DESIGN.md et SET_01_FAERIE.md.

La sauvegarde est maintenant en version 2, toujours sous la clé locale `tcg-faerie-v1` pour retrouver les anciennes parties. La migration conserve énergie, machine, copies, deck et ouverture en cours, initialise les nouvelles familles et garde une copie v1 sous `tcg-faerie-v1-backup`. Une sauvegarde illisible ou d'une version future n'est jamais écrasée : le message indique que la session ne sera pas persistée. Le combo se réinitialise au rechargement. Pas de production hors ligne ni de synchronisation multi-onglets : jouer dans un seul onglet.

## Modifier le prototype

- `lib/cards.ts` : contenu, raretés, palettes, seeds et effets.
- `lib/game.ts` : statistiques, économie, tirage pondéré, équipement/remplacement atomique, capacité et migration v1 → v2 ; fonctions pures testées.
- `lib/effects.ts` : catalogue typé des effets, résolution centrale et descriptions numériques.
- `lib/progression.ts` : sept améliorations, coûts, niveaux de cartes, combo et paliers de machine.
- `lib/synergies.ts` : seuils de type et propositions de builds Clic, Idle et Collection.
- `components/game/` : vues Collection, Deck, Améliorations et jauge de combo.
- `app/progression.css` : mise en page responsive et retour visuel de progression.
- `lib/sprites.ts` : rasterisation déterministe sur grille 64 × 64, neuf anatomies, détails basés sur seed et séparation des parties (corps, queue, ailes, coiffe, visage).
- `lib/visuals.ts` : habitats, noms de capacités, textes d'ambiance, finitions et durées de suspense. Aucun changement des effets du jeu.
- `components/Sprite.tsx` : pixels regroupés en chemins SVG par couleur et partie, animations idle. Pas d'image ni de dépendance graphique.
- `components/CardArt.tsx` : décors procéduraux en plans successifs, atmosphère déterministe et créature au premier plan.
- `components/Card.tsx` : cadre de collection, typographie, foil, holographie et reflet au pointeur. Les finitions dépendent de la rareté, sans nouvelle variante de gameplay.
- `components/Machine.tsx` : forêt vivante, vortex, cristaux, runes et végétation. Réactions au clic et au critique dans `Game`.
- `components/BoosterOpening.tsx` : carrousel, découpe au doigt/souris, pile avec carte suivante face visible, retrait des cartes et récapitulatif. Anticipation à la première apparition uniquement ; effets de rareté au premier plan. Temporisations annulées au démontage et attribution unique de chaque carte.
- `components/BoosterPack.tsx` : sachet commun à la boutique et à l'ouverture.
- `components/Game.tsx` : orchestration de la partie et persistance.
- `app/dev/page.tsx` : neuf sprites comparés simultanément à 48/80/112 px, zoom ×2/×3/×4, quatre fonds, palette exacte, seed, isolation des parties et arrêt des animations. Vue des cartes et ouverture de démonstration couvrant Commune, Rare, Épique, Légendaire et Mythique ; aucune modification de la sauvegarde.
- `app/globals.css` : structure de l'interface ; `app/polish.css` : surfaces, décors et chorégraphie de la phase 2. Respect de `prefers-reduced-motion` et bouton pour passer le suspense.

Les choix de prix, noms et effets sont des valeurs de test de cette vertical slice, pas le contenu définitif du set. Animations CSS/SVG : GSAP n'était pas nécessaire.

## Validation visuelle

Ouvrir `/dev`, comparer les silhouettes sur les fonds clair et sombre, puis consulter « Cartes & finitions ». « Tester l'ouverture » permet de voir les révélations sans attendre un tirage rare. La carte suivante est déjà face visible sous celle que l’on retire. Elle arrive directement au premier plan avec les effets de sa rareté, sans dos ni suspense intermédiaire. Seule la première apparition conserve une courte anticipation, raccourcie à 50 ms avec les animations réduites.

La phase 3 conserve les neuf identifiants, les sprites, la clé de sauvegarde et les gestes de booster. Les effets ont été rééquilibrés pour les trois builds. Aucun asset externe, image IA ou package ajouté.

## Documents du projet

- `GAME_DESIGN.md` : boucle, périmètre et comportement actuel de l’ouverture.
- `ART_BIBLE.md` : rendu 64 × 64, cartes, finitions, continuité de la pile et atelier.
- `SET_01_FAERIE.md` : neuf cartes temporaires, effets et seeds ; objectif futur de 60 cartes.
- `VERIFICATION.md` : derniers contrôles et historique des validations.

## Ouverture tactile — 2 octobre 2026

L’ouverture reprend les gestes de collection de Pokémon TCG Pocket avec les graphismes originaux Faerie : carrousel de sachets, découpe horizontale du haut, bandelette détachée, apparition d’une pile, première carte automatique, puis balayage ou toucher pour retirer la carte visible. Le choix du sachet est uniquement visuel et ne relance jamais le tirage payé. Les nouvelles espèces sont signalées « NOUVEAU » et les cinq cartes apparaissent au récapitulatif.

- `app/opening.css` : scène plein écran, pile, glissements, découpe et récapitulatif responsive.
- `lib/pack-audio.ts` : déchirure, souffle et carillon synthétisés via Web Audio. Le son commence uniquement après interaction et peut être coupé dans l’ouverture. Aucun fichier audio externe.
- Souris, tactile, clavier et boutons alternatifs sont pris en charge. Une découpe incomplète revient à zéro ; un déplacement court replace la carte ; les actions rapides ne doublent pas l’attribution.
- La sauvegarde conserve toujours les cartes déjà révélées et reprend à la suivante. Le mode atelier reste indépendant de la partie.

Référence de gestes : https://corporate.pokemon.co.jp/en/topics/detail/t-28/ . Il s’agit d’une adaptation au monde Faerie, sans reprise des assets Pokémon.
