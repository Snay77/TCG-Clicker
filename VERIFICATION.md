# Vérification de TCG Clicker

## Phase 3 — Core Game Loop & Progression · 2 octobre 2026

- `npm test` : 21 tests réussis, dont 13 nouveaux tests de progression et les 8 tests précédents conservés/adaptés.
- `npm run typecheck` et `npm run build` : réussis ; routes / et /dev générées.
- Logique : migration v1 → v2 et reprise de booster, validation de sauvegardes, seuils et effets de carte, résolution cumulative de tous les types d'effets, synergies actives/proches, capacité 6/7/8, remplacement atomique, contraintes d'évolution, sept améliorations et plafonds, combo/décroissance, paliers de machine, doublons crédités une seule fois, probabilités renormalisées et garantie du cinquième tirage, trois builds distincts.
- Navigateur Edge/Chromium, build de production : migration avec copie v1 brute, achat d'amélioration, montée/décroissance du combo, remplacement de Chantignon par Noctipapille, prévisualisation des variations, niveaux de carte, deux lignées, neuf cartes /060, persistance après recharge. Évolution bloquée sans parent ; sauvegarde future conservée après clic ; /dev accessible. Aucune erreur JavaScript navigateur pendant les parcours.
- Mobile tactile 390 × 844 avec animations réduites : découpe clavier, retrait tactile des cartes, rechargement après la première attribution, reprise à la suivante, cinq attributions exactes, cinq cartes et Continuer au récapitulatif. Machine, Deck et Collection sans débordement horizontal du document.
- Souris et tactile réel via CDP, animations normales : petite découpe annulée, découpe de droite à gauche, petit balayage annulé, cinq cartes retirées par balayage, son désactivable, Rare/Épique/Légendaire/Mythique au premier plan, cinq attributions exactes et récapitulatif.
- Six paliers visuels vérifiés séparément en navigateur (1/5/10/20/35/50) : cristaux, végétation, anneaux et cœur renforcé cumulés, console sans erreur. Captures `phase3-tier-*.png` ; script `phase3-tiers.cjs`.
- Inspection des captures desktop et mobile : panneaux lisibles, synergies, niveaux, six emplacements, atelier et combo. Contraste corrigé pendant cette phase pour conserver le thème sombre.

Scripts/captures locaux dans `test-results/` (ignorés) : `phase3-check.cjs`, `phase3-gestures.cjs`, `phase3-balance.ts`, `phase3-machine.png`, `phase3-deck.png`, `phase3-collection.png`, `phase3-mobile-machine.png`, `phase3-mobile-deck.png`, captures d'ouverture et de récapitulatif. Le CLI agent-browser n'est pas installé : contrôles exécutés avec le Playwright fourni par Codex et Edge installé, sans installation de dépendance.

### Vérification du rythme de progression

Simulation déterministe indicative de 30 minutes : 2 clics/seconde, combo supposé maintenu à ×1,5, rendement critique moyen, tentative de booster toutes les 20 secondes, achat de l'amélioration disponible la moins coûteuse et équipement des six premières espèces dès découverte. À 5/15/30 minutes : machine niveaux 28/44/53, 14/44/89 boosters, coût de l'amélioration suivante environ 4 481 / 61 241 / 229 334 éclats. Plusieurs familles continuent de progresser à 30 minutes. Les ouvertures ne bloquent pas la production de clic dans cette simulation : ces valeurs donnent une borne optimiste, pas une durée de partie validée par des joueurs. Une session réelle et le choix du build modifieront ce rythme.

### Périmètre et suites

Neuf créatures uniquement ; le plan 60 cartes est documenté, aucune espèce supplémentaire ajoutée. Pas d'asset externe ni image IA. Les niveaux de machine suivent l'Amplificateur sylvestre ; les autres améliorations modifient les statistiques. Synergies à une carte provisoires pour les types représentés par une seule espèce. Les anciennes évolutions équipées restent actives à la migration ; tout nouvel équipement exige le parent immédiat. Capacités 7/8 préparées sans amélioration achetable. Les copies restent conservées ; pas de destruction/craft. Pas de production hors ligne ou synchronisation multi-onglets.

## Historique — pile face visible, 2 octobre 2026

La pile montre la carte suivante face visible sous celle qui s’envole. Aucun dos ni suspense n’est intercalé entre les cartes ; les effets de rareté démarrent au premier plan.

- TypeScript, huit tests et compilation de production : réussis lors de la dernière modification du code.
- Parcours complet sur ordinateur et mobile tactile 390 × 844 : cinq cartes attribuées exactement une fois, récapitulatif accessible, aucune erreur navigateur.
- Animations réduites : cinq cartes du récapitulatif et bouton Continuer visibles ensemble.
- Contrôle actuel de la transition : `test-results/faceup-check.cjs` ; récapitulatif mobile : `test-results/pocket-summary-check.cjs`.

Les sections suivantes conservent l’historique. Les anciens scripts `phase2-check.cjs`, `pocket-check.cjs` et `pocket-touch-check.cjs` décrivent aussi des étapes remplacées, notamment les dos et le suspense entre cartes ; ils ne constituent pas les contrôles de référence de la transition actuelle. Les scripts et captures de `test-results/` sont des artefacts locaux ignorés par Git.

