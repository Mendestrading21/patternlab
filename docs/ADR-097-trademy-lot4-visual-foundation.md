# ADR-097 — LOT 4 : fondation visuelle premium (tokens, icônes, signature, widgets, états de marché)

- **Statut** : accepté (LOT 4, sous-lot A — fondation + application verticale pilote).
- **Contexte** : le socle « Trademy Learning Glass » (ADR-076/077) est déjà en place et token-driven.
  Le LOT 4 ne le réécrit pas : il le **rationalise** et lui ajoute une couche premium, appliquée à un
  seul parcours vertical (le pilote « Comprendre un chandelier »), sans toucher à la logique du LOT 3.
- **Références d'intention** : les 16 images du brief n'étaient pas accessibles dans l'environnement ;
  décision explicite de l'auteur de **procéder depuis l'intention textuelle**. Elles restent des
  références d'INTENTION, jamais recopiées ; aucun asset filigrané n'est intégré.

## Décision

### 1. Tokens sémantiques (additif, non cassant)
Ajout à `src/design-system/tokens.ts` (l'API existante est conservée) :
- surfaces d'état : `surfaceSelected`, `surfaceLocked` ; anneau de focus `focusRing` ;
- **sémantique d'ÉTAT DE MARCHÉ** dérivée de la palette AA existante : `confirmation` (= technique/cyan),
  `invalidation` (= or, jamais « baissier »), `falseSignal` (= neutre) — distincte de la direction
  (`bullish`/`bearish`) ET du feedback pédagogique (`feedbackCorrect`/`feedbackIncorrect`) ;
- échelles : `opacity`, `borderWidth`, `touchTarget` (44), `zIndex`.
Verrouillé par `tokens.test.ts`. **La couleur n'informe jamais seule** (icône + forme + libellé).

### 2. Famille d'icônes unique, complétée
Extension de la **façade unique** `TrademyIcon` (grille 24×24, trait uniforme, terminaisons rondes,
géométrie originale) avec les concepts nommés au brief : `review`, `unlocked`, `progression`,
`decline`, `checkpoint`, `mastery`, `hint`, `success`, `error`, `warning`, `volume`, `support`,
`resistance`, `confirmation`, `invalidation`, `false-signal`, `risk`, `psychology`. Une seule famille
principale. Verrouillé par `icons.test.ts`.

### 3. Signature géométrique originale
`SignatureMark` : rythme ascendant de trois corps de chandelier (mèches) convergeant vers un **point de
confirmation**, relié par une fine trajectoire de progression. Motif abstrait, **sans rapport avec
l'« alphabet chandelier » des références** (aucune lettre, aucune copie). Décoratif par défaut.

### 4. Composants de fondation premium
- `MarketStatePill` — puce d'état (setup haussier/baissier, zone de confirmation, invalidation, faux
  signal). Purement présentationnel : n'infère aucune vérité pédagogique. Triple signal (icône, texte,
  couleur). Vocabulaire **autorisé** uniquement, jamais BUY/SELL.
- `StatTile` — tuile de statistique partagée (remplace la tuile dupliquée de l'écran de session).
- `ProgressWidget` — widget « data premium » vitré (verre discret, liseré fin, aucun flou coûteux),
  qui **n'invente aucune valeur** et prévoit l'état vide.

### 5. Application verticale pilote (sans régression LOT 3)
- Écran de **résultat de session** : tuiles `StatTile` premium (icônes de la famille) + séparateur
  `SignatureMark`. Données et a11y inchangées.
- Écran de **monde pilote** : progression rendue par `ProgressWidget` ; jalons du parcours passés de
  l'emoji système aux glyphes `TrademyIcon` (verrou/coche/révision/point de contrôle/trophée).
  `MarketStatePill` reste un composant du design system (testé, documenté) mais N'EST PAS rendu sur
  l'écran de module — voir la micro-correction 4-A ci-dessous.
- La logique pédagogique, la persistance, la reprise, la remédiation, la maîtrise et la source
  sémantique unique du LOT 3 sont **inchangées** (prouvé par les tests d'intégration existants).

## Conséquences
- Une identité visuelle plus premium et cohérente sur le parcours pilote, sans dépendance ajoutée
  (SVG et Reanimated déjà présents ; aucune 3D/Lottie/Rive).
- Les trois familles visuelles du brief restent distinctes ; les objets 3D noir/or (récompenses) et la
  finition « glass » complète sur d'autres écrans sont **différés au sous-lot B**.
- Contraste AA **vérifié par `contrast.test.ts`** (y compris `surfaceSelected`/`surfaceLocked` avec
  texte + accents + couleurs de marché) — aucune affirmation « AA partout » sans test. Chaque action
  tactile ≥ 44 px ; aucune couleur seule ; reduced-motion inchangé (aucune animation ajoutée).

## Micro-correction 4-A (revue avant fusion, PR #11)

Corrige des incohérences visuelles échappant aux tests, sans toucher moteur/progression/maîtrise/
reprise/remédiation :

1. **Marché ≠ progression pédagogique** : la tuile « Maîtrise » utilise un token de MARQUE dédié
   (`colors.mastery`), jamais `bullish`. `MarketStatePill` utilise des flèches directionnelles
   NEUTRES (`market-up`/`market-down`), jamais l'icône `progression` (réservée à l'apprentissage) ni
   l'ancien glyphe moralisant `decline` (retiré). Verrous : `tokens.test.ts`, `icons.test.ts`,
   `MarketStatePill.test.tsx`.
2. **Contraste** : `surfaceSelected` assombri `#28324C → #181F30` (AA pour violet/texte atténué/marché).
   Tests de contraste étendus aux surfaces d'état.
3. **Vérité pédagogique** : la légende `MarketStatePill` n'était PAS dérivée du module ; elle est
   **retirée du runtime**. Le composant reste dans le design system (tests + doc), sans seconde source
   de vérité ni migration.
4. **Famille d'icônes** : emojis retirés des écrans modifiés (résultat : `summary.emoji` → `TrademyIcon`
   par palier, `🔁` → icône `review` ; monde : `🎉`/`✓` retirés des libellés). Garde-fou
   `src/integration/pilotNoEmoji.test.ts`.
5. **Artefact mascotte** : l'asset `celebrate.png` portait un damier de transparence baked-in ; la
   figure n'est plus rendue sur l'écran de résultat, remplacée par la **scène de personnage
   VECTORIELLE** (nette, accessible). (Asset encore référencé par des écrans hors périmètre pilote —
   noté comme dette hors 4-A.)
6. **Accessibilité** : `ProgressWidget` n'annonce le pourcentage qu'UNE fois (porté par la valeur de la
   barre) ; état vide explicite (« Aucune progression enregistrée ») ; « Découvrir la notion » ≥ 44 px ;
   dynamic type plafonné (sûr à 200 %).
7. **Captures fiables** : `capture-pilot.mjs` échoue sur navigation ratée / erreur console / débordement,
   vérifie la route avant capture, et produit `pilot-result-{320,390,430,web,reduced}`.

## Alternatives écartées
- Réécrire les tokens/thème : rejeté — l'API existante est saine ; une couche additive suffit.
- Ajouter une dépendance d'icônes/animation : rejeté — la façade `TrademyIcon` et `react-native-svg`
  couvrent le besoin ; aucune justification de coût bundle.
- Appliquer le nouveau système à toute l'app d'un coup : rejeté — le brief impose une application
  verticale d'abord, la logique métier restant intacte.
