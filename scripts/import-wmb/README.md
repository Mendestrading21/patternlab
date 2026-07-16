# import-wmb

Pipeline d'import **traçable et idempotent** du contenu éducatif WMB (P1).

Étapes : inventaire → export brut (`content/raw-wmb/`) → validation → normalisation
(`content/normalized/`) → déduplication → mapping → transformation → revue financière +
pédagogique → import en brouillon → tests → publication (`content/published/`).

Chaque objet importé conserve : `legacySource, legacyTable, legacyId, legacySlug,
sourceHash, migrationVersion, importedAt, humanReviewStatus`.

**Exclus (jamais importés) :** comptes, mots de passe, emails, Stripe, tokens, secrets,
notes privées, portefeuilles, abonnements.

> Non implémenté en P0.1 — ce dossier fixe le contrat et l'emplacement.
