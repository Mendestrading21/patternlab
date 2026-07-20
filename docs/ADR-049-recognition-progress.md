# ADR-049 — Persistance des progrès de reconnaissance + badge

## Statut
Accepté. Donne une **boucle de progression** durable à l'entraîneur « Reconnais la figure » (ADR-048),
branchée sur le socle existant (persistance schéma-versionnée, stats, badges).

## Contexte
L'entraîneur ne conservait qu'un score de session. Pour qu'il devienne une vraie mécanique de
progression (cœur d'une app gamifiée), il fallait cumuler les figures reconnues et récompenser l'effort,
sans jamais récompenser un gain, un rendement ni la vitesse (contrainte produit).

## Décision
1. **Schéma de progression v6 → v7** : `LearningStats` gagne `figuresRecognized` et
   `bestRecognitionStreak` (cumulatifs). `migrateProgress`/`migrateLearning` remplissent 0 par défaut et
   assainissent (négatif/non fini → 0, décimal tronqué) — **aucune perte de progression** pour les états
   antérieurs (testé v6→v7).
2. **Logique pure** `addRecognitionResult(state, recognized, bestStreak)` : ajoute au cumul et relève la
   meilleure série ; ignore les valeurs invalides ; renvoie la même référence si sans effet (testé).
3. **Badge** « Œil de lecteur » 👁️ (famille compréhension) débloqué à **15 figures reconnues** — récompense
   le savoir, pas un gain (testé aux seuils 14/15).
4. **Câblage** : `ProgressProvider.recordRecognition(recognized, bestStreak)` (persistance + analytics
   `recognition_completed` + annonce des badges) ; l'écran `/reconnaissance` l'appelle une fois en fin de
   série. Surface : carte **Exploration** des statistiques (« Figures reconnues »).

## Conséquences
- La reconnaissance nourrit désormais la progression durable, les statistiques et les réussites — de
  façon cohérente avec la posture produit (jamais de gains/vitesse récompensés).
- Migration sûre et testée : les utilisateurs existants (v6) montent en v7 sans rien perdre.
- Validations : lint · typecheck · tests **376** · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : une série jouée (2/8) est **persistée** et réaffichée à l'identique dans
  les statistiques, 0 erreur console. Voir **ADR-049**. Aucun push sans accord explicite.
