---
name: patternlab-full-launch
description: Pilote de bout en bout la conception, l’architecture, le développement, l’import WMB, les animations de Toto et Bobo, les tests, GitHub, la bêta et le lancement iOS/Android de PatternLab.
---

# PatternLab — Full Launch Skill

## Mission

Construire PatternLab comme une application autonome d’apprentissage de la finance et de l’analyse de marché, réellement jouable, mobile-first, émotionnelle et évolutive.

Le produit s’inspire des meilleurs principes de micro-apprentissage et de rétention, mais ne copie ni l’identité, ni les écrans, ni les personnages, ni les textes d’une application existante.

## Identité définitive

- **Marque produit : PatternLab**
- **Toto : taureau vert**, enthousiaste, curieux, optimiste, représente l’élan et l’hypothèse haussière.
- **Bobo : ours rouge**, prudent, exigeant, sceptique, représente le risque et l’hypothèse baissière.
- Les textes visibles « Toro & Bruno » présents dans certaines références sont des maquettes temporaires : les remplacer par **PatternLab**, **Toto** et **Bobo**.
- Ne jamais transformer Bobo en cochon ou en taureau.
- Ne jamais présenter Toto comme une promesse de hausse ni Bobo comme une certitude de baisse.

## Références visuelles obligatoires

Inspecte avant de dessiner ou coder :

- `assets/visual-references/01-app-icon-toto-bobo.jpeg`
- `assets/visual-references/02-character-situations.jpeg`
- `assets/visual-references/03-interface-concepts.jpeg`
- `assets/visual-references/04-mobile-product-concepts.jpeg`
- `assets/visual-references/05-mobile-dashboard-concepts.jpeg`

Ces images fixent :

- le contraste sombre premium ;
- la chaleur et l’expressivité des personnages ;
- les volumes 3D doux ;
- le vert haussier et le rouge baissier ;
- les cartes arrondies ;
- les scènes d’apprentissage ;
- la qualité attendue.

Elles ne doivent pas être copiées écran par écran. Construis un système cohérent, original, accessible et industrialisable.

## Documents à lire selon la tâche

- `reference/01-product-vision.md`
- `reference/02-technical-architecture.md`
- `reference/03-toto-bobo-character-bible.md`
- `reference/04-design-system.md`
- `reference/05-animation-system.md`
- `reference/06-learning-engine.md`
- `reference/07-pattern-lab-engine.md`
- `reference/08-wmb-migration.md`
- `reference/09-github-delivery.md`
- `reference/10-quality-release.md`
- `reference/11-roadmap.md`

## Règles absolues

1. Commence par le mode Plan.
2. N’écris aucun fichier avant validation du plan lorsqu’un plan est demandé.
3. Audite l’état réel du dépôt avant de décider.
4. Dans un dossier vide, prépare un projet Expo/React Native/TypeScript avec Expo Router, après vérification de la documentation officielle actuelle.
5. N’impose aucune version obsolète : utilise les commandes et versions officiellement recommandées au moment de l’exécution.
6. Utilise React Native Reanimated pour les transitions et micro-interactions compatibles ; évalue Rive ou Lottie pour les personnages dans un ADR avant adoption.
7. Le prototype doit tourner sur iOS, Android et web.
8. La PWA/web ne remplace pas les validations sur appareil mobile.
9. Tout bouton visible doit fonctionner ou être clairement désactivé avec une raison.
10. Ne crée jamais uniquement une galerie de maquettes.
11. Le moteur pédagogique doit être indépendant du contenu.
12. Les futurs modules et patterns doivent pouvoir être ajoutés sans modifier le cœur de l’application.
13. Les contenus WMB sont importés en brouillon, avec leur origine et leur hash.
14. Les comptes, mots de passe, emails, Stripe, notes privées et données personnelles WMB ne sont jamais importés automatiquement.
15. Aucun contenu financier généré par IA n’est publié sans validation humaine.
16. Aucun signal, conseil personnalisé, promesse de gain ou exécution de transaction.
17. Aucun compte de courtage réel dans PatternLab.
18. Ne pousse jamais sur GitHub, ne crée jamais un dépôt distant et ne publie jamais dans les stores sans approbation explicite.
19. N’utilise pas `--dangerously-skip-permissions`.
20. Conserve un journal des décisions et un plan de rollback.

## Architecture recommandée

Pour un nouveau produit, privilégie :

