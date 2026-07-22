# État courant de TradeMy / PatternLab

**Date de référence :** 22 juillet 2026

**Dépôt :** `Mendestrading21/TradeMy`

**Base vérifiée :** `main` au commit `5f34d57`

**Branche de fondation :** `cleanup/repository-foundation`

## Produit

Le socle Expo/React Native est fonctionnel et ne doit pas être reconstruit. PatternLab possède déjà
sa navigation à cinq onglets, son parcours de 15 mondes, ses leçons, exercices, révisions, glossaire,
bibliothèque visuelle, laboratoires, progression locale et guides Toto/Bobo.

Les valeurs exactes du corpus et des registres ne sont jamais maintenues ici : consulter
`src/data/repoTruth.ts`, contrôlé par `src/data/repoTruth.test.ts`.

## Fondation 2026-07-22

- identité produit **PatternLab** séparée du nom de dépôt **TradeMy** ;
- chemin GitHub Pages centralisé dans `config/deployment.json` et contrôlé sous `/TradeMy/` ;
- Node/npm harmonisés pour local, CI et déploiement ;
- icônes Expo remplacées par l’identité Toto/Bobo sur web, iOS, Android et splash ;
- un seul skill Claude actif et trois documents d’entrée canoniques ;
- ZIP WMB, moodboards bruts, sources graphiques lourdes et scripts temporaires retirés de l’arbre
  courant ; ils restent récupérables dans l’historique Git de la base ;
- contenu et assets runtime inchangés : ce lot est une fondation, pas une refonte fonctionnelle.

## Programme actif

Le programme `patternlab-learning-master` reste la trajectoire produit. Les lots 0 à 9 et le premier
incrément du Lot 10 sont dans `main`. La prochaine évolution produit doit poursuivre un seul objectif
à la fois : enrichissement éditorial revu humainement, puis progression/rétention, sans rouvrir les
anciens programmes archivés.

## Refonte Trademy — en cours (branche `feat/trademy-complete-redesign`)

Transformation complète vers l'identité **Trademy** guidée par les documents canoniques (vision,
Trademy Learning Glass, Toto/Bobo, architecture 500+, plan d'exécution — PR #2 fusionnée). Exécution
par lots ; `main` n'est jamais modifié directement ; livrable = une PR vers `main`.

- **Lot 1 — Identité & tokens** ✅ : marque publique **Trademy** partout (app.json, appInfo,
  manifeste PWA, `+html`, écrans Accueil/Profil/Premium, label éditorial), signature
  « Ne parie pas. Comprends. ». Design system **Trademy Learning Glass** installé dans
  `src/design-system/tokens.ts` : marque **violette** (CTA), marché vert/rouge, or (zones), cyan
  (annotations), feedback pédagogique **distinct** du marché, bloc `motion`. Contraste WCAG AA
  reverrouillé ; nouveau `tokens.test.ts` garde l'identité. Voir **ADR-076**.

Prochain lot : **Lot 2 — composants partagés & jeu d'icônes Trademy**.

## Gate canonique

```bash
npm ci
npm run check
```

Le résultat exact de la gate appartient au rapport de commit/PR, jamais à une valeur historique
copiée ici.

## Limites connues

- Les fichiers retirés de la branche restent présents dans l’historique Git public. Une purge de
  l’historique serait une opération séparée, destructive et soumise à validation explicite.
- Les imports WMB pédagogiques ne sont pas encore normalisés vers un générateur runtime unique.
- Les builds natifs signés et les stores exigent les comptes Apple/Google du propriétaire.
- `npm audit` ne remonte plus de vulnérabilité haute ou critique. Les alertes modérées restantes sont
  transitives dans la chaîne Expo ; la correction automatique proposée rétrograderait le SDK et ne
  doit pas être appliquée avec `--force`.
