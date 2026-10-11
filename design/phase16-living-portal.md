# Phase 16 — La Porte vivante

## A — Audit et choix artistique

La Machine existante possède une silhouette de porte, de la végétation et des
paliers 1/5/10/20/35/50 intéressants. Son petit intérieur en dégradé, son rendu
uniformément pixelisé et la secousse de tout le SVG limitent la profondeur. Les
particules extérieures n'ont pas de destination. Game mélange aussi rendu,
réactions et règles de clic. Les boutons doivent rester hors de la surface.

Deux compositions étudiées : observatoire horizontal (grand astrolabe rond,
instrumentation latérale) et porte suspendue (arc de pierre, lentilles obliques,
passage vertical vers Faerie). La seconde conserve le passage existant et laisse
un objet grand et lisible sur téléphone. Le cercle seul n'est pas sa silhouette.

Construction retenue : SVG natif, pierre sombre taillée, bronze patiné à facettes,
incrustations ivoire, lentilles indépendantes, forêt intérieure en perspective,
racines et filaments dirigés vers le passage. Pas d'asset externe, d'image IA ou
de moteur WebGL. SVG garantit un rendu net, inspectable et léger sans boucle de
redessin JS. La lumière est localisée aux joints et au passage, pas au cadre UI.

## B — Prototype et passes de finition

Passes réalisées : silhouette/matières/profondeur puis captures des quatre tailles ;
facettes de pierre, rivière éclairée, circuit de résonance et hauteur périphérique ;
compression, ondes/critique/charge, cadence compacte et en-têtes réduits.
Les mécanismes C/D ont été ajoutés après la première observation dans le navigateur.
Le portail SVG est mémorisé : les
compteurs ne le recréent pas, les animations n'utilisent pas de state par frame.
Les réactions de clic restent locales à la surface et sont bornées/nettoyées.

## C — Règles finales

Surcharge à partir de Machine 5 et 75 clics. 100 points conservés, +1 par geste
validé, activation volontaire 8 secondes. Bonus +35 % du clic ordinaire AVANT
critique/charge : les anciens multiplicateurs restent intacts mais ne multiplient
pas le nouveau bonus. Maximum du supplément +50 % de ce clic ordinaire.
Passif, XP par geste et coûts Phase 15 inchangés. Pas de charge pendant surcharge.

Une fissure stable à Machine 5 et 75 clics, après 80 interactions éligibles et
60 secondes visibles sur Machine. Stabiliser donne 15 points (aucun éclat direct).
Elle n'expire pas : consulter Deck, ouvrir un booster ou quitter l'onglet la
met simplement en attente. La fissure et son avancement persistent, son
encaissement est atomique. Une seule, pas de chaîne, rien perdu en l'ignorant.

Trois cartes existantes seulement, interactions distinctes sans changer leur
effet avancé : Luciolot (impulsion chargée → +4 charge), Flamèche (critique → +1
charge), Songegarde (critique prépare 4 s de fenêtre, surcharge lancée pendant
cette fenêtre → supplément 50 % au lieu de 35 %). La fenêtre est perdue au
reload/retrait. Les cartes ne donnent plus de charge pendant la surcharge.

## Persistance et séparation

Champ optionnel `portal` en sauvegarde v4, normalisé, anciennes sauvegardes
acceptées. Charge et progression de fissure durables ; buffs, fenêtre Songegarde
et réactions non persistés. Activation débite la charge immédiatement ; reload
ne restaure pas une surcharge. Aucune énergie hors ligne ajoutée. Les règles
pures sont dans living-portal, le runtime dans un hook séparé, le rendu dans
LivingPortal/PortalSurface, la périphérie dans PortalControls.

## D — Intégration et limites économiques

- Un geste éligible ajoute 1 point, au moins 60 ms entre deux gains de charge.
  Les clics normaux restent disponibles sans ce filtre économique supplémentaire.
- Luciolot conserve 25 clics → prochain ×3. Consommer la charge ajoute 4 points,
  soit 5 avec le geste. Flamèche conserve critique → +15 % clic 4 s et ajoute
  1 point par critique. Songegarde conserve critique → +10 % clic 4 s et prépare
  une surcharge à 50 % pendant 4 s. Identifiants : F01-025 / F01-039 / F01-018.
