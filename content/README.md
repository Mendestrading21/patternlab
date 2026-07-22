# Contenu pédagogique

## Deux états, un seul runtime

- `src/data/learningContent.ts` compose `V5_CONCEPTS` : c’est la source réellement rendue dans
  l’application.
- `content/drafts/` contient des brouillons JSON soumis aux schémas et à une revue humaine.
- `content/published/` conserve les exemples du pipeline historique ; ce dossier n’alimente pas
  automatiquement le runtime actuel.

Un brouillon n’est jamais publié par simple déplacement de fichier. Après validation humaine, son
contenu est intégré explicitement au registre runtime, testé et réconcilié par `repoTruth`.

## Validation

```bash
npm run validate:content
npm test -- --runInBand
```

Tout nouveau contenu reste `needsReview`, cite sa provenance et respecte le vocabulaire éducatif.
Les imports WMB ne doivent contenir aucun compte, e-mail, secret, script DB/e-mail, paiement ou
donnée personnelle.
