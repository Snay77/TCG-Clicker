# Vérification de TCG Clicker

**État actuel — Phase 6 (2 octobre 2026) : Set 01 complet, économie des boosters et sauvegarde v3. Les sections précédentes constituent l’historique.**

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

## Phase 4 — Set 01, roster et pipeline (2 octobre 2026)

- `npm test` : 30 tests réussis (21 existants et 9 nouveaux). Vérification des 60 fiches, raretés exactes 24/14/10/6/4/2, relations 12×3 + 8×2 + 8, marqueurs, signatures, échantillon limité à 12 et référence Markdown identique aux données.
- `npm run typecheck` et `npm run build` réussis. Routes `/` et `/dev` compilées en production.
- Pixels bornés à la grille 64 × 64, douze silhouettes distinctes, couleurs dans la palette dérivée, chemins compacts. Seed limitée aux marques secondaires : ni silhouette, ni composants fixes altérés. Tête paramétrée, oreilles/ailes amovibles et variantes non produites refusées.
- Edge avec Playwright fourni par Codex : douze échantillons, comparaison de 60 rendus à 48/64/80/112/160 px, silhouettes sur fond nuit, seed modifiée puis restaurée, isolation de partie, arrêt manuel et mouvement réduit.
- Vingt lignées visibles, dont L01 et L13 entièrement rendues. Soixante fiches, filtre des 48 designs à produire, recherche, raretés mythiques, douze cartes d'étude et atlas de seize habitats vérifiés.
- Mobile 390 × 844 : échantillons, comparaisons, lignées et cartes sans débordement horizontal du document. Aucune erreur JavaScript ou console sur le parcours Phase 4.
- `/dev` laisse intacte une valeur sentinelle de sauvegarde. Les effets et conditions de design ne sont pas actifs dans le jeu ; les tests confirment neuf cartes dans le tirage et les statistiques initiales Phase 3.
- Régression navigateur Phase 3 : migration et copie de secours, achat d'amélioration, décroissance du combo, remplacement du deck, niveaux, prérequis d'évolution, rechargement, sauvegarde future préservée. Mobile, découpe au clavier, progression tactile, recharge en pleine ouverture, cinq attributions exactes et récapitulatif passent sans erreur navigateur.

Captures locales : `test-results/phase4-samples.png`, `phase4-cards.png`, `phase4-sizes.png`, `phase4-48px.png`, `phase4-silhouettes.png`, `phase4-night-silhouettes.png`, `phase4-lineage-three.png`, `phase4-lineage-two.png`, `phase4-habitats.png` et `phase4-mobile.png`. Scripts locaux `phase4-check.cjs`, `phase4-controls.cjs`, régression `phase3-check.cjs`. Captures et scripts navigateur sont ignorés par Git.

Limite de cette phase : les 60 créatures sont conçues, 12 sprites seulement sont produits. Les 48 autres et trois des quatre légendaires restent au stade du design. Les anatomies prévues ne sont pas toutes implémentées (25 prévues, 11 réalisées). La production complète attend la validation visuelle de l'échantillon. Aucun asset externe, image IA, dépendance ou changement d'économie ajouté.

## Phase 4.5 — Validation artistique (2 octobre 2026)

- 34 tests passent : les 30 précédents et quatre contrôles supplémentaires couvrant référence Phase 4, changements des douze silhouettes, règles faciales par anatomie, combinaisons dirigées, proportions, postures, études temporaires et idles distincts.
- TypeScript et build de production passent. La référence des 60 fiches reste identique aux données ; le roster conserve 60 cartes et exactement 12 recettes rendues.
- Edge/Playwright : douze comparaisons dans **Set 01 — Style Validation**, passage Avant/Après, huit études extrêmes, 60 rendus comparatifs aux cinq tailles, animations actives puis arrêt manuel, préférence de mouvement réduit. Aucun message d'erreur JavaScript ou console.
- Mobile 390 × 844 : grille, témoin Avant et cinq tailles sans débordement horizontal. La sauvegarde sentinelle reste intacte après le parcours de l'atelier.
- Les visuels ont été inspectés sur les captures couleur et silhouettes noires, à 48 et 112 px ainsi que sur la planche extrême. Les dimensions tête/corps sont mesurées sur les pixels (visage inclus), pas déduites d'un libellé de variante.
- Régression Phase 3 réussie : migration/copie de secours, améliorations, combo, remplacement du deck, niveaux, prérequis des évolutions, recharge, sauvegarde future préservée ; découpe au clavier, progression tactile, ouverture rechargée, cinq attributions exactes et récapitulatif mobile. Aucun changement de fichiers de gameplay.

Captures : `test-results/phase45-before.png`, `phase45-after.png`, `phase45-extremes.png`, `phase45-sizes.png`, `phase45-mobile.png`. Script navigateur : `test-results/phase45-check.cjs`. Régression : `phase3-check.cjs`. Ces fichiers de vérification locale sont ignorés par Git.

