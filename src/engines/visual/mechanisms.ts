/**
 * Registre des mécanismes (type visuel `mechanism`) — un schéma d'économie/mécanisme rendu comme
 * une suite d'étapes fléchées (pas de dataset OHLC). Sert les concepts « fondations » non graphiques
 * (Dividende, PER…). 100 % déterministe et éducatif ; aucune donnée réelle ni promesse.
 */
export interface MechanismStep {
  label: string;
  sub?: string;
}
export interface Mechanism {
  steps: MechanismStep[];
  note?: string;
}

export const MECHANISMS: Record<string, Mechanism> = {
  dividende: {
    steps: [
      { label: 'Entreprise', sub: 'réalise un bénéfice' },
      { label: 'Dividende', sub: 'part distribuée' },
      { label: 'Actionnaire', sub: 'reçoit du cash' },
    ],
    note: 'À la date de détachement, le cours baisse d’environ le montant du dividende.',
  },
  per: {
    steps: [
      { label: 'Prix', sub: 'ex. 20 €' },
      { label: '÷ Bénéfice / action', sub: 'ex. 2 €' },
      { label: '= PER 10', sub: '≈ années de bénéfices' },
    ],
    note: 'PER élevé = fortes attentes de croissance ; PER bas = prudence ou croissance faible.',
  },
};

export function mechanism(variant: string): Mechanism | undefined {
  return MECHANISMS[variant];
}
