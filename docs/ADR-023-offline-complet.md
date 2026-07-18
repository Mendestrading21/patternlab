# ADR-023 — Offline complet (connectivité branchable, local-first assumé)

## Statut
Accepté (LOT 17 — Offline complet, skill `patternlab-product-growth`).

## Contexte
La détection hors-ligne se limitait à un hook `useIsOnline` (web `navigator.onLine`) et à
un bandeau. PatternLab est déjà **local-first** (contenu embarqué + progression
AsyncStorage) : la boucle d'apprentissage n'a aucune dépendance réseau. Le skill demande
une détection robuste (native différée), des états hors-ligne clairs, et de traiter le
hors-ligne comme un mode normal — pas une panne.

## Décision
1. **Connectivité branchable et testée** `src/lib/connectivity.ts` :
   - `ConnectivityStore` — magasin observable **pur** (état + abonnés ; ne notifie que sur
     un changement réel), testable avec une source factice.
   - `bindPlatformSource` — source web (`navigator.onLine` + événements `online`/`offline`) ;
     sur natif, suppose « en ligne » (détection native différée ; `@react-native-community/
     netinfo` fournira une source **sans changer les appelants** — aucune dépendance ajoutée).
   - Singleton `connectivity` + hook `useConnectivity()` (branche la source une seule fois).
   - Remplace `useIsOnline` (supprimé) ; le bandeau global (`_layout`) passe au nouveau hook.
2. **Disponibilité hors-ligne garantie et visible** `src/data/offline.ts` :
   `offlineCapabilities()` (pur) résume ce qui est embarqué (compétences, leçons,
   exercices, glossaire, badges) et confirme `contentReady` + `progressLocal`. Testé :
   tout le parcours est disponible sans réseau. Affiché dans le Profil (carte « Mode
   hors-ligne ») avec le statut de connexion en direct — message honnête et rassurant.
3. **Un vrai garde-fou réseau** : sur le paywall, « Activer » et « Restaurer » sont
   **désactivés hors-ligne** avec une raison explicite (« Connexion requise pour finaliser
   un achat »). Cela modélise la contrainte réelle d'un futur achat (StoreKit / Play
   Billing) et démontre l'UI pilotée par la connectivité, sans casser le mode démo en
   ligne. Le reste de l'app (leçons, sessions, quêtes, révisions, stats, glossaire) reste
   pleinement utilisable hors-ligne — zéro bouton mort.

## Conséquences
- Le hors-ligne est un mode de première classe : détecté, communiqué, et sans perte
  (contenu et progression locaux). La navigation et l'apprentissage fonctionnent sans
  réseau (vérifié en pilotant Chromium en mode offline).
- La détection native se branche plus tard en une source (NetInfo) sans toucher aux
  écrans. Le garde-fou d'achat est prêt pour un vrai magasin.

## Rollback
Revenir au bandeau seul : `connectivity.ts` et `offline.ts` sont additifs ; le garde-fou
du paywall et la carte Profil se retirent sans effet sur le reste. Aucune donnée n'est
concernée (rien n'a jamais transité par le réseau).
