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
  l'emoji système aux glyphes `TrademyIcon` (verrou/coche/révision/point de contrôle/trophée) ;
  **légende `MarketStatePill`** des repères de marché enseignés (informative, ne révèle aucune réponse).
- La logique pédagogique, la persistance, la reprise, la remédiation, la maîtrise et la source
  sémantique unique du LOT 3 sont **inchangées** (prouvé par les tests d'intégration existants).

## Conséquences
- Une identité visuelle plus premium et cohérente sur le parcours pilote, sans dépendance ajoutée
  (SVG et Reanimated déjà présents ; aucune 3D/Lottie/Rive).
- Les trois familles visuelles du brief restent distinctes ; les objets 3D noir/or (récompenses) et la
  finition « glass » complète sur d'autres écrans sont **différés au sous-lot B**.
- Toute couleur passe le contraste AA ; chaque action tactile ≥ 44 px ; aucune couleur seule ;
  reduced-motion inchangé (aucune animation ajoutée par ce sous-lot).

## Alternatives écartées
- Réécrire les tokens/thème : rejeté — l'API existante est saine ; une couche additive suffit.
- Ajouter une dépendance d'icônes/animation : rejeté — la façade `TrademyIcon` et `react-native-svg`
  couvrent le besoin ; aucune justification de coût bundle.
- Appliquer le nouveau système à toute l'app d'un coup : rejeté — le brief impose une application
  verticale d'abord, la logique métier restant intacte.
