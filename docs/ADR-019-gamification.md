# ADR-019 — Gamification (quêtes du jour, jalons de série, réussites)

## Statut
Accepté (LOT 13 — Gamification, skill `patternlab-product-growth`).

## Contexte
La progression comptait déjà XP, niveau, pièces, série et 8 badges dérivés. Mais les
« Défis du jour » de l'accueil étaient **codés en dur dans le composant**, sans
récompense, sans test, et mesuraient des totaux à vie (« 50 XP au total », « débloque
une compétence ») tout en s'affichant « du jour » — trompeur. Les badges n'annonçaient
jamais leur obtention. Aucun jalon de série, aucun événement analytics de gamification.

Le skill demande une gamification **motivante et honnête** (prochaine action claire,
série, quêtes) et **refuse** les vies punitives, le casino visuel, la fausse urgence et
les classements par profits. La séparation XP = activité / coins = récompenses internes /
streak = régularité doit être préservée ; la maîtrise ne doit jamais être touchée.

## Décision
1. **Registre d'activité du jour** (schéma v4) : `daily {date, sessions, correct, xp}`
   ajouté à `ProgressState`, **remis à zéro à chaque changement de jour**. Les quêtes
   mesurent donc l'activité RÉELLE d'aujourd'hui, jamais un total à vie simulé.
2. **Moteur pur et testé** `src/data/gamification.ts` :
   - `recordActivity` / `recordSessionActivity` : alimentent le registre (XP gagné,
     bonnes réponses, sessions), avec bascule de jour automatique.
   - `buildDailyQuests` : 3 quêtes stables (`Termine une session` +5, `Réussis 5
     exercices` +10, `Gagne 30 XP` +10) avec progrès borné, `done` et `claimable`.
   - `claimQuest` : crédite la récompense en **pièces internes**, **idempotent** (une
     fois par jour, réinitialisé au nouveau jour via `claimedQuestIds`).
   - `streakInfo` + `applyStreakMilestones` : paliers `[3,7,14,30,60,100]`, +15 pièces
     par jalon, **récompensés une seule fois** (`claimedStreakMilestones`).
   - `newlyEarnedBadges(prev, next)` : diff pour célébrer/announcer un badge à l'instant
     où il est obtenu.
3. **Migration v4 non destructive** : `daily` vide, `claimedQuestIds` et
   `claimedStreakMilestones` `[]` par défaut ; registre corrompu assaini ; aucune perte
   de progression (v3 → v4). Tests dédiés.
4. **Câblage** (`progressContext`) : chaque réponse nourrit le registre (XP réel + bonne
   réponse) ; chaque fin de session compte la session **et** crédite les jalons de série
   franchis ; `claimQuest` exposé au contexte. Analytics ajoutés : `quest_completed`
   (réclamation), `achievement_unlocked` (badge ou jalon).
5. **UI honnête, zéro bouton mort** : l'accueil remplace les faux « Défis » par les
   vraies quêtes (barre de progression + bouton **Réclamer +N 🪙** actif seulement quand
   la quête est terminée, sinon `progress/target` ou `Réclamé ✓`). L'écran Réussites
   gagne une carte **Série** (jalon suivant + récompense). Message explicite : « les
   pièces récompensent ta régularité, jamais un pari ».

## Conséquences
- Boucle de rétention réelle et testée (quêtes quotidiennes rémunérées, jalons de série),
  fidèle à la promesse et sans mécanique manipulatrice.
- Les récompenses restent internes (pièces) ; XP, maîtrise et série gardent leurs rôles.
- Base extensible : ajouter une quête = une entrée `DAILY_QUESTS` ; un jalon = une valeur
  dans `STREAK_MILESTONES`. La célébration de badge est prête pour un futur toast/modale.

## Rollback
Retirer la carte Quêtes/Série des écrans (le moteur devient inerte) ; les champs v4
(`daily`, `claimedQuestIds`, `claimedStreakMilestones`) sont additifs et ignorés par le
reste du runtime. Aucune donnée de progression existante n'est perdue.
