# Phase 11A — prototype artistique local

4 octobre 2026. Base Alpha 0.2.0, direction **Faerie Field Journal × Arcane Machine**. Prototype livré ; son commit et son push sur main ont été autorisés par le propriétaire. Aucun passage automatique à 11B.

## Réalisé

- UI Bible et tokens distincts des couleurs historiques des cartes et du booster.
- Machine : angles gravés, compteur compact, rails de combo, commandes du dispositif ; illustration, forêt et interaction conservées.
- Atelier : huit symboles SVG originaux, composants en lignes, achats et sheet existants.
- Voyage : niveau en médaillon, chemin du niveau actuel aux étapes futures, prochain déblocage réel, annotations et récompenses.
- Objectifs : missions séparées par des filets, catégorie et état textuel conservés ; statistiques en registre.

Les SVG `Rune` et le composant `ExplorationPath` ne portent aucun état de jeu. Le chemin lit exclusivement les fonctions XP et déblocages existants. Les styles sont limités à `.tab-machine`, `.arcane-upgrades` et `.journal-view`. Pas de police, d’image ou de dépendance externe ajoutée. Aucun changement dans `lib/game`, économie, cartes, sauvegardes ou probabilités.

## Comparaisons

BEFORE intact : `test-results/ui-audit/`. AFTER et galerie côte à côte : `test-results/ui-redesign/index.html`, 85 paires, mêmes fixtures débutant/avancé/ouverture et mêmes viewports. Collection, Deck, navigation, paramètres et booster sont inclus comme références hors prototype. Les captures d’animation et les compteurs passifs ne sont pas pixel-identiques entre les prises.

Les scripts de capture, fixtures et manifestes restent dans ces dossiers ignorés. Le serveur du prototype utilise le port 3111. Depuis `ui-redesign`, le script de capture rejoue 77 vues ; le supplément ajoute huit vues ; `compare.cjs` assemble les 85 paires. Les images originales s’ouvrent depuis la galerie.

## Vérifications

- 103 tests unitaires, TypeScript et build réussis.
- Chrome/Edge : parcours mobile/PWA existant, ouvertures, favoris, export, panneaux, focus et reprise hors connexion réussis, aucune erreur JavaScript.
- Machine sans scroll global : Chrome 360 × 800, 390 × 844, 393 × 852, 430 × 932, 768 × 1024 ; Edge 390 × 844. Desktop 1440 × 1000 également contrôlé.
- Voyage desktop/mobile : seuils existants 22/23/24, 42 objectifs, 14 lignes de registre, récompense attribuée une fois et conservée au rechargement, contour de focus et réduction de mouvement vérifiés.
- Revue React : composants définis hors render, SVG décoratifs masqués aux lecteurs d’écran, aucune nouvelle subscription/effect ou écriture de sauvegarde ; pas d’animation continue ajoutée.

## Limites et suite

Collection, cercle de compagnons, navigation et icônes générales appartiennent à 11B et ne sont pas refondus ici. Les téléphones réels et Safari n’ont pas été testés dans cette passe. Version toujours Alpha 0.2.0. La disponibilité sur Vercel doit être confirmée séparément du push GitHub.
