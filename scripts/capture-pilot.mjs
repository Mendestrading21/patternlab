/**
 * Capture des preuves visuelles du parcours pilote « Comprendre un chandelier ».
 *
 * Reproductible : `npm run build:web` puis `node scripts/capture-pilot.mjs [dossierSortie]`.
 * Sert `dist/` localement (fallback SPA façon GitHub Pages) et pilote Chromium via Playwright.
 * Aucune dépendance runtime ajoutée : le script est un outil de développement autonome. Playwright
 * doit être disponible (installation globale de l'environnement CI/dev) — sinon le script s'arrête.
 * Les images produites ne sont PAS embarquées dans le build web.
 *
 * FIABILITÉ (LOT 4-A) : le script ÉCHOUE (code de sortie 1) si une navigation n'atteint pas la route
 * attendue, si une erreur console est relevée, ou si un débordement horizontal dépasse 0 px. Il ne
 * masque plus les échecs de navigation par un `.catch()` silencieux, et vérifie que la route attendue
 * est réellement rendue avant chaque capture.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync, mkdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';

const OUT = process.argv[2] || join(process.cwd(), 'docs', 'pilot-captures');
const DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.error('✗ dist absent. Lance d’abord `npm run build:web`.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

let chromium;
try {
  const req = createRequire(process.env.PLAYWRIGHT_REQUIRE ?? '/opt/node22/lib/node_modules/playwright/');
  ({ chromium } = req('playwright'));
} catch {
  console.error('✗ Playwright introuvable. Installe-le (npm i -g playwright) pour reproduire les captures.');
  process.exit(1);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.startsWith('/TradeMy/')) p = p.slice('/TradeMy'.length);
    if (p === '/' || p === '') p = '/index.html';
    let f = normalize(join(DIST, p));
    if (!f.startsWith(DIST)) { res.writeHead(403); return res.end(); }
    if (!existsSync(f) || statSync(f).isDirectory()) {
      if (existsSync(f + '.html')) f = f + '.html';
      else f = join(DIST, '404.html'); // repli SPA façon Pages
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' });
    res.end(await readFile(f));
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/TradeMy`;
const browser = await chromium.launch({ args: ['--no-sandbox'] });

// ── Accumulateurs d'ÉCHEC DUR (le script sort en erreur si non vides) ──
const consoleErrors = [];
const overflowFails = [];

const vis = async (p, re) => (await p.getByText(re).count().catch(() => 0)) > 0;
const clickText = async (p, re, t = 1000) => { try { await p.getByText(re).first().click({ timeout: t }); return true; } catch { return false; } };
async function overflow(p) { return p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth)).catch(() => -1); }

/** Navigue vers `path` et VÉRIFIE que la route est réellement rendue (sinon lève — plus de repli muet). */
async function nav(p, path, markerRe, tag) {
  await p.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  try {
    await p.getByText(markerRe).first().waitFor({ timeout: 9000 });
  } catch {
    throw new Error(`Route non rendue: ${path} (marqueur ${markerRe} absent) [${tag}]`);
  }
}

/** Capture après vérification du débordement horizontal (0 px exigé). */
async function shot(p, n) {
  await p.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await p.waitForTimeout(180);
  const ov = await overflow(p);
  if (ov > 0) overflowFails.push(`${n}: ${ov}px`);
  await p.screenshot({ path: join(OUT, `${n}.png`) });
  console.log('  ✓', n, ov === 0 ? '' : `(⚠ débordement ${ov}px)`);
}

