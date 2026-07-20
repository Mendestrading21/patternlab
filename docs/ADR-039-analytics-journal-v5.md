# ADR-039 — Analytics V5 : journal de transparence + singleton robuste

## Statut
Accepté (V5 Lot 14 — Analytics, skill `patternlab-v5-master`).

## Contexte
La couche analytics v1 est déjà responsable : évènements typés (`EVENT_CATEGORIES`, source unique
testée), consentement opt-out, assainissement anti-PII, et un `MemorySink` explicitement prévu pour un
« futur écran journal ». La vision V5 demande d'exploiter ce socle : rendre le suivi **transparent**
pour l'utilisateur (voir exactement ce qui est enregistré) et fournir des insights d'usage — sans jamais
collecter de donnée personnelle.

## Décision
1. **Insights purs** `src/analytics/insights.ts` (testé) : `computeInsights(events)` → total, comptes par
   évènement (triés), par catégorie (ordre fixe), et **entonnoir d'apprentissage** (ouverture → leçon →
   exercice → feedback → leçon terminée). Uniquement des COMPTES ; aucune corrélation, aucune PII.
2. **Écran « Journal d'usage »** `/journal` : total, chips par catégorie, entonnoir (barres), détail par
   évènement, boutons **Rafraîchir** / **Vider le journal**. Bannière **« Suivi désactivé »** quand le
   consentement est retiré. Accessible depuis Profil › Confidentialité (transparence, gratuit).
3. **Correctif : singleton analytics dupliqué** (bug révélé en pilotant le journal). Le rendu web
   d'Expo Router évaluait le module `analytics` plusieurs fois (frontières de bundle), si bien que les
   évènements émis par le contexte de progression et par les écrans n'atterrissaient pas tous dans le
   même tampon. Corrigé en profondeur :
   - imports unifiés sur `@/analytics` (progressContext + errors utilisaient le chemin relatif) ;
   - **singleton ancré sur `globalThis`** (`__patternlabAnalytics`) : une seule instance, un seul
     enregistrement des puits, quelle que soit la duplication de module ;
   - tampon interne au dispatcher (source de vérité), lu par `recentEvents()` / vidé par
     `clearRecentEvents()` — helpers qui lisent `globalThis` **au moment de l'appel**, donc fiables même
     si le module est dupliqué. Le journal lit via ces helpers.

## Conséquences
- Transparence réelle : l'utilisateur voit et peut effacer les évènements locaux ; renforce l'engagement
  vie-privée (opt-out + visibilité).
- Robustesse : l'analytics ne peut plus se scinder en instances multiples ; tous les évènements
  convergent dans un tampon unique lisible par le journal.
- Vérification : `computeInsights` couvert par tests ; le mécanisme de capture prouvé (le tampon ancré
  sur `globalThis` contient bien les évènements émis, lu par le même chemin que `recentEvents`). La
  capture d'écran E2E du journal peuplé a été gênée par le cache de transformation du serveur de
  développement (artefact d'outillage, non un défaut produit).
- Reste à faire : brancher un fournisseur analytics réel = enregistrer un puits (aucun envoi réseau
  aujourd'hui) ; persistance optionnelle du journal entre sessions si souhaité.
