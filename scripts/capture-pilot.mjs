/**
 * Capture des preuves visuelles du parcours pilote « Comprendre un chandelier ».
 *
 * Reproductible : `npm run build:web` puis `node scripts/capture-pilot.mjs [dossierSortie]`.
 * Sert `dist/` localement (fallback SPA façon GitHub Pages) et pilote Chromium via Playwright.
 * Aucune dépendance runtime ajoutée : outil de développement autonome. Les images produites ne sont
 * PAS embarquées dans le build web.
 *
 * DÉTERMINISME & FIABILITÉ (LOT 4-A) : manifeste EXACT des captures attendues ; production isolée
 * puis publication des seuls PNG gérés après succès ; chaque `shot()` s'enregistre dans `produced` ;
 * égalité stricte exigée entre `produced`, le manifeste et les PNG publiés. Le script ÉCHOUE (code 1)
 * sur : erreur console, pageerror, débordement horizontal > 0, mesure d'overflow impossible, route
 * incorrecte (pathname + marqueur STABLE propre à l'écran), état ou palier obligatoire non atteint,
 * capture manquante ou inattendue.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';

const OUT = process.argv[2] || join(process.cwd(), 'docs', 'pilot-captures');
const DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.error('✗ dist absent. Lance d’abord `npm run build:web`.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

// ── Manifeste EXACT des captures attendues (sans extension) ──
const MANIFEST = [
  'pilot-practice-320', 'pilot-practice-390', 'pilot-practice-430', 'pilot-practice-web', 'pilot-practice-reduced',
  'pilot-result-320', 'pilot-result-390', 'pilot-result-430', 'pilot-result-web', 'pilot-result-reduced',
  'pilot-feedback-390', 'pilot-place-line-390',
  'pilot-error-remediation-390', 'pilot-remediation-variant-390',
  'pilot-progression-final-390', 'pilot-resume-390', 'pilot-offline-390',
  'pilot-checkpoint-fail-390', 'pilot-checkpoint-pass-390',
  'lot4-monde-390', 'lot4-monde-web', 'lot4-monde-reduced',
];
const MANIFEST_SET = new Set(MANIFEST);
const produced = new Set();

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
      else f = join(DIST, '404.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' });
    res.end(await readFile(f));
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/TradeMy`;
const browser = await chromium.launch({ args: ['--no-sandbox'] });
// Les nouvelles preuves sont produites à l'écart. Les fichiers suivis ne sont remplacés qu'après
// une exécution entièrement réussie : un navigateur absent ou un état invalide ne détruit rien.
const RUN_OUT = mkdtempSync(join(OUT, '.capture-run-'));

const consoleErrors = [];

const vis = async (p, re) => (await p.getByText(re).count().catch(() => 0)) > 0;
const clickText = async (p, re, t = 1000) => { try { await p.getByText(re).first().click({ timeout: t }); return true; } catch { return false; } };

/** Mesure du débordement horizontal. Une mesure IMPOSSIBLE lève (jamais un -1 accepté). */
async function overflow(p) {
  const v = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
  if (typeof v !== 'number' || Number.isNaN(v)) throw new Error('Mesure de débordement impossible');
  return v;
}

/** Navigue et VÉRIFIE le pathname attendu + un marqueur STABLE propre à l'écran (sinon lève). */
async function nav(p, path, markerRe, screen) {
  await p.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const pathname = new URL(p.url()).pathname;
  const expectedPathname = `${new URL(base).pathname.replace(/\/$/, '')}${path}`;
  if (pathname !== expectedPathname) {
    throw new Error(`Route incorrecte: attendu ${expectedPathname}, obtenu ${pathname} [${screen}]`);
  }
  try {
    await p.getByText(markerRe).first().waitFor({ timeout: 9000 });
  } catch {
    throw new Error(`Écran non rendu: ${screen} (marqueur ${markerRe} absent sur ${path})`);
  }
}

