# Catalogue éditorial et modèle de concept

## Contrat d’un concept riche

```ts
type LearningConcept = {
  id: string;
  slug: string;
  title: string;
  aliases: string[];
  worldId: string;
  moduleId: string;
  primarySkillId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  objective: string;
  definitionShort: string;
  explanation: string;
  visualSpec: VisualSpec;
  interactionSpec: InteractionSpec;
  recognitionRules: string[];
  limitations: string[];
  counterExamples: string[];
  misconceptions: Misconception[];
  exercises: string[];
  flashcards: Flashcard[];
  relatedConceptIds: string[];
  sources: ContentSource[];
  status: 'draft' | 'needsReview' | 'approved' | 'published';
};
```

Adapter le modèle existant par migration, sans duplication ni rupture des slugs.

## Promotion prioritaire — Dividende

Le terme existe déjà dans le glossaire. Créer une fiche riche :

- Définition : part du résultat ou des réserves distribuée aux actionnaires, décidée selon le cadre de l’entreprise.
- Visuel 1 : entreprise → bénéfice → réinvestissement / réserves / dividendes.
- Visuel 2 : frise annonce → date ex-dividende → date d’enregistrement → paiement.
- Interaction : déplacer un curseur de bénéfice distribué et observer dividende par action, rendement et capital conservé.
- Question visuelle : distinguer dividende, intérêt obligataire et plus-value.
- Contre-exemples : rendement élevé causé par une chute du cours ; dividende réduit ; absence de dividende chez une entreprise de croissance.
- Liens : action, bénéfice par action, rendement du dividende, PER, cash-flow, fiscalité générale sans conseil fiscal personnalisé.

## Promotion prioritaire — PER

Le terme existe déjà dans le glossaire. Créer une fiche riche :

- Formule visible : `PER = cours / bénéfice par action`.
- Visuel 1 : deux sociétés au même bénéfice, prix différents.
- Visuel 2 : même prix, bénéfices qui montent ou baissent.
- Interaction : curseurs cours et BPA avec recalcul instantané du PER.
- Comparaison : secteur, croissance, cyclicité et historique ; ne jamais conclure « bas = bon » ou « élevé = mauvais ».
- Cas limites : BPA négatif, éléments exceptionnels, dilution, comparabilité sectorielle.
- Quiz : calcul, interprétation prudente, comparaison de scénarios.
- Liens : capitalisation, bénéfice par action, croissance, marge, dividende.

## Indicateurs techniques déjà présents à enrichir

### RSI

- Conserver la fiche et le visuel actuels.
- Ajouter période ajustable, zones 30/70, tendance forte et divergence.
- Faire observer que surachat/survente n’est pas un ordre.
- Quiz : lecture de valeur, contexte, divergence et faux signal.

### MACD

- Afficher ligne MACD, signal et histogramme.
- Paramètres pédagogiques 12/26/9 avec presets simplifiés.
- Interaction : masquer/afficher chaque couche et avancer dans le replay.
- Quiz : élan, croisement, passage par zéro et retard.

### Bandes de Bollinger

- Moyenne 20, écart-type 2 par défaut.
- Interaction : modifier période et multiplicateur.
- Montrer compression, expansion, marche le long d’une bande et faux retournement.

### Moyennes mobiles, volume, VWAP et profil de volume

- SMA/EMA 20, 50, 200.
- Volume avec comparaison à une moyenne, sans inventer une vérité causale.
- VWAP comme moyenne pondérée par volume, session pédagogique.
- Profil de volume : POC, zones de forte/faible activité et limites.

## Économie visuelle

Ajouter progressivement : inflation, taux, obligation et rendement, croissance, chômage, cycle économique, banque centrale, devise, offre/demande, liquidité, corrélation, diversification, intérêt composé.

Chaque thème doit avoir un schéma interactif simple : curseur, balance, frise, comparaison ou flux. Ne pas utiliser un graphique de trading quand un diagramme économique explique mieux.

## Règles de rédaction

- Français clair, phrases courtes, un terme technique défini avant emploi.
- Donner le nom anglais comme alias, pas comme titre principal.
- Expliquer d’abord le mécanisme, puis l’usage, puis la limite.
- Aucun jargon de vente, aucune promesse, aucun « toujours/jamais » non justifié.
- Les boutons commencent par un verbe : Observer, Comparer, Répondre, Continuer, Réviser.
- Le feedback explique pourquoi, pas seulement « correct ».

## Provenance et revue

- Enregistrer source, chemin, hash, date d’import et relecteur.
- Import idempotent ; mise à jour détectée sans doublon.
- WMB alimente les brouillons ; PatternLab reformule en objectif, visuel, interaction et évaluation.
- Aucun contenu `needsReview` ne devient publié automatiquement.
