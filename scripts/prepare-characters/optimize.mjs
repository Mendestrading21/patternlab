// Prépare les assets Toto & Bobo optimisés à partir des rendus 3D sources.
// AUCUN outil externe (pas d'ImageMagick/sharp) : on décode/redimensionne/recadre
// via Chromium (canvas 2D), en passant les images en data-URL (évite les soucis file://).
//
// Usage :
//   node scripts/prepare-characters/optimize.mjs preview   -> aperçus de calage des découpes
//   node scripts/prepare-characters/optimize.mjs scenes     -> écrit assets/characters/scenes/*
//   node scripts/prepare-characters/optimize.mjs heads      -> écrit assets/characters/heads/*
//   node scripts/prepare-characters/optimize.mjs all        -> scenes + heads
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = '/home/user/patternlab/assets/characters';
const SRC = `${ROOT}/source`;
const PREVIEW = '/tmp/claude-0/-home-user/bf83c316-521b-505f-a938-db129b4b0fd6/scratchpad';

const F = {
  warningDuo: '0c51b81c-bc3a-4e7a-b128-2488337a4b45.png',
  exprSheet: '0c69cf15-9f52-464a-ad3a-9821115a2581.png',
  presentToto: '3c35dbe9-1179-4d2e-9725-d98195932ae8.png',
  studyDuo: '48181a87-b7e1-46af-b949-49c3469d9229.png',
  analyzeDuo: '63f5d3af-0ac9-4ef7-88ef-f583c19d202b.png',
  boboRisk: '66076bdd-fbbe-4610-9c90-2cbc8814ae1c.png',
  welcomeDuo: '89cf4680-a6ca-4c36-a07e-6ba1a51ba9eb.png',
  celebrateDuo: '8a7b5434-79d1-4505-9469-40115c9d6feb.png',
};

// Scènes carrées 1254x1254 -> panneaux illustrés (JPEG, pas de transparence nécessaire).
const SCENES = [
  ['welcome-duo', F.welcomeDuo],
  ['study-duo', F.studyDuo],
  ['present-toto', F.presentToto],
  ['analyze-duo', F.analyzeDuo],
  ['bobo-risk', F.boboRisk],
  ['warning-duo', F.warningDuo],
  ['celebrate-duo', F.celebrateDuo],
];

// Découpes des têtes dans la planche d'expressions 0c69 (1122x1402).
// Coordonnées fractionnelles {x,y,w,h}. Ajustées via le mode "preview".
const HEADS = [
  ['toto-happy', F.exprSheet, 0.03, 0.385, 0.2, 0.16],
  ['toto-thinking', F.exprSheet, 0.21, 0.385, 0.2, 0.16],
  ['toto-concerned', F.exprSheet, 0.4, 0.385, 0.2, 0.16],
  ['toto-excited', F.exprSheet, 0.59, 0.385, 0.2, 0.16],
  ['toto-neutral', F.exprSheet, 0.77, 0.385, 0.2, 0.16],
  ['bobo-happy', F.exprSheet, 0.03, 0.66, 0.2, 0.15],
  ['bobo-concerned', F.exprSheet, 0.21, 0.66, 0.2, 0.15],
  ['bobo-sad', F.exprSheet, 0.4, 0.66, 0.2, 0.15],
  ['bobo-thinking', F.exprSheet, 0.59, 0.66, 0.2, 0.15],
  ['bobo-neutral', F.exprSheet, 0.77, 0.66, 0.2, 0.15],
];

// Détourages (fond transparent). cropFrac optionnel {x,y,w,h} en fractions.
// tol = tolérance couleur du fond ; keepN = nb de composantes (persos) à garder.
const CUTOUTS = [
  ['toto', F.exprSheet, { x: 0.02, y: 0.02, w: 0.47, h: 0.42 }, 140, 1],
  ['bobo', F.exprSheet, { x: 0.5, y: 0.02, w: 0.48, h: 0.42 }, 140, 1],
  ['welcome', F.welcomeDuo, null, 140, 2],
  ['study', F.studyDuo, null, 140, 3],
  ['present', F.presentToto, null, 140, 3],
  ['analyze', F.analyzeDuo, null, 140, 3],
  ['celebrate', F.celebrateDuo, null, 140, 3],
  ['bobo-risk', F.boboRisk, null, 140, 2],
];

function dataUrl(file) {
  return 'data:image/png;base64,' + readFileSync(`${SRC}/${file}`).toString('base64');
}

