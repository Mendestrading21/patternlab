# ADR-085 — Toto/Bobo : états & animations (refonte Lot 10)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 10 (branche `feat/trademy-complete-redesign`).
Source : `docs/product/TOTO_BOBO_CANON.md` et `src/characters/`.

## Contexte

Le système de mascottes est déjà mûr (programmes learning-master/experience-max) :
`CHARACTER_STATES` (registre unique de 24 états avec expression, personnage par défaut, catégorie,
intensité, ton), `CharacterAnimationController` (pop ponctuel piloté par l'intensité + flottement au
repos, **rendu statique si `prefers-reduced-motion`**), `CharacterScene`, `mascotFor`, dialogue
contextuel. Les mascottes sont présentes à l'onboarding, l'accueil, les leçons, les quiz, les
erreurs, les réussites, la révision et la progression.

Manquait, vs la liste canonique d'états (idle · speak · think · **point** · celebrate · warn ·
correct · confused · sleep/offline), l'état **`point`** (mascotte qui pointe un élément).

## Décision

- Ajout de l'état **`point`** (`types.ts` + `states.ts`) : expression `excited`, Toto par défaut,
  catégorie `guidance`, intensité `subtle`, ton « regarde ici ». Dérivé automatiquement dans
  `STATE_TO_EXPRESSION` ; aucun autre registre exhaustif à modifier.
- **Usage réel** : au Laboratoire, Toto passe à l'état `point` quand les annotations sont affichées
  (il pointe le graphique annoté), et revient à `explain` sinon.
- `states.test.ts` : `point` ajouté aux états canoniques couverts.

## Conséquences

- L'ensemble des états nommés du canon est représentable ; chaque état a une expression et une
  intensité (testé). L'animation reste **déclenchée par un évènement** (pop) puis revient au repos,
  et honore `prefers-reduced-motion` (rendu statique) — comportement déjà en place, ici confirmé et
  complété.
- Pas de dépendance ajoutée (Reanimated déjà présent).
- Gate verte : lint · typecheck · **500 tests** · validate:content · release:check · build:web
  (34 pages /TradeMy/). Présence des mascottes vérifiée sur tous les écrans pilotés en Chromium
  (Accueil, Apprendre, Bibliothèque, Laboratoire, Profil, session). Voir ADR-085.
