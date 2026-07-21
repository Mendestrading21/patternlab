# ADR-064 — Vérité du dépôt : compteurs générés & fin du repli silencieux (Learning-Master Lot 0)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 0 (« Vérité du dépôt »).

## Contexte

L'audit `patternlab-learning-master` (voir `references/01-audit-repository.md` et
`docs/PATTERNLAB_LEARNING_MASTER_PLAN.md`) relève deux dettes de « vérité » :

1. **Compteurs écrits à la main.** `PROJECT_STATUS.md` mélange l'état courant et un long journal
   historique, avec des sections dépassées (« un seul monde », « ~8 leçons / ~20 exercices »,
   « 9 formats sur 12 ») qui contredisent le code (58 concepts, 15 mondes, 15 leçons, 28 exercices,
   16 formats déclarés / 13 branchés). Les nombres dérivent au fil des lots.
2. **Repli silencieux de session.** `session/[skillId].tsx` retombait sur `skill.actions` pour tout
   id inconnu : l'utilisateur pouvait recevoir un autre contenu que celui demandé, sans le savoir.
   Contredit la règle « aucun repli silencieux » de la checklist d'acceptation.

## Options

1. Corriger les nombres dans la doc à la main (dérive garantie au lot suivant).
2. **Source unique dérivée du code + garde de cohérence + fin du repli silencieux** *(retenu)*.

## Décision

Option 2.

- **`src/data/repoTruth.ts`** — source unique : compteurs dérivés des registres réels
  (`V5_CONCEPTS`, `SKILLS`, `LESSONS`/`EXERCISES` via helpers, `GLOSSARY_TERMS`, `BADGES`, `WORLDS`,
  `CATEGORIES`, `SUPPORTED_VISUAL_TYPES`) et **réconciliation des formats** d'exercice
  (`ALL_EXERCISE_TYPES` déclarés vs `supportedTypes()` branchés → écart nommé :
  `drag_drop`, `draw_level`, `timed`). Helpers `repoTruth()`, `REPO_TRUTH`, `repoTruthLines()`.
- **`src/data/repoTruth.test.ts`** — contrôle de dérive : cohérence compteur↔registre, unicité des
  id/slug, réconciliation exacte des formats, intégrité (chaque compétence a leçon + exercices ;
  chaque `CONCEPT_BY_SKILL` résout), pins structurels (compétences 4, mondes 15, catégories 13,
  types de visuels 10 — un changement passe par un lot explicite).
- **Fin du repli silencieux** — `session/[skillId].tsx` : un id sans contenu réel affiche un état
  **« Session introuvable »** (message + CTA « Voir le parcours » + « Accueil ») et journalise
  `session_not_found` (nouvel évènement lifecycle, sans PII) au lieu d'enseigner un autre contenu.
  Un point de contrôle reste valide (ses exercices sont agrégés, donc non vides).
- **Documentation courante séparée de l'historique** — le journal chronologique complet part dans
  `docs/PROJECT_STATUS_ARCHIVE.md` (banni de contradiction : bandeau « états dépassés ») ; le nouveau
  `docs/PROJECT_STATUS.md` est compact et cite `repoTruth` ; `docs/REPO_TRUTH.md` publie l'instantané
  et la politique « ne jamais écrire un compteur à la main ».

## Conséquences

- La doc ne peut plus mentir sur les compteurs sans casser la CI ; la croissance de contenu met les
  chiffres à jour d'elle-même.
- Plus aucune session n'enseigne un contenu non demandé ; l'accès à un id inconnu est visible et
  journalisé.
- Le registre unique des **formats** est amorcé ici (lecture/réconciliation) ; sa **finalisation**
  (grader/renderer/statut, retrait ou implémentation de `drag_drop`/`draw_level`/`timed`) reste au
  **Lot 7**.
- Gate à ré-exécuter au lot ; aucune publication sans accord.