Le témoin vectoriel `design/phase4-sprite-baseline.json` conserve les pixels réels antérieurs à la correction ; ne pas le régénérer avec le moteur courant. Les cinq prototypes `STUDY-*` servent uniquement aux limites de proportions. Ils restent hors du roster et des boosters. Les douze échantillons sont corrigés ; les 48 sprites finaux supplémentaires ne sont pas produits. Floréale, Nacréveil et Auralis ont des signatures de production précisées, mais aucun nouveau sprite final dans cette passe.

## Phase 5 — Production complète et intégration (2 octobre 2026)

- `npm test` : 39 tests réussis. Exactement 60 identités, raretés 24/14/10/6/4/2, structure 12×3 + 8×2 + 8, relations runtime/design bijectives et tous les parents réciproques.
- Les 48 nouveaux sprites sont rendus. Les 60 silhouettes sont distinctes ; pixels entiers bornés, palettes exactes, SVG compacts et seeds secondaires sans changement d’anatomie. Empreintes et recettes des 12 références Phase 4.5 identiques au témoin figé. Six idles de signature distincts pour les quatre Légendaires et deux Mythiques.
- Test de 6 000 boosters avec générateur déterministe : les 60 cartes apparaissent, cinq cartes par booster et cinquième Peu commune ou mieux. Les poids par rareté restent inchangés.
- Sauvegardes v1 et v2 : les neuf IDs historiques, copies, deck et ouverture partielle restent conservés. Migration v1 → v2 avec backup brut confirmée dans le navigateur. Les cartes nouvelles persistent et le rechargement ne perd aucune des 60 espèces d’un fixture complet. Aucune migration du format v2.
- Tests des six raretés dans un même deck, capacité 6/7/8, parents à l’équipement, sept synergies avec seuil naturel de deux espèces, non-double comptage et spécialités Clic/Idle/Collection.
- `npm run typecheck` et `npm run build` réussis sur Next.js 16.3.8 ; routes `/` et `/dev` pré-rendues.
- Vérification Edge/Chromium via Playwright disponible localement (`agent-browser` absent) sur build de production : 60 cartes premium, deck des six raretés équipé dans l’interface, remplacement, filtres, reload, améliorations, montée/décroissance du combo, sauvegarde future préservée. Aucun message d’erreur JavaScript sur les parcours.
- Ouverture mobile : découpe clavier, avancée tactile, reprise après reload, exactement cinq crédits et récapitulatif. Gestes et prix Phase 3 conservés.
- Atelier Full Roster : 60 sprites, filtres type/rareté/anatomie/habitat, 300 comparaisons de taille, 20 lignées avec 52 sprites et 16 habitats. Style Validation : 12 références, témoin Avant, huit études extrêmes, arrêt manuel, mouvement réduit et isolation de la sauvegarde vérifiés.
- Mobile 390 × 844 : classeur neuf avec 60 silhouettes, lignées repliables et atelier sans débordement horizontal. La navigation d’atelier se replie désormais sur plusieurs lignes.
- Inspection visuelle de la planche couleur et silhouettes noires des 60 créatures, des six cartes de signature et des cinq tailles. Captures locales : `test-results/phase5-sheet.png`, `phase5-special.png`, `phase5-dev-mobile.png`, `phase5-new-deck.png`, `phase5-collection-mobile.png`.

Tous les sprites, habitats et animations sont construits en code. Aucune image IA, asset externe ou nouvelle dépendance. Les données des capacités conditionnelles restent inactives. L’équilibrage long terme demande encore des sessions de 30–60 minutes : fréquence des boosters, valeur des doublons, niveaux élevés et fatigue d’ouverture. Deck 7/8 reste préparé sans nouveau moyen d’achat, conformément au périmètre Phase 3.

## Phase 6 — Recharge, prix et ouverture en chaîne (2 octobre 2026)