async function assertState(p, re, label) {
  if (!(await vis(p, re))) throw new Error(`État obligatoire non atteint: ${label}`);
}

/** Capture : refuse un nom hors manifeste, exige overflow 0, enregistre dans `produced`. */
async function shot(p, name) {
  if (!MANIFEST_SET.has(name)) throw new Error(`Capture INATTENDUE (hors manifeste): ${name}`);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(180);
  const ov = await overflow(p);
  if (ov > 0) throw new Error(`Débordement horizontal ${ov}px sur ${name}`);
  await p.screenshot({ path: join(RUN_OUT, `${name}.png`) });
  produced.add(name);
  console.log('  ✓', name);
}

async function ctx(w, h, opts = {}) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, ...opts });
  const p = await c.newPage();
  p.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${w}px ${m.text().slice(0, 140)}`); });
  p.on('pageerror', (e) => consoleErrors.push(`${w}px PAGEERROR ${String(e).slice(0, 140)}`));
  return { c, p };
}

const PRACTICE = /Exercice\s+\d+\s*\/\s*\d+/;
async function reachPractice(p, tag) {
  for (let i = 0; i < 22; i++) {
    if (await vis(p, PRACTICE)) return;
    if (await clickText(p, /Commencer les exercices/i, 800)) { await p.waitForTimeout(600); continue; }
    await clickText(p, /Suivant/i, 800);
    await p.waitForTimeout(350);
  }
  throw new Error(`Phase pratique non atteinte [${tag}]`);
}

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
const RESULT = /Refaire la session|Retour à l’accueil/i;
const RESULT_SUCCESS = /Sans faute — parfait !|Session réussie, bravo !/i;
const RESULT_RETRY = /Bien essayé — révise et retente !/i;

/** Vérifie la sémantique du résultat, pas seulement ses boutons génériques. */
async function assertResultTier(p, expected, label) {
  await assertState(p, RESULT, `${label} (actions résultat)`);
  await assertState(p, /^\d+\s*\/\s*\d+$/, `${label} (score)`);
  const success = await vis(p, RESULT_SUCCESS);
  const retry = await vis(p, RESULT_RETRY);
  if (success === retry) {
    throw new Error(`Palier de résultat ambigu ou absent: ${label}`);
  }
  if (expected === 'success' && !success) {
    throw new Error(`Résultat réussi attendu mais palier « à revoir » obtenu: ${label}`);
  }
  if (expected === 'retry' && !retry) {
    throw new Error(`Résultat « à revoir » attendu mais réussite obtenue: ${label}`);
  }
}

async function playToResult(p, tag) {
  for (let step = 0; step < 14; step++) {
    if (await vis(p, RESULT)) return;
    await answerBestEffort(p);
    await p.waitForTimeout(450);
    await clickText(p, /Continuer|Voir mon résultat/i, 800);
    await p.waitForTimeout(450);
  }
  throw new Error(`Écran de résultat non atteint [${tag}]`);
}

// Marqueurs STABLES propres à chaque écran (jamais des expressions larges).
const CANDLE = 'Chandeliers japonais';
const FONDATIONS = 'Fondations des marchés';
const SESSION = '/session/skill.candles';
const CHECKPOINT = '/session/checkpoint.read-chart';

async function run() {
  // ── 1) Pratique + RÉSULTAT corrigé, à 5 rendus ──
  for (const [w, h, tag, opts] of [[320, 720, '320', {}], [390, 844, '390', {}], [430, 932, '430', {}], [1280, 900, 'web', {}], [390, 844, 'reduced', { reducedMotion: 'reduce' }]]) {
    const { c, p } = await ctx(w, h, opts);
    await nav(p, SESSION, new RegExp(CANDLE), `session ${tag}`);
    await reachPractice(p, tag);
    await assertState(p, PRACTICE, `pratique ${tag}`);
    await shot(p, `pilot-practice-${tag}`);
    await playToResult(p, tag);
    await assertResultTier(p, 'success', `résultat ${tag}`);
    await shot(p, `pilot-result-${tag}`);
    await c.close();
  }

  // ── 2) Mécaniques (390) : feedback + placement de ligne ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, new RegExp(CANDLE), 'mech');
    await reachPractice(p, 'mech');
    let sawPlace = false, sawFeedback = false;
    for (let step = 0; step < 9 && !(sawPlace && sawFeedback); step++) {
      if (!sawPlace && (await vis(p, /Valider mon niveau/))) { await shot(p, 'pilot-place-line-390'); sawPlace = true; }
      const bs = await p.getByRole('button').all();
      let acted = false;
      for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider/i.test(t)) continue; await b.click({ timeout: 1000 }).catch(() => {}); acted = true; break; }
      if (!acted) await clickText(p, /Valider mon niveau|Valider l’ordre|Valider l'ordre/i, 800);
      await p.waitForTimeout(500);
      if (!sawFeedback && (await vis(p, /Continuer|Voir mon résultat/i))) { await shot(p, 'pilot-feedback-390'); sawFeedback = true; }
      await clickText(p, /Continuer|Voir mon résultat/i, 800);
      await p.waitForTimeout(350);
      if (await vis(p, RESULT)) break;
    }
    if (!sawFeedback) throw new Error('État obligatoire non atteint: feedback');
    if (!sawPlace) throw new Error('État obligatoire non atteint: placement de ligne');
    await c.close();
  }

  // ── 3) Remédiation déclenchée par l'erreur (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, new RegExp(CANDLE), 'remed');
    await reachPractice(p, 'remed');
    if (!(await clickText(p, /Plutôt à la baisse/i, 1500))) throw new Error('Réponse « direction » introuvable (remédiation)');
    await p.waitForTimeout(800);
    await assertState(p, /Réessayer autrement/i, 'proposition de remédiation');
    await shot(p, 'pilot-error-remediation-390');
    if (!(await clickText(p, /Réessayer autrement/i, 1500))) throw new Error('Bouton « Réessayer autrement » inopérant');
    await p.waitForTimeout(800);
    await assertState(p, /REMÉDIATION/i, 'variante de remédiation');
    await shot(p, 'pilot-remediation-variant-390');
    await c.close();
  }

  // ── 4) Progression finale + reprise + hors-ligne (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, new RegExp(CANDLE), 'final');
    await reachPractice(p, 'final');
    await playToResult(p, 'final');
    await assertResultTier(p, 'success', 'progression finale');
    await shot(p, 'pilot-progression-final-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, new RegExp(CANDLE), 'resume');
    await reachPractice(p, 'resume');
    await answerBestEffort(p);
    await p.waitForTimeout(400);
    await clickText(p, /Continuer/i, 800);
    await p.waitForTimeout(500);
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await assertState(p, /Exercice\s+2\s*\/\s*\d+/, 'reprise (Exercice 2)');
    await shot(p, 'pilot-resume-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, SESSION, new RegExp(CANDLE), 'offline');
    await reachPractice(p, 'offline');
    await c.setOffline(true);
    await p.waitForTimeout(1200);
    await assertState(p, /Hors ligne/i, 'hors-ligne');
    await shot(p, 'pilot-offline-390');
    await c.close();
  }

  // ── 5) Checkpoint échoué / réussi (390) ──
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, CHECKPOINT, PRACTICE, 'cp-fail');
    for (let step = 0; step < 12; step++) {
      if (await vis(p, RESULT)) break;
      const bs = await p.getByRole('button').all();
      for (const b of bs) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (!t || /continuer|voir mon|recommencer|retour|accueil|refaire|monter|descendre|◀|▶|valider|réessayer/i.test(t)) continue; await b.click({ timeout: 900 }).catch(() => {}); break; }
      await p.waitForTimeout(400);
      await clickText(p, /Valider mon niveau|Valider l’ordre|Valider l'ordre/i, 700);
      await p.waitForTimeout(300);
      await clickText(p, /Continuer|Voir mon résultat/i, 800);
      await p.waitForTimeout(400);
    }
    await assertResultTier(p, 'retry', 'checkpoint échoué');
    await shot(p, 'pilot-checkpoint-fail-390');
    await c.close();
  }
  {
    const { c, p } = await ctx(390, 844);
    await nav(p, CHECKPOINT, PRACTICE, 'cp-pass');
    await playToResult(p, 'cp-pass');
    await assertResultTier(p, 'success', 'checkpoint réussi');
    await shot(p, 'pilot-checkpoint-pass-390');
    await c.close();
  }

  // ── 6) Écran de MONDE pilote (marqueur STABLE = titre du monde) ──
  for (const [w, h, tag, opts] of [[390, 844, '390', {}], [1280, 900, 'web', {}], [390, 844, 'reduced', { reducedMotion: 'reduce' }]]) {
    const { c, p } = await ctx(w, h, opts);
    await nav(p, `/monde/world.foundations`, new RegExp(FONDATIONS), `monde ${tag}`);
    await assertState(p, new RegExp(FONDATIONS), `monde ${tag}`);
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

// ── Vérifications finales STRICTES ──
const runPngs = new Set(readdirSync(RUN_OUT).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)));
const existingPngs = new Set(readdirSync(OUT).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)));
const missing = MANIFEST.filter((n) => !produced.has(n));
const unexpectedProduced = [...produced].filter((n) => !MANIFEST_SET.has(n));
const unexpectedRun = [...runPngs].filter((n) => !MANIFEST_SET.has(n));
const missingRun = MANIFEST.filter((n) => !runPngs.has(n));
const foreignExisting = [...existingPngs].filter((n) => !MANIFEST_SET.has(n));

console.log(`\nCaptures produites : ${produced.size}/${MANIFEST.length}`);
console.log('Erreurs console/pageerror :', consoleErrors.length);
consoleErrors.slice(0, 8).forEach((e) => console.log('   !', e));

let ok = true;
if (failure) { console.error('✗ ÉCHEC :', failure.message); ok = false; }
if (consoleErrors.length) { console.error('✗ ÉCHEC : erreurs console/pageerror.'); ok = false; }
if (missing.length) { console.error('✗ Captures manquantes :', missing.join(', ')); ok = false; }
if (unexpectedProduced.length) { console.error('✗ Captures inattendues :', unexpectedProduced.join(', ')); ok = false; }
if (unexpectedRun.length) { console.error('✗ PNG inattendus produits :', unexpectedRun.join(', ')); ok = false; }
if (missingRun.length) { console.error('✗ PNG produits manquants :', missingRun.join(', ')); ok = false; }
if (foreignExisting.length) { console.error('✗ PNG étrangers dans le dossier cible :', foreignExisting.join(', ')); ok = false; }

if (!ok) {
  rmSync(RUN_OUT, { recursive: true, force: true });
  process.exit(1);
}

// Publication finale : remplace uniquement les 22 noms gérés, après toutes les vérifications.
for (const name of MANIFEST) {
  renameSync(join(RUN_OUT, `${name}.png`), join(OUT, `${name}.png`));
}
rmSync(RUN_OUT, { recursive: true, force: true });

const finalPngs = new Set(readdirSync(OUT).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)));
const missingFinal = MANIFEST.filter((n) => !finalPngs.has(n));
const unexpectedFinal = [...finalPngs].filter((n) => !MANIFEST_SET.has(n));
if (missingFinal.length || unexpectedFinal.length) {
  console.error('✗ Publication finale incohérente.', { missingFinal, unexpectedFinal });
  process.exit(1);
}
console.log('✓ Manifeste exact respecté ; 0 erreur console ; 0 débordement. Captures dans', OUT);
