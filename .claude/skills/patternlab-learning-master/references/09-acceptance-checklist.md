# Checklist d’acceptation

## Produit

- [ ] Une seule trajectoire d’apprentissage.
- [ ] Cinq onglets maximum.
- [ ] Une action principale par écran.
- [ ] Première interaction en moins de 60 secondes.
- [ ] Aucun monde validé par simple consultation.
- [ ] Aucun bouton ou lien mort.
- [ ] Aucun fallback silencieux vers un autre contenu.

## Contenu

- [ ] Objectif, visuel, interaction, limites et sources.
- [ ] Feedback correct et incorrect explicatif.
- [ ] Contre-exemple ou faux signal.
- [ ] Dividende/PER reliés au premier monde.
- [ ] RSI/MACD/Bollinger sans langage de signal automatique.
- [ ] `needsReview` tant que non relu.
- [ ] Aucun doublon de slug/id/sourceHash.

## Apprentissage

- [ ] Un step par écran.
- [ ] Reprise exacte après fermeture.
- [ ] Maîtrise distincte de XP.
- [ ] Erreur reliée à une misconception.
- [ ] Révision espacée au niveau concept/skill.
- [ ] Variation de question après erreur.

## Graphiques

- [ ] Modes static/guided/interactive/blind.
- [ ] Axes, labels et légendes lisibles.
- [ ] Aucun indice de réponse en mode blind.
- [ ] Alternative textuelle utile.
- [ ] Alternative clavier/boutons à chaque geste.
- [ ] Datasets vides, plats et extrêmes testés.

## Toto/Bobo

- [ ] Rôle pédagogique explicite.
- [ ] Dialogue lié au contexte.
- [ ] Ne masque aucune interaction.
- [ ] Reduced motion.
- [ ] Style d’asset cohérent.
- [ ] Fréquence contrôlée.

## Accessibilité

- [ ] Cibles 44 px.
- [ ] Contraste AA.
- [ ] Dynamic Type 1.8.
- [ ] Un titre principal par écran.
- [ ] Focus web visible et ordre logique.
- [ ] Aucun sens porté par la couleur seule.
- [ ] VoiceOver/TalkBack vérifiés avant release native.

## Fiabilité

- [ ] Migration non destructive.
- [ ] Offline complet pour le contenu embarqué.
- [ ] Analytics sans PII et soumis au consentement.
- [ ] Erreurs et états vides gérés.
- [ ] Pas de secret dans le dépôt.

## Gate

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run release:check
npm run build:web
```

## Vérification manuelle

- [ ] 320 × 568.
- [ ] 390 × 844.
- [ ] 430 × 932.
- [ ] Tablette.
- [ ] Clavier web.
- [ ] Offline.
- [ ] Reduced motion.
- [ ] Progression neuve et migrée.
- [ ] Premium gratuit/actif/expiré/offline.
- [ ] Console sans erreur.

## Rapport honnête

Séparer toujours : testé automatiquement, parcouru manuellement, indiqué par un ancien rapport, non vérifiable dans l’environnement. Ne jamais annoncer un build natif ou un test lecteur d’écran non exécuté.
