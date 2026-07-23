import type { TrademyIconName } from '@/design-system';

/**
 * Navigation principale Trademy — SOURCE UNIQUE des cinq espaces (canon produit :
 * Accueil · Apprendre · Bibliothèque · Laboratoire · Profil). La barre d'onglets
 * (`src/app/(tabs)/_layout.tsx`) mappe cette liste ; ne pas recréer un second modèle.
 *
 * Note de câblage : pour éviter tout renommage d'URL/route typée, les fichiers de route
 * historiques sont réutilisés — le roadmap vit dans `parcours.tsx` (espace « Apprendre »)
 * et le hub de référence dans `apprendre.tsx` (espace « Bibliothèque »). Le libellé
 * d'onglet et l'en-tête d'écran portent le nom canonique ; l'URL interne reste stable.
 */
export type PrimarySpace = {
  /** Nom de route Expo Router (fichier dans `(tabs)/`). */
  name: string;
  /** Libellé d'onglet et nom d'espace visible. */
  title: string;
  icon: TrademyIconName;
};

export const PRIMARY_SPACES: PrimarySpace[] = [
  { name: 'index', title: 'Accueil', icon: 'home' },
  { name: 'parcours', title: 'Apprendre', icon: 'learn' },
  { name: 'apprendre', title: 'Bibliothèque', icon: 'library' },
  { name: 'laboratoire', title: 'Laboratoire', icon: 'lab' },
  { name: 'profil', title: 'Profil', icon: 'profile' },
];

/**
 * Écrans conservés hors de la barre (accessibles par navigation). Réviser est intégré à
 * l'Accueil et au Profil (accès rapide) plutôt qu'à un onglet dédié.
 */
export const HIDDEN_TAB_ROUTES = ['revisions', 'lecons', 'quiz'] as const;
