# Phase 13B — Playtest humain des cinq builds

> Protocole historique : pour le prochain test humain, utiliser
> [la grille Phase 13C](phase13c-playtest.md), qui le remplace avec des sessions
> de 5 à 10 minutes et les critères de validation actuels.

Statut : **non réalisé — aucun testeur disponible pour le moment**.
Les simulations et tests automatiques ne valident ni le plaisir de jeu ni la
compréhension spontanée. La généralisation aux 60 cartes reste bloquée.

## Préparer une session

Utiliser `http://127.0.0.1:3116` dans un profil de navigateur temporaire, sans
vraie sauvegarde. Dans Paramètres, importer un des fichiers JSON préparés dans
`test-results/phase13b/playtest/`, puis confirmer le remplacement dans ce profil
de test seulement. Les cinq fichiers utilisent la même collection de 30 espèces,
les mêmes niveaux, améliorations, deux boosters gratuits et 500 énergies de
départ. Seul le Deck change.

- `clic.json`
- `idle.json`
- `critique.json`
- `collection.json`
- `mixte.json`

Faire tester les cinq builds à une personne découvrant cette version. Prévoir
trois minutes par build, dans un ordre choisi au hasard. Repartir du fichier
initial pour chaque session ; ne pas reporter les achats d'un build vers le suivant.
Le build Idle doit aussi être observé sans clic pendant une partie de sa session.

Avant de nommer ou expliquer un effet, observer si la personne le remarque.
Après ses premiers gestes, demander d'ouvrir au moins un booster, d'examiner le
Deck, de recharger la page et de retirer puis remettre un compagnon. Noter si
elle anticipe correctement ce qui est conservé ou perdu. Ne pas expliquer les
règles avant de noter la première interprétation.

## Observations pour chaque build

| Build | Plaisir /5 | Puissance perçue /5 | Clarté /5 | Effet remarqué spontanément | Envie de changer le Deck |
| --- | --- | --- | --- | --- | --- |
| Clic | | | | | |
| Idle | | | | | |
| Critique | | | | | |
| Collection | | | | | |
| Mixte | | | | | |

Noter les clics ou ouvertures approximatifs, les moments d'attente, les effets
ignorés et les changements de comportement. Le plaisir ne se déduit pas du score
énergétique. Une personne qui lit la règle après explication n'a pas démontré
une compréhension spontanée.

## Questions après les cinq sessions

1. Lequel semble le plus fun ? Pourquoi ?
2. Lequel semble le plus puissant ? Dans quel usage ?
3. Lequel semble le plus clair ?
4. Quels effets sont difficiles à comprendre ?
5. Quel build donne envie de changer de Deck ?
6. Le build Collection semble-t-il utile ? Qu'est-ce qui te le fait penser ?

## Validation complémentaire

- [ ] La durée et le bonus d'un effet temporaire sont identifiés sans aide.
- [ ] Le compteur de Luciolot et son prochain clic renforcé sont compris.
- [ ] La conservation de sa progression au reload est comprise.
- [ ] Le retrait efface uniquement les effets du compagnon retiré.
- [ ] Le build Collection a une utilité spontanément identifiée.
- [ ] Aucun build n'est préféré pour tous les usages sans contrepartie perçue.

## Compte rendu à compléter

- Date et appareil :
- Personne découvrant cette version : oui / non
- Ordre des cinq sessions et durée :
- Réponses exactes aux six questions :
- Observations spontanées, puis réponses après aide :
- Ambiguïtés ou frustration au reload / changement de Deck :
- Ajustements nécessaires :
- Validation humaine : à confirmer / refusée / validée avec motifs

Ne marquer la Phase 13B entièrement validée et ne généraliser qu'après collecte
de ce compte rendu et résolution des difficultés observées.
