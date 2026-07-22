# Plan d’exécution Claude Code — Trademy

## Règle générale

Un lot = un résultat utilisateur démontrable, une branche, des tests et une revue. Ne jamais refondre toute l’application dans un commit géant.

## Phase 1 — identité et fondations UI

1. Remplacer la marque visible PatternLab par Trademy sans renommer aveuglément les identifiants internes.
2. Installer les tokens Learning Glass dans le design system.
3. Créer les icônes originales et composants canoniques.
4. Uniformiser navigation, typographie, rayons, spacing et états.
5. Auditer chaque couleur en dur et chaque emoji utilisé comme icône.
6. Vérifier mobile, web, dark mode et reduced-motion.

## Phase 2 — expérience d’apprentissage

1. Refaire Accueil autour d’une mission et d’une reprise.
2. Consolider le Parcours en carte verticale claire.
3. Enrichir Apprendre avec bibliothèque, glossaire et labs.
4. Améliorer Réviser par misconceptions et répétition espacée.
5. Clarifier Profil : progression, maîtrise, badges, réglages.

## Phase 3 — graphiques et laboratoires

1. Normaliser toutes les primitives chart.
2. Ajouter axes, légendes, annotations et descriptions.
3. Produire des schémas originaux pour mécanique du prix, liquidité, tendance, range et faux signal.
4. Étendre les labs aux indicateurs prioritaires.
5. Ajouter exemples guidés et mode aveugle testés.

## Phase 4 — contenu

Avancer par paquets équilibrés de concepts. Commencer par les fondations qui débloquent le plus de prérequis, puis chandeliers/structure, figures, indicateurs, risk et psychologie. Chaque paquet passe par needsReview et les critères de qualité.

## Phase 5 — mascottes et rétention

1. Canoniser les états Toto/Bobo.
2. Brancher les réactions aux événements pédagogiques.
3. Ajouter révisions, séries et quêtes sans dark patterns.
4. Préparer des animations originales avec fallback statique.
5. Mesurer compréhension et retour, jamais activité vide.

## Phase 6 — premium et release

Seulement après validation du cœur : modèle gratuit/premium, paywall honnête, analytics respectueux, crash reporting, conformité stores, tests E2E et release pilote.

## Définition de terminé d’un lot

- résultat visible sur écran réel ;
- aucune rupture de navigation ;
- aucun bouton mort ;
- zéro couleur/spacing local non justifié ;
- loading, vide, erreur, offline, verrouillé et premium couverts si concernés ;
- accessibilité et reduced-motion ;
- tests ciblés ;
- npm run check vert ;
- documentation et ADR si décision durable ;
- captures ou description précise de la vérification ;
- rappel éducatif présent lorsque nécessaire.

## Ordre immédiat recommandé

1. Identité publique Trademy et tokens.
2. Navigation + accueil.
3. Parcours et fiche monde.
4. Carte concept et graphique pédagogique.
5. Session, feedback et Toto/Bobo.
6. Bibliothèque/glossaire.
7. Labs.
8. Incréments de contenu.
