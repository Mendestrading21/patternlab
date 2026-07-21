# ADR-067 — Session pas-à-pas : stepper, reprise & maîtrise réelle (Learning-Master Lot 3)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 3.

## Contexte

L'audit relève que la phase `learn` de `session/[skillId].tsx` rendait **tous les steps de la leçon
sur un seul écran défilant** (P0 « leçon non séquencée »), sans reprise après fermeture, avec un
résultat dont la 3ᵉ tuile affichait « 🔥 » (emoji sans valeur), et sans garantie de contre-exemple.
La checklist d'acceptation demande : un step par écran, reprise exacte, maîtrise distincte de l'XP,
contre-exemple obligatoire. *(La « fin du repli silencieux » de session, aussi listée au Lot 3, a été
livrée au Lot 0.)*

## Décision

- **`src/data/sessionFlow.ts`** (nouveau, pur) + test :
  - `buildLearnSteps(steps, counterExample?)` **garantit un contre-exemple** (`falseSignal`) : si la
    leçon n'en a pas, un est inséré juste avant le résumé, avec le premier faux signal du concept lié.
  - `SessionResume` + `sanitizeResume(raw, {skillId})` + `isResumable` : modèle de **reprise exacte**.
    `sanitizeResume` renvoie `null` si le `skillId` ne correspond pas → on ne reprend jamais une autre
    compétence.
- **`src/data/repositories.ts`** — `sessionResumeRepository` (clé `patternlab.session.v1`,
  load/save/clear ; best-effort, une reprise perdue ne bloque jamais la session).
- **`src/app/session/[skillId].tsx`** :
  - **Un step par écran** (phase Apprendre) : stepper avec **progression + « ◀ Retour » + un seul
    CTA** (« Suivant ▶ » puis « Commencer les exercices »). Les liens « Pour aller plus loin »
    n'apparaissent qu'au dernier step.
  - **Reprise exacte** : au 1ᵉʳ rendu, la position sauvegardée (phase, step, exercice, score) est
    restaurée ; **« Recommencer »** repart de zéro ; la reprise est effacée en fin de session.
  - **Résultat de maîtrise réelle** : la tuile « 🔥 » devient **statut de maîtrise**
    (Nouveau → Maîtrisé, via `masteryStatus`) + une ligne **« Prochaine révision : … »** (dérivée de
    `review.dueAt`). Pour un point de contrôle (pas de compétence unique), repli sur un libellé de
    palier (Excellent/Validé/À revoir).

## Conséquences

- La leçon est réellement séquencée : une idée par écran, retour possible, une seule action.
- Fermer puis rouvrir une session la **reprend exactement** où elle en était.
- Le résultat affiche une **maîtrise mesurée**, distincte de l'XP, et la prochaine échéance de
  révision — plus d'emoji décoratif.
- Chaque parcours d'apprentissage montre au moins un **contre-exemple**.
- Gate verte : lint · typecheck · **436 tests** (+8) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : stepper (étape 1/8 → 5/8, un seul step visible),
  contre-exemple rendu (skill.actions 10 steps, skill.trend 8 steps), **reprise** après rechargement
  (repris à l'étape 5/8) + « Recommencer », résultat avec tuile **Maîtrise** (mot, pas emoji) +
  « Prochaine révision ». Aucune publication sans accord.
