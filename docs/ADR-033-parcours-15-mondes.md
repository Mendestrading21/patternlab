# ADR-033 — Parcours & carte des 15 mondes

## Statut
Accepté (V5 Lot 8 — Parcours & mission, skill `patternlab-v5-master`).

## Contexte
Deux modèles de « monde » coexistent, **non reliés** :
- **v1 runtime** (`src/data/worldMap.ts` → `buildWorldMap`) : un trail de progression sur les 4
  compétences du module pilote + checkpoint, sous un titre codé en dur « Monde 1 · Fondations ».
- **V5 statique** (`WORLDS` dans `learningConcept.ts`) : le registre des **15 mondes** macro, jamais
  surfacé dans l'UI.

La vision V5 veut rendre visible la carte des 15 mondes **sans casser** le parcours pilote existant,
et en montrant honnêtement où en est le contenu (seuls 3 mondes ont des concepts aujourd'hui).

## Décision
1. **Vue catalogue pure** `src/data/worldOverview.ts` (nouveau, testé) : `buildWorldOverview(WORLDS,
   V5_CONCEPTS)` → un `WorldSummary` par monde (trié par `order`), avec `conceptCount`,
   `firstConceptSlug` et `hasContent` (dérivés de `conceptsByWorld`). `worldsWithContent(summaries)`
   compte les mondes non vides. **Additif et non destructif** : le trail runtime (`worldMap.ts`) est
   inchangé ; aucune fusion des deux modèles (pas de collision — `worldMap.ts` n'exporte pas `World`).
2. **Écran** `src/app/(tabs)/parcours.tsx` : sous le trail pilote (priorité principale conservée),
   une section **« 🗺️ La carte des mondes »** liste les 15 mondes (badge d'ordre, titre, sous-titre) avec
   un compteur **« N/15 mondes ouverts »**. Chaque monde **avec contenu** est cliquable → fiche du
   premier concept (`/concept/[slug]`) + `analytics.track('world_opened', { worldId })`. Les mondes
   **sans contenu** affichent une pastille **« à venir »** et sont non actionnables (désactivés,
   `accessibilityState.disabled` + hint « Contenu à venir ») — **aucun bouton mort silencieux**.
3. **Analytics** : nouvel évènement **`world_opened`** (catégorie `engagement`) ajouté à l'union
   `AnalyticsEvent` **et** à `EVENT_CATEGORIES` (les deux, car un test vérifie leur synchronisation).

## Conséquences
- La montée en gamme (15 mondes) est visible et honnête (couverture réelle), tout en gardant le parcours
  pilote jouable. Le catalogue se remplira automatiquement à mesure que des concepts rejoignent un monde
  (`conceptsByWorld`), sans changement d'écran.
- Pas de modèle de progression pour les 14 autres mondes tant qu'ils n'ont pas de compétences dédiées :
  décision assumée de les présenter en catalogue (accès fiche) plutôt que d'inventer un déblocage factice.
- Reste à faire (lots ultérieurs) : mapping explicite compétence→monde et progression par monde quand le
  contenu (Lot 9/10) alimentera plusieurs mondes ; mission du jour multi-mondes.