Cette mise à jour documentaire ne modifie pas le code et ne constitue pas une nouvelle exécution des tests.

## Historique — vertical slice

Vérifiée le 1er octobre 2026.

- `npm test` : 5 tests réussis (achats, reprise des révélations, équipement et limite du deck, raretés, déterminisme, validation des sauvegardes).
- `npm run typecheck` : réussi.
- `npm run build` : réussi, routes `/`, `/dev` et icône générées.
- Chrome : parcours depuis une partie vierge, 20 clics, achat, déchirure du sceau, révélations 1–2 puis rechargement, révélations 3–5, collection, équipement et retrait.
- Avec une fixture contrôlée : 6 emplacements, 7e équipement bloqué, réduction à 90 éclats, production passive réelle, amélioration du portail et persistance après rechargement.
- Mobile 390 × 844 : pas de débordement horizontal du document, boutique, deck et ouverture utilisables ; défilement vers la carte révélée.
- Atelier : 9 sprites, seed modifié puis restauré donnant le même SVG.
- Aucun message d’erreur navigateur pendant le parcours final.

Captures et script de contrôle local dans `test-results/` (ignorés par Git). Le script navigateur utilise le Playwright fourni par l’environnement Codex ; les tests de logique sont autonomes avec `npm test`.

Limites assumées : sauvegarde par navigateur et un seul onglet actif ; pas de progression hors ligne ; neuf cartes de test, sans amélioration des doublons ni variantes collectionnables.

## Phase 2 — Visual Polish Prototype

- Huit tests réussis : les cinq tests de gameplay initiaux, plus neuf silhouettes distinctes sans couleur, variation des marques sans altération de la silhouette, palette exacte, chemins SVG compacts, atmosphère déterministe et progression du suspense.
- Compilation de production et contrôle TypeScript réussis.
- Chrome : neuf sprites et comparaison 48/80/112 px ; fond, zoom, seed et isolation de coiffe ; cartes premium, reflet au pointeur ; cinq dos distribués ; révélations Commune, Rare, Épique, Légendaire et Mythique ; récapitulatif de cinq cartes.
- Le test d'ouverture de l'atelier n'écrit pas dans la sauvegarde.
- Partie réelle depuis zéro : clics et critique, achat, révélation puis rechargement, quatre révélations suivantes, exactement cinq cartes obtenues, équipement et sauvegarde.
- Mobile 390 × 844 : classeur et atelier sans débordement du document ; révélation mythique et récapitulatif ; parcours intégral avec `prefers-reduced-motion`.
- Aucun message d'erreur navigateur durant le parcours.

Captures : `test-results/phase2-sprites.png`, `phase2-cards.png`, `phase2-home.png`, `phase2-reveal-0.png` à `phase2-reveal-4.png`, `phase2-summary.png` et variantes mobiles. Script local : `test-results/phase2-check.cjs`.
- Contrôle complémentaire : double clic sur « Passer l’animation » sans double attribution ; rechargement pendant le suspense d'une Rare, reprise sur la même carte non révélée et ancien timer annulé.

## Ouverture tactile — 2 octobre 2026

- TypeScript, les huit tests de logique et la compilation de production passent.
- Parcours Chrome : carrousel, choix du sachet, découpe interrompue puis complète, retrait des cinq cartes par glissement, chaque rareté de démonstration et récapitulatif. Aucun message d’erreur navigateur.
- Tactile réel via le protocole Chrome : découpe de droite à gauche, petite découpe annulée, petit déplacement d’une carte replacé et balayage complet. Recharge en cours de pile et de suspense ; double passage du suspense sans double attribution. Exactement cinq cartes conservées, équipement après fermeture, défilement de la page restauré.
- Clavier, boutons alternatifs, son désactivable et préférence de mouvement réduit vérifiés.
- Mobile 390 × 844 : les cinq cartes du récapitulatif et le bouton Continuer tiennent ensemble dans l’écran. Ouverture plein écran sans débordement horizontal visible.
- L’atelier n’écrit pas dans la sauvegarde. Les prix, probabilités et effets de cartes sont inchangés.

Scripts locaux : `test-results/pocket-check.cjs`, `pocket-touch-check.cjs`, `pocket-summary-check.cjs`. Captures `pocket-carousel.png`, `pocket-sealed.png`, `pocket-card-0.png` à `pocket-card-4.png`, `pocket-summary.png`, `pocket-mobile-mythic.png`, `pocket-mobile-summary.png`.

### Ajustement du 2 octobre — pile face visible

La carte suivante est préaffichée face visible sous la carte courante, sans interaction ni attribution anticipée. Après le retrait, passage direct au premier plan et effets de rareté sans fondu depuis un dos de carte. Attribution unique conservée.

Vérification : parcours complet au clic sur ordinateur et au toucher à 390 × 844 ; absence de dos et de suspense entre les cinq cartes ; cinq attributions exactes ; récapitulatif et bouton Continuer visibles avec animations réduites ; aucune erreur navigateur. TypeScript, 8 tests et compilation de production réussis. Script de contrôle local : test-results/faceup-check.cjs.
