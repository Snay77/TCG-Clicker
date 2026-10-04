# Phase 11B — Arcane Brutalism, prototype

État courant : **Phase 11E — propagation complète**. La base 11D est appliquée à toutes les vues principales, à l’introduction et aux dialogues. Les sections 11B–11D ci-dessous documentent les étapes précédentes et leurs limites de périmètre historiques.

4 octobre 2026. Trois écrans uniquement : Machine, Collection et Deck, desktop et mobile. La direction C est validée par le propriétaire ; le raffinement 11C reste limité à ces trois écrans avant propagation ou publication. Les directions A (Alpha 0.2.0) et B (Faerie Field Journal) restent dans les galeries locales précédentes.

## Langage

Fond noir neutre, ivoire, gris, traits droits, numéros et données tabulaires. Pas de nouvelle police ni d’asset externe. Les sprites, habitats, cartes, portail et ouverture sont conservés. Les accents de type apparaissent sur de petits marqueurs, jamais sur un grand panneau.

`app/arcane-brutalism.css` définit les tokens locaux : `--ab-bg` #0b0e0f, `--ab-surface` #131718, `--ab-surface-2` #1a1f20, `--ab-ink` #f1efe7, `--ab-muted` #adb3b0 et `--ab-line` #424947. Le gris secondaire est plus clair que l’exemple du brief pour garder le texte lisible.

Types : Sylve #9ddb72, Lune #b49bff, Rosée #6fcbe8, Étincelle #ff9a62, Aurore #f3d76b, Astral #dd76ff, Mycète #d78ebc. Les couleurs ne remplacent pas les noms, les compteurs ou les libellés d’état.

## Composition

- Navigation numérotée 01–05 ; Boosters reste en deuxième position, toutes les routes et disponibilités sont conservées.
- Machine : titres courts, compteur visible, scène dominante, combo monochrome et commandes industrielles. Hauteurs Phase 10 et safe areas conservées.
- Collection : archive avec numéro et identité au-dessus de chaque carte ; identité inconnue non révélée avant découverte. Filtres natifs et panneau mobile conservés, deux colonnes mobile.
- Deck : six à huit emplacements numérotés, sprites et accents de type ; grille 2 colonnes mobile, comparaisons et remplacement existants.

Le thème s’active uniquement sur les trois onglets ciblés. Il est retiré pendant l’ouverture, l’introduction et les Paramètres. Voyage conserve 11A ; la page Boosters conserve 0.2.0. Les styles ne modifient pas les composants graphiques des cartes ou des créatures. Aucun changement du moteur, de l’économie ou des sauvegardes.

## Livrables locaux

`test-results/arcane-brutalism/` est ignoré par Git : six captures 1440 × 1000 / 390 × 844, `arcane-brutalism-overview.png`, `index.html` pour comparer A/B/C. Les comptes avancés sont les mêmes fixtures que l’audit ; aucun profil ou sauvegarde réel utilisé. Le montage assemble les six captures réelles.

## Vérifications et limites

103 tests, TypeScript et build réussis. Vérification des six vues sans débordement et de la Machine sans scroll ; contrôle des écrans protégés et absence d’erreur JavaScript. Parcours responsive/PWA et boosters rejoués sur Chrome/Edge : filtres, inspection, remplacement, panneaux/focus, ouvertures gratuites/payantes, favoris, export et relance offline. Formats mobiles Phase 10 conservés. Pas de nouvelle animation continue ni de nouvelle écriture de sauvegarde.

Prototype local, non commité et non publié. Safari et les téléphones réels ne sont pas validés dans cette passe. Le brief 11C exclut encore Voyage, les paramètres, les boosters et l’introduction.

## Phase 11C — Raffinement de la direction validée

La structure noire / ivoire est conservée. Une bande de repères associe symboles de portail, secteur Faerie et index de registre ou nombre de liens actifs. Les libellés décrivent le monde et les données déjà disponibles, sans créer de mécanique.

- Machine : état de signal (veille, charge active, résonance) dérivé du combo existant ; énergie ambre, charge lunaire et divisions de palier. Repères dans la marge haute de la scène, sans toucher à l’illustration ni au clic.
- Collection : numéro coloré et symbole de type avec index SET 01 au-dessus de chaque carte ; traits de classement, recherche et filtres sur lignes. Les cartes inconnues restent anonymes.
- Deck : repères LIEN / 01–08, accents des sept types, sprites affichés plus grands sans modification des assets. Retirer garde une cible de 44 px et devient un lien discret avec accent au survol. Les synergies montrent les liens remplis d’après les compteurs existants.
- Trois traitements de titres : instrument massif, archive plus espacée, équipe plus grande. Boutons primaires ivoire, secondaires bordés, retrait discret ; inversion au survol. Aucun nouveau mouvement continu.

Six captures finales dans `test-results/arcane-brutalism-refinement/`, montage `arcane-brutalism-overview.png` et comparaison 11B / 11C `index.html`. Les captures 11B et les galeries A / B / C précédentes sont conservées. Viewports 1440 × 1000 et 390 × 844, fixtures avancées isolées.

Validation : 103 tests, typecheck et build réussis ; six captures sans débordement horizontal ni erreur JavaScript, Machine mobile sans scroll. Parcours Chrome / Edge existants rejoués (filtres, inspection, remplacement, upgrades, focus, boosters, paramètres, export, PWA et reprise offline). Les écrans exclus désactivent toujours le thème. Aucun changement des fonctions de jeu, du format de sauvegarde ou des données de cartes. Safari et appareils physiques non vérifiés.

