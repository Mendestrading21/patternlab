# 02 — Design, navigation et système Toto/Bobo

## Direction visuelle

PatternLab adopte une identité **Instrument Glass** :

- 70 % surfaces mates graphite/bleu nuit ;
- 20 % verre sombre contrôlé ;
- 10 % couleur fonctionnelle.

Le produit doit évoquer TradingView, Bloomberg, Duolingo et Apple par ses principes de clarté et de finition, sans copier leur identité.

## Palette fonctionnelle

Base recommandée, à ajuster après tests de contraste :

```text
backgroundDeep       #080C12
background           #0B1119
surface              #111A24
surfaceElevated      #172331
surfaceInteractive   #1C2A39
borderSubtle         #253343
borderStrong         #364A60
textPrimary          #F4F7FA
textSecondary        #AAB7C6
textMuted            #758395
bullish              #26C281
bearish              #F05A67
technical            #42B7E8
warning              #F3B94E
reward               #E8B94F
neutral              #8292A6
```

Séparer obligatoirement :

- bullish/bearish = direction financière ;
- feedbackCorrect/feedbackIncorrect = résultat pédagogique ;
- technical = tracés et annotations ;
- warning = prudence ;
- reward = progression et récompenses.

Une bougie verte peut être une mauvaise réponse. Une bougie rouge peut être la bonne observation.

## Règles visuelles

- Une priorité principale par écran.
- Éviter l'empilement interminable de cartes.
- Éviter le glow, les bordures lumineuses et les transparences partout.
- Réduire les emojis génériques ; utiliser une iconographie cohérente.
- Réserver les grandes scènes de personnages aux moments émotionnels ou explicatifs.
- Donner aux graphiques plus d'espace qu'aux décorations.
- Conserver des textes courts et hiérarchisés.
- Toujours prévoir loading, empty, error, offline, locked et disabled.

## Composants attendus

- Screen
- Text
- Button / IconButton
- Card / GlassCard
- ProgressBar / CircularProgress
- Chip / XPChip / StreakChip
- MissionCard
- LessonCard
- PathNode
- AnswerOption
- FeedbackPanel
- ChartCard
- BottomTabs
- Modal / BottomSheet
- Toast
- Skeleton
- EmptyState / ErrorState / OfflineState
- PaywallCard
- StatCard
- MasteryRing
- SectionHeader

Chaque composant traite : default, pressed, hover, focus, selected, disabled, loading, success, error, locked, completed et reviewDue selon pertinence.

## Accueil

Hiérarchie cible :

1. Salutation et statut compact.
2. Mission du jour avec CTA principal.
3. Révision prioritaire uniquement si due.
4. Progression et objectif hebdomadaire.
5. Raccourcis secondaires : laboratoire, glossaire, réussites, statistiques.
6. Disclaimer discret.

La prochaine action doit être identifiable en moins de deux secondes.

## Parcours

Remplacer la simple liste verticale par une carte accessible :

- chemin visuel ;
- nœuds reliés ;
- mondes ;
- checkpoints ;
- examens ;
- laboratoires ;
- révisions intégrées ;
- états locked, available, current, completed, mastered, reviewDue.

Prévoir une version simplifiée pour reduced motion, faible performance, lecteur d'écran et clavier web.

## Toto et Bobo

### Toto

- taureau vert ;
- enthousiaste, curieux, optimiste ;
- formule une hypothèse ou un setup haussier ;
- demande quelles preuves confirment l'idée ;
- n'affirme jamais que le marché va monter.

### Bobo

- ours rouge ;
- prudent, analytique, sceptique ;
- cherche le risque, l'invalidation et le faux signal ;
- n'affirme jamais que le marché va baisser.

### Débat pédagogique

Séquence recommandée :

1. Toto propose une hypothèse.
2. Bobo demande ce qui manque ou invalide le scénario.
3. L'utilisateur observe ou manipule.
4. Le feedback explique les conditions des deux scénarios.

### États

- idle
- welcome
- explain
- observe
- think
- debate
- celebrate
- encourage
- confused
- warning
- wrongAnswer
- falseSignal
- levelUp
- streak
- review
- rest
- loading
- offline
- premium

### Fréquence

Utiles : onboarding, explication difficile, débat, erreur, faux signal, progression, réussite, encouragement, hors ligne.

Discrets ou absents : réglages, listes denses, tracé précis sur graphique, écrans où ils masquent les données.

### Assets

Maintenir un registre typé unique : nom, personnage, état, usage, ratio, format, fallback et texte d'accessibilité.

Auditer les anciens JPG, cutouts, poses, figures HD et avatars SVG. Ne supprimer un fichier qu'après preuve qu'il n'est plus référencé.

### Animation

- courte ;
- contextuelle ;
- non bloquante ;
- interruptible ;
- sans boucle agressive ;
- désactivable ;
- compatible reduced motion.

## Accessibilité

- contraste AA ;
- zones tactiles suffisantes ;
- tailles dynamiques ;
- lecteurs d'écran ;
- navigation clavier web ;
- focus visible ;
- alternative aux gestes ;
- ne jamais transmettre une information uniquement par couleur ;
- description textuelle des graphiques ;
- option de réduction des effets translucides et animations.
