import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SRC='/home/user/patternlab/assets/characters/source';
const b = await chromium.launch({executablePath:EXE, args:['--no-sandbox']});
const p = await b.newPage();
for (const f of readdirSync(SRC).filter(x=>x.endsWith('.png')).sort()) {
  const url = pathToFileURL(`${SRC}/${f}`).href;
  const dim = await p.evaluate((u)=>new Promise((res)=>{const i=new Image();i.onload=()=>res([i.naturalWidth,i.naturalHeight]);i.src=u;}), url);
  console.log(f.slice(0,8), dim.join(' x '));
}
await b.close();
