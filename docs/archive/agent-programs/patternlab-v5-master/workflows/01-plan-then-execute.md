# Workflow 01 — Audit, plan complet puis exécution

## A. Audit

1. Vérifier Git, branche, statut et derniers commits.
2. Lire les documents structurants.
3. Exécuter les validations disponibles.
4. Cartographier routes, données, moteurs, contenu, composants et assets.
5. Comparer documentation et code.
6. Identifier bugs, incohérences, dettes et quick wins.
7. Inventorier concepts, visuels et formats d’exercice.

## B. Plan

Créer `docs/PATTERNLAB_V5_MASTER_PLAN.md` avec :

1. résumé exécutif ;
2. état réel ;
3. architecture cible ;
4. écrans ;
5. modèle de contenu ;
6. moteur visuel ;
7. moteur chart ;
8. taxonomie ;
9. migration APP ;
10. lots ordonnés ;
11. fichiers exacts ;
12. tests ;
13. accessibilité ;
14. analytics ;
15. risques ;
16. rollback ;
17. décisions bloquantes.

Pour chaque lot : objectif utilisateur, problème, comportement, fichiers, données, composants, tests, analytics, accessibilité, critères, risques et rollback.

## C. Exécution automatique

Sauf `PLAN_ONLY` : afficher le résumé, commencer Lot 0, terminer/tester/documenter/committer, puis continuer au lot suivant lorsque possible.

## D. Arrêt propre

Ne pas laisser de migration partielle. Revenir à un état compilable et écrire `docs/PATTERNLAB_V5_CONTINUATION.md` avec branche, commit, tests et prochaine commande.
