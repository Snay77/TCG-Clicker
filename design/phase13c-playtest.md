# Phase 13C — Human Playtest Gate

**Statut : playtest humain non réalisé. Généralisation aux 60 cartes interdite.**

Cette grille remplace le protocole de playtest de la Phase 13B. Aucun résultat
humain n'est présumé ; les simulations ne remplacent pas ce test.

## Préparation

- Participant :
- Date :
- Appareil / navigateur / taille d'écran :
- A déjà joué au prototype : oui / non
- A déjà lu le rapport technique : oui / non (si oui, le noter comme limite du test)

Ouvrir le jeu local : http://127.0.0.1:3116 (serveur local nécessaire).
Utiliser un profil de navigateur temporaire sans vraie sauvegarde utilisateur.
Dans Paramètres, importer une sauvegarde depuis
`test-results/phase13b/playtest/`. Confirmer le remplacement uniquement dans ce
profil de test. Repartir de la sauvegarde initiale à chaque build : ne pas
transférer les achats ou la progression de la session précédente.

| Build | Sauvegarde |
| --- | --- |
| Clic | `clic.json` |
| Idle | `idle.json` |
| Critique | `critique.json` |
| Collection | `collection.json` |
| Mixte | `mixte.json` |

Les cinq sauvegardes ont les mêmes conditions de départ ; seul le Deck change.
Prévoir 25 à 50 minutes de jeu, plus le temps des réponses et imports.

## Protocole

1. Choisir et noter l'ordre des cinq builds.
2. Jouer **5 à 10 minutes par build**, sans lire le rapport technique avant le test.
3. Jouer naturellement, sans expliquer les effets au participant.
4. Changer de Deck uniquement si l'envie vient naturellement. Ne pas imposer
   d'ouverture du Deck, de booster, de reload ou de manipulation particulière.
5. Répondre aux questions après chaque session. Noter ce qui n'a pas été observé
   comme « non observé », sans le transformer en résultat positif ou négatif.

Ordre choisi :

## Réponses par build

Réponses libres, avec un exemple concret lorsque possible. « Je ne sais pas »
est une réponse utile. Pour les questions 5 à 8, ajouter éventuellement une note
de 1 à 5, sans remplacer le commentaire.

| Question | Clic | Idle | Critique | Collection | Mixte |
| --- | --- | --- | --- | --- | --- |
| Durée réelle (5–10 min) | | | | | |
| 1. Est-ce que je comprends ce qu'il cherche à faire ? | | | | | |
| 2. Est-ce que je ressens ses effets sans ouvrir le Deck ? | | | | | |
| 3. Quel effet est le plus satisfaisant ? | | | | | |
| 4. Quel effet semble inutile ou invisible ? | | | | | |
| 5. Le build semble-t-il puissant ? | | | | | |
| 6. Est-il amusant ? | | | | | |
| 7. Ai-je envie de rejouer ce build ? | | | | | |
| 8. Ai-je envie de tester un autre build ? | | | | | |
| Deck ouvert spontanément ? Quand / pourquoi ? | | | | | |
| Deck changé spontanément ? Quoi / pourquoi ? | | | | | |

## Questions spécifiques

| Build | Question | Réponse / exemple observé |
| --- | --- | --- |
| Clic | Le cycle des clics et charges est-il satisfaisant ? | |
| Idle | Le build semble-t-il utile même sans interaction constante ? | |
| Critique | Les critiques donnent-ils vraiment un moment excitant ? | |
| Collection | L'amélioration des boosters et doublons est-elle perceptible ? | |
| Mixte | Semble-t-il polyvalent ou juste moins spécialisé ? | |

## Zone EFFETS

Noter les observations spontanées avant toute explication. Si un état ne s'est
pas présenté durant la session, indiquer « non observé ».

| Point à évaluer | Clic | Idle | Critique | Collection | Mixte |
| --- | --- | --- | --- | --- | --- |
| Zone EFFETS lisible ? | | | | | |
| Limite de 3 lignes : suffisante, gêne ou information manquante ? | | | | | |
| Timers compris et faciles à suivre ? | | | | | |
| Charges et déclenchement compris ? | | | | | |
| Conditions comprises sans documentation ? | | | | | |
| Surcharge / distraction ressentie ? | | | | | |

## Décision après les cinq sessions

Choisir pour chaque critère : **validé / échoué / non évalué**. Une observation
absente ou ambiguë reste non évaluée. Appuyer chaque décision sur les réponses
du participant, sans utiliser les chiffres de simulation pour la remplacer.

| Critère obligatoire | Statut | Preuve / réponse humaine |
| --- | --- | --- |
| Au moins 3 builds paraissent réellement différents | Non évalué | |
| Aucun build ne semble objectivement obligatoire | Non évalué | |
| Les effets principaux sont compris sans documentation | Non évalué | |
| La zone EFFETS n'est pas jugée envahissante | Non évalué | |
| Collection a une utilité perceptible | Non évalué | |
| Plusieurs effets donnent envie de construire un Deck autour d'eux | Non évalué | |

- Trois builds ressentis comme différents et raisons :
- Effets donnant envie de construire un Deck et raisons :
- Points incompris ou invisibles :
- Limites du test / états non observés :
- Décision finale : **EN ATTENTE DU PLAYTEST HUMAIN**

La généralisation ne peut être autorisée que lorsque le playtest humain est
réalisé et que **tous les critères** sont validés. Un critère échoué ou non évalué
maintient le blocage. Cette phase ne modifie aucun code.