- Expo + React Native + TypeScript ;
- Expo Router ;
- React Native Reanimated ;
- persistance locale abstraite ;
- Expo SQLite pour le contenu/progression locale lorsque pertinent ;
- SecureStore uniquement pour les secrets locaux ;
- moteur graphique SVG ou Skia après benchmark ;
- monorepo léger uniquement si l’admin web et les packages partagés le justifient ;
- EAS Build/Submit pour les builds et soumissions après validation.

Ne transforme pas cette recommandation en dogme. Vérifie le dépôt et rédige un ADR pour toute décision majeure.

## Mode Plan obligatoire

La première réponse doit produire :

1. inventaire du dépôt ;
2. état fonctionnel réel ;
3. vision du MVP ;
4. architecture cible ;
5. structure GitHub ;
6. modèle de contenu ;
7. moteur de leçons ;
8. moteur des exercices ;
9. moteur de patterns ;
10. système Toto/Bobo ;
11. animations ;
12. import WMB ;
13. écrans ;
14. persistance/offline ;
15. analytics ;
16. accessibilité ;
17. sécurité ;
18. tests ;
19. CI/CD ;
20. bêta ;
21. App Store/Play Store ;
22. lots P0/P1/P2 ;
23. fichiers exacts ;
24. critères d’acceptation ;
25. risques et décisions demandées.

Arrête-toi après le plan.

## Parcours MVP obligatoire

Construis une tranche verticale complète appelée **Lire un graphique** :

- comprendre une action et un graphique ;
- bougies japonaises ;
- tendance ;
- support ;
- résistance ;
- volume ;
- moyenne mobile ;
- RSI ;
- MACD ;
- bandes de Bollinger ;
- gestion du risque ;
- premiers patterns.

Cible :

- 30 à 40 micro-leçons ;
- 100 à 150 exercices ;
- 50 à 100 flashcards ;
- 5 évaluations ;
- 20 à 30 patterns initiaux ;
- un parcours jouable de bout en bout.

## Écrans minimums

- splash ;
- onboarding ;
- choix d’objectif ;
- test de niveau facultatif ;
- création de profil ;
- accueil ;
- mission du jour ;
- parcours ;
- module ;
- leçon ;
- exercice ;
- correction ;
- résultat ;
- révisions ;
- laboratoire de patterns ;
- glossaire ;
- défis ;
- réussites ;
- profil ;
- statistiques ;
- réglages ;
- paywall de démonstration ;
- écran hors ligne ;
- état d’erreur ;
- admin de contenu séparé si nécessaire.

## Formats d’exercices minimums

1. QCM
2. vrai/faux expliqué
3. association
4. classement
5. glisser-déposer
6. sélectionner une zone sur graphique
7. tracer support/résistance
8. identifier un pattern
9. trouver l’erreur
10. scénario conditionnel
11. réponse numérique
12. défi chronométré

## Animation obligatoire

Toto et Bobo doivent posséder un système d’états :

- idle ;
- welcome ;
- explain ;
- think ;
- celebrate ;
- encourage ;
- confused ;
- wrong-answer ;
- warning ;
- debate ;
- level-up ;
- streak ;
- rest ;
- offline ;
- loading.

Les animations doivent être courtes, contextuelles, désactivables et compatibles avec la préférence « réduire les animations ».

## GitHub

Prépare localement :

- dépôt Git initialisé ;
- branche `main` protégée dans les recommandations ;
- branche de travail ;
- README ;
- CLAUDE.md ;
- conventions ;
- issues ;
- PR template ;
- CI ;
- changelog ;
- décisions d’architecture ;
- sécurité ;
- roadmap.

Avant de créer un dépôt distant, demande :

- nom du dépôt ;
- propriétaire ;
- visibilité publique ou privée ;
- licence ;
- stratégie de branches.

## Définition de terminé

Le socle est terminé lorsque :

- l’app démarre sur iOS, Android et web ;
- le parcours pilote est complet ;
- la progression persiste ;
- les révisions fonctionnent ;
- six formats d’exercices au minimum sont validés, puis douze avant bêta ;
- Toto et Bobo réagissent sans gêner l’apprentissage ;
- les animations respectent l’accessibilité ;
- l’import WMB est traçable et idempotent ;
- la CI est verte ;
- aucun bouton mort ;
- aucun secret ;
- aucune donnée personnelle WMB ;
- une build interne iOS/Android est produite ;
- un rapport de tests et un rollback existent ;
- l’ajout d’un nouveau module ne demande pas de réécrire le moteur.
