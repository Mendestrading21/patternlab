# ADR-076 — Identité Trademy & tokens « Learning Glass » (refonte Lot 1)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 1 (branche `feat/trademy-complete-redesign`).
Source canonique : `docs/design/TRADEMY_LEARNING_GLASS.md` et `docs/product/TRADEMY_PRODUCT_VISION.md`.

## Contexte

Le blueprint Trademy (PR #2, fusionnée) fixe la marque publique **Trademy**, la signature
« Ne parie pas. Comprends. » et le design system **Trademy Learning Glass** : univers sombre premium,
verre discret, et surtout des **couleurs sémantiques** — violet = marque/CTA, vert = marché haussier,
rouge = marché baissier, or = zones importantes, cyan = annotations, feedback pédagogique distinct.

L'ancien thème (« Instrument Glass ») utilisait le **vert comme couleur primaire/CTA**, ce qui
contredit le canon (le vert doit rester réservé au marché). Le nom public affiché restait
« PatternLab ».

## Décision

**1. Tokens (`src/design-system/tokens.ts`) — valeurs seulement, clés inchangées.**
Toutes les surfaces, la marque et les accents adoptent Trademy Learning Glass. La marque devient
**violette** (`colors.primary`), indépendante du marché.

- Marque : `primary #9270F0`, `primaryBright #A78BFA`, `primaryDim #6D48D0`, `onPrimary #16082C`.
  `#9270F0` est la teinte **AA-ajustée** de la référence `#8B5CF6` : lisible à la fois comme *texte*
  coloré sur carte et comme *fond* de bouton (label sombre). Un violet plus profond (white-on-violet)
  ne tiendrait pas l'AA comme texte, un violet plus clair perdrait l'identité.
- Marché : `bullish #2DD4A7` (haussier), `bearish #FF5D73` (baissier) — jamais réutilisés comme
  bonne/mauvaise réponse.
- Feedback pédagogique **distinct** : `feedbackCorrect #66E3A4`, `feedbackIncorrect #FF8798`.
- Annotation `technical #22D3EE` (cyan), zone `reward/warning #F6C453` (or), `advanced #C084FC`.
- Surfaces nuit : canvas `#0A0D16`, cartes `#101421 → #171C2B`, deep `#05070E`.
- Nouveau bloc `motion` (micro 150 / transition 260 / celebration 720 ms) — le mouvement explique.

**2. Identité publique → Trademy.** `app.json` (`name`, `primaryColor #9270F0`, couleurs de fond),
`src/lib/appInfo.ts` (`name`, `signature`, disclaimer), `+html.tsx` (titre PWA, theme-color),
`config/web-manifest.json`, badges et écrans (Profil, Premium), et le label éditorial des concepts
(« Voix pédagogique Trademy »). Les identifiants **internes** (`slug`, `scheme`, `bundleIdentifier`,
package npm, nom de dossier du skill) restent historiques, comme prévu par le contrat.

## Conséquences

- Le changement de valeur de token propage l'identité violette dans **toute l'app** sans réécrire
  chaque écran : `colors.*` conserve ses clés, aucun consommateur n'est cassé.
- Accessibilité verrouillée : `contrast.test.ts` (WCAG AA ≥ 4.5) reste vert avec les nouvelles
  teintes ; `primary` et `primaryBright` passent comme texte, `onPrimary` sur `primary` = 5.25.
- Nouveau garde-fou `tokens.test.ts` : la marque reste violette, le marché vert/rouge, le feedback
  distinct du marché, et l'identité publique = Trademy avec sa signature.
- Gate verte : lint · typecheck · **480 tests** (+6) · validate:content · release:check · build:web.
- `main` n'est pas modifié : le travail vit sur `feat/trademy-complete-redesign` jusqu'à la PR finale.
- Les icônes de marque (PNG) ne changent pas dans ce lot ; le jeu d'icônes vectoriel original relève
  du Lot 2 (composants & icônes).
