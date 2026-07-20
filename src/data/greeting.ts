/**
 * Salutation selon l'heure locale — pure et testable (aucune I/O ; l'heure est injectée).
 * Rend l'accueil un peu plus vivant, sans donnée personnelle.
 */
export function greetingFor(hour: number): string {
  const h = ((Math.floor(Number.isFinite(hour) ? hour : 12) % 24) + 24) % 24;
  if (h < 6) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}