## Phase 11D — Rythme, hiérarchie et états vides

Échelle d’espacement locale : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px via les tokens `--ab-space-*`. Les espacements de la passe 11D suivent cette échelle.

Les slots du Deck suivent une grille verticale commune : index, sprite, nom, type/niveau, effet. L’action secondaire Retirer est séparée par une ligne et au moins 16 px ; ses baselines sont alignées par rangée. Grille 3 colonnes desktop et 2 mobile conservée. Les effets auparavant masqués par le CSS mobile sont visibles, les compagnons disposent de davantage de hauteur et d’espace entre rangées. Les emplacements vides gardent leurs indices et un signe + centré.

La Collection dispose de labels verticaux alignés, d’un espace de 24 px avant les cartes et de 32 px entre rangées. Sur desktop, recherche et filtres forment une ligne compacte de contrôles natifs accessibles. À 0/60, une note de registre explique les silhouettes anonymes ; aucune identité ni couleur de type n’est révélée. Les composants Card et Sprite ne sont pas modifiés.

Premiers pas utilise un fond neutre, une bordure fine et un accent lunaire discret, uniquement dans les trois vues ciblées et la sheet de conseils. Le fonctionnement du tutoriel et les étapes sont conservés. Un défaut hérité de la notification mobile a été corrigé pour le message de Deck vide : il reste désormais dans le flux de la page.

Livrables : `test-results/arcane-brutalism-polish/`, dix captures (six vues avancées et quatre vues Collection/Deck vides), `index.html` et montage `arcane-brutalism-11c-11d-overview.png`. Les captures précédentes restent intactes. Les états vides sont vérifiés sans récompense prête ni booster gratuit ; le tutoriel est contrôlé avant de passer les conseils pour les captures vides.

Validation : 103 tests, typecheck et build réussis ; dix vues sans overflow ni erreur JavaScript. Vérification des baselines d’action, de la présence des effets et de leur séparation ; tutoriel neutre ; Machine mobile sans scroll. Parcours Chrome/Edge responsive et PWA rejoués, incluant filtres, inspection, remplacement, focus, boosters et sauvegarde offline. La scène Machine, les safe areas, la bottomnav et les sheets sont préservées. Aucun moteur, règle, économie ou format de sauvegarde modifié. Prototype local, sans push ni propagation aux autres écrans.

## Phase 11E — Propagation complète

Le thème est désormais actif sur tous les onglets, y compris pendant Introduction et Paramètres. Il est retiré uniquement pendant l’ouverture des boosters pour conserver intégralement cette séquence et ses assets. `app/arcane-full-ui.css` étend le langage 11D en réutilisant ses couleurs et sa gamme d’espacements ; aucune nouvelle palette ni dépendance.

- Progression : niveau monumental, XP tabulaire, chemin en traits droits, catégories neutres, objectifs en entrées de registre avec état textuel et récompense à droite sur desktop ; statistiques en lignes. Les valeurs, objectifs, seuils, achats et récompenses restent inchangés.
- Boosters : catalogue, sélection, stock, prix et favoris cadrés par des règles et des commandes rectangulaires. Le pack art et toutes les étapes d’ouverture sont conservés.
- Paramètres : séparateurs, champs et actions sobres ; réinitialisation avec accent destructif discret, annulation secondaire. PWA, export/import et diagnostics gardent leurs callbacks existants.
- Introduction : marque TCG CLICKER / 01, micro-labels communs, espace autour du portail existant et CTA contrasté.
- Tutoriel, inspection, feedback, modales et sheets : même surface neutre, titres et fermeture rectangulaires. Focus, retour au déclencheur, swipe, safe areas et cibles tactiles sont conservés.
- Écrans de chargement/récupération de sauvegarde : même base neutre ; aucune logique de récupération modifiée.

Composants partagés : `UIAction` fournit primary / secondary / destructive au-dessus d’un bouton natif ; `ArcaneMark` centralise les micro-symboles et l’index de secteur/set. `Modal` et `BottomSheet` gardent leur infrastructure existante et utilisent le cadrage commun. Les composants Card, Sprite, Machine, BoosterPack et BoosterOpening ne sont pas modifiés.

Galerie locale ignorée par Git : `test-results/arcane-full-ui/index.html`, 40 captures, `arcane-full-ui-overview.png` et manifest. Desktop 1440 × 1000 et mobile 390 × 844 ; pages longues Niveau/Objectifs, détails d’archive, stock, Paramètres/sauvegarde, Introduction, Premiers pas, inspection, quatre sheets et feedback de récompense. Fixtures avancées et nouvelles parties isolées ; aucune sauvegarde utilisateur réelle.

Validation : 103 tests, typecheck et build réussis. Captures sans overflow horizontal dans la page ni dans les dialogues, aucune erreur JavaScript. Vérifications Chrome/Edge : clics, améliorations, focus et restauration, filtres, inspection, remplacement, ouverture gratuite/payante, favoris persistants, export, manifest/icônes, /dev 404, service worker et relance offline avec sauvegarde conservée. Machine mobile sans scroll inutile sur les formats Phase 10. Pas de modification de moteur, économie, probabilités, timers ou format de sauvegarde.

Toutes les vues demandées sont migrées. La séquence d’ouverture des boosters conserve volontairement sa mise en scène. Safari et appareils physiques non vérifiés. Travail local, sans push ni déploiement demandé pour cette phase.
