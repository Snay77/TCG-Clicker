# TCG Clicker — Faerie

## État actuel

**Alpha 0.1.0** : un clicker de collection jouable dans le navigateur, avec 60 créatures originales, 20 lignées et six raretés. Cliquer sur le portail produit de l’énergie ; améliorations, deck et synergies développent clics, production passive, critiques et combo. Les boosters contiennent cinq cartes et garantissent une Peu commune ou mieux. Les doublons renforcent manuellement les cartes jusqu’au niveau 5.

La progression d’exploration comprend 42 objectifs, récompenses et titres. Six emplacements de deck au départ, deux supplémentaires à débloquer. Les boosters gratuits se rechargent toutes les dix minutes, même après fermeture du jeu, jusqu’au stockage maximal. **Aucune énergie n’est produite hors ligne.** Introduction, conseils, audio synthétique, ouverture rapide et préférence de mouvement réduit sont disponibles.

La sauvegarde v4 est locale à l’origine du site, sous `tcg-faerie-v1`. Paramètres permet export JSON, import validé avec résumé et confirmation, reset avec saisie RESET, et copie des diagnostics. Un import/reset crée une copie de secours avant remplacement. Une sauvegarde illisible déclenche un écran de récupération, sans écrasement automatique. Un second onglet est bloqué ; fermer le premier puis recharger pour reprendre.

Aucun compte, service de gameplay, tracking, police téléchargée ou asset graphique externe. Sprites, habitats et finitions sont produits en code. Les illustrations de l’ancien essai artistique restent archivées hors des fichiers publics.

**Publication :** build local vérifié ; Safari/iOS et playtests humains restent à valider avant annonce publique. Les résultats et limites sont dans `VERIFICATION.md` et `ALPHA_RELEASE_CHECKLIST.md`.

## Installation

Node.js 22 recommandé. Depuis la racine :

```powershell
npm ci
npm run dev
```

Jeu : http://127.0.0.1:3000. Atelier : http://127.0.0.1:3000/dev, uniquement avec le serveur de développement.

## Architecture

- `components/Game.tsx` : orchestration, boucle de jeu, navigation et animations.
- `lib/game.ts`, `effects.ts`, `progression.ts`, `synergies.ts`, `exploration.ts` : règles pures, calculs et progression.
- `design/set01-faerie.json`, `lib/cards.ts`, `lib/content/` : 60 cartes, relations, sprites déterministes et habitats.
- `components/game/` : collection, deck, progression, paramètres, dialogues et gestion de session.
- `lib/save-manager.ts`, `save-storage.ts`, `tab-ownership.ts` : validation, migration, copies, export et propriété de l’onglet.
- `components/BoosterOpening.tsx`, `Card.tsx`, `Sprite.tsx`, `CardArt.tsx` : ouverture, cartes et rendu.
- `app/*.css` : apparence, responsive, mouvements réduits et safe areas.
- `lib/release.ts` : version affichée, issue uniquement de `package.json`.

## Développement

Le gameplay est gelé pour cette alpha : aucun nouveau système, monnaie, carte ou set. Corriger stabilité, sauvegarde, compatibilité, accessibilité et performances.

`/dev` et ses liens sont masqués en production (404), y compris sur les previews Vercel. Le reset développeur reste dans l’atelier ; le reset joueur exige une confirmation forte. Aucun secret ni variable d’environnement n’est nécessaire au gameplay.

Les transactions importantes sont sauvegardées immédiatement. Les ticks ordinaires sont regroupés à une écriture par seconde, avec vidage lorsque la page devient cachée ou se ferme. Les copies `last-valid`, `before-replacement`, `unreadable` et les backups de migration restent dans le navigateur. Exporter régulièrement pour se protéger contre l’effacement du stockage par le navigateur ou l’utilisateur.

Le verrou Web Locks est conservé pendant toute la session. Sans cette API, un bail localStorage de quinze secondes est rafraîchi toutes les trois secondes et revérifié avant les ticks, clics et écritures. Un propriétaire suspendu dont le bail a expiré doit recharger : il ne reprend pas silencieusement. Le fallback est une protection pratique, pas un mutex atomique entre processus.

Après modification du contenu, régénérer `SET_01_FAERIE.md` avec `npx --no-install tsx scripts/generate-set-doc.ts`. Les noms et identités historiques de sauvegarde restent stables.

## Tests

```powershell
npm test
npm run typecheck
npm run build
npm run start -- --port 3100
```

Tests navigateur reproductibles : `scripts/verify-alpha.cjs` utilise Playwright (fourni par l’environnement de test, absent des dépendances de production). Définir `PLAYWRIGHT_PATH` si le module est dans un runtime externe et `ALPHA_URL` si le port change. Le script utilise Chrome/Edge installés ; `CHROME_PATH` et `EDGE_PATH` peuvent remplacer leurs chemins. Captures et rapports sont écrits dans `test-results/`, ignoré par Git. `scripts/verify-firefox.cjs` utilise le protocole BiDi d’un Firefox de test isolé ; voir `ALPHA_RELEASE_CHECKLIST.md`.

Les simulations de 1/3/8 heures contrôlent règles, valeurs finies, sauvegardes et taille d’état. Elles ne remplacent pas huit heures sur un téléphone réel.

## Publication sur Vercel

Importer le dépôt GitHub dans Vercel avec le preset **Next.js**, dossier racine du dépôt, installation `npm ci` et build `npm run build`. Garder la sortie Next.js par défaut et choisir Node.js 22. Aucune variable secrète, base de données ou intégration analytics n’est requise.

Valider une preview HTTPS avec la checklist avant de la promouvoir en production. Vérifier notamment `/dev` = 404. Utiliser une URL stable pour les playtests : chaque domaine et chaque URL de preview a son stockage local distinct. Exporter/importer pour déplacer la progression vers un domaine différent. Ne pas activer les analytics Vercel pour cette alpha. Aucun déploiement n’est effectué par cette préparation.

Pour une correction, incrémenter `package.json` (0.1.1, 0.1.2…) et ajouter l’entrée publique correspondante au changelog. Vérifier la nouvelle preview puis promouvoir ; en cas de régression, restaurer le déploiement précédent depuis Vercel. Un rollback du code ne restaure pas les données locales : conserver la compatibilité v4 et une copie exportée.

## Documentation

- `GAME_DESIGN.md` : règles et historique des systèmes.
- `ART_BIBLE.md` : direction graphique et contraintes de production.
- `SET_01_FAERIE.md` : référence des 60 cartes générée depuis les données.
- `design/phase7-progression.md` : courbe d’XP, objectifs et déblocages.
- `CHANGELOG.md` : versions publiques.
- `ALPHA_TEST.md` : playtest de 30–45 minutes, questionnaire après session.
- `ALPHA_RELEASE_CHECKLIST.md` : contrôles de publication, Safari/iOS et limites.
- `VERIFICATION.md` : résultats techniques et navigateurs réellement contrôlés.
- `design/alpha-audit.md` : constats, décisions et risques de la Phase 9.

## Historique de développement

L’ancien README et les descriptions des prototypes à neuf cartes sont archivés dans `design/history/README-before-alpha.md`. Ils ne décrivent pas l’état actuel. Les sections historiques des documents de conception conservent les décisions des phases antérieures.
