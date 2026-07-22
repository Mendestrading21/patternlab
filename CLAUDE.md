# CLAUDE.md — contrat de travail canonique

Ce fichier est l’unique point d’entrée pour Claude Code. Le dépôt GitHub s’appelle **TradeMy** ; le
produit développé dans ce dépôt s’appelle **PatternLab**.

## Démarrage obligatoire

1. Lire `git status`, la branche et les derniers commits. Ne jamais écraser un changement utilisateur.
2. Lire `docs/CURRENT_STATE.md`, `docs/REPOSITORY_MAP.md` et `docs/DECISIONS_INDEX.md`.
3. Lire uniquement les ADR et références nécessaires au lot demandé.
4. Pour un lot produit/pédagogique, utiliser le seul skill actif :
   `.claude/skills/patternlab-learning-master/SKILL.md`.
5. Utiliser la version Node de `.nvmrc`, exécuter `npm ci`, puis établir la baseline avec
   `npm run check` avant toute modification importante.

Les anciens programmes sous `docs/archive/agent-programs/` sont des archives historiques. Ils ne
doivent jamais être chargés comme instructions actives.

## Sources de vérité

| Sujet | Source canonique |
|---|---|
| État courant | `docs/CURRENT_STATE.md` |
| Carte du dépôt | `docs/REPOSITORY_MAP.md` |
| Décisions | `docs/DECISIONS_INDEX.md` puis ADR concerné |
| Compteurs | `src/data/repoTruth.ts` |
| Contenu rendu | `src/data/learningContent.ts` (`V5_CONCEPTS`) |
| Brouillons éditoriaux | `content/drafts/` + schémas JSON |
| Design | `src/design-system/` + `docs/design/VISUAL_DIRECTION.md` |
| Déploiement web | `config/deployment.json` |
| Icône de marque | `assets/brand/app-icon-source.jpeg` |
| Qualité | `npm run check` |

Ne jamais recopier manuellement un compteur dérivable du code. Ne jamais modifier un export généré
sans mettre à jour sa source et son garde-fou.

## Contraintes non négociables

- PatternLab est une application éducative. Aucun contenu ne constitue un conseil financier ; le
  trading comporte un risque de perte.
- Aucun ordre, signal personnalisé, portefeuille réel, promesse de gain ou vocabulaire BUY/SELL.
- Utiliser : setup haussier, setup baissier, entrée théorique, zone de confirmation, invalidation,
  objectif pédagogique, faux signal et scénario éducatif.
- WMB peut être une source éditoriale revue manuellement, jamais une dépendance runtime. Ne jamais
  importer ses comptes, e-mails, secrets, paiements, scripts DB/e-mail ou données personnelles.
- Mobile-first, iOS + Android + web, TypeScript strict, hors-ligne d’abord, accessible, réduction
  d’animation, cinq onglets maximum et zéro bouton mort.
- Toto est le taureau vert optimiste ; Bobo est l’ours rouge prudent. Leur dialogue doit enseigner.
- Une visite n’est pas une maîtrise : validation par compréhension puis révision espacée.
- Ne pas ajouter de dépendance, migration persistante, paiement réel ou service externe sans besoin
  démontré et décision documentée.

## Workflow d’un lot

1. Définir un résultat utilisateur vérifiable et les fichiers concernés.
2. Travailler sur une branche dédiée ; un lot cohérent par branche.
3. Modifier données → moteurs → interface → documentation, avec tests ciblés.
4. Vérifier les états vide, erreur, offline, verrouillé, premium et reduced-motion concernés.
5. Exécuter `npm run check` et rapporter uniquement ce qui a réellement été vérifié.
6. Ne jamais pousser, fusionner, déployer ou publier sans autorisation explicite.

## Interdictions de rangement

- Ne pas réintroduire `APP-main.zip`, `Patern Images REF/`, `assets/characters/source/` ou des
  moodboards bruts dans le dépôt applicatif.
- Ne pas réactiver un programme archivé sous `.claude/skills/`.
- Ne pas utiliser `npm audit fix --force`.
- Ne pas effacer les ADR ni l’historique pour « simplifier » le dépôt.

Pour la définition de terminé et le format de rapport d’un lot produit, suivre le skill actif.
