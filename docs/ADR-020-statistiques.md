# ADR-020 — Statistiques (historique d'activité + tableau de bord)

## Statut
Accepté (LOT 14 — Statistiques, skill `patternlab-product-growth`).

## Contexte
Le Profil affichait 4 chiffres bruts (niveau, XP, pièces, série) et la maîtrise d'une
seule compétence de démonstration. Aucune vue d'ensemble de la progression, aucune
répartition de maîtrise, aucune synthèse des erreurs récurrentes, et surtout **aucun
historique** : le registre du jour (schéma v4) était remis à zéro chaque jour et perdu.
Impossible de montrer l'évolution — cœur d'un écran « statistiques » utile.

## Décision
1. **Historique d'activité** (schéma **v5**) : `history: DailySnapshot[]` ajouté à
   `ProgressState`. Lors du basculement de jour (`rolled`, gamification), le registre
   écoulé **ayant une activité réelle** est archivé (dédupliqué par date, borné à
   `HISTORY_LIMIT = 60` jours). Migration non destructive : `history` par défaut `[]`,
   instantanés assainis (date non vide, nombres ≥ 0). Tests dédiés.
2. **Moteur pur et testé** `src/data/stats.ts` — `computeStats(state, skills, now,
   windowDays = 7)` agrège, **sans donnée inventée** :
   - **vue d'ensemble** (niveau, XP, XP dans le niveau, pièces, série, compétences
     terminées / totales) ;
   - **maîtrise par compétence** (mastery, confidence, statut via `masteryStatus`, XP,
     erreurs) + **répartition** des statuts (une compétence jamais commencée = `new`) ;
   - **erreurs récurrentes** : agrégation des `errorTags` de toutes les compétences,
     classées, rattachées au nom de la compétence ;
   - **série d'activité** des N derniers jours : fusion `history` + registre du jour
     (le jour courant, même vide, prime), avec `windowXp`, `activeDays`, `peakXp`.
3. **Écran** `/statistiques` : vue d'ensemble, **graphique d'activité 7 jours** (barres
   en Views pures — pas de dépendance, pas d'animation, chaque barre étiquetée pour les
   lecteurs d'écran, aujourd'hui mis en avant), maîtrise par compétence (barres + puces
   de statut), erreurs à retravailler → bouton **Réviser** vers `/revisions` (sinon état
   vide positif). Accessible depuis le Profil (« Voir le détail 📊 »).
4. **Analytics** : `stats_viewed` à l'ouverture de l'écran.

## Conséquences
- Progression réellement lisible et honnête (maîtrise, régularité, points faibles), au
  service de l'apprentissage — jamais un tableau décoratif ni une donnée extrapolée.
- L'historique se remplit passivement (au fil des jours) sans écriture supplémentaire :
  l'archivage se greffe sur le basculement de jour déjà existant.
- Base extensible : fenêtre configurable (`windowDays`), historique borné à 60 jours ;
  un futur graphique 30 jours ou par compétence ne demande que de la présentation.

## Rollback
Retirer l'écran `/statistiques` et le lien Profil (le moteur devient inerte) ; le champ
v5 `history` et l'archivage dans `rolled` sont additifs et sans effet sur le reste du
runtime (quêtes, série, maîtrise inchangées). Aucune progression existante n'est perdue.
