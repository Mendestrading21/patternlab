# ADR-018 — Glossaire enrichi (recherche, catégories, fiches reliées)

## Statut
Accepté (LOT 12 — Glossaire enrichi, skill `patternlab-product-growth`).

## Contexte
Le glossaire (24 termes) offrait une recherche naïve (`includes` brut, sensible aux
accents et à la casse) et une légende trompeuse (« 1 111+ termes »). Les fiches étaient
des culs-de-sac : aucun lien vers la pratique (compétences) ni entre termes voisins.
Le skill demande un glossaire **outil d'apprentissage** — trouvable, catégorisé, relié
au parcours — sans introduire de dépendance runtime ni de contenu non revu.

## Décision
1. **Recherche pure, testée, insensible aux accents** `src/data/glossarySearch.ts` :
   `normalizeSearch` (NFD → retrait des diacritiques `[̀-ͯ]` → minuscules →
   trim) et `searchGlossary(terms, query, category)`. Filtre par catégorie puis, si la
   requête est non vide, **classe par pertinence** : début du terme (4) > terme (3) >
   anglais (2) > résumé (1), départage alphabétique. Aucune dépendance ; réutilisable.
2. **Liens sortants du modèle** : `GlossaryTerm` gagne `relatedSkillId?` (vers une
   compétence réelle) et `related?` (slugs de termes voisins). Les liens vivent dans une
   **table séparée** `GLOSSARY_LINKS` fusionnée à l'export (`GLOSSARY_TERMS`) — les 24
   définitions restent lisibles, les liens se maintiennent au même endroit.
3. **Fiche reliée à la pratique** (`glossaire/[slug].tsx`) : bouton
   « S'entraîner — {compétence} » → `/session/{skillId}` quand `relatedSkillId` existe ;
   carte « Termes reliés » avec puces navigables → `/glossaire/{slug}`. Aucun bouton mort
   (les sections ne s'affichent que si le lien existe), rôles/hints d'accessibilité.
4. **Légende honnête** : « N terme(s) sur M · le vocabulaire essentiel des marchés »
   (fin du « 1 111+ » mensonger) ; l'écran liste consomme désormais `searchGlossary`.
5. **Intégrité garantie par test** : chaque `related` pointe vers un slug existant et
   jamais vers lui-même ; chaque `relatedSkillId` référence une compétence réelle
   (`SKILLS`). Un lien cassé fait échouer la CI.

## Conséquences
- Glossaire réellement navigable (recherche tolérante, catégories, allers-retours
  terme↔terme et terme↔compétence) — boucle apprentissage renforcée.
- Le modèle de liens est extensible : brancher les 18 concepts importés (revus) =
  enrichir `GLOSSARY_LINKS` / le corpus, sans toucher au moteur de recherche.
- Couleurs de catégories alignées sur « Instrument Glass » (cohérence design).

## Rollback
Retirer `relatedSkillId`/`related` de `GlossaryTerm` et `GLOSSARY_LINKS` (les fiches
masquent alors simplement les sections reliées) ; `searchGlossary` peut retomber sur un
filtre `includes` sans impact sur le reste. Additif, sans effet runtime au-delà de l'écran.
