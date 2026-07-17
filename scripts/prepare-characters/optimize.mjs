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
