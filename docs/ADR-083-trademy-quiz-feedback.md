# ADR-083 — Quiz, flashcards & feedback canoniques (refonte Lot 8)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 8 (branche `feat/trademy-complete-redesign`).
Source : `docs/design/TRADEMY_LEARNING_GLASS.md` (QuizOption, FeedbackPanel) et
`docs/product/TOTO_BOBO_CANON.md` (feedback avec mascotte).

## Contexte

Les composants de quiz utilisaient des emojis pour le statut (✅/❌) et le panneau de correction
était purement textuel (ni icône, ni emplacement pour un visuel / une mascotte). Le canon veut un
`QuizOption`/`FeedbackPanel` canoniques et un feedback illustré avec intervention de mascotte.

## Décision

- **`AnswerOption` (QuizOption)** : le marquage correct/incorrect passe au **système d'icônes
  Trademy** (`check` / `close`) au lieu des emojis ✅/❌.
- **`FeedbackPanel`** : icône de statut en tête (`check` si correct, `info` si erreur — éducatif,
  jamais punitif) + **emplacement `children`** pour un visuel ou une intervention de mascotte
  (feedback illustré).
- **Session (`session/[skillId].tsx`)** : la réaction de mascotte (Toto en réussite ; Bobo pointant
  l'idée fausse précise en erreur, cf. `mistakeMoment`) est désormais **intégrée dans le
  `FeedbackPanel`** — une seule carte de correction cohérente.

## Conséquences

- Quiz et feedback conformes au canon : icônes originales, correction illustrée avec mascotte
  contextuelle (réussite/erreur), erreur non punitive.
- Réutilisable partout (le slot `children` accueille un `MiniVisual` ou une `CharacterScene`).
- Gate verte : lint · typecheck · **500 tests** · validate:content · release:check · build:web
  (34 pages /TradeMy/). Session vérifiée en pilotant Chromium (390×844) : rendu propre (phase
  Apprendre) ; l'état de correction post-réponse (icônes + mascotte intégrée) est couvert par le
  typage SVG et la suite de tests (le clic n'est pas scriptable en capture statique). Voir ADR-083.