async function ctx(w, h, opts = {}) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, ...opts });
  const p = await c.newPage();
  p.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${w}px ${m.text().slice(0, 140)}`); });
  p.on('pageerror', (e) => consoleErrors.push(`${w}px PAGEERROR ${String(e).slice(0, 140)}`));
  return { c, p };
}

async function reachPractice(p, tag) {
  for (let i = 0; i < 22; i++) {
    if (await vis(p, /Exercice\s+\d+\s*\/\s*\d+/)) return;
    if (await clickText(p, /Commencer les exercices/i, 800)) { await p.waitForTimeout(600); continue; }
    await clickText(p, /Suivant/i, 800);
    await p.waitForTimeout(350);
  }
  if (!(await vis(p, /Exercice/))) throw new Error(`Phase pratique non atteinte [${tag}]`);
}

// Réponses correctes connues de l'unité pilote (réussite déterministe → résultat + célébration).
const CORRECT = ['Plutôt à la hausse', 'Une part d’une entreprise', 'Le plus haut atteint', 'La couleur d’une bougie prédit', 'Deuxième tiers'];
const rx = (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
async function answerBestEffort(p) {
  if (await vis(p, /Valider mon niveau/)) {
    for (let k = 0; k < 50; k++) { try { await p.getByRole('button', { name: 'Monter' }).first().click({ timeout: 150 }); } catch { break; } }
    await clickText(p, /Valider mon niveau/i, 1000);
    return;
  }
  if (await vis(p, /Valider l’ordre|Valider l'ordre/)) { await clickText(p, /Valider l’ordre|Valider l'ordre/i, 1000); return; }
  for (const t of CORRECT) { if (await clickText(p, rx(t), 600)) return; }
  if (await clickText(p, /^Vrai$/i, 600)) return;
  const bs = await p.getByRole('button').all();
  for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider|réessayer/i.test(t)) continue; await b.click({ timeout: 700 }).catch(() => {}); return; }
}
async function playToResult(p, tag) {
  for (let step = 0; step < 14; step++) {
    if (await vis(p, /Refaire la session|Retour à l’accueil/i)) return;
    await answerBestEffort(p);
    await p.waitForTimeout(450);
    await clickText(p, /Continuer|Voir mon résultat/i, 800);
    await p.waitForTimeout(450);
  }
  if (!(await vis(p, /Refaire la session/i))) throw new Error(`Écran de résultat non atteint [${tag}]`);
}

async function run() {
  const SESSION = `/session/skill.candles`;
  const PRACTICE_MARKER = /Chandeliers japonais|Comprendre|Exercice/;

  // ── 1) Pratique + RÉSULTAT corrigé, à 5 rendus (320/390/430/web + reduced-motion) ──
  for (const [w, h, tag, opts] of [[320, 720, '320', {}], [390, 844, '390', {}], [430, 932, '430', {}], [1280, 900, 'web', {}], [390, 844, 'reduced', { reducedMotion: 'reduce' }]]) {
    const { c, p } = await ctx(w, h, opts);
    await nav(p, SESSION, PRACTICE_MARKER, tag);
    await reachPractice(p, tag);
    await shot(p, `pilot-practice-${tag}`);
    await playToResult(p, tag);
    await p.waitForTimeout(300);
    await shot(p, `pilot-result-${tag}`); // écran de résultat : icône de famille, Maîtrise non-marché, sans damier
    await c.close();
  }

  // ── 2) Mécaniques distinctes (390) : feedback, placement de ligne, ordre mélangé ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, PRACTICE_MARKER, 'mech');
    await reachPractice(p, 'mech');
    let sawPlace = false, sawOrder = false, sawFeedback = false;
    for (let step = 0; step < 9; step++) {
      if (!sawPlace && (await vis(p, /Valider mon niveau/))) { await shot(p, 'pilot-place-line-390'); sawPlace = true; }
      if (!sawOrder && (await vis(p, /Valider l’ordre|Valider l'ordre/))) { await shot(p, 'pilot-order-shuffled-390'); sawOrder = true; }
      const bs = await p.getByRole('button').all();
      let acted = false;
      for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider/i.test(t)) continue; await b.click({ timeout: 1000 }).catch(() => {}); acted = true; break; }
      if (!acted) await clickText(p, /Valider mon niveau|Valider l’ordre|Valider l'ordre/i, 800);
      await p.waitForTimeout(500);
      if (!sawFeedback && (await vis(p, /Continuer|Voir mon résultat/i))) { await shot(p, 'pilot-feedback-390'); sawFeedback = true; }
      await clickText(p, /Continuer|Voir mon résultat/i, 800);
      await p.waitForTimeout(400);
      if (await vis(p, /Refaire la session|Retour à l’accueil/i)) break;
    }
    await c.close();
  }

  // ── 3) Remédiation déclenchée par l'erreur (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, PRACTICE_MARKER, 'remed');
    await reachPractice(p, 'remed');
    await clickText(p, /Plutôt à la baisse/i, 1500); // réponse fausse à « direction »
    await p.waitForTimeout(800);
    await shot(p, 'pilot-error-remediation-390');
    if (await clickText(p, /Réessayer autrement/i, 1500)) {
      await p.waitForTimeout(800);
      await shot(p, 'pilot-remediation-variant-390');
    }
    await c.close();
  }

  // ── 4) Progression finale (session réussie) + reprise + hors-ligne (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, PRACTICE_MARKER, 'final');
    await reachPractice(p, 'final');
    await playToResult(p, 'final');
    await p.waitForTimeout(300);
    await shot(p, 'pilot-progression-final-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, PRACTICE_MARKER, 'resume');
    await reachPractice(p, 'resume');
    await answerBestEffort(p);
    await p.waitForTimeout(400);
    await clickText(p, /Continuer/i, 800);
    await p.waitForTimeout(500);
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await shot(p, 'pilot-resume-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, PRACTICE_MARKER, 'offline');
    await reachPractice(p, 'offline');
    await c.setOffline(true);
    await p.waitForTimeout(1200);
    await shot(p, 'pilot-offline-390');
    await c.close();
  }

  // ── 5) Checkpoint échoué / réussi (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, `/session/checkpoint.read-chart`, /Exercice|point de contrôle|Chandeliers/i, 'cp-fail');
    for (let step = 0; step < 12; step++) {
      if (await vis(p, /Refaire la session|Retour à l’accueil/i)) break;
      const bs = await p.getByRole('button').all();
      for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider|réessayer/i.test(t)) continue; await b.click({ timeout: 900 }).catch(() => {}); break; }
      await p.waitForTimeout(400);
      await clickText(p, /Valider mon niveau|Valider l’ordre|Valider l'ordre/i, 700);
      await p.waitForTimeout(300);
      await clickText(p, /Continuer|Voir mon résultat/i, 800);
      await p.waitForTimeout(400);
    }
    await shot(p, 'pilot-checkpoint-fail-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, `/session/checkpoint.read-chart`, /Exercice|point de contrôle|Chandeliers/i, 'cp-pass');
    await playToResult(p, 'cp-pass');
    await p.waitForTimeout(300);
    await shot(p, 'pilot-checkpoint-pass-390');
    await c.close();
  }

  // ── 6) Écran de MONDE pilote (LOT 4) : ProgressWidget, jalons en icônes, 3 rendus ──
  for (const [w, h, tag, opts] of [[390, 844, '390', {}], [1280, 900, 'web', {}], [390, 844, 'reduced', { reducedMotion: 'reduce' }]]) {
    const { c, p } = await ctx(w, h, opts);
    await nav(p, `/monde/world.foundations`, /Fondations|Module|MONDE/i, `monde-${tag}`);
    await p.waitForTimeout(500);
    await shot(p, `lot4-monde-${tag}`);
    await c.close();
  }
}

let failure = null;
try {
  await run();
} catch (e) {
  failure = e;
}
await browser.close();
server.close();

console.log('\nErreurs console cumulées :', consoleErrors.length);
consoleErrors.slice(0, 8).forEach((e) => console.log('   !', e));
if (overflowFails.length) console.log('Débordements horizontaux :', overflowFails.join(', '));
console.log('Captures écrites dans', OUT);

if (failure) { console.error('\n✗ ÉCHEC de capture :', failure.message); process.exit(1); }
if (consoleErrors.length) { console.error('\n✗ ÉCHEC : erreurs console détectées.'); process.exit(1); }
if (overflowFails.length) { console.error('\n✗ ÉCHEC : débordement horizontal détecté.'); process.exit(1); }
console.log('✓ Captures fiables : 0 erreur console, 0 débordement horizontal.');
