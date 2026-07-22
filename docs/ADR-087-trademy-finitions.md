# ADR-087 — Accessibilité, responsive & finitions (refonte Lot 12)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 12 (branche `feat/trademy-complete-redesign`).

## Contexte

Avant la PR, le canon impose une passe de finition : contraste, responsive 320/390/430, états
loading/vide/erreur, recherche de couleurs en dur & composants parallèles, noms publics « PatternLab »
visibles et mots interdits.

## Audit (résultats réels)

- **Couleurs en dur dans les écrans (`src/app/**.tsx`, hors `+html.tsx`) : 0.** Toute couleur vient
  de `theme.colors.*`.
- **Noms publics « PatternLab » visibles : 0** (identifiants internes conservés : `com.patternlab.*`,
  clés AsyncStorage `patternlab.*`, fixture de test — jamais affichés).
- **Vocabulaire interdit : 0** occurrence de contenu ; les seules correspondances sont les **gardes**
  de validation (`FORBIDDEN_UPPER`, commentaires) qui *interdisent* ce vocabulaire.
- **Contraste** : verrouillé WCAG AA par `contrast.test.ts` (tokens Learning Glass).
- **États** : loading/vide/erreur/offline/verrouillé présents (`StateView`, `EmptyState`,
  `OfflineBanner`, états « introuvable » / « verrouillé »).
- **Reduced-motion** : `CharacterAnimationController` rend statique ; règle documentée.

## Décision

- **Garde-fou de finition** `noHardcodedColors.test.ts` : échoue si un écran introduit une couleur
  en dur (`#RRGGBB`), verrouillant la source unique de couleur.
- **Vérification responsive** en pilotant Chromium : **320 px** (petit écran) et **430 px** (grand
  téléphone), en plus des 390 px déjà vérifiés. Aucun débordement horizontal ; les rangées d'outils/
  filtres défilent, les puces se replient, la barre d'onglets s'adapte (libellés ellipsés à 320).

## Conséquences

- L'identité, les couleurs sémantiques et l'accessibilité sont verrouillées par tests ; les écrans
  ne peuvent plus dériver (couleur en dur → CI rouge).
- Gate verte : lint · typecheck · **503 tests** (+1) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Responsive 320/390/430 vérifié en Chromium. Voir ADR-087.
- Reste (Lot 13) : validation finale complète (dont Expo Doctor), captures avant/après, PR vers `main`.
