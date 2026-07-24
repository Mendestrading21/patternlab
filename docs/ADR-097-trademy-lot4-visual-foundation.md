# ADR-097 — LOT 4 : fondation visuelle premium (tokens, icônes, widgets, états de marché)

- **Statut** : accepté (LOT 4, sous-lot A — fondation + application verticale pilote).
- **Contexte** : le socle « Trademy Learning Glass » (ADR-076/077) est déjà en place et token-driven.
  Le LOT 4 ne le réécrit pas : il le **rationalise** et lui ajoute une couche premium, appliquée à un
  seul parcours vertical (le pilote « Comprendre un chandelier »), sans toucher à la logique du LOT 3.
- **Source visuelle unique** : le canon initial **TradeMy Learning Glass**
  (`docs/design/TRADEMY_LEARNING_GLASS.md`) — nuit bleutée/anthracite, verre subtil ; violet =
  apprentissage / progression / maîtrise ; vert/rouge = directions de marché ; cyan = annotation
  technique ; jaune/or = zones importantes ; Toto & Bobo. Aucune image stock ni filigranée.

## Décision

### 1. Tokens sémantiques (additif, non cassant)
Ajout à `src/design-system/tokens.ts` (l'API existante est conservée) :
- surfaces d'état : `surfaceSelected`, `surfaceLocked` ; anneau de focus `focusRing` ;
- **sémantique d'ÉTAT DE MARCHÉ** dérivée de la palette AA existante : `confirmation` (= technique/cyan),
  `invalidation` (= or, jamais « baissier »), `falseSignal` (= neutre) — distincte de la direction
  (`bullish`/`bearish`) ET du feedback pédagogique (`feedbackCorrect`/`feedbackIncorrect`) ;
- `mastery` (= marque/violet) pour la maîtrise pédagogique — jamais une couleur de marché ;
- échelles : `opacity`, `borderWidth`, `touchTarget` (44), `zIndex`.
Verrouillé par `tokens.test.ts`. **La couleur n'informe jamais seule** (icône + forme + libellé).

### 2. Famille d'icônes unique, complétée
Extension de la **façade unique** `TrademyIcon` (grille 24×24, trait uniforme, terminaisons rondes,
géométrie originale) avec les concepts du canon pédagogique : `review`, `unlocked`, `progression`,
`checkpoint`, `mastery`, `hint`, `success`, `error`, `warning`, `market-up`, `market-down`, `volume`,
`support`, `resistance`, `confirmation`, `invalidation`, `false-signal`, `risk`, `psychology`. Une
seule famille principale. `progression` reste réservée à l'APPRENTISSAGE ; les directions de marché
utilisent des flèches NEUTRES (`market-up`/`market-down`). Verrouillé par `icons.test.ts`.

### 3. Composants de fondation
- `MarketStatePill` — puce d'état (setup haussier/baissier, zone de confirmation, invalidation, faux
  signal). Purement présentationnel : n'infère aucune vérité pédagogique. Triple signal (icône, forme,
  libellé). Vocabulaire **autorisé** uniquement, jamais BUY/SELL.
