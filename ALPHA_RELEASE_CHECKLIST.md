# Checklist courante — Alpha 0.2.0

3 octobre 2026. Préparation locale ; la checklist Alpha 0.1.0 ci-dessous reste historique.

- [x] Version Alpha 0.2.0, changelog, README et règles documentées sans changement d’économie.
- [x] 100 tests, TypeScript, build de production.
- [x] Machine sans scroll global sur 360 × 800, 390 × 844, 393 × 852, 430 × 932, 768 × 1024.
- [x] Navigation fixe, accès direct aux boosters et aux sept améliorations.
- [x] Panneaux à scroll interne, focus/Escape/bouton, retour du focus.
- [x] Collection, détail carte, Deck/sélection, Progression et desktop Chrome/Edge.
- [x] Manifest et icônes locaux ; éligibilité Chrome normal sans erreur.
- [x] Relance offline et sauvegarde conservée après préparation du cache.
- [x] Mise à jour explicite réelle, ouverture non interrompue et sauvegarde préalable.
- [x] Export, import/migration/récupération et multi-onglet couverts par tests Alpha.
- [x] /dev inaccessible en production ; cache ne stocke pas la sauvegarde.
- [x] Aide iOS et standalone vérifiés en émulation, installation documentée.
- [ ] Android réel : installation, lancement, offline, suspension, son, clavier et update.
- [ ] iPhone/iPad réels : ajout Safari, safe areas, stockage Safari/PWA, offline et update.
- [ ] Firefox récent : parcours Phase 10.
- [ ] Lighthouse sur URL HTTPS publiée, si l’outil est disponible.
- [ ] Déployer Alpha 0.2.0 sur Vercel et vérifier HTTPS, version, /dev et accès des testeurs.
- [ ] Playtest humain portrait/paysage, gros texte et petit écran ; conservation et export de la progression existante.

---

# Checklist de publication — Alpha 0.1.0

État au 2 octobre 2026. Les cases cochées sont étayées par les contrôles locaux ; les cases vides restent à effectuer. Une simulation et une émulation mobile ne constituent pas un essai sur matériel réel.

## Build et parcours local de production

- [x] Tests de règles et sauvegarde réussis, sans régression des 75 tests historiques.
- [x] TypeScript et build de production.
- [x] Nouvelle partie : introduction, clics, paramètres.
- [x] Migration v1/v2/v3 et anciennes v4, progression et identité conservées (tests automatisés).
- [x] Export JSON v4 téléchargeable, réimport validé avec résumé et confirmation.
- [x] Import invalide refusé, progression actuelle conservée.
- [x] Copie avant remplacement et reset, écriture refusée si backup impossible (test de quota).
- [x] Principal illisible : choix explicite, restauration et archivage brut.
- [x] Multi-onglet : second onglet bloqué, fallback et bail expiré.
- [x] Diagnostics : version, compteurs et préférences ; aucun export complet implicite.
- [x] Version Alpha 0.1.0 ; `/dev` retourne 404 et aucun lien développeur en production.
- [x] Chrome 154.0.8037.97 et Edge 154.0.4258.48, parcours de production.
- [x] Firefox installé 138.0.3, moteur réel via BiDi : parcours, 390 px, deux onglets, booster repris, import.
- [ ] Firefox actuel sur le poste d’un testeur : la version installée ici est plus ancienne que la cible « récente ».
- [x] Mobile émulé 360/390/430 px et tablette 768 px, quatre vues et booster.
- [x] Clavier : introduction, commandes alternatives, focus des paramètres/carte, Échap et retour du focus.
- [x] Préférence reduced-motion et réglage manuel.
- [x] Collection de 60 cartes, filtres, inspection ; deck et progression.
- [x] Reprise d’une ouverture et cinq attributions exactes.
- [x] Jeu utilisable hors réseau après chargement des fichiers ; aucune API de gameplay ni tracking.
- [x] Simulations 1/3/8 heures et retours 10 min/1 h/6 h/24 h/7 jours.
- [x] Profilage : particules plafonnées, écritures regroupées, cartes mémorisées et animations hors écran suspendues.

## Safari macOS et Safari iOS — vérification manuelle obligatoire

