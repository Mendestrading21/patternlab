# ADR-071 — Exercices adaptatifs : registre unique, formats nettoyés & misconceptions (Learning-Master Lot 7)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 7.

## Contexte

Audit P1 : le moteur d'exercices était **incohérent** — 16 formats déclarés (`ALL_EXERCISE_TYPES`)
pour 13 branchés (un grader), dont trois orphelins (`drag_drop`, `draw_level`, `timed`) déclarés sans
grader ni renderer. Par ailleurs, les erreurs étaient identifiées par **id d'exercice brut**, pas par
la compréhension à retravailler.

## Décision

- **Retrait des orphelins** — `drag_drop`, `draw_level`, `timed` supprimés de l'union `ExerciseType`
  et de `ALL_EXERCISE_TYPES`. **Déclarés === branchés === 13**, plus d'incohérence. *(Les chaînes
  `draw_level` de `interactiveTemplates` des concepts sont du texte libre, non l'union — intactes ; le
  schéma JSON de contenu reste un sur-ensemble permissif.)*
- **`src/engines/exercise/formatRegistry.ts`** (pur, testé) — `EXERCISE_FORMAT_REGISTRY` : source
  unique décrivant chaque format (libellé, interactif, alternative accessible, statut `live`). Le type
  `Record<ExerciseType, …>` **garantit l'exhaustivité à la compilation**. La session dérive ses
  libellés via `exerciseFormatLabel` (fin de la table écrite à la main). `repoTruth` / `REPO_TRUTH.md`
  reflètent 13/13.
- **`src/data/misconceptions.ts`** (pur, testé) — catalogue de **misconceptions** typées (couleur
  seule, tendance sur une bougie, niveau = certitude, figure anticipée, indicateur = signal, prix vs
  valeur…), un rattachement exercice→misconception (override précis + défaut par compétence), et
  `summarizeMisconceptions(errorTags)` qui agrège les erreurs en misconceptions triées.
- **Réviser** — nouvelle carte **« 🎯 Tes points faibles »** : les idées fausses les plus fréquentes,
  chacune avec un conseil, au lieu d'ids d'exercice opaques.

## Conséquences

- Le moteur d'exercices a **une seule vérité** : union = graders = registre = 13, vérifié par test
  (dérive impossible sans casser la CI).
- Les erreurs deviennent **actionnables** : la révision cible une compréhension nommée, pas un id.
- La **réinsertion adaptative** de base existait déjà (erreur → `errorTag` → révision rapprochée) ;
  ce lot la rend lisible côté apprenant. Un deck d'erreurs par misconception pourra s'appuyer sur
  `summarizeMisconceptions`.
- Gate verte : lint · typecheck · **461 tests** (+9) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : libellé de format en session (registre), et la
  carte « Tes points faibles » apparaît dans Réviser après une réponse fausse. Aucune publication sans
  accord.
