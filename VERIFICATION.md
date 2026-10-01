# Vérification de la vertical slice

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
