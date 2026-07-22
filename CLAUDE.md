# CLAUDE.md — contrat de travail canonique

Ce fichier est l’unique point d’entrée pour Claude Code.

- **Marque publique : Trademy**
- **Dépôt : TradeMy**
- **PatternLab : identifiant historique interne uniquement**
- **Signature : « Ne parie pas. Comprends. »**

## Démarrage obligatoire

1. Lire `git status`, la branche et les derniers commits. Ne jamais écraser un changement utilisateur.
2. Lire `docs/CURRENT_STATE.md`, `docs/REPOSITORY_MAP.md` et `docs/DECISIONS_INDEX.md`.
3. Pour tout travail produit, design, contenu ou UX, lire :
   - `docs/product/TRADEMY_PRODUCT_VISION.md`
   - `docs/design/TRADEMY_LEARNING_GLASS.md`
   - `docs/product/TOTO_BOBO_CANON.md`
   - `docs/product/LEARNING_CONTENT_ARCHITECTURE.md`
   - `docs/product/TRADEMY_EXECUTION_PLAN.md`
4. Lire uniquement les ADR nécessaires au lot demandé.
5. Pour un lot pédagogique, utiliser le seul skill actif :
   `.claude/skills/patternlab-learning-master/SKILL.md`.
6. Utiliser la version Node de `.nvmrc`, exécuter `npm ci`, puis établir la baseline avec
   `npm run check` avant toute modification importante.

Les programmes sous `docs/archive/agent-programs/` sont historiques et ne sont jamais des instructions actives.

## Sources de vérité

| Sujet | Source canonique |
|---|---|
| Vision et marque | `docs/product/TRADEMY_PRODUCT_VISION.md` |
| Design, palette, composants, graphiques | `docs/design/TRADEMY_LEARNING_GLASS.md` puis `src/design-system/` |
| Mascottes et motion | `docs/product/TOTO_BOBO_CANON.md` puis `src/characters/` |
| Modèle des 500+ concepts | `docs/product/LEARNING_CONTENT_ARCHITECTURE.md` |
| Ordre d’exécution et terminé | `docs/product/TRADEMY_EXECUTION_PLAN.md` |
| État courant | `docs/CURRENT_STATE.md` |
| Carte du dépôt | `docs/REPOSITORY_MAP.md` |
| Décisions | `docs/DECISIONS_INDEX.md` puis ADR concerné |
| Compteurs réels | `src/data/repoTruth.ts` |
| Contenu rendu | `src/data/learningContent.ts` (`V5_CONCEPTS`) |
| Brouillons éditoriaux | `content/drafts/` + schémas JSON |
| Déploiement web | `config/deployment.json` |
| Qualité | `npm run check` |

Ne jamais recopier un compteur dérivable du code. Ne jamais modifier un export généré sans sa source et son garde-fou.

## Contraintes non négociables

- Trademy est une application éducative. Aucun contenu ne constitue un conseil financier ; le trading comporte un risque de perte.
- Aucun ordre, signal personnalisé, portefeuille réel, promesse de gain ou vocabulaire BUY/SELL.
- Utiliser : setup haussier, setup baissier, entrée théorique, zone de confirmation, invalidation, objectif pédagogique, faux signal et scénario éducatif.
- Mobile-first, iOS + Android + web, TypeScript strict, offline-first, accessible, reduced-motion, cinq onglets maximum et zéro bouton mort.
- Toto est le taureau vert enthousiaste ; Bobo est l’ours rouge prudent. Leur dialogue enseigne une condition, une preuve, une invalidation ou une misconception.
- Une visite n’est pas une maîtrise : observer, formuler, vérifier, manipuler, répondre, expliquer puis réviser.
- Les couleurs sont sémantiques : violet = marque/CTA ; vert/rouge = marché ; cyan = annotation ; or = zone importante. Ne pas les réinterpréter localement.
- Toute iconographie et tout graphique sont originaux. Les références externes et images avec filigrane ne sont jamais des assets.
- Ne pas ajouter de dépendance, migration persistante, paiement ou service externe sans besoin démontré et décision documentée.

## Workflow d’un lot

1. Définir un résultat utilisateur vérifiable et les fichiers concernés.
2. Travailler sur une branche dédiée ; un lot cohérent par branche.
3. Modifier tokens/données → moteurs → composants → écrans → documentation.
4. Prévoir loading, vide, erreur, offline, verrouillé, premium et reduced-motion si concernés.
5. Vérifier petit écran mobile, 390 × 844 et web large.
6. Exécuter les tests ciblés puis `npm run check`.
7. Rapporter uniquement les validations réellement exécutées.
8. Ne jamais pousser, fusionner, déployer ou publier sans autorisation explicite.

## Interdictions de rangement

- Ne pas réintroduire `APP-main.zip`, `Patern Images REF/`, `assets/characters/source/` ou des moodboards bruts.
- Ne pas réactiver un programme archivé sous `.claude/skills/`.
- Ne pas utiliser `npm audit fix --force`.
- Ne pas effacer les ADR ni l’historique.
- Ne pas lancer une refonte globale en un commit ; suivre les phases et lots du plan Trademy.
