# ADR-015 — Maîtrise adaptative (statuts, errorTags, migration v3)

## Statut
Accepté (LOT 9 — Maîtrise adaptative, skill `patternlab-product-growth`).

## Contexte
La progression suivait `mastery` et `confidence`, mais n'exposait pas de **statut de
maîtrise** lisible, ne mémorisait pas les **erreurs récurrentes**, et n'orientait pas
l'utilisateur vers ce qu'il doit retravailler. Le skill demande : statuts
new→mastered, `confidence`, `errorTags`, et — pour toute évolution de progression —
`schemaVersion`, migration et tests.

## Décision
1. **Statut de maîtrise** pur `masteryStatus(progress)` : échelle
   `new → learning → fragile → reviewing → strong → mastered`, dérivée de `mastery`,
   `confidence` et des rappels (`fragile` = maîtrise moyenne mais confiance faible).
   Ne dépend pas d'une seule réponse (règle kit). Testé.
2. **errorTags** : `SkillProgress.errorTags` (tag → nombre d'échecs). Sur une mauvaise
   réponse, la session enregistre l'id de l'exercice comme tag (`recordAnswer(..., tag)`).
   `errorCount` agrège les erreurs. La **révision est déjà rapprochée** par le moteur
   (SM-2 : échec → `dueAt = now`) ; les errorTags rendent les concepts à retravailler
   **visibles** et orientent la sélection (adaptation au niveau du parcours de révision).
3. **Migration v3** : `PROGRESS_SCHEMA_VERSION = 3`. `migrateProgress` complète
   `errorTags = {}` sur les anciens états (v2 → v3, **sans perte**) et assainit les
   entrées (seuls les entiers positifs sont conservés). Testé.
4. **Surfaçage** : chip de statut + « X erreurs à retravailler » dans **Révisions**
   (vue d'ensemble) ; chip de statut dans **Profil**.

## Conséquences
- L'utilisateur voit où il en est (statut) et ce qu'il doit consolider (erreurs).
- Les données de progression restent compatibles (migration additive, non destructive).
- Base pour une adaptation plus fine (re-séquencement intra-session) dans un lot ultérieur.

## Rollback
`masteryStatus`/`errorTags`/`errorCount` sont additifs ; l'écran retomberait sur
l'affichage `mastery %`. La migration v3 ne supprime rien (les errorTags absents → {}).
