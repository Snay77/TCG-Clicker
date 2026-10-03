# Phase 9 — audit et décisions

## Périmètre

Gameplay gelé : aucun changement de pool, prix, XP, amélioration, effet, récompense ou rareté. Pas de refactor global. Game reste le point d’orchestration ; extraire l’acquisition de session et la persistance permet de rendre leur cycle de vie explicite sans restructurer le jeu.

## Constats et corrections

| Constat | Correction | Vérification |
| --- | --- | --- |
| Persistance sur chaque cleanup de l’effet dépendant de save ; presque chaque tick écrivait | Effet de session stable, une écriture/s hors transactions, flush pagehide/visibilitychange, déduplication JSON | Compteur navigateur : au plus trois écritures ordinaires en 2,2 s |
| JSON illisible laissé en place mais partie fictive jouable sans secours | Écran bloquant, backup valide proposé, export du brut, nouveau départ confirmé | Tests de stockage et parcours Chrome |
| Import et reset sans protections inexistants | Import max 512 Ko, validateSave/parseSave, résumé, confirmation, backup avant écriture ; RESET requis | Tests invalides, quota, copie et navigateur |
| Deux onglets peuvent écrire le même état | Web Locks atomique, onglet secondaire suspendu ; fallback bail localStorage revérifié | Deux onglets réels et expiration simulée |
| Chargement affichait des valeurs neuves avant hydration | Écran de chargement jusqu’à acquisition et lecture | Nouvelle partie et récupération navigateur |
| /dev et reset de test exposés | Wrapper serveur retourne notFound hors development ; liens conditionnels | HTTP 404 du build et absence de liens |
| Absence d’UI en cas d’erreur React | error.tsx/global-error.tsx, recharge et export accessible | Contrôle de production et interface cohérente |
| Les 60 cartes recevaient de nouveaux children à chaque tick | CollectionCard mémorisé, callbacks stables et filtres calculés sur collection/niveaux | Zéro mutation des enfants de cartes au repos pendant 1,5 s |
| Animations hors écran actives | IntersectionObserver avec marge 100 px, CSS pause, cleanup à la disparition | 56/60 cartes suspendues hors écran à 1440×1000 |
| Identifiant de particule mélangeait temps et compteur | Compteur séparé de born, TTL indépendant de la durée de session ; cap 19 conservé | Rafale 200 clics, cleanup sans particules après 1,3 s |
| Rafales critiques non limitées par le throttle audio | Même limite 45 ms que les clics ordinaires | AudioContext simulé : 100 critiques ne produisent qu’un accord |
| Focus natif pouvait traverser la barre navigateur à la fin du dialogue | Boucle Tab/Shift+Tab explicite, commandes dynamiques, Échap ferme le récapitulatif | 24 tabulations, fermeture et focus restauré |
| Viewports modernes sans fallback et safe areas | vh/dvh/svh et env(safe-area-inset-*), cibles principales ≥44 px | Mobile émulé et checklist Safari |
| Docs de 9 cartes présentées parmi l’état actuel | README actuel réécrit, snapshot historique séparé, introduction du générateur corrigée | Référence du roster contrôlée par les tests |

## Cycle de sauvegarde

Les compteurs et gains saturent à MAX_SAFE_INTEGER pour qu’une valeur extrême importée reste réexportable après un clic/récompense ; le niveau de machine doit correspondre à son amélioration. Ces plafonds ne sont pas atteignables dans une session alpha normale.

v4 reste un JSON brut, sans enveloppe et sans exécution. Les IDs inconnus, doublons de deck, comptes invalides, nombres non finis/hors limites, versions futures et fichiers trop gros sont refusés. parseSave conserve ses migrations et reconstruit les champs connus ; les champs arbitraires account/ux ne sont pas réexportés.

Le principal n’est remplacé qu’après la copie before-replacement et, si nécessaire, l’archive unreadable. Les migrations gardent leur backup historique. Le dernier principal valide est copié périodiquement sous last-valid. Les clés sont en nombre fixe, sans historique croissant. Les sauvegardes endommagées ne sont jamais écrasées automatiquement au chargement.

Web Locks est préférable au lease parce qu’il reste propriétaire même si le navigateur suspend l’onglet. Le lease expire après quinze secondes, vérifie la propriété après 100 ms d’acquisition et bloque définitivement cet écran si la propriété est perdue. L’utilisateur ferme l’autre onglet puis recharge ; aucune reprise silencieuse depuis un ancien état. Les pages restaurées depuis bfcache rechargent leur session.

## Profilage local

Chrome 154.0.8037.97 headless, 1440×1000, 60 cartes possédées : douze transitions Machine/Collection entre 239 et 450 ms (mesure incluant l’automatisation). Heap après GC : 7,04 Mo au second passage, 7,61 Mo au douzième, soit +0,57 Mo ; aucune croissance évidente non bornée sur ce petit échantillon. 5 781 nœuds dans la collection, sans production de nouveaux nœuds au repos. Moyenne requestAnimationFrame ~34 ms, pic 42,6 ms dans ce contexte headless. Ce résultat ne garantit pas 60 FPS sur téléphone et justifie le contrôle matériel de la checklist ; aucun changement artistique massif n’est introduit.

Les sprites et CardArt possédaient déjà memo/useMemo. Les timers de booster, listeners de préférences, audio et scroll sont nettoyés au démontage. Les effets de clics et boosters sont bornés. Les cycles TypeScript existants entre game/exploration/ux sont résolus à l’appel des fonctions ; pas de nouvelle dépendance circulaire entre sauvegarde et moteur. Pas de paquet ni réseau de gameplay ajouté.

## Longue durée

Tests 1/3/8 h : ticks 200 ms, un clic/s, passif de deck, consommation de gratuits chaque dix minutes, révélations, XP/objectifs et checkpoint toutes les dix minutes. Valeurs finies, playSeconds correct, booster terminé sans double attribution, collection ≤60, objectifs ≤42 et JSON <16 Ko. Retours 10 min/1 h/6 h/24 h/7 jours : reserve plafonnée, timestamp null au plein, énergie/prix/temps actif inchangés. La mémoire du navigateur sur huit heures n’est pas mesurée ; le profilage court et la taille d’état restent des indices séparés.

## Compatibilité et publication

Chrome et Edge : parcours complet automatisé via Playwright local, car le CLI agent-browser n’est pas installé. Firefox : moteur installé 138.0.3, protocole BiDi, import réel, onglets et ouverture repris ; refaire sur Firefox récent au playtest. Safari absent : audit des APIs et checklist manuelle détaillée. Clipboard possède un fallback texte, Web Locks un lease, IntersectionObserver une apparence animée normale sans observer, Web Audio un silence non bloquant.

Vercel : preset Next.js, Node.js 22, sortie standard et aucune intégration externe. Ni déploiement, ni commit/push, ni domaine créés dans cette phase de préparation. Les tests humains et Safari restent des critères ouverts avant une annonce publique.
