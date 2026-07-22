# Direction visuelle canonique

## Signature

PatternLab est un laboratoire d’éducation visuelle premium : sombre, précis, vivant et rassurant.
L’inspiration fonctionnelle vient de TradingView/Bloomberg pour la lisibilité et de Duolingo pour la
progression courte, sans copier leur interface.

- fond bleu-noir `Instrument Glass` et surfaces superposées ;
- verre discret, profondeur contrôlée et lueurs réservées à l’action ou à la progression ;
- vert pour un setup haussier, rouge pour un setup baissier, or pour une zone importante, cyan pour
  une annotation technique ;
- Toto et Bobo comme signature émotionnelle, pas comme décoration répétitive ;
- graphiques et schémas générés en code, déterministes et accessibles.

Les tokens de `src/design-system/` priment toujours sur cette description.

## Traduction des références 2026-07-22

| Piste | Décision PatternLab |
|---|---|
| Sélecteur de personnages | Reprendre l’interaction avec Toto/Bobo, noms et assets cohérents |
| Verre sombre, cartes lumineuses, profondeur | Conserver comme langage premium, avec contraste AA |
| Icône graphique simple | Décliner en SVG natif pour les concepts, jamais copier l’image |
| Packs 3D noir/or | Rejeter : trop génériques et orientés richesse |
| Icônes business monochromes | Réserver aux contrôles secondaires, dans un seul système de traits |
| Ondes/alphabet/doodles | Hors sujet |
| BUY/SELL, promesse de profit, filigrane | Interdit |

Les références brutes ne sont pas stockées dans le dépôt. Une idée retenue devient un composant,
un token, un brief original ou un dataset graphique PatternLab.

## Règles d’interface

- Une action primaire par écran ; deux maximum pendant un exercice.
- Hiérarchie : contenu lisible d’abord, profondeur ensuite, lueur en dernier.
- Rayon, ombre, bordure et espacement viennent du design system.
- Les graphiques montrent seulement l’information nécessaire à l’objectif pédagogique.
- Chaque couleur porte aussi un libellé, une forme ou une icône ; jamais de sens par la couleur seule.
- Animation courte et contextuelle ; version statique en reduced-motion.
- Aucun asset filigrané, sans provenance, issu d’un pack générique ou copié d’une app tierce.

## Marque et personnages

- Source de l’icône : `assets/brand/app-icon-source.jpeg`.
- Exports vérifiés : `assets/brand/asset-manifest.json`.
- Personnages runtime : `assets/characters/figures/`.
- Toto formule l’hypothèse optimiste ; Bobo teste le risque, l’invalidation et le faux signal.
- Ne pas mélanger les styles 2D, 3D, pixel et photoréaliste dans un même flux.

## Vocabulaire visuel et éditorial

Utiliser « setup haussier », « setup baissier », « entrée théorique », « zone de confirmation »,
« invalidation », « objectif pédagogique », « faux signal » et « scénario éducatif ». Ne jamais
afficher BUY, SELL, signal sûr, profit garanti ou trade gagnant.
