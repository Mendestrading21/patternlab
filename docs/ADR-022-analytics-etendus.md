# ADR-022 — Analytics étendus (couche typée, indépendante du fournisseur, privacy-first)

## Statut
Accepté (LOT 16 — Analytics étendus, skill `patternlab-product-growth`).

## Contexte
La couche analytics se réduisait à un logger console/no-op avec une liste d'évènements
partielle. Le skill demande une **couche typée et indépendante du fournisseur**, une
taxonomie complète, et surtout un principe fort : **minimiser les données et ne jamais
envoyer d'informations financières personnelles** ni de PII. Il fallait aussi un moyen
pour l'utilisateur de refuser le suivi (opt-out).

## Décision
1. **Taxonomie typée et catégorisée** `src/analytics/events.ts` : liste essentielle du
   skill complétée (`app_opened`, `daily_mission_started/completed`, `interaction_*`,
   `hint_requested`, `false_signal_identified`, `mastery_changed`, `glossary_searched`,
   `concept_viewed`, `favorite_added`, `subscription_expired`, …). `EVENT_CATEGORIES`
   (lifecycle / onboarding / learning / engagement / monetization) est la **source
   unique** ; `ANALYTICS_EVENTS` en dérive. Test d'exhaustivité.
2. **Couche de confidentialité pure et testée** `src/analytics/privacy.ts` :
   `sanitizeProps` retire les **clés interdites** (email, name, iban, card, stripe,
   balance, montant, compte, broker, position…), **rédige** les valeurs ressemblant à un
   e-mail, **borne** la longueur des chaînes (120) et le nombre de propriétés (24).
   Appliquée à **chaque** évènement avant diffusion. Les requêtes sensibles ne sont jamais
   envoyées en clair (ex. `glossary_searched` n'émet que `queryLength`, pas le texte).
3. **Dispatcher indépendant du fournisseur** `src/analytics/analytics.ts` : pipeline
   `consentement → assainissement → diffusion` vers des **puits** enregistrables
   (`AnalyticsSink`). Puits fournis : `ConsoleSink` (dev only), `MemorySink` (tampon borné,
   débogage/tests/futur écran journal). Un puits qui échoue **n'interrompt jamais**
   l'application. Brancher un vrai fournisseur = enregistrer un puits (aucun réseau ici).
4. **Consentement (opt-out) persistant** : `consentRepository` (clé
   `patternlab.consent.v1`, `true` par défaut), chargé au démarrage et appliqué **avant**
   toute émission (`analytics.setConsent`). Bascule dans le Profil (carte
   « Confidentialité », `accessibilityRole="switch"`). Le consentement n'est **pas** remis
   à zéro par « Réinitialiser ma progression » (choix de vie privée distinct).
5. **Évènements réellement câblés** : `app_opened` (démarrage), `glossary_searched`
   (soumission de recherche, longueur seulement), `concept_viewed` (fiche glossaire),
   `daily_mission_started` (CTA accueil), `mastery_changed` (franchissement de palier de
   statut).

## Conséquences
- Analytics prêt pour la production : brancher un fournisseur validé côté vie privée sans
  toucher aux appels `analytics.track` existants (un puits de plus).
- Garantie structurelle : aucune PII ni donnée financière personnelle ne peut sortir, même
  en cas d'erreur d'appel — le sanitizer est le point de passage obligé.
- L'utilisateur garde le contrôle (opt-out persistant, respecté avant toute diffusion).

## Rollback
Retirer les puits/évènements ajoutés et la carte Confidentialité ; le dispatcher retombe
sur un no-op inerte (aucun puits). `privacy.ts`, `consentRepository` et la taxonomie sont
additifs. Aucun envoi réseau n'ayant jamais été branché, il n'y a aucune donnée à purger.
