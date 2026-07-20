/**
 * Contraste WCAG 2.1 — utilitaires purs pour garantir l'accessibilité de la palette.
 * Sert de garde-fou testable : toute évolution des tokens texte/surface doit rester
 * au-dessus du seuil AA (4.5 pour le texte normal, 3.0 pour le grand texte / UI).
 */

/** Convertit `#RRGGBB` en composantes 0–255. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Luminance relative (WCAG). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Ratio de contraste entre deux couleurs opaques (1 → 21). */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;

/** Vrai si le contraste atteint le seuil AA (normal par défaut). */
export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? WCAG_AA_LARGE : WCAG_AA_NORMAL);
}
