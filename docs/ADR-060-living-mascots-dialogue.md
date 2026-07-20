# ADR-060 — Toto & Bobo vivants : dialogue contextuel (Exp-Max Lot 7)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 7.

## Contexte

Le système de mascottes (registre d'états `CHARACTER_STATES` avec intensité d'animation gérée par
`useReducedMotion`) était riche, mais les **répliques étaient figées** en dur au point d'appel
(« Bien joué ! », « Pas grave… »). Résultat : peu de vie, aucune variété, aucune réaction au
contexte (série, palier de résultat). Objectif : rendre Toto & Bobo **vivants** — dialogues
contextuels + réactions aux résultats — sans casser la réduction d'animation.

## Options

1. Multiplier des répliques en dur au fil des écrans (dispersé, répétitif).
2. Un **moteur de dialogue pur** qui choisit une réplique variée selon le contexte, câblé aux
   moments clés. *(retenu)*
3. Ajouter des animations lourdes (contraire à la réduction d'animation).

## Décision

Option 2.
- Module pur `src/characters/dialogue.ts` : `characterLine(ctx, seed)` → `{ character, state, text }`.
  Contextes : `answer`/`recognition` (correct + série), `result` (perfect/pass/retry), `mission`,
  `concept` (sens). Banques de 3–4 variantes ; la graine (index de question, score) fait varier la
  phrase de façon **déterministe** (testable). Toto encourage / hypothèse haussière ; Bobo rassure
  sur l'erreur / pointe le risque. Aucun ordre, aucune promesse.
- Câblage aux **réactions** : `session/[skillId].tsx` (feedback par question + réaction au résultat,
  avec un **compteur de série** qui déclenche l'état `streak`), `reconnaissance.tsx` (feedback du
  quiz visuel). Les états renvoyés (`streak`, `celebrate-big`, `celebrate-small`, `encourage`,
  `wrong`) activent les micro-animations « lively/subtle » **déjà gérées par la réduction
  d'animation** — plus de vie, aux bons moments.

## Conséquences

- Les mascottes réagissent au contexte avec des phrases variées : après 3 bonnes réponses, Toto
  passe en état `streak` (« Tu es dans le rythme, continue ! ») ; le résultat déclenche une réaction
  adaptée (perfect/pass/retry).
- Gate verte : lint · typecheck · **410 tests** (+6, `dialogue.test`) · validate:content 31 ·
  release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : répliques variées en session
  (« Exact, tu progresses ! »), série (« Tu es dans le rythme, continue ! ») après 3 bonnes réponses,
  **0 erreur console**.

## Rollback

Réversible : rebrancher les `CharacterScene` sur des répliques fixes et retirer `dialogue.ts`. Aucun
changement de schéma ni de persistance.
