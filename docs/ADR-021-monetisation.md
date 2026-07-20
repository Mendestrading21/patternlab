# ADR-021 — Monétisation (offre premium, paywall, entitlement simulé)

## Statut
Accepté (LOT 15 — Monétisation, skill `patternlab-product-growth`).

## Contexte
Le produit n'avait aucune couche de monétisation. Le skill demande une offre
gratuit/premium claire, un paywall affiché **après une démonstration de valeur**, des
prix **hypothétiques configurables**, et pose des garde-fous stricts : PatternLab n'est
pas un casino, aucune promesse de gain, **aucun achat réel sans autorisation**, aucune
donnée de paiement, aucun Stripe, aucun abonnement ni donnée personnelle importés de WMB.

## Décision
1. **Modèle d'entitlement pur et testé** `src/data/premium.ts` :
   - `PRICING` (Pass Fondateur 14,99 · Annuel 44,99 · Mensuel 7,99, devise `CHF`) —
     **hypothèses configurables**, pas un engagement.
   - `PREMIUM_FEATURES` (tous les mondes, labo complet, exercices avancés, révisions
     illimitées, statistiques détaillées, offline étendu) et `FREE_FEATURES` (affichées
     pour la transparence : premier monde, mission/quêtes, progression/série/réussites,
     glossaire, aperçu des statistiques).
   - `PremiumState {active, plan, since, demo}` avec `isPremium`, `activate`,
     `deactivate`, `migratePremium`. **`demo` est toujours vrai** : l'activation est une
     simulation locale, jamais un achat réel.
2. **Persistance séparée** `premiumRepository` (clé `patternlab.premium.v1`, mêmes
   contrats que l'onboarding) : l'entitlement est un état distinct de la progression
   d'apprentissage. Chargé/enregistré par `progressContext` ; exposé via `premium`,
   `activatePremium`, `deactivatePremium`, `restorePremium`. **Aucune** donnée de
   paiement n'est stockée ni demandée.
3. **Paywall** `/premium` : promesse, liste premium vs gratuit, cartes d'offres
   sélectionnables (Pass Fondateur mis en avant), CTA **« Activer — {offre} (démo) »**
   qui simule l'activation, « Restaurer », « Plus tard ». **Avertissement explicite** :
   « Simulation — aucun achat réel n'est effectué… les prix sont des hypothèses ». Si
   déjà premium : écran d'état + « Désactiver (démo) ». Zéro bouton mort.
4. **Un gate réel, non punitif** : les **statistiques détaillées** (historique,
   maîtrise par compétence, points faibles) deviennent premium ; la **vue d'ensemble
   reste gratuite** (démonstration de valeur). Le gate n'apparaît qu'à l'ouverture des
   stats (après une première interaction), jamais au démarrage — conforme au skill. Le
   cœur d'apprentissage (leçons, sessions, quêtes, révisions, parcours, glossaire) reste
   entièrement gratuit.
5. **Analytics** : `premium_gate_hit` (gate atteint), `paywall_viewed` (ouverture du
   paywall), `subscription_started` (activation démo), `subscription_restored`.

## Conséquences
- Chemin de valeur clair (gratuit riche → premium pour aller plus loin) sans mécanique
  manipulatrice ni fausse urgence, prêt à brancher un vrai magasin d'app (StoreKit /
  Play Billing) plus tard **après autorisation** — seul `activatePremium` changerait.
- L'entitlement étant découplé, ajouter un gate (mondes, labo, révisions) = un simple
  `isPremium(premium)` au point d'appel.

## Rollback
Retirer l'écran `/premium`, le gate des statistiques et l'entrée Profil ; le
`premiumRepository` et `premium.ts` sont additifs et inertes s'ils ne sont pas appelés.
Aucune progression ni donnée existante n'est affectée. Aucun paiement réel n'ayant jamais
été branché, il n'y a rien à rembourser ni à révoquer.