- Aucun point pendant la surcharge, y compris les accords. Capacité 100 sans
  débordement. Un surplus de fissure est perdu à cette capacité.
- Critique × charge × combo fonctionne comme avant. Le nouveau supplément seul
  est additif : gain ancien + clic ordinaire × 0,35 (ou 0,50).
- Le clic ordinaire inclut combo/buffs valides, sans multiplication critique ou
  charge. Supplément plafonné à 50 % de ce clic. Passif/XP par geste inchangés.
- Fissure différée pendant surcharge/booster, utilisable au retour sans expiration.
  Après stabilisation, ses compteurs repartent de zéro : au moins 80 nouveaux
  gestes ET 60 secondes visibles sur Machine. Pas de passif converti en charge.
- Déblocage à Machine 5 pour éviter une fissure donnant des points inutilisables.
  Une jauge d'abord ; la fissure arrive ensuite par l'activité. Le playtest
  précédent atteignait Machine 10 à 30 min.
- Charge/gestes/temps visible conservés en navigation/reload ; temporaires avec
  échéances réelles, expirant aussi dans le Deck/booster, perdus au reload.
  Retirer Songegarde efface la préparation sans retirer la charge globale gagnée.
  Une surcharge payée garde son bonus fixé à l'activation malgré un changement
  de Deck. Remettre une carte ne restaure pas son ancienne préparation.

## E — Architecture et vérification

Parcours : geste → transition pure playClick/living-portal → Save/PortalRuntime
→ feedback local/contrôles → écriture v4 → reload. Pas d'API/service ajouté.

- `lib/living-portal.ts` : règles, capacités, transitions et normalisation.
- `lib/play-effects.ts` : gain/preview partagent la formule et les anciens effets ;
  runtime optionnel pour les anciens consommateurs.
- `useLivingPortal` : horloge monotone, visibilité, mouvement système et retrait.
- `LivingPortal` : SVG mémorisé, aucun compteur par frame ; paliers 1/5/10/20/35/50
  avec végétation, runes, orbite et cœur de Faerie.
- `PortalSurface` : pointerdown immédiat, gain au click/clavier, deux animations
  Web Animations annulées/remplacées, huit nombres max, six poussières dirigées.
  Nettoyage à la sortie, suspension des animations hors viewport/onglet caché.
- `PortalControls` : boutons frères, aucune navigation/fissure/activation dans
  la surface. Son/mute/volume conservés, timbres Web Audio synthétiques et
  oscillateurs déconnectés après leur son.
- Écriture immédiate des activations/encaissements ; autres charges à la cadence
  de sauvegarde habituelle et flush à la fermeture/masquage. Aucun buff sérialisé.

174 tests, typecheck et build passent. Nouveaux tests : charge/activation,
8 s/expiration, plafonds, critique/charge/combo, identité des trois cartes,
retrait, double encaissement, normalisation, ancienne v4, reload et géométrie.
Edge en production locale : 1440×1000, 360×800, 390×844, 430×932,
souris/tactile émulé/clavier, surface non recouverte, gains uniques, navigation,
reload et mouvement réduit. Burst de 90 clics : huit nombres max et même SVG.

Captures et démonstration : `test-results/phase16/index.html` (ignoré par Git).
Aucun vrai profil/sauvegarde de joueur utilisé. Aucun playtest humain,
commit, push ou déploiement.

## Pistes écartées et limites

WebGL, textures externes et centaines de particules : poids/risques mobile sans
bénéfice suffisant. Dix anomalies/interactions par famille : complexité prématurée.
Expiration punitive : écartée pour permettre de consulter ses cartes sereinement.
Surcharge multiplicative : écartée pour protéger critiques/charges et Phase 15.

Plaisir, son ressenti et confort tactile physique restent à valider séparément.
Pas de Safari/téléphone physique. Le stress headless n'est pas un benchmark mobile.
Les 64 paires simulées ne garantissent ni comportement humain ni économie au-delà
de 30 min. Les effets avancés restent limités à 12 cartes.


## Comparaisons économiques — 64 paires, 5/10/20/30 min

