# ADR-098 — LOT 4-B : application du canon à l'Accueil (icônes de la famille, a11y)

- **Statut** : accepté (LOT 4-B — deuxième application verticale de la fondation LOT 4-A).
- **Contexte** : LOT 4-A (ADR-097) a posé la fondation visuelle et l'a appliquée au parcours pilote. Le
  LOT 4-B étend cette application à l'**onglet Accueil** (`src/app/(tabs)/index.tsx`), depuis le canon
  initial **TradeMy Learning Glass** — sans 3D, sans référence externe, sans toucher aux moteurs.

## Décision

### 1. Famille d'icônes — glyphes Accueil du canon
Ajout à la façade unique `TrademyIcon` (grille 24×24, trait uniforme, terminaisons rondes, géométrie
ORIGINALE) : `timer` (minuteur — durée de la mission) et `coin` (jeton d'apprentissage). Verrou
`icons.test.ts`.

### 2. Accueil : emojis-icônes → famille Trademy
Les emojis utilisés comme icônes sont remplacés par des glyphes de la famille (ou retirés du texte) :
- `🎯 MISSION DU JOUR` → icône `target` + libellé ;
- `💡 CONCEPT DU JOUR` → icône `hint` + libellé ;
- puce `⏱️` → `Chip iconName="timer"` ; puce `🪙` → `Chip iconName="coin"` ;
- salutation `… 👋` → texte seul.
Tokens uniquement (verrou `noHardcodedColors`), a11y préservée (icônes décoratives, libellés intacts),
cibles tactiles inchangées (cartes larges). Aucune donnée ni logique modifiée.

### 3. Preuve exécutable
- `src/integration/accueil.integration.test.tsx` monte l'écran d'Accueil RÉEL dans le `ProgressProvider`
  et prouve : les libellés de section sont rendus SANS emoji système (`🎯`/`⏱️`/`🪙`/`💡`/`👋` absents),
  des icônes de la famille (`viewBox 0 0 24 24`) sont rendues, et l'action principale émet réellement une
  route.
- `src/integration/accueilNoEmoji.test.ts` verrouille l'absence d'emoji dans la source de l'écran.

## Conséquences
- L'Accueil rejoint la famille d'icônes canonique ; cohérence visuelle accrue, sans dépendance ajoutée.
- **Limite de capture assumée (honnête)** : un lien direct vers la route de groupe `/(tabs)` dans l'export
  statique sert d'abord l'écran d'accueil racine (`app/index.tsx`) puis le client route vers l'onglet, ce
  qui déclenche un avertissement d'hydratation React #418. Ce n'est PAS introduit par le LOT 4-B (la
  navigation réelle in-app est côté client, sans divergence) et corriger ce cas relève de l'architecture
  de navigation (hors périmètre 4-B). Faute de capture Chromium déterministe SANS erreur console pour cet
  écran, la preuve d'Accueil est portée par le **test d'intégration rendu** ci-dessus, pas par un PNG.
  Le manifeste de captures du pilote (22) reste **inchangé**.
- Dette notée : hydratation #418 sur deep-link `/(tabs)` (et autres onglets) — candidat pour un futur lot
  de finition de navigation, à cadrer séparément.

## Alternatives écartées
- Forcer une capture de l'Accueil : rejeté — produirait un PNG avec une erreur console #418, contraire au
  standard « 0 erreur console » ; l'honnêteté prime sur un artefact.
- Corriger le #418 des onglets ici : rejeté — changement d'architecture de navigation, hors scope 4-B.
- Étendre le nouveau système à tous les onglets d'un coup : rejeté — application verticale, un écran à la
  fois (profil/révisions/etc. gardent leur dette emoji, à traiter dans un prochain sous-lot).

**LOT 4-C : non commencé** — sera cadré séparément depuis le canon, après validation humaine.
