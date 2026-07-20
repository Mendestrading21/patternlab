# ADR-028 — Glossaire premium V5

## Statut
Accepté (V5 Lot 4 — Glossaire premium, skill `patternlab-v5-master`).

## Contexte
La v1 offrait un glossaire de 25 termes (`GlossaryTerm`) avec recherche et filtres par catégorie.
La vision V5 exige un glossaire **premium** : source unifiée (termes v1 + concepts V5 riches),
favoris, récemment-vus, et **liaison vers les fiches concept visuelles** (Lot 3) quand elles existent.
Contrainte : **non destructif** — l'écran glossaire et les fiches `/glossaire/[slug]` existants doivent
continuer de fonctionner, sans réécrire les 25 termes ni les 18 brouillons.

## Décision
1. **Source unifiée** `src/data/glossaryUnified.ts` : `UNIFIED_GLOSSARY = dedupBySlug([...conceptTerms,
   ...GLOSSARY_TERMS])`. Les concepts V5 (dérivés via `glossaryFromConcepts`, le pont non destructif du
   Lot 1) sont placés **en premier** pour que la version riche prime lors de la déduplication par slug.
   `CONCEPT_SLUGS` + `hasConceptFiche(slug)` indiquent quels slugs disposent d'une fiche concept.
2. **Logique pure** `src/data/favorites.ts` : `toggleInSet` (bascule immuable), `pushRecent` (tête,
   dédupliqué, borné à `RECENT_MAX = 12`). Aucune I/O, entièrement testée.
3. **Persistance** `glossaryPrefsRepository` (`patternlab.glossaryprefs.v1`) : `{ favorites, recent }`,
   `load()` assainit les tableaux (ne garde que des chaînes) et renvoie un défaut vide. Câblée dans
   `ProgressProvider` : état `glossaryPrefs`, chargé dans le `Promise.all` initial, `favorites` exposé
   en `ReadonlySet`, `toggleFavorite(slug)` (persiste + `analytics.track('favorite_added')`) et
   `markRecentlyViewed(slug)` (persiste via `pushRecent`, no-op si déjà en tête). `reset()` efface aussi
   les préférences glossaire.
4. **Écran** `src/app/glossaire/index.tsx` : barre de vues **Tout / ★ Favoris / Récents**, étoile
   ★/☆ par carte (couleur `reward`/`textMuted`), tag **« fiche visuelle »** sur les termes à fiche riche,
   navigation `open()` → `/concept/[slug]` si `hasConceptFiche`, sinon `/glossaire/[slug]`. États vides
   par vue. La vue Récents préserve l'ordre de consultation.
5. **Fiches** : `markRecentlyViewed` appelé au montage de `/glossaire/[slug]` **et** `/concept/[slug]` ;
   bouton favori ★/☆ ajouté aux deux en-têtes.

## Conséquences
- Un seul glossaire, deux profondeurs : terme court (v1) ou fiche visuelle riche (V5), sans duplication
  ni réécriture. L'ajout de nouveaux concepts V5 enrichit automatiquement le glossaire (priorité au riche).
- Favoris et récemment-vus persistés localement, réinitialisables, sans donnée personnelle.
- Favoris = préférence d'apprentissage locale ; aucun signal, aucune recommandation personnalisée.
- Base prête pour la maîtrise / révision-due par terme (lots ultérieurs) qui réutiliseront `glossaryPrefs`.
- A11y : étoiles avec `accessibilityRole="button"`, `accessibilityLabel` explicite (ajouter/retirer) et
  `accessibilityState.selected` ; information jamais portée par la seule couleur.
