# Phase 10 — Alpha 0.2.0

Préparée localement le 3 octobre 2026. L’Alpha 0.1.0 est publiée sur Vercel selon le propriétaire ; aucun déploiement Alpha 0.2.0 n’est effectué par cette phase.

## Interface

Breakpoint mobile/tablette : 850 px. La sidebar devient une navigation fixe en bas, avec icône, libellé et badges existants. Le header sticky affiche énergie, niveau d’exploration et boosters, plus Paramètres. Les safe areas sont prises en compte aux deux extrémités. Le portail utilise le reste de la hauteur portrait ; combo, boutons d’améliorations et boosters restent au-dessus de la navigation. Les conseils se retrouvent dans le panneau « ? », sans pousser la machine vers le bas.

`BottomSheet` réutilise un dialogue natif : focus contenu, Escape, bouton fermer, retour du focus, verrouillage du scroll de fond, scroll interne, reduced motion et safe area. Le glissement de fermeture est limité à la poignée : il ne se confond pas avec le scroll du contenu. Les achats restent dans les fonctions de règles existantes.

Collection : deux cartes par ligne, recherche compacte, filtres en panneau, progression repliable ; les détails et améliorations sont dans l’inspection plein écran. Deck : emplacements en deux colonnes, recherche/type dans le panneau de remplacement, comparaison clic/passif/critique/réduction avant sélection, fermeture après action. Les cartes bloquées gardent leur raison et un bouton désactivé. Synergies et styles restent accessibles sous un détail repliable. Voyage : niveau, XP, prochain déblocage, trois récompenses prêtes puis les autres repliées ; statistiques dans l’onglet existant.

Sur desktop, sidebar, machine, boutique, améliorations, collection et synergies restent en panneaux ordinaires. Un faible écran paysage et un zoom important peuvent nécessiter du scroll ; aucun blocage global des gestes ou du zoom n’est ajouté. Le tap portail conserve `touch-action: manipulation`, y compris les gestes volontaires de scroll.

## PWA

`app/manifest.ts` : identité stable `/`, nom, description, langue française, démarrage `/`, scope `/`, standalone et couleurs du jeu. PNG 192/512, maskable 512 avec symbole dans la zone sûre et apple-touch-icon 180, rasterisés depuis `app/icon.svg`, sans asset externe.

`app/sw.js/route.ts` sert le worker avec des en-têtes sans cache HTTP et un scope racine. `lib/pwa-worker.ts` précache la page `/`, les scripts/styles locaux effectivement référencés, le manifest et les icônes. La préparation doit réussir entièrement : un asset manquant invalide le nouveau cache. La navigation privilégie le réseau, puis restaure le shell préparé hors connexion. `/dev`, POST, origines externes, sauvegardes et autres pages ne sont pas interceptés. Les écritures runtime de cache sont facultatives et ne doivent pas empêcher une réponse réseau valide.

Le worker ne fait pas de `skipWaiting` automatique. `usePWA` détecte la version en attente et vérifie les mises à jour au retour au premier plan. Le joueur déclenche Mettre à jour dans Paramètres : `saveBeforeReload` exige le droit de sauvegarder, une écriture réussie et aucune ouverture en cours. Import/reset désactivent l’action. L’onglet demandeur recharge au changement de contrôleur ; les autres ne subissent pas de rechargement automatique. Le cache courant et un précédent sont gardés, les autres caches de l’origine restent intacts. Sur Vercel, la version et le commit distinguent les caches. Chaque nouvelle release doit incrémenter la version.

La sauvegarde v4 reste en localStorage. Export/import reste la méthode de transfert entre appareils, navigateurs et domaines ; Safari et sa PWA peuvent avoir des stockages distincts. Une éviction de cache requiert une nouvelle visite connectée. Aucune synchronisation, notification push ou nouvelle règle de gameplay.

## Installation et limites

Android : URL stable HTTPS dans Chrome, Paramètres → Installer TCG Clicker si le prompt a été fourni ; sinon menu navigateur → Installer l’application / Ajouter à l’écran d’accueil. Aucun bouton sans prompt utilisable. iPhone/iPad : Safari → Partager → Ajouter à l’écran d’accueil ; activer Ouvrir comme app si proposé. Le mode standalone (media query et mécanisme Safari) remplace l’aide par Application installée.

Chrome/Edge réels sur Windows, avec viewports/touches émulés, ne remplacent pas Android, iOS ou Safari réel. Tester barre de statut, safe areas, clavier, lancement depuis l’icône, reprise après suspension, stockage, audio et mise à jour sur appareil. Lighthouse absent du runtime : aucun score inventé. Les erreurs d’éligibilité PWA de Chrome sont vides dans un profil neuf non privé ; cela ne prouve pas une installation physique.

## Preuves locales

- `scripts/verify-mobile-pwa.cjs` : parcours responsive Chrome/Edge, achats, boosters, filtres, inspection, deck, progression, focus, export, relance offline et sauvegarde.
- `scripts/verify-boosters.cjs` : catalogue illustré, ancien format de préférences, ajout/retrait du favori et persistance après rechargement, ouvertures gratuites/payantes avec prix et attributions existants. Rapports et captures dans `test-results/boosters/`.
- `scripts/verify-pwa-update.cjs` : vrai worker en attente sur proxy local isolé ; ouverture non interrompue, mise à jour explicite, cartes conservées et traitement du prompt d’installation.
- `tests/pwa.test.ts` : cache complet/incomplet, exclusion de `/dev`, offline, activation explicite et conservation du cache précédent.
- `test-results/phase10/gallery.html` : captures avant/après depuis Alpha 0.1.0 (`abe8e99`) et Alpha 0.2.0. Les captures et profils de test restent ignorés par Git.
