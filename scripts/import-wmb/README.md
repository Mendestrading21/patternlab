# import-wmb

Contrat d'import **sélectif, traçable et idempotent** du contenu éducatif WMB.

Étapes : inventaire en zone privée hors dépôt → validation → normalisation
(`content/normalized/`) → déduplication → mapping → transformation → revue financière +
pédagogique → import en brouillon → tests → publication (`content/published/`).

Chaque objet importé conserve : `legacySource, legacyTable, legacyId, legacySlug,
sourceHash, migrationVersion, importedAt, humanReviewStatus`.

**Exclus (jamais importés) :** comptes, mots de passe, e-mails, Stripe, tokens, secrets,
notes privées, portefeuilles, abonnements, schémas/routeurs DB, scripts de seed/envoi et newsletters.

Ne jamais déposer un export WMB complet ou `APP-main.zip` dans TradeMy. Seuls les brouillons
pédagogiques anonymisés, sourcés et `needsReview` peuvent entrer dans `content/drafts/`.