- `npm test` : 49 tests réussis, dont dix contrôles d’économie supplémentaires. Les 60 cartes et les douze références visuelles restent couvertes par leurs tests précédents.
- Recharge testée aux frontières de dix minutes, par ticks et par saut de date ; reliquat conservé en réserve partielle, plafond plein, aucun temps caché, reprise après consommation, recul d’horloge et retours 10/30/60/180 minutes.
- Prix des achats 1/2/5/10/20/30/50, quatre croissances, précision décimale, plafonds, réduction du deck, compteur exclusivement payant, sources identiques et débit unique vérifiés.
- Sac dimensionnel : huit coûts croissants, capacités 2 à 10, débit d’énergie, plafond, timer plein/partiel et absence de déblocage du Deck 7/8.
- Migration v1/v2 vers v3, progression conservée, compteur historique payé, provenance d’ouverture partielle, recharge à la lecture v3, champs invalides et versions futures testés. Les copies brutes sont conservées avant la première écriture v3.
- Simulation préalable de quatre courbes, 72 trajectoires : profils actifs/mixtes, 30/60/120 minutes, trois seeds. Courbe ×1,12 retenue, résultats enregistrés et contrôlés pour cohérence prix/compteurs/collection. Quatre retours hors ligne et estimation analytique des espèces après ouverture. Commande reproductible : `npm run simulate:economy`.
- Edge/Chromium et Playwright local, build de production : chaîne gratuit → gratuit → payé, choix/déchirure conservés à chaque booster, exactement quinze attributions, consommation explicite, stock restant et provenance visibles, compteur payé une seule fois, récapitulatif et retour machine volontaire. Bouton payant absent sans ressources, accès volontaire à Collection.
- Horloge navigateur accélérée : vraie nouvelle partie 0/2, recharge live à dix puis vingt minutes, stockage plein, timestamp suspendu et aucune énergie hors ligne.
- Mobile 390 × 844 : reprise d’un booster gratuit après reload, départ du cycle depuis une réserve pleine, boutons de récapitulatif et choix Collection, boutique et machine sans débordement horizontal. Présentation des boutons boutique ajustée pour rester dans leur panneau.
- Stockage acheté de 2 à 10 dans l’interface ; maximum désactivé. Migration v2 avec backup brut et booster en cours confirmée. Contrôle de reset présent uniquement dans l’atelier ; annulation préserve la partie, confirmation redémarre à zéro avec capacité 2, compteur payé 0, collection vide.
- Régression des parcours précédents : migration v1/backup, améliorations, combo et décroissance, remplacement du deck, niveaux, vingt lignées, soixante cartes, sauvegarde future conservée, ouverture clavier/tactile, reprise et cinq attributions uniques. Aucun message d’erreur console ou JavaScript sur les parcours.
- `npm run typecheck` et `npm run build` réussis ; aucune dépendance supplémentaire, aucun nouveau contenu de carte ou asset.

Captures et scripts locaux ignorés par Git : `test-results/phase6-shop.png`, `phase6-summary.png`, `phase6-mobile.png`, `phase6-check.cjs`, `phase6-clock-check.cjs`, `phase6-regression.cjs`. `agent-browser` absent sur ce poste ; vérification réalisée avec Edge via le Playwright local disponible.

Le réglage reste préparatoire : les bots optimisés découvrent environ 57–58 espèces en trente minutes, leur comportement n’est pas une mesure de joueur. Le premier playtest humain doit vérifier saturation de collection, choix upgrade/booster, stock et coût du Sac dimensionnel, prix des anciennes parties migrées, satisfaction des doublons et fatigue des gestes successifs. Aucun mode rapide, ouverture multiple ou déblocage de slots 7/8 n’a été ajouté.


## Ajustements de progression et cartes de prestige — 2 octobre 2026

- 53 tests unitaires passent, compilation de production réussie avec vérification TypeScript.
- Navigateur Edge isolé : 100 clics sur une partie neuve = exactement 100 éclats ; après premier amplificateur, un clic donne 2 éclats ; niveau conservé après rechargement.
- Classeur : achats successifs consommant 2/3/4/5 doublons ; une copie reste, carte équipée maintenue, autres espèces intactes, niveau 5 permanent après rechargement et bouton plafonné.
- Tests moteur : stock insuffisant et ouverture en cours refusés ; révélation ne monte pas automatiquement le niveau ; v3→v4 conserve niveaux historiques et copies ; données de niveau invalides refusées.
- Galerie : six images locales chargent ; quatre légendaires et deux mythiques ; six titres de capacités distincts ; affichage 1440 et 390 px sans débordement.
- Galerie accessible directement avec `/dev?view=prestige`. Ouverture de démonstration complète, illustrations de prestige visibles et récapitulatif de cinq cartes intact. Aucune erreur JavaScript ni console sur ces parcours.
- Captures locales : `test-results/prestige-gallery.png`, `prestige-1440.png`, `prestige-390.png`.
- Les mesures de simulation Phase 6 avec la base 5 sont historiques ; l’équilibrage global avec le nouveau départ à 1 reste à mesurer en playtest humain.


## Retour au style précédent — 2 octobre 2026

Les six illustrations sont archivées hors de `public/` dans `design/archive/2026-10-02-prestige-art/illustrations/`. Les empreintes SHA256 avant/après déplacement sont identiques. Composant et styles de prestige archivés pour référence, imports actifs et galerie peinte retirés, titres de capacités antérieurs restaurés.

Vérification TypeScript et compilation de production réussies. Navigateur Edge, 1440 et 390 px : les six cartes prestigieuses utilisent à nouveau les sprites et habitats du roster, avec les cadres antérieurs ; aucun rendu ni requête d’illustration peinte, aucun débordement horizontal ou erreur JavaScript. L’ancienne URL publique d’une illustration retourne 404. Les changements de progression ne sont pas concernés par ce retour visuel.