- [ ] Nouvelle partie puis rechargement : aucune introduction rejouée, sauvegarde persistante.
- [ ] Paramètres/inspection : `<dialog>` au-dessus du jeu, focus piégé, Échap et restitution du focus (clavier externe sur iOS si possible).
- [ ] Deux onglets : le second est bloqué ; premier onglet caché > 30 secondes puis repris, aucune double production/écriture.
- [ ] Quitter/revenir via l’historique et après verrouillage du téléphone ; ne pas jouer depuis un écran conservé sans rechargement de sa session.
- [ ] Pointer Events : découpe dans les deux sens, découpe abandonnée, balayage court/long, pointercancel lors d’une interruption.
- [ ] Web Audio après premier geste, mute, volume et reprise après mise en arrière-plan ; écouter casque/haut-parleur.
- [ ] SVG, silhouettes, finitions Rare/Légendaire/Mythique, aucune carte invisible.
- [ ] Barre Safari ouverte puis repliée, encoche et safe areas : booster, récapitulatif et boutons accessibles, sans couper le bas.
- [ ] Portrait puis paysage ; zoom de texte ; aucune orientation imposée.
- [ ] Clavier virtuel sur recherche et confirmation RESET : champ et commandes restent accessibles.
- [ ] Scroll interne des dialogues et restauration du scroll du jeu à la fermeture du booster.
- [ ] Export JSON téléchargé dans Fichiers et réimport choisi via le sélecteur iOS.
- [ ] Import invalide, principal endommagé dans un profil de test et backup restauré sans perte de l’original.
- [ ] Clipboard refusé : texte des diagnostics sélectionnable manuellement.
- [ ] Stockage refusé/plein : écran explicite ou avertissement, export restant possible si la partie est chargée.
- [ ] VoiceOver : titres, boutons, annonces importantes, aucun spam de production passive ; contraste et cibles tactiles en situation réelle.

Les APIs utilisées ciblent les navigateurs récents. Les dialogues natifs et Web Locks sont documentés par [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) et [MDN Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API). Fallbacks : bail localStorage sans Web Locks, diagnostics en texte si Clipboard échoue, animations conservées si IntersectionObserver manque, absence d’audio sans AudioContext, `vh` avant `dvh`/`svh`. La présence d’une API ne prouve pas sa qualité sur un appareil réel.

## Téléphones et playtests

- [ ] Au moins un iPhone et un Android, sessions 30–45 minutes ; son et température/batterie raisonnables.
- [ ] Session réelle prolongée, mise en veille et reprise ; aucune croissance mémoire ou lenteur progressive ressentie.
- [ ] 3 à 5 personnes nouvelles au projet, selon `ALPHA_TEST.md`.
- [ ] Réviser compréhension, fatigue d’ouverture et rythme à partir des retours.

## Publication Vercel

- [ ] Reporter ou corriger tout blocage constaté ci-dessus.
- [ ] Commit/push de cette préparation après revue des changements, y compris les nouveaux fichiers ; ne pas inclure `test-results/`, profils navigateur ou `.next/`.
- [ ] Importer le dépôt, preset Next.js, racine du dépôt, Node.js 22, `npm ci`, `npm run build`, sortie automatique.
- [ ] Aucune variable secrète ni intégration analytics ajoutée ; pas de cookies marketing.
- [ ] Tester la preview HTTPS : page, icône, métadonnées, sauvegarde/import, audio, `/dev` 404 et absence de liens internes.
- [ ] Vérifier que les bundles de production ne chargent pas d’illustration archivée ni de service tiers.
- [ ] Choisir une URL stable pour les playtests et annoncer que les sauvegardes sont propres à chaque origine ; proposer export/import si l’URL change.
- [ ] Promouvoir le build validé, relever URL/version/date et revérifier le parcours sur l’URL finale.
- [ ] Garder le déploiement précédent pour rollback ; ne pas revenir à un code incapable de lire v4.

## Reproduire les tests Firefox locaux

Utiliser un profil **jetable**, jamais le profil personnel. Lancer Firefox avec `--headless --no-remote --profile <dossier-test-absolu> --remote-debugging-port 9225`, puis `node scripts/verify-firefox.cjs`. Définir `FIREFOX_BIDI_URL` si le port change et `ALPHA_URL` si le serveur change. Le script crée un contexte utilisateur isolé et le ferme après succès. Sur échec, fermer les onglets de ce profil ou le navigateur de test avant de recommencer. Aucun composant de test n’est utilisé par le jeu publié.

## Limites connues

La suppression des données du navigateur peut effacer principal et backups ; seul un export externe protège contre cela. Le fallback localStorage est moins fort que Web Locks (relecture après acquisition, avant actions/écritures et après événement storage). Un crash entre deux checkpoints ordinaires peut perdre environ une seconde de clic/passif ; les transactions importantes sont immédiates. Le jeu chargé fonctionne sans réseau, mais un premier chargement/rechargement hors réseau n’est pas garanti : aucune PWA n’est ajoutée. Safari/iOS, lecteur d’écran et autonomie mobile n’ont pas été exécutés dans cet environnement.
