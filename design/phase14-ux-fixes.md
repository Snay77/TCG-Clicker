# Phase 14 — Corrections UX et gameplay · 9 octobre 2026

Passe locale sur Alpha 0.3.0, issue du rapport utilisateur. Les 60 cartes, Set 01, sprites, direction Arcane Brutalism, architecture PWA et échantillon des 12 effets avancés sont conservés. Aucun nouveau playtest humain ni déploiement effectué.

## Corrections du rapport

| Points | Résultat |
| --- | --- |
| P1 · 1 | Navigation découverte mémorisée ; annonces de Progression conditionnées à son accès. Boosters conserve solde, prix et achat désactivé si le solde manque. |
| P1 · 2 | Première ouverture : trois Bases distinctes dans les trois premières positions, dont une Peu commune ou mieux. Carte 5 conserve sa garantie. Tirages ultérieurs inchangés. |
| P1 · 3, P2 · 34 | Parent immédiat manquant : nom, silhouette et numéro FÆ dans Collection, inspection, choix Deck et booster. |
| P1 · 4 | Sélecteur : effet avancé, condition et état ; une sélection sur Deck plein précise que la condition dépend du compagnon remplacé. |
| P1 · 5 | Comparaison clic, passif, critique, multiplicateur, réduction, Rare+ réel, doublons, combo ; synergies et effets avancés gagnés/perdus, conditions modifiées. Effets temporaires des cartes conservées inclus. Lignes inchangées masquées. |
| P1 · 6, 9 | Remplacement depuis une fiche ou le sélecteur plein. Comparaison de chaque compagnon ; insertion dans le slot choisi et retour à la fiche. |
| P1 · 7 | Retour Collection en haut ; cinq acquisitions examinables, doublons compris. Bandeau retiré après navigation. |
| P1 · 8 | Slots 7/8 « disponibles », prix 5 000/25 000 éclats, achat depuis Deck et Progression. |
| P2 · 10, 11 | Résumé Deck avant les slots sur mobile ; paires et triples présentés ensemble avec prochain palier. |
| P2 · 12, 13 | Rare+ calculé par renormalisation réelle, distinguant cartes 1–4 et carte 5 ; doublon chiffré avec supplément avancé inclus. |
| P2 · 14, 15 | Mode rapide après huit boosters terminés ou exploration niveau 12. Choix esthétique expliqué et sauté en mode rapide hors paquet mythique. Suspense Rare+ préservé ; Mythique conserve son rythme complet, sous réserve de la préférence de mouvements réduits. |
| P2 · 16, 17 | Combo plus permissif et premier bonus plus visible ; contribution du passif au clic actif limitée par palier. Aucun retrait de production passive. |
| P2 · 18, 19 | Upgrades : valeurs réelles avant/après et rendement moyen du clic lorsque pertinent. Cœur universel et Pacte Faerie explicités ; dans Set 01, tous les effets appartiennent à Faerie. |
| P2 · 20, 30 | Stockage replié en bas, présenté pour les absences ; révélé après cinq boosters dans l'affichage progressif. Solde et coût présents aux achats boosters/upgrades/stockage/slots. |
| P2 · 21, 22 | XP dans le niveau en priorité, XP totale secondaire. Objectif recommandé concret avec compteur, récompense et action directe. |
| P2 · 23, 24, 25, 26 | Fiche sans bloc Capacité redondant ; progression affiche seulement la prochaine valeur. Formatage français borné, contributions nulles masquées, éclats dans les interfaces économiques et niveaux contextualisés. |
| P2 · 27, 28, 35 | Notices ordinaires retirées après huit secondes, annonces de découverte après 4,5 secondes, timers suspendus pendant un booster. Conseils accomplis masqués. Montées de niveau rapprochées regroupées sur deux secondes. |
| P2 · 29 | Récap mobile à deux colonnes : artwork, nom, rareté, nouveau/doublon ; inspection au toucher, détails de capacité retirés des mini-cartes. Échap dans l'inspection laisse le récap ouvert. |
| P2 · 31, 32 | Choix équipables récents/avancés avant cartes ordinaires puis formes bloquées. Badge récent transitoire dans Collection, Deck et inspection, retiré après consultation. |
| P2 · 33 | Upgrade non équipé : précise que l'effet renforcé s'appliquera à l'équipement. |
| P2 · 36, 37, 38 | Machine desktop : titre et espaces réduits. Boosters : stock et actions avant catalogue. Paramètres : son, animations, ouverture rapide et sauvegarde avant installation PWA repliée. |

## Ajustements chiffrés

- Clic initial : toujours exactement 1 éclat, sans critique ou combo acquis.
- Combo : grâce de 2 s au lieu de 1 s ; décroissance de 10 points/s au lieu de 18.
- Bonus combo acquis `b > 0` : bonus maximal `min(1, 0,15 + b)`, réparti sur les paliers 25/50/75/100. Premier composant : multiplicateur maximal ×1,20 au lieu de ×1,05. Sans bonus acquis, multiplicateur ×1.
- Clic actif : ajout `min(passif × 0,12, clic de base) × palier / 4`, uniquement avec bonus combo acquis. Le supplément ne dépasse jamais le clic de base, même avec un passif très élevé ; le multiplicateur combo et les charges s'appliquent ensuite. Production passive inchangée.
- Prix, coûts de cartes, récompenses, XP et plafonds avancés conservés. Les règles spéciales du premier booster n'affectent pas les ouvertures suivantes.

## Sauvegarde et vérification

Sauvegarde v4 conservée. Seul ajout nécessaire : préférence optionnelle `ux.discoveredSystems` pour mémoriser les écrans découverts après dépense/reload. Les anciens fichiers restent importables ; le parseur valide les clés connues. Acquisitions récentes, notifications et combo ne créent pas de nouvel état permanent. Le blocage multi-onglets reste désactivé conformément à la demande antérieure.

149 tests automatisés réussis, dont 19 tests Phase 14 ; TypeScript et build de production réussis. `scripts/verify-phase14.cjs` utilise Edge installé, profils isolés, desktop 1440 × 1000 et mobile tactile émulé 390 × 844. Parcours : remplacement plein, ordre, achat slot, ouverture rapide, inspection imbriquée, retour Collection/scroll, cinq acquisitions, expiration des notices et première ouverture avec navigation persistante. Captures avant/après et galerie `test-results/phase14/index.html` (ignoré par Git). Régression Phase 13B rejouée sur Chrome desktop/mobile : compteurs périodiques, charge prête persistante, consommation unique, buffs des compagnons conservés et gain annoncé correspondant au clic. Dix captures, zéro erreur navigateur.

Limites : ni téléphone physique, ni Safari, ni nouveau playtest humain dans cette passe. Les contrôles historiques PWA/Firefox restent datés de leurs versions. Ils ne sont pas présentés comme rejoués pour Phase 14. Les captures avant concernent la baseline locale précédant ces corrections, avec les mêmes fixtures de sauvegarde.
