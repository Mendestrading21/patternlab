/**
 * Ordre d'affichage initial d'un exercice de reconstitution (`order` / `sequence_market_structure`).
 *
 * Un exercice « à remettre dans l'ordre » ne doit JAMAIS s'afficher déjà résolu : sinon l'utilisateur
 * valide sans rien reconstituer (bug corrigé). On dérive donc un ordre d'affichage **déterministe**
 * (aucun hasard → tests reproductibles) et **garanti différent de la solution**.
 */

/** Deux permutations sont-elles identiques (même longueur, mêmes éléments dans le même ordre) ? */
export function sameOrder(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * Ordre d'affichage déterministe pour `correctOrder`, garanti `≠ correctOrder` (pour n ≥ 2).
 *
 * On prend le **miroir** (ordre inversé) de la solution : pour une permutation de valeurs distinctes,
 * le miroir n'est jamais égal à elle-même dès n ≥ 2 (il faudrait `correctOrder[i] === correctOrder[n-1-i]`,
 * impossible hors du centre avec des valeurs distinctes). Résultat : bien mélangé, déterministe, jamais
 * la solution. Filet de sécurité (inatteignable pour n ≥ 2) : rotation d'un cran.
 */
export function scrambledDisplayOrder(correctOrder: number[]): number[] {
  const n = correctOrder.length;
  if (n < 2) return [...correctOrder]; // 0 ou 1 élément : rien à mélanger (et rien à « résoudre »)
  const mirrored = [...correctOrder].reverse();
  if (!sameOrder(mirrored, correctOrder)) return mirrored;
  return correctOrder.map((_, i) => correctOrder[(i + 1) % n]);
}
