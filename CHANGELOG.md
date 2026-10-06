# Changelog

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
