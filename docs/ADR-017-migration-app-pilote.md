# ADR-017 — Migration APP/WMB pilote (pipeline de contenu)

## Statut
Accepté (LOT 11 — Migration APP pilote, skill `patternlab-product-growth`).

## Contexte
Le contenu historique WMB vit dans `Mendestrading21/APP`. Le skill impose de l'importer
**en brouillons**, avec **origine + hash**, sans jamais en faire une dépendance runtime,
et **sans aucune donnée personnelle**. Il faut un pipeline
(inventaire → … → brouillons → validation → revue humaine → publication versionnée).

## Décision
1. **Cœur pur et testé** `src/content/importPipeline.ts` : `contentHash` (FNV-1a),
   `slugify`, `normalizeText`, `classifyCategory` (5 catégories), `hasPersonalData`
   (garde), `toDraftConcept` (statut `needsReview` + origine + hash), `dedupe`.
2. **Une seule source** : le runner `scripts/import-app/index.mjs` **réutilise** ce
   module TypeScript via l'exécution TS native de Node 22 (`.mjs` important un `.ts`) —
   aucune duplication de logique. Le module n'est jamais importé par l'app (build-time).
3. **Schéma** `schemas/concept.schema.json` (statuts `imported`→`archived`, `origin`
   requis) ; `validate:content` valide aussi `content/drafts/concepts/`.
4. **Idempotence** : un `sourceHash` inchangé n'est pas réécrit (pas de churn).
5. **Sécurité** : `hasPersonalData` rejette tout enregistrement portant une clé
   interdite (email, password, stripe, compte, abonnement…). Aucune donnée de compte,
   e-mail, secret ou paiement ne transite.
6. **Revue humaine** : tout reste `needsReview` ; la publication est manuelle
   (aucune publication automatique).
7. **Pilote** : source curatée (`scripts/import-app/source/`) représentative du corpus
   éducatif APP (`02_DATA_EDUCATIVES`) → 18 concepts sur les 5 catégories. Le pipeline
   monte à 50+ sans changement de code (procéder par lots, pas 1000+ d'un coup).

## Conséquences
- Contenu WMB importable, tracé et réversible, sans risque de fuite de données perso.
- L'app reste découplée de APP (contenu figé en JSON validé, publié après revue).
- Base extensible : brancher la source réelle = alimenter le dossier `source/`.

## Rollback
Supprimer `content/drafts/concepts/` (brouillons) ; le pipeline et le schéma sont
additifs et sans effet sur le runtime.