- `StatTile` — tuile de statistique partagée (remplace la tuile dupliquée de l'écran de session).
- `ProgressWidget` — widget de progression sobre (verre discret, liseré fin, aucun flou coûteux), qui
  **n'invente aucune valeur** et prévoit un état vide explicite.

### 4. Application verticale pilote (sans régression LOT 3)
- Écran de **résultat de session** : tuiles `StatTile` (icônes de la famille). Les accents des métriques
  d'apprentissage viennent du **canon d'apprentissage** (`RESULT_STAT_ACCENT`/`RESULT_ICON_ACCENT`) —
  jamais une couleur de marché, de zone/récompense ou d'annotation technique. Données et a11y inchangées.
- Écran de **monde pilote** : progression rendue par `ProgressWidget` ; jalons du parcours passés de
  l'emoji système aux glyphes `TrademyIcon` (verrou/coche/révision/point de contrôle/trophée).
  `MarketStatePill` reste un composant du design system (testé, documenté) mais N'EST PAS rendu sur
  l'écran de module.
- La logique pédagogique, la persistance, la reprise, la remédiation, la maîtrise et la source
  sémantique unique du LOT 3 sont **inchangées** (prouvé par les tests d'intégration existants).

## Conséquences
- Une identité visuelle plus cohérente sur le parcours pilote, **sans dépendance ajoutée**
  (`react-native-svg` et Reanimated déjà présents ; aucune dépendance d'animation).
- La finition sur les autres écrans est **différée**. Le sous-lot 4-B sera **cadré séparément depuis le
  canon initial TradeMy Learning Glass, après validation humaine** — il n'est pas défini ici.
- Contraste AA **vérifié par `contrast.test.ts`** (y compris `surfaceSelected`/`surfaceLocked` avec
  texte + accents + couleurs de marché + maîtrise) — aucune affirmation « AA partout » sans test. Chaque
  action tactile ≥ 44 px ; aucune couleur seule ; reduced-motion inchangé (aucune animation ajoutée).

## Micro-corrections 4-A (revues avant fusion, PR #11)

Corrigent des incohérences visuelles échappant aux tests, sans toucher moteur/progression/maîtrise/
reprise/remédiation :

1. **Marché ≠ progression** : « Maîtrise » = token de marque `colors.mastery` (jamais `bullish`).
   `MarketStatePill` : flèches NEUTRES `market-up`/`market-down` (jamais `progression`). Verrous ajoutés.
2. **Contraste** : `surfaceSelected` `#28324C → #181F30` (AA) ; `contrast.test.ts` étendu aux surfaces d'état.
3. **Vérité pédagogique** : la légende `MarketStatePill` (non dérivée du module) est **retirée du runtime** ;
   le composant reste au design system (tests + doc). Aucune seconde source de vérité, aucune migration.
4. **Emojis** : retirés des écrans pilote (résultat, monde) ET des répliques rendues (`characterLine`).
   Garde-fou `src/integration/pilotNoEmoji.test.ts` (écrans + contenu + sortie runtime de `characterLine`).
5. **Artefact mascotte** : `celebrate.png` portait un damier de transparence baked-in ; la figure n'est
   plus rendue sur le résultat, remplacée par la **scène de personnage VECTORIELLE** (nette, accessible).
   (Asset encore référencé par des écrans hors périmètre pilote — dette hors 4-A.)
6. **Accessibilité** : `ProgressWidget` — EXACTEMENT une barre, le pourcentage porté une seule fois par
   `accessibilityValue`, aucun libellé ne le duplique ; état vide explicite. « Découvrir la notion » ≥ 44 px.
   Le plafond de dynamic type (cap 1,8) est vérifié ; une preuve réelle de reflow à 200 % exige un
   appareil/simulateur (indisponible en environnement web+jest) — limite documentée, non déduite.
7. **Accents du résultat** : XP = `primary`, précision = `info` (jamais `technical`), maîtrise = `mastery`,
   palier perfect = `mastery`, pass = `feedbackCorrect`, retry = `neutral`. Aucun `bullish`/`bearish`/
   `reward`/`technical` pour un niveau d'apprentissage. Verrou `resultAccents.test.ts`.
8. **`SignatureMark` retiré** intégralement (composant, test, export, usages) : ce motif confondait encore
   hausse de marché et progression pédagogique. Espacements rééquilibrés avec les primitives existantes.
9. **Captures déterministes** : `capture-pilot.mjs` déclare un **manifeste exact**, nettoie les PNG gérés
   avant lancement, exige `produced == manifeste == PNG du dossier`, échoue sur erreur console/pageerror,
   débordement > 0, mesure d'overflow impossible, route incorrecte (pathname + marqueur stable), état
   obligatoire non atteint, capture manquante ou inattendue. **Ce script ne tourne pas en CI** (contrôle
   local uniquement).

## Alternatives écartées
- Réécrire les tokens/thème : rejeté — l'API existante est saine ; une couche additive suffit.
- Ajouter une dépendance d'icônes/animation : rejeté — `TrademyIcon` et `react-native-svg` couvrent le
  besoin ; aucune justification de coût bundle.
- Appliquer le nouveau système à toute l'app d'un coup : rejeté — application verticale d'abord, la
  logique métier du LOT 3 restant intacte.
