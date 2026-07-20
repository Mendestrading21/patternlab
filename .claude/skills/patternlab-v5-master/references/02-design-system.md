# 02 — Design System V5

## Direction

Identité : **Instrument Glass Learning**.

- 70 % surfaces mates graphite / bleu nuit ;
- 20 % verre sombre contrôlé ;
- 10 % couleur fonctionnelle ;
- densité professionnelle mais mobile-first ;
- hiérarchie forte ;
- animations courtes et contextuelles.

## Palette indicative

```text
backgroundDeep       #070B11
background           #0A111A
surface              #111A24
surfaceElevated      #172331
surfaceInteractive   #1D2B3A
borderSubtle         #253343
borderStrong         #38506A
textPrimary          #F4F7FA
textSecondary        #AAB7C6
textMuted            #758395
bullish              #26C281
bearish              #F05A67
technical            #42B7E8
warning              #F3B94E
reward               #E8B94F
neutral              #8292A6
advanced             #9B7CF6
```

Séparer direction financière, résultat pédagogique, avertissement, récompense et annotation technique.

## Composants

- Screen / AppHeader / BottomTabs
- Button / IconButton
- Card / GlassCard
- MissionCard / WorldCard / PathNode / LessonCard
- ConceptCard / VisualCard / CandleCard / PatternCard
- ComparisonCard / CheatSheetPanel
- MiniChart / AnnotatedChart / InteractiveChart
- FeedbackPanel / FalseSignalPanel
- Flashcard / MiniQuiz
- MasteryRing / ProgressBar
- SearchBar / FilterBar / FavoriteButton
- Badge / Tooltip / BottomSheet / Modal
- Skeleton / EmptyState / ErrorState / OfflineState

## Règles

- une priorité principale par écran ;
- ne pas transformer chaque bloc en carte ;
- pas de glow généralisé ;
- pas de néon casino ;
- pas d’emoji comme système d’icônes principal ;
- les graphiques passent avant la décoration ;
- Toto/Bobo ne masquent jamais une donnée ;
- tout écran prévoit les états pertinents.

## Toto et Bobo

Toto formule une hypothèse ou un scénario haussier conditionnel.
Bobo recherche le risque, les conditions manquantes et l’invalidation.

États : welcome, observe, think, debate, explain, warning, falseSignal, correct, wrong, celebrate, review, offline, premium.

Ils servent aux moments pédagogiques, pas dans chaque carte.
