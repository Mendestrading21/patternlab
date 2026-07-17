# 06 — Monétisation, analytics et croissance

## Principe

La monétisation doit intervenir après une démonstration de valeur. Ne jamais bloquer l'utilisateur avant sa première interaction utile et son premier moment de réussite.

## Modèle recommandé

### Gratuit

- onboarding ;
- diagnostic ;
- premier monde ;
- mission quotidienne limitée ;
- progression et série ;
- glossaire de départ ;
- quelques révisions ;
- quelques scénarios de laboratoire.

### Premium

- tous les mondes ;
- laboratoires complets ;
- exercices avancés ;
- révisions illimitées ;
- statistiques détaillées ;
- mode hors ligne étendu ;
- synchronisation future ;
- parcours spécialisés ;
- nouveau contenu.

## Prix comme configuration, jamais en dur dispersé

Hypothèses initiales :

- Pass Fondateur : 14,99 CHF/€ ;
- Mensuel indicatif : 7,99 CHF/€ ;
- Annuel indicatif : 39,99 ou 44,99 CHF/€.

Le prix final nécessite validation commerciale. Centraliser devise, pays, produit, période et textes.

## Paywall

Afficher après :

- première interaction ;
- compréhension de la valeur ;
- première réussite ou exploration d'un contenu premium.

Le paywall explique :

- valeur concrète ;
- contenu gratuit conservé ;
- fonctionnalités premium ;
- prix et période ;
- essai éventuel ;
- renouvellement ;
- restauration ;
- annulation ;
- disclaimer éducatif.

Éviter les dark patterns, faux comptes à rebours et boutons de fermeture dissimulés.

## Architecture des droits

Abstraire :

- products ;
- entitlements ;
- purchaseState ;
- trial ;
- expiration ;
- restore ;
- premiumGate ;
- localDemoProvider ;
- futur provider réel.

Ne déclencher aucun achat réel sans autorisation et configuration explicites.

## Gamification responsable

Récompenser :

- leçon terminée ;
- révision ;
- concept maîtrisé ;
- faux signal identifié ;
- régularité ;
- diversité des compétences ;
- checkpoint réussi.

Ne jamais récompenser :

- gains fictifs ;
- rendement ;
- prise de risque ;
- vitesse au détriment de la compréhension.

La série doit prévoir jours de repos, protection limitée et messages non culpabilisants.

## Analytics

Couche typée et indépendante du fournisseur.

Événements recommandés :

- app_opened ;
- onboarding_started/completed ;
- goal_selected ;
- level_selected ;
- daily_goal_selected ;
- topics_selected ;
- diagnostic_started/completed ;
- path_generated ;
- daily_mission_viewed/started/completed ;
- lesson_started/completed ;
- lesson_step_viewed ;
- interaction_started/completed ;
- exercise_viewed/answered ;
- answer_changed ;
- hint_requested ;
- feedback_viewed ;
- false_signal_identified ;
- review_scheduled/started/completed ;
- mastery_changed ;
- streak_updated ;
- path_node_unlocked ;
- checkpoint_completed ;
- achievement_unlocked ;
- lab_started/completed ;
- glossary_searched ;
- concept_viewed ;
- favorite_added ;
- paywall_viewed ;
- premium_gate_hit ;
- trial_started ;
- subscription_started/restored/expired ;
- app_error.

## Vie privée

- minimiser les données ;
- ne pas envoyer de texte libre sans nécessité ;
- ne pas inclure de données financières personnelles ;
- permettre consentement et désactivation futurs ;
- documenter les propriétés ;
- ne pas dupliquer les événements.

## KPI

- activation ;
- première mission terminée ;
- D1, D7, D30 ;
- sessions par semaine ;
- durée de session ;
- progression mastery ;
- révisions réalisées ;
- concepts fragiles ;
- usage du laboratoire ;
- paywall après valeur ;
- essai ;
- conversion ;
- churn ;
- abandon par écran ou contenu.

## Expérimentation

Tester une variable à la fois :

- promesse onboarding ;
- objectif quotidien ;
- ordre des écrans ;
- moment du paywall ;
- Pass Fondateur vs abonnement ;
- mission de 3, 5 ou 10 minutes ;
- type de feedback ;
- fréquence Toto/Bobo.

Aucune expérience ne doit dégrader la conformité financière, l'accessibilité ou la compréhension.
