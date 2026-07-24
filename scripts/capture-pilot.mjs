/**
 * Capture des preuves visuelles du parcours pilote « Comprendre un chandelier ».
 *
 * Reproductible : `npm run build:web` puis `node scripts/capture-pilot.mjs [dossierSortie]`.
 * Sert `dist/` localement (fallback SPA façon GitHub Pages) et pilote Chromium via Playwright.
 * Aucune dépendance runtime ajoutée : le script est un outil de développement autonome. Playwright
 * doit être disponible (installation globale de l'environnement CI/dev) — sinon le script s'arrête
 * proprement avec un message. Les images produites ne sont PAS embarquées dans le build web.
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
  // Playwright de l'environnement (installation globale du runner) — résolu dynamiquement pour ne
  // PAS l'imposer comme dépendance du projet. Passe PLAYWRIGHT_REQUIRE pour une autre base de résolution.
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

const errs = [];
const vis = async (p, re) => (await p.getByText(re).count().catch(() => 0)) > 0;
const clickText = async (p, re, t = 1000) => { try { await p.getByText(re).first().click({ timeout: t }); return true; } catch { return false; } };
async function shot(p, n) { await p.evaluate(() => window.scrollTo(0, 0)).catch(() => {}); await p.waitForTimeout(180); await p.screenshot({ path: join(OUT, `${n}.png`) }); console.log('  ✓', n); }
async function overflow(p) { return p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth)).catch(() => -1); }
async function ctx(w, h, opts = {}) { const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, ...opts }); const p = await c.newPage(); p.on('console', (m) => { if (m.type() === 'error') errs.push(`${w}px ${m.text().slice(0, 120)}`); }); p.on('pageerror', (e) => errs.push(`${w}px PAGEERROR ${String(e).slice(0, 120)}`)); return { c, p }; }
async function reachPractice(p) { for (let i = 0; i < 22; i++) { if (await vis(p, /Exercice\s+\d+\s*\/\s*\d+/)) return true; if (await clickText(p, /Commencer les exercices/i, 800)) { await p.waitForTimeout(600); continue; } await clickText(p, /Suivant/i, 800); await p.waitForTimeout(350); } return vis(p, /Exercice/); }

// Marche à travers les exercices en capturant les écrans clés (dont la 4e mécanique et l'ordre mélangé).
async function walk(p, tag, maxOv) {
  let sawPlace = false; let sawOrder = false; let sawFeedback = false;
  for (let step = 0; step < 9; step++) {
    maxOv.v = Math.max(maxOv.v, await overflow(p));
    if (!sawPlace && (await vis(p, /Valider mon niveau/))) { await shot(p, `pilot-place-line-${tag}`); sawPlace = true; }
    if (!sawOrder && (await vis(p, /Valider l’ordre|Valider l'ordre/))) { await shot(p, `pilot-order-shuffled-${tag}`); sawOrder = true; }
    // avance
    const bs = await p.getByRole('button').all();
    let acted = false;
    for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider/i.test(t)) continue; await b.click({ timeout: 1000 }).catch(() => {}); acted = true; break; }
    if (!acted) { await clickText(p, /Valider mon niveau|Valider l’ordre|Valider l'ordre/i, 800); }
    await p.waitForTimeout(500);
    if (!sawFeedback && (await vis(p, /Continuer|Voir mon résultat/i))) { await shot(p, `pilot-feedback-${tag}`); sawFeedback = true; }
    await clickText(p, /Continuer|Voir mon résultat/i, 800); await p.waitForTimeout(500);
    if (await vis(p, /Refaire la session|Retour à l’accueil/i)) { await shot(p, `pilot-result-${tag}`); break; }
  }
}

for (const [w, h, tag, opts] of [[320, 720, '320', {}], [390, 844, '390', {}], [430, 932, '430', {}], [1280, 900, 'web', {}], [390, 844, 'reduced', { reducedMotion: 'reduce' }]]) {
  const { c, p } = await ctx(w, h, opts);
  await p.goto(`${base}/session/skill.candles`, { waitUntil: 'networkidle' }).catch(() => {});
  await p.waitForTimeout(1500);
  await reachPractice(p);
  await p.waitForTimeout(400);
  const maxOv = { v: 0 };
  await shot(p, `pilot-practice-${tag}`);
  await walk(p, tag, maxOv);
  console.log(`  ${tag}: débordement horizontal max = ${maxOv.v}px`);
  await c.close();
}
// Hors-ligne
{ const { c, p } = await ctx(390, 844); await p.goto(`${base}/session/skill.candles`, { waitUntil: 'networkidle' }).catch(() => {}); await p.waitForTimeout(1500); await reachPractice(p); await c.setOffline(true); await p.waitForTimeout(1200); await shot(p, 'pilot-offline-390'); await c.close(); }

console.log('\nErreurs console cumulées :', errs.length);
errs.slice(0, 6).forEach((e) => console.log('   !', e));
await browser.close();
server.close();
console.log('Captures écrites dans', OUT);
