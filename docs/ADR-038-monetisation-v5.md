# ADR-038 — Monétisation V5 (démo, aucun achat réel)

## Statut
Accepté (V5 Lot 13 — Monétisation, skill `patternlab-v5-master`).

## Contexte
La monétisation v1 (`premium.ts`, écran `premium.tsx`) est **une démo** : entitlement local, drapeau
`demo`, aucun Stripe ni achat réel, paywall déclenché seulement après une démonstration de valeur.
Elle gardait le cœur d'apprentissage gratuit et ne gâtait qu'une profondeur (statistiques détaillées).
Mais le paywall listait des perks (« tous les mondes », « laboratoire complet »…) qui **n'étaient pas
réellement verrouillés** — un écart d'honnêteté. Lot 13 réutilise le v1 et livre un perk V5 **réel et
verrouillé**, sans jamais bloquer l'apprentissage essentiel.

## Décision
1. **Perk premium réel : « Deck de révision des concepts »**. Logique pure `revisionDeck.ts`
   (`buildRevisionDeck` réunit toutes les flashcards + mini-quiz des `V5_CONCEPTS`, ordre stable,
   testé). Écran `/revision-deck` : gratuit → **gate** (aperçu + « Débloquer avec Premium » →
   `/premium` + note « activation de démonstration, aucun achat réel » + `premium_gate_hit`) ; premium →
   le deck (flashcards + quiz via le composant `Flashcard`). Entrée depuis l'onglet Révisions (carte
   « Deck de révision des concepts », badge Premium, bouton « Ouvrir le deck » — navigue vers le gate,
   **aucun bouton mort**).
2. **Perk juste, jamais bloquant** : les flashcards/quiz restent **gratuits** sur chaque fiche/leçon ;
   seul le deck **consolidé** (réviser d'un coup) est un confort Premium. Le cœur d'apprentissage
   (fiches, glossaire, leçons, exercices, mondes en aperçu) reste entièrement gratuit.
3. **Honnêteté de l'offre** : `PREMIUM_FEATURES` réordonné pour mettre en tête les **deux perks
   réellement livrés et verrouillés** (statistiques complètes, deck de révision) ; `FREE_FEATURES`
   réécrit pour refléter la réalité V5 (module pilote complet, 15 mondes en aperçu, fiches visuelles,
   glossaire unifié). Le drapeau `demo` et les mentions « aucun achat réel » restent partout.

## Conséquences
- Le paywall est **substantiel et honnête** : au moins deux perks concrets sont réellement débloqués
  par l'activation démo, vérifiés de bout en bout.
- Modèle responsable préservé : aucune promesse de gain, aucun achat réel, aucune donnée de paiement ;
  Premium n'apporte que commodité/profondeur, jamais du contenu d'apprentissage essentiel.
- Reste à faire : verrouiller réellement les perks encore aspirants (exercices avancés, laboratoire
  complet, révisions illimitées) au fil des lots, ou les retirer de l'offre s'ils ne sont pas livrés.