async function run() {
  const mode = process.argv[2] || 'all';
  mkdirSync(`${ROOT}/scenes`, { recursive: true });
  mkdirSync(`${ROOT}/heads`, { recursive: true });
  const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const page = await b.newPage();

  // rend une image (optionnellement recadrée) vers un dataURL de sortie
  async function render(file, { crop, outW, outH, type, quality }) {
    const src = dataUrl(file);
    return page.evaluate(
      async ({ src, crop, outW, outH, type, quality }) => {
        const img = new Image();
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = src;
        });
        const iw = img.naturalWidth,
          ih = img.naturalHeight;
        const c = crop
          ? { sx: crop.x * iw, sy: crop.y * ih, sw: crop.w * iw, sh: crop.h * ih }
          : { sx: 0, sy: 0, sw: iw, sh: ih };
        const cv = document.createElement('canvas');
        cv.width = outW;
        cv.height = outH;
        const ctx = cv.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, outW, outH);
        return cv.toDataURL(type, quality);
      },
      { src, crop, outW, outH, type, quality }
    );
  }

  function save(dataURL, path) {
    const b64 = dataURL.split(',')[1];
    writeFileSync(path, Buffer.from(b64, 'base64'));
  }

  // Détourage : flood-fill du fond depuis les bords + on ne garde que les N plus
  // grandes composantes (les persos) + adoucissement du bord. Renvoie un PNG transparent.
  async function cutout(file, cropFrac, tol, keepN, outMax, checker) {
    const src = dataUrl(file);
    return page.evaluate(
      async ({ src, cropFrac, tol, keepN, outMax, checker }) => {
        const img = new Image();
        await new Promise((res) => { img.onload = res; img.src = src; });
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const cx = cropFrac ? Math.round(cropFrac.x * iw) : 0;
        const cy = cropFrac ? Math.round(cropFrac.y * ih) : 0;
        const W = cropFrac ? Math.round(cropFrac.w * iw) : iw;
        const H = cropFrac ? Math.round(cropFrac.h * ih) : ih;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, cx, cy, W, H, 0, 0, W, H);
        const im = ctx.getImageData(0, 0, W, H);
        const d = im.data;
        const N = W * H;
        // Fond = décor bleu nuit sombre. Les persos sont rouges/verts vifs — même à
        // l'ombre, leur canal rouge OU vert domine le bleu. On considère « fond » un
        // pixel sombre dont le bleu n'est PAS nettement dominé par le rouge ou le vert.
        // -> le dégradé navy (toute luminance) part, les ombres rouge/verte restent.
        // Parties sombres internes (sabots, nez) préservées car non reliées au bord.
        // `tol` = seuil de luminance V (exclut seulement le très clair : cornes, yeux).
        const V = tol;
        const isBg = (i) => {
          const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
          const mx = Math.max(r, g, b);
          return mx < V && r - b < 30 && g - b < 46;
        };
        // flood-fill du fond depuis les bords
        const bgMask = new Uint8Array(N);
        const stack = [];
        for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
        for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
        while (stack.length) {
          const i = stack.pop();
          if (bgMask[i] || !isBg(i)) continue;
          bgMask[i] = 1;
          const x = i % W, y = (i / W) | 0;
          if (x > 0) stack.push(i - 1);
          if (x < W - 1) stack.push(i + 1);
          if (y > 0) stack.push(i - W);
          if (y < H - 1) stack.push(i + W);
        }
        // composantes connexes du premier plan
        const label = new Int32Array(N);
        const sizes = [0];
        let cur = 0;
        for (let i = 0; i < N; i++) {
          if (bgMask[i] || label[i]) continue;
          cur++; sizes.push(0);
          const st = [i]; label[i] = cur;
          while (st.length) {
            const j = st.pop(); sizes[cur]++;
            const x = j % W, y = (j / W) | 0;
            if (x > 0 && !bgMask[j - 1] && !label[j - 1]) { label[j - 1] = cur; st.push(j - 1); }
            if (x < W - 1 && !bgMask[j + 1] && !label[j + 1]) { label[j + 1] = cur; st.push(j + 1); }
            if (y > 0 && !bgMask[j - W] && !label[j - W]) { label[j - W] = cur; st.push(j - W); }
            if (y < H - 1 && !bgMask[j + W] && !label[j + W]) { label[j + W] = cur; st.push(j + W); }
          }
        }
        // On garde les composantes assez grandes (persos + gros props tenus) et on
        // supprime les petits résidus (bougies, flèches, éclats du fond). keepN sert de
        // plafond de sécurité ; le vrai filtre est un ratio par rapport à la plus grande.
        let largest = 0;
        for (let k = 1; k <= cur; k++) if (sizes[k] > largest) largest = sizes[k];
        const ranked = [...Array(cur)].map((_, k) => k + 1).sort((a, b) => sizes[b] - sizes[a]);
        const keep = new Set();
        for (const k of ranked) {
          if (keep.size >= keepN) break;
          if (sizes[k] >= largest * 0.14) keep.add(k);
        }
        for (let i = 0; i < N; i++) {
          if (bgMask[i] || !keep.has(label[i])) d[i * 4 + 3] = 0;
        }
        // adoucir le bord (anti-halo) : alpha réduit sur les pixels de contour
        const a0 = new Uint8Array(N);
        for (let i = 0; i < N; i++) a0[i] = d[i * 4 + 3];
        for (let i = 0; i < N; i++) {
          if (!a0[i]) continue;
          const x = i % W, y = (i / W) | 0;
          const edge = x === 0 || x === W - 1 || y === 0 || y === H - 1 ||
            !a0[i - 1] || !a0[i + 1] || !a0[i - W] || !a0[i + W];
          if (edge) d[i * 4 + 3] = Math.min(a0[i], 150);
        }
        ctx.putImageData(im, 0, 0);
        // recadrage à la boîte englobante opaque
        let minx = W, miny = H, maxx = 0, maxy = 0, any = false;
        for (let i = 0; i < N; i++) {
          if (d[i * 4 + 3] > 12) { any = true; const x = i % W, y = (i / W) | 0;
            if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
        }
        if (!any) { minx = 0; miny = 0; maxx = W - 1; maxy = H - 1; }
        const pad = 10;
        minx = Math.max(0, minx - pad); miny = Math.max(0, miny - pad);
        maxx = Math.min(W - 1, maxx + pad); maxy = Math.min(H - 1, maxy + pad);
        const bw = maxx - minx + 1, bh = maxy - miny + 1;
        const scale = Math.min(1, outMax / Math.max(bw, bh));
        const ow = Math.round(bw * scale), oh = Math.round(bh * scale);
        const out = document.createElement('canvas');
        out.width = ow; out.height = oh;
        const octx = out.getContext('2d');
        octx.imageSmoothingQuality = 'high';
        if (checker) {
          const s = 16;
          for (let yy = 0; yy < oh; yy += s) for (let xx = 0; xx < ow; xx += s) {
            octx.fillStyle = ((xx / s + yy / s) | 0) % 2 ? '#3a3f45' : '#6b7178';
            octx.fillRect(xx, yy, s, s);
          }
        }
        octx.drawImage(cv, minx, miny, bw, bh, 0, 0, ow, oh);
        return out.toDataURL('image/png');
      },
      { src, cropFrac, tol, keepN, outMax, checker }
    );
  }

  if (mode === 'cutouts' || mode === 'cutpreview') {
    mkdirSync(`${ROOT}/cutouts`, { recursive: true });
    const checker = mode === 'cutpreview';
    for (const [name, file, cropFrac, tol, keepN] of CUTOUTS) {
      const out = await cutout(file, cropFrac, tol, keepN, 600, checker);
      const kb = (Buffer.from(out.split(',')[1], 'base64').length / 1024).toFixed(0);
      if (checker) {
        save(out, `${PREVIEW}/cut-${name}.png`);
        console.log('cutpreview', name, kb + 'KB');
      } else {
        save(out, `${ROOT}/cutouts/${name}.png`);
        console.log('cutout', name, '->', kb + 'KB');
      }
    }
  }

  if (mode === 'scenes' || mode === 'all') {
    for (const [name, file] of SCENES) {
      const out = await render(file, { outW: 900, outH: 900, type: 'image/jpeg', quality: 0.85 });
      const p = `${ROOT}/scenes/${name}.jpg`;
      save(out, p);
      console.log('scene', name, '->', (Buffer.from(out.split(',')[1], 'base64').length / 1024).toFixed(0) + 'KB');
    }
  }

  if (mode === 'heads' || mode === 'all') {
    for (const [name, file, x, y, w, h] of HEADS) {
      const out = await render(file, {
        crop: { x, y, w, h },
        outW: 256,
        outH: 256,
        type: 'image/jpeg',
        quality: 0.9,
      });
      const p = `${ROOT}/heads/${name}.jpg`;
      save(out, p);
      console.log('head', name, '->', (Buffer.from(out.split(',')[1], 'base64').length / 1024).toFixed(0) + 'KB');
    }
  }

  if (mode === 'preview') {
    // Overlay des rectangles de découpe sur la planche source pour valider le calage.
    const src = dataUrl(F.exprSheet);
    const rects = HEADS.map(([name, , x, y, w, h]) => ({ name, x, y, w, h }));
    const outURL = await page.evaluate(
      async ({ src, rects }) => {
        const img = new Image();
        await new Promise((res) => {
          img.onload = res;
          img.src = src;
        });
        const scale = 760 / img.naturalWidth;
        const cv = document.createElement('canvas');
        cv.width = img.naturalWidth * scale;
        cv.height = img.naturalHeight * scale;
        const ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        ctx.lineWidth = 2;
        ctx.font = '13px sans-serif';
        for (const r of rects) {
          const x = r.x * cv.width,
            y = r.y * cv.height,
            w = r.w * cv.width,
            h = r.h * cv.height;
          ctx.strokeStyle = r.name.startsWith('toto') ? '#3FD07A' : '#E15A50';
          ctx.strokeRect(x, y, w, h);
          ctx.fillStyle = '#fff';
          ctx.fillText(r.name.replace(/^(toto|bobo)-/, ''), x + 2, y + 14);
        }
        return cv.toDataURL('image/png');
      },
      { src, rects }
    );
    save(outURL, `${PREVIEW}/heads-preview.png`);
    console.log('preview -> heads-preview.png');
  }

  await b.close();
}

run();
