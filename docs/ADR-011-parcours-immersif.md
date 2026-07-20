# ADR-011 — Parcours immersif (monde, carte, checkpoint)

## Statut
Accepté (LOT 5 — Parcours immersif, skill `patternlab-product-growth`).

## Contexte
Le parcours V1 était une simple liste verticale de compétences (done/current/locked).
Le skill demande un parcours **immersif** : mondes, carte à nœuds, **checkpoints** et
révisions intégrées, conforme à la hiérarchie `World > Module > Skill`.

## Décision
1. **Carte pure et testable** `buildWorldMap(state, skills, moduleTitle, now)` →
   nœuds ordonnés (compétences + un **checkpoint** de fin de module) avec statut
   `done` / `current` / `due` / `locked`. Une compétence terminée **due** (révision
   échue) est distinguée sur la carte. Le checkpoint est verrouillé tant que les 4
   compétences ne sont pas terminées.
2. **Checkpoint = revue mixte du module.** Contenu : `getExercises('checkpoint.read-chart')`
   agrège quelques exercices de chaque compétence — qui **conservent leur skillId réel**,
   donc y répondre met à jour la maîtrise/révision réelle. `skillById` renvoie un titre
   dédié. Le lecteur de session **n'est pas modifié** (il résout par id).
   `checkpoint_completed` est émis à la fin d'une session checkpoint.
3. **UI immersive** (`parcours.tsx`) : en-tête de monde, mascotte, barre de progression,
   puis un **trail** (colonne « rail » avec badges reliés par un connecteur vertical +
   cartes-libellés). Statuts colorés (terminé / à réviser / courant / verrouillé),
   révisions dues surlignées, checkpoint distinct. Nœuds accessibles (rôle bouton,
   état désactivé, hints) ; états loading gérés.

## Conséquences
- Progression lisible comme une carte ; les révisions apparaissent dans le parcours.
- Le checkpoint réutilise l'infrastructure de session sans duplication.
- Tests : `buildWorldMap` (statuts + gating checkpoint).

## Rollback
Restaurer la liste simple ; `worldMap` et le contenu checkpoint sont additifs et
sans effet de bord (le checkpoint est un id de contenu distinct des compétences).
