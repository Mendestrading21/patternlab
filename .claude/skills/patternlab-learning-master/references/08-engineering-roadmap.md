# Roadmap d’ingénierie

> **Trajectoire historique.** Les lots 0 à 9 sont terminés et le Lot 10 a commencé. Ne pas les
> relancer depuis cette liste : utiliser les statuts de `docs/PROJECT_STATUS.md`, puis exécuter un
> seul prochain lot validé.

Exécuter dans l’ordre, un flux complet à la fois. Ne pas publier automatiquement.

## Lot 0 — Vérité du dépôt

- Baseline reproductible.
- Compteurs générés.
- Documentation courante séparée de l’historique.
- Registre unique routes/contenus/formats.
- Aucun fallback silencieux.

## Lot 1 — Navigation et accueil simplifiés

- Onglets : Accueil, Parcours, Apprendre, Réviser, Profil.
- Déplacer Laboratoire dans Apprendre.
- Réduire l’accueil à la mission et aux informations essentielles.
- Tests de toutes les routes visibles.

## Lot 2 — Hiérarchie pédagogique unique

- Ajouter Module et Skill au modèle des 15 mondes.
- Migrer les 4 skills pilotes dans le monde 1.
- Route détail Monde.
- Déblocage fondé sur checkpoints.
- Migration non destructive de progression.

## Lot 3 — Session step-by-step

- Un step par écran.
- Reprise de session.
- Feedback et remédiation.
- Résultat de maîtrise réel.
- Contre-exemple obligatoire.

## Lot 4 — Fondations interactives

- Concepts riches Dividende et PER.
- Visualisations économie/mécanismes.
- Leçons et exercices du premier monde.
- Checkpoint complet.

## Lot 5 — Graphique canonique

- Axes, grille, volume, overlays et replay.
- Modes static/guided/interactive/blind.
- Dataset et calculs purs.
- Accessibilité et snapshots.

## Lot 6 — Indicateurs

- RSI, MACD, Bollinger, moyennes, volume/VWAP.
- Labs paramétrables.
- Quiz visuels et faux signaux.

## Lot 7 — Exercices adaptatifs

- Registre unique des formats.
- Finaliser/retirer drag_drop, draw_level et timed.
- Misconceptions typées.
- Réinsertion adaptative et deck d’erreurs.

## Lot 8 — Glossaire et bibliothèque premium

- Recherche unifiée.
- Mini-visuels et statuts de maîtrise.
- Favoris/collections.
- Navigation vers concepts et pratique.
- Comparaison visuelle.

## Lot 9 — Toto/Bobo V3

- `MascotMoment`.
- Animations contextuelles.
- Dialogues liés aux erreurs.
- Inventaire d’assets et reduced motion.

## Lot 10 — Contenu des 15 mondes

- Atteindre 75 concepts jouables, puis 150.
- Relier chaque concept à leçon, exercice et révision.
- Checkpoints et prérequis.
- Revue humaine et provenance.

## Lot 11 — Progression, révision et rétention

- États Découvert/Pratiqué/Compris/Solide/Maîtrisé.
- Révisions au niveau concept.
- Célébrations de badges.
- Statistiques 30 jours.
- Quêtes reléguées hors du CTA principal.

## Lot 12 — Abonnement réel prêt à brancher

- Une offre Plus.
- Abstraction entitlement.
- États achat/restauration/offline/expiration.
- Aucun achat réel sans comptes, politique, prix et autorisation.

## Lot 13 — Release native

- Tests VoiceOver/TalkBack.
- NetInfo natif.
- Build EAS signé.
- TestFlight/Play interne.
- Crash/analytics fournisseur selon consentement.
- Captures et fiches stores.

## Migration

- Versionner chaque schéma persistant.
- Assainir les entrées.
- Préserver XP, progression et favoris.
- Fournir migration descendante uniquement si raisonnable ; sinon sauvegarde/version explicite.
- Tester vN-2 → vN, données partielles et valeurs corrompues.

## Discipline Git

- Conserver les changements utilisateur.
- Petits commits cohérents.
- Aucun force-push.
- Une branche par lot si demandé.
- Push, PR, fusion et déploiement uniquement avec autorisation.
