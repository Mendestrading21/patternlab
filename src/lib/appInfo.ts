/**
 * Métadonnées de publication — source unique, SANS import (feuille du graphe).
 *
 * `version` doit rester synchronisé avec `app.json` et `package.json` : le script
 * `release:check` échoue si les trois divergent. Aucune dépendance : ce module est
 * importable aussi bien par l'app (RN) que par le runner Node de `release:check`.
 */
export const APP_INFO = {
  name: 'Trademy',
  /** Version marketing (SemVer). À garder synchronisée avec app.json / package.json. */
  version: '1.0.0',
  tagline: 'Apprends à lire les marchés, quelques minutes par jour.',
  /** Signature de marque Trademy. */
  signature: 'Ne parie pas. Comprends.',
  disclaimer:
    'Trademy est une application éducative. Aucun conseil en investissement, aucun signal d’achat ou de vente, aucune promesse de gain. Le trading comporte un risque de perte.',
} as const;

/** Résumé de confidentialité affiché dans l'app (minimisation des données). */
export const PRIVACY_SUMMARY: string[] = [
  'Aucun compte, aucun e-mail, aucune donnée personnelle collectés.',
  'Ta progression reste sur ton appareil — aucun serveur, aucune synchronisation.',
  'Suivi d’usage anonyme, désactivable à tout moment ; jamais de donnée financière personnelle.',
  'Aucun conseil financier : le contenu est strictement éducatif.',
];

/** Mentions légales concises (média/jeu éducatif). */
export const LEGAL_LINES: string[] = [
  'Trademy est une application éducative indépendante.',
  'Le trading comporte un risque de perte. Rien ici ne constitue un conseil personnalisé.',
  'Les marques et données citées à des fins pédagogiques appartiennent à leurs propriétaires.',
];
