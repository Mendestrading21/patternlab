# ADR-073 — Toto/Bobo V3 : MascotMoment & dialogues liés aux erreurs (Learning-Master Lot 9)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 9.

## Contexte

Le moteur de dialogue contextuel (`characterLine`, Exp-Max Lot 7) rendait déjà les mascottes vivantes
avec des répliques variées, mais sur une **erreur**, Bobo disait seulement « on apprend en se
trompant » — générique, sans lien avec la confusion précise. Le skill demande des **dialogues liés
aux erreurs conceptuelles** et une structure de **MascotMoment**.

## Décision

- **`src/data/mascotMoment.ts`** (pur, testé) — type `MascotMoment` (`character`, `state`, `text`,
  `role`, `misconceptionId?`) et `mistakeMoment(exerciseId)` : résout la **misconception** de
  l'exercice raté (via `misconceptionIdForExercise` du Lot 7) et renvoie un moment où **Bobo pointe
  l'idée fausse précise** (libellé + conseil de la misconception), plus un « réessaie » générique.
  Vocabulaire conforme (aucun ordre/promesse), garanti par test.
- **Session** — sur une réponse **correcte**, Toto garde sa réplique variée ; sur une **erreur**, la
  scène affiche le `mistakeMoment` (Bobo, état `false-signal`) ciblant la confusion. Connecte
  directement le Lot 7 (misconceptions) au Lot 9 (dialogue).

## Inventaire d'assets & réduction d'animation

- **Personnages** : Toto (taureau vert) / Bobo (ours rouge). Assets 3D transparents cohérents +
  avatars vectoriels, orchestrés par le registre d'états `CHARACTER_STATES` (expression, intensité
  still/subtle/lively) — source unique déjà en place.
- **MascotMoment** décrit l'intention (personnage, état, réplique, rôle). Les nuances d'animation
  (entrée / geste / pointage / sortie) se **réduisent à un rendu statique** sous
  `prefers-reduced-motion` et le réglage natif — le moment reste lisible et non bloquant. Aucune
  nouvelle dépendance ni corpus Lottie requis pour ce lot.

## Conséquences

- Une erreur devient un **enseignement ciblé** : Bobo nomme la confusion (couleur seule, tendance sur
  une bougie, niveau = certitude, prix vs valeur…) au lieu d'un encouragement vague.
- `MascotMoment` donne un **vocabulaire réutilisable** pour d'autres moments (célébration, mission) ;
  l'orchestration d'animation fine reste une extension future, sans dette (rendu statique honnête).
- Gate verte : lint · typecheck · **474 tests** (+4) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : après une réponse fausse, le panneau de
  correction s'affiche **et** une réplique de Bobo liée à la misconception apparaît. Aucune publication
  sans accord.
