/**
 * Glossaire — extrait éducatif du contenu WMB (voix pédagogique, aucune donnée personnelle).
 * Chaque terme : définition simple, à quoi ça sert, exemple.
 */
export type GlossaryCategory = 'marche' | 'analyse' | 'risque' | 'strategie' | 'indicateur';

export interface GlossaryTerm {
  slug: string;
  term: string;
  english: string;
  category: GlossaryCategory;
  summary: string;
  definition: string;
  example?: string;
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'Tous', color: '#9DB0A6' },
  { id: 'marche', label: 'Marché', color: '#5B7488' },
  { id: 'analyse', label: 'Analyse', color: '#2FB35C' },
  { id: 'risque', label: 'Risque', color: '#D0453C' },
  { id: 'strategie', label: 'Stratégie', color: '#C79A45' },
  { id: 'indicateur', label: 'Indicateur', color: '#3E9AE6' },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { slug: 'bull-bear', term: 'Marché haussier & baissier', english: 'Bull & Bear Market', category: 'marche',
    summary: 'Deux régimes opposés : prix qui montent durablement (bull) ou qui baissent (bear).',
    definition: 'Un marché haussier (bull) désigne une hausse prolongée d’au moins 20 % depuis un creux ; un marché baissier (bear) une baisse d’au moins 20 % depuis un sommet.',
    example: 'Mars 2009 → février 2020 : l’un des plus longs marchés haussiers de l’histoire.' },
  { slug: 'support-resistance', term: 'Support & Résistance', english: 'Support & Resistance', category: 'analyse',
    summary: 'Niveaux où le prix bute : plancher (support) et plafond (résistance).',
    definition: 'Le support est un niveau où les acheteurs reviennent ; la résistance un niveau où les vendeurs reprennent la main. Ce sont des zones de mémoire du marché.' },
  { slug: 'tendance', term: 'Tendance', english: 'Trend', category: 'analyse',
    summary: 'La direction générale du prix : haussière, baissière ou latérale.',
    definition: 'Une succession de sommets et creux de plus en plus hauts = tendance haussière ; de plus en plus bas = baissière ; sans direction = range.' },
  { slug: 'volatilite', term: 'Volatilité', english: 'Volatility', category: 'risque',
    summary: 'L’ampleur et la rapidité des variations de prix — le « niveau d’agitation ».',
    definition: 'Elle mesure la dispersion des variations. Plus c’est volatil, plus il faut réduire l’exposition pour un même risque.',
    example: 'En mars 2020, le VIX a bondi au-dessus de 80 : des variations de 5-10 % par jour.' },
  { slug: 'spread', term: 'Spread', english: 'Bid-Ask Spread', category: 'marche',
    summary: 'L’écart entre le prix d’achat et le prix de vente à un instant donné.',
    definition: 'C’est le coût implicite d’un aller-retour. Plus un actif est liquide, plus le spread est faible.' },
  { slug: 'liquidite', term: 'Liquidité', english: 'Liquidity', category: 'marche',
    summary: 'La facilité d’acheter/vendre rapidement sans bouger le prix.',
    definition: 'Un actif liquide s’échange en gros volume avec peu d’impact sur le cours ; un actif illiquide bouge fort au moindre ordre.' },
  { slug: 'levier', term: 'Effet de levier', english: 'Leverage', category: 'risque',
    summary: 'Contrôler une position plus grande que son capital, en empruntant.',
    definition: 'Le levier multiplie gains ET pertes. C’est l’outil le plus dangereux pour un débutant.',
    example: 'Avec un levier ×10, un mouvement de -10 % efface 100 % de la mise (appel de marge).' },
  { slug: 'interets-composes', term: 'Intérêts composés', english: 'Compound Interest', category: 'strategie',
    summary: 'Les intérêts qui produisent eux-mêmes des intérêts : la croissance exponentielle.',
    definition: 'Réinvestir les gains fait grossir la base sur laquelle on gagne, année après année.' },
  { slug: 'diversification', term: 'Diversification', english: 'Diversification', category: 'strategie',
    summary: 'Répartir le capital sur des actifs variés pour réduire le risque global.',
    definition: 'C’est la seule façon de réduire le risque sans forcément réduire le rendement attendu.',
    example: 'En 2022, un portefeuille diversifié a mieux résisté qu’un portefeuille 100 % tech.' },
  { slug: 'stop-take', term: 'Stop-Loss & Take-Profit', english: 'Stop-Loss & Take-Profit', category: 'risque',
    summary: 'Deux niveaux définis à l’avance : où couper la perte, où prendre le gain.',
    definition: 'Le stop-loss limite la perte si le prix va contre soi ; le take-profit sécurise le gain à un objectif.' },
  { slug: 'bulle', term: 'Bulle spéculative', english: 'Speculative Bubble', category: 'marche',
    summary: 'Une envolée des prix déconnectée de la valeur réelle, suivie d’un effondrement.',
    definition: 'L’euphorie et l’effet de foule poussent les prix bien au-delà des fondamentaux, jusqu’à l’éclatement.' },
  { slug: 'correlation', term: 'Corrélation', english: 'Correlation', category: 'analyse',
    summary: 'Le lien entre deux actifs : bougent-ils ensemble (+1) ou à l’inverse (−1) ?',
    definition: 'Une corrélation proche de +1 = mouvements synchronisés ; proche de −1 = opposés ; proche de 0 = indépendants.' },
  { slug: 'dividende', term: 'Dividende', english: 'Dividend', category: 'marche',
    summary: 'Une part du bénéfice qu’une entreprise reverse à ses actionnaires.',
    definition: 'Versé régulièrement (souvent trimestriel/annuel), il récompense la détention de l’action.' },
  { slug: 'inflation', term: 'Inflation', english: 'Inflation', category: 'marche',
    summary: 'La hausse générale des prix, qui réduit le pouvoir d’achat de la monnaie.',
    definition: 'Une inflation élevée érode la valeur de l’argent dormant et influence taux et marchés.' },
  { slug: 'rsi', term: 'RSI', english: 'Relative Strength Index', category: 'indicateur',
    summary: 'Mesure le surachat (>70) et la survente (<30).',
    definition: 'Compare l’ampleur des hausses et des baisses récentes sur une échelle 0-100. Une divergence peut annoncer un essoufflement.' },
  { slug: 'macd', term: 'MACD', english: 'Moving Average Convergence Divergence', category: 'indicateur',
    summary: 'La dynamique de la tendance via l’écart de deux moyennes mobiles.',
    definition: 'Ligne MACD, ligne de signal et histogramme. Le croisement de la MACD au-dessus de son signal est très suivi.' },
  { slug: 'bollinger', term: 'Bandes de Bollinger', english: 'Bollinger Bands', category: 'indicateur',
    summary: 'Une enveloppe de volatilité autour d’une moyenne mobile.',
    definition: 'Bandes qui s’écartent = volatilité en hausse ; qui se resserrent (squeeze) = calme avant un mouvement.' },
  { slug: 'volume', term: 'Volume', english: 'Volume', category: 'analyse',
    summary: 'La quantité échangée sur une période — la « conviction » du mouvement.',
    definition: 'Une cassure accompagnée d’un fort volume est jugée plus solide qu’une cassure « molle ».' },
  { slug: 'moyenne-mobile', term: 'Moyenne mobile', english: 'Moving Average', category: 'indicateur',
    summary: 'Lisse le prix pour révéler la direction dominante.',
    definition: 'Moyenne des derniers N cours, recalculée à chaque période. La SMA pondère également, l’EMA privilégie le récent.' },
  { slug: 'capitalisation', term: 'Capitalisation boursière', english: 'Market Cap', category: 'marche',
    summary: 'La valeur totale d’une entreprise en Bourse.',
    definition: 'Prix de l’action × nombre d’actions. Un prix élevé ne veut pas dire « grosse » entreprise sans regarder la capitalisation.' },
  { slug: 'per', term: 'PER', english: 'Price/Earnings Ratio', category: 'analyse',
    summary: 'Combien d’années de bénéfices tu paies pour une action.',
    definition: 'Cours ÷ bénéfice par action. Un PER élevé suppose une forte croissance attendue ; bas, l’inverse (ou un risque).' },
  { slug: 'etf', term: 'ETF', english: 'Exchange-Traded Fund', category: 'marche',
    summary: 'Un panier d’actifs coté en Bourse, souvent qui réplique un indice.',
    definition: 'Acheter une part d’ETF revient à s’exposer d’un coup à tout un indice — un outil de diversification simple.' },
  { slug: 'ordre', term: 'Ordre au marché & à cours limité', english: 'Market & Limit Order', category: 'marche',
    summary: 'Deux façons d’acheter : tout de suite au prix courant, ou à un prix fixé.',
    definition: 'L’ordre au marché s’exécute immédiatement au meilleur prix ; l’ordre à cours limité n’exécute qu’à ton prix ou mieux.' },
  { slug: 'appel-de-marge', term: 'Appel de marge', english: 'Margin Call', category: 'risque',
    summary: 'Quand les pertes menacent le capital garanti d’une position à levier.',
    definition: 'Le courtier exige d’ajouter des fonds ou liquide la position. C’est le risque central de l’effet de levier.' },
];
