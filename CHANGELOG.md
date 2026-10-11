# Changelog

## Phase 16 — The Living Portal · 11 octobre 2026

- Porte suspendue en SVG natif : pierre et bronze, forêt intérieure, lentilles indépendantes, gravures, fragments, paliers visuels de Machine et réactions différenciées normal/critique/charge.
- Surface centrale exclusivement dédiée aux impulsions ; surcharge, fissure, effets, cadence, boosters et améliorations en périphérie.
- Surcharge volontaire de 8 s, bonus additif plafonné ; une fissure persistante et facultative récompensant en charge ; accords limités à Luciolot, Flamèche et Songegarde. Les 12 effets avancés existants sont conservés.
- Charge et progression de fissure dans un champ optionnel de sauvegarde v4 ; buffs temporaires perdus au reload, retrait de Songegarde effaçant sa préparation ; aucun revenu passif supplémentaire.
- Règles pures, rendu et runtime séparés ; mouvement réduit, suspension invisible et réactions bornées. Vérifications et simulations décrites dans `design/phase16-living-portal.md`.
- Aucun nouveau set, asset externe, image IA, généralisation aux 60 cartes, playtest humain, commit ou déploiement.

## Phase 15 — Core Loop Refinement · 11 octobre 2026

- Remplacement du Deck en lignes compactes, différences prioritaires et comparaison complète repliable ; actions de fiche rapprochées et confirmation d'amélioration avant/après.
- États d'effets explicites : condition manquante, prêt, en charge, chargé, actif et attente de booster. Lièvrille et les conditions actives visibles discrètement sur Machine.
- Ouverture rapide automatique des doublons ordinaires ; pauses sur découvertes et mise en scène Légendaire/Mythique préservées. Récapitulatif des gains et possibilités de renforcement.
- Recherche prioritaire, compteur de filtres mobile, distinction NOUVEAU/RÉCENT, achat slot près du résumé et confirmation, notifications groupées et formatage français.
- Diagnostic sur trois parcours simulés, 16 graines chacun, à 5/10/20/30 minutes. Ajustements ciblés sur croissance passive, coûts intermédiaires et courbe payante ; début et pouvoirs de clic préservés. Détail : `design/phase15-core-loop.md`.
- Aucun nouveau set, carte ou effet avancé ; aucune généralisation aux 60 cartes, aucun nouveau playtest humain ni déploiement.

## Phase 14 — Correctifs locaux · 9 octobre 2026

- Navigation découverte persistante, trois Bases distinctes au premier booster et prérequis d'évolution immédiatement visibles.
- Deck : comparaison complète, effets avancés dans le choix, remplacement direct et ordre stable, achat des slots 7/8, résumé mobile et paliers de synergies réunis.
- Boosters : CTA prioritaire, probabilité Rare+ réelle, doublons chiffrés, cinq acquisitions après ouverture et récap mobile examinable.
- Mode rapide après huit boosters terminés ou exploration niveau 12 ; choix esthétique expliqué. Mise en scène Mythique conservée.
- Combo : grâce 2 s, décroissance 10 points/s, premier bonus acquis renforcé ; contribution active plafonnée du passif, sans réduire le passif ni changer le clic initial de 1.
- Upgrades, XP, objectifs, terminologie, formatage, conseils, notices et paramètres clarifiés. Sauvegarde v4 compatible, préférence optionnelle des onglets découverts.
- 149 tests, TypeScript, build et parcours Edge desktop/mobile validés. Détail : `design/phase14-ux-fixes.md`. Aucun nouveau playtest humain ou déploiement.

## Correctif local — 9 octobre 2026

- Blocage entre onglets désactivé : chargement direct, sans Web Locks ni bail localStorage. Les anciens verrous ne bloquent plus le jeu.
- Sauvegarde v4, récupération, export/import et copies de secours conservés. Les onglets ne synchronisent pas leurs écritures ; utiliser un seul onglet de jeu à la fois.
- Vérification navigateur actualisée pour la Collection et la Progression de l’Alpha 0.3.0.

## Alpha 0.3.0 — 6 octobre 2026

- Direction Arcane Brutalism : navigation, Machine, Boosters, Collection, Deck, Progression, paramètres et introduction.
- Progressive disclosure : les écrans et informations apparaissent selon les actions et la progression utiles ; feedback court de déblocage.
- Nouvelle fiche carte : objet TCG séparé des actions, capacité, progression, copies et Deck ; informations secondaires repliables et lecture mobile compactée.
- Prototype data-driven d'effets avancés sur 12 cartes : conditions de Deck et combo, charges de clics, buffs temporaires, diversité des types, collection, doublons et lignées. Les 48 autres cartes ne sont pas généralisées.
- Zone EFFETS de la Machine limitée à trois lignes : durées, jauges discrètes et charges pertinentes ; effets actifs du Deck présentés avec nom, condition et état.
- Reload : les buffs temporaires et charges liées à l'ouverture d'un booster sont perdus ; la progression et la charge prête des effets périodiques de clics sont sauvegardées.
- Retrait d'une carte : seuls ses effets sont effacés. Les effets des cartes conservées restent actifs. Rééquiper une carte retirée repart de zéro, sans restaurer d'ancien buff.

Publication pour playtest externe. Aucun changement de gameplay ou d'équilibrage
supplémentaire dans la préparation de cette release. La généralisation aux 60
cartes reste interdite jusqu'à validation humaine des critères de Phase 13C.
La compatibilité et le plaisir de jeu sur appareils réels restent à confirmer.

## Alpha 0.2.0 — 3 octobre 2026

- Machine mobile centrée sur un écran : énergie, portail, combo, boosters et améliorations.
- Navigation fixe en bas, header compact et safe areas.
- Onglet Boosters : choix par paquet illustré, ouverture gratuite ou payante et favori conservé dans la sauvegarde ; miniature du favori sur la Machine mobile. Seul Faerie est proposé.
- Panneaux pour améliorations, filtres, détails booster et remplacement d’un compagnon ; Collection à deux colonnes et détail plein écran.
- Progression compacte avec récompenses disponibles mises en avant.
- PWA : manifest, icônes issues du symbole existant, installation Android et aide Safari iOS, mode standalone.
- Relance hors connexion après préparation du cache et mise à jour explicite avec sauvegarde préalable.

Règles, coûts, probabilités et progression inchangés ; sauvegarde v4 conservée. Aucun nouveau set, système majeur, notification push ou tracking. Version préparée localement, installation réelle Android/iOS à valider.

## Alpha 0.1.0 — 2 octobre 2026

Première alpha navigateur de TCG Clicker — Faerie.

- Portail évolutif, clics, combo, production passive et améliorations permanentes.
- 60 créatures originales, six raretés, 20 lignées, collection et deck avec synergies.
- Boosters de cinq cartes, ouverture tactile, effets de rareté et mode rapide déblocable.
- Recharge gratuite toutes les dix minutes, stockage et prix progressifs.
- Renforcement des cartes grâce aux doublons, exploration, 42 objectifs, récompenses et titres.
- Introduction, conseils, paramètres audio/animations, interface mobile et commandes clavier.
- Sauvegarde locale v4, migration des anciennes parties, export/import JSON, copies de secours, récupération et protection contre les onglets concurrents.
- Diagnostics copiables et écran de secours en cas d’erreur.

Aucun compte ni tracking. La publication publique attend la checklist Safari/iOS et les premiers retours humains. Cette entrée décrit le build préparé ; elle n’annonce pas un déploiement déjà effectué.
