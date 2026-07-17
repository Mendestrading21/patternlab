# 07 — Roadmap d'exécution Product V2

## Principe

Exécuter un lot par session importante. Un lot produit une fonctionnalité visible, testée, documentée et réversible.

## Lot 0 — Fiabilité

- audit réel ;
- cohérence XP affichés/enregistrés ;
- absence de double attribution ;
- progression et déblocage ;
- migrations ;
- documentation obsolète ;
- inventaire des assets.

## Lot 1 — Design System V2

- base graphite/bleu nuit ;
- tokens sémantiques ;
- séparation finance/feedback ;
- composants et états ;
- accessibilité ;
- migration des écrans existants.

## Lot 2 — Navigation

- onglets Accueil, Parcours, Laboratoire, Révisions, Profil ;
- routes mortes et doublons ;
- retour, erreur, hors ligne ;
- PWA et deep links.

## Lot 3 — Onboarding personnalisé

- promesse ;
- objectif ;
- niveau ;
- temps quotidien ;
- sujets ;
- diagnostic facultatif ;
- parcours recommandé ;
- première interaction.

## Lot 4 — Accueil mission du jour

- une priorité principale ;
- mission ;
- révision due ;
- progression compacte ;
- raccourcis secondaires.

## Lot 5 — Parcours immersif

- mondes et modules ;
- carte ;
- nœuds ;
- checkpoints ;
- états ;
- révisions intégrées.

## Lot 6 — Leçons V2

- steps structurés ;
- alternance visuel/interaction ;
- Toto/Bobo ;
- erreur fréquente ;
- faux signal ;
- flashcard ;
- reprise.

## Lot 7 — Exercices avancés

- registry extensible ;
- drag/drop ;
- zone ;
- tracé ;
- invalidation ;
- OHLC ;
- scénario ;
- comparaison ;
- faux signal ;
- replay.

## Lot 8 — Laboratoire graphique

- benchmark technologique ;
- ADR ;
- prototype ;
- annotations ;
- replay ;
- premier scénario accessible.

## Lot 9 — Maîtrise adaptative

- mastery ;
- confidence ;
- errorTags ;
- révisions ;
- difficulté ;
- migrations.

## Lot 10 — Toto/Bobo V2

- registre d'assets ;
- états ;
- fréquence ;
- débat ;
- reduced motion ;
- nettoyage prouvé des doublons.

## Lot 11 — Migration APP pilote

- pipeline ;
- schémas ;
- 50 concepts pilotes ;
- exercices en brouillon ;
- rapport ;
- revue humaine.

## Lot 12 — Glossaire et fiches

- recherche ;
- filtres ;
- favoris ;
- relations ;
- fiches ;
- mini-quiz ;
- accès contextuel.

## Lot 13 — Gamification responsable

- défis ;
- badges ;
- série ;
- jours de repos ;
- récompenses pédagogiques.

## Lot 14 — Statistiques et profil

- temps ;
- mastery ;
- faiblesses ;
- révisions ;
- préférences ;
- favoris ;
- données locales.

## Lot 15 — Monétisation technique

- droits abstraits ;
- paywall démo ;
- Pass Fondateur ;
- abonnement indicatif ;
- restauration simulée ;
- aucun achat réel.

## Lot 16 — Analytics

- événements typés ;
- propriétés ;
- vie privée ;
- documentation ;
- fournisseur abstrait.

## Lot 17 — Offline et sync future

- repositories ;
- séparation contenu/progression/préférences ;
- migrations ;
- offline ;
- stratégie de conflit ;
- pas de backend prématuré.

## Lot 18 — Accessibilité complète

- VoiceOver/TalkBack ;
- clavier ;
- contrastes ;
- graphiques alternatifs ;
- reduced motion ;
- alternatives aux gestes.

## Lot 19 — Release readiness

- unitaires ;
- intégration ;
- E2E ;
- performance ;
- CI ;
- documentation ;
- rapport bêta.

## MVP

Indispensable : lots 0 à 9, une partie de 10, une migration pilote limitée, accessibilité de base et tests.

## Bêta

Lots 10 à 18 avec contenu suffisant, paywall de démonstration, analytics et offline robuste.

## Lancement stores

Utiliser ensuite le skill `patternlab-full-launch` pour EAS, builds internes, TestFlight, Play Internal, store listings, conformité et monitoring.

## Dépendances

- Ne pas refaire l'accueil avant les tokens essentiels.
- Ne pas industrialiser 500+ concepts avant les schémas et le moteur de leçon.
- Ne pas choisir Skia/Canvas avant benchmark.
- Ne pas connecter les achats avant l'abstraction des droits.
- Ne pas lancer la synchronisation avant des migrations locales robustes.
- Ne pas supprimer d'assets avant registre et recherche des références.