16 graines par comportement, avant = Phase 15 avec les mêmes règles de choix et
les mêmes tirages ; après = ces règles plus les interactions de portail.
Idle : 90 clics initiaux, puis aucune activation. Occasionnel : courtes salves
et un booster toutes les 150 s. Régulier : 2 clics/s pendant 35 s/min.
Synchronisé : même activité, mais activation différée pour une charge, une
préparation Songegarde ou le prochain rendez-vous de 30 s. Ce dernier modèle
n'est pas un optimiseur parfait : attendre diminue parfois le revenu.

Passif continu, ouvertures simulées de 20 s puis 5 s, décisions sur les cartes
connues, achats toutes les 40 s, objectifs réclamés toutes les 20 s. Le joueur
se consacre à la Machine hors ouvertures : le temps passé à lire ailleurs
n'est pas reproduit ; la préparation peut donc être plus rare en pratique.

Revenus bruts incluent tous les clics, passif, objectifs, lignées et doublons.
Le nouveau bonus est inclus dans le clic, sans double comptage. Les soldes
reflètent les achats effectivement possibles, qui peuvent se décaler.

| Comportement | Minute | Revenus avant → après | Variation | Solde avant → après | Packs avant → après | Attente booster avant → après (s cumulées) |
|---|---:|---:|---:|---:|---:|---:|
| Idle | 5 | 1 820 → 1 820 | 0,00 % | 957 → 957 | 2,0 → 2,0 | 18 → 18 |
| Idle | 10 | 6 783 → 6 783 | 0,00 % | 3 002 → 3 002 | 3,0 → 3,0 | 18 → 18 |
| Idle | 20 | 22 205 → 22 205 | 0,00 % | 11 766 → 11 766 | 7,0 → 7,0 | 18 → 18 |
| Idle | 30 | 44 459 → 44 459 | 0,00 % | 18 570 → 18 570 | 10,0 → 10,0 | 18 → 18 |
| Occasionnel | 5 | 2 077 → 2 077 | 0,00 % | 1 214 → 1 214 | 2,0 → 2,0 | 12 → 12 |
| Occasionnel | 10 | 7 162 → 7 162 | 0,00 % | 4 895 → 4 895 | 4,0 → 4,0 | 12 → 12 |
| Occasionnel | 20 | 25 180 → 25 192 | 0,05 % | 4 122 → 4 134 | 8,0 → 8,0 | 12 → 12 |
| Occasionnel | 30 | 52 087 → 52 139 | 0,10 % | 25 814 → 25 866 | 12,0 → 12,0 | 12 → 12 |
| Régulier | 5 | 3 204 → 3 204 | 0,00 % | 2 119 → 2 119 | 6,0 → 6,0 | 0 → 0 |
| Régulier | 10 | 14 873 → 14 966 | 0,62 % | 11 032 → 11 125 | 13,0 → 13,0 | 0 → 0 |
| Régulier | 20 | 56 621 → 57 251 | 1,11 % | 22 526 → 21 342 | 28,0 → 28,0 | 0 → 0 |
| Régulier | 30 | 116 611 → 118 390 | 1,53 % | 6 511 → 5 946 | 42,6 → 42,6 | 29 → 27 |
| Synchronisé | 5 | 3 204 → 3 204 | 0,00 % | 2 119 → 2 119 | 6,0 → 6,0 | 0 → 0 |
| Synchronisé | 10 | 14 873 → 14 926 | 0,36 % | 11 032 → 11 085 | 13,0 → 13,0 | 0 → 0 |
| Synchronisé | 20 | 56 621 → 56 886 | 0,47 % | 22 526 → 22 791 | 28,0 → 28,0 | 0 → 0 |
| Synchronisé | 30 | 116 611 → 117 548 | 0,80 % | 6 511 → 5 987 | 42,6 → 42,6 | 29 → 25 |

À 30 min, Idle est inchangé, Occasionnel +0,10 %, Régulier +1,53 %,
Synchronisé +0,80 %. Aucun nouveau coût général ni réduction du passif.
Les objectifs d'épargne restent : acheter les slots et les boosters Phase 15.
Ces écarts mesurent les politiques simulées, pas des résultats humains.

Sources reproductibles : `scripts/simulate-phase16.ts` et rapport brut ignoré
`test-results/phase16/economy.json`. Captures : 22 ; vidéo :
`test-results/phase16/portal-motion.webm`. La galerie affiche les états stable,
résonance, normal, critique, charge, surcharge et mouvement réduit.
