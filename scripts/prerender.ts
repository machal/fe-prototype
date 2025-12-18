import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');

// Načteme data pro získání všech routes
const dataPath = join(__dirname, '..', 'src', 'data.ts');
const dataContent = readFileSync(dataPath, 'utf-8');

// Extrahujeme všechny IDs z dat
const extractIds = (content: string, pattern: RegExp): string[] => {
  const matches = [...content.matchAll(pattern)];
  return matches.map(m => m[1]).filter(Boolean);
};

// Talk IDs
const talkMatches = [...dataContent.matchAll(/talks:\s*\[([\s\S]*?)\],/g)];
let talkIds: string[] = [];
if (talkMatches.length > 0) {
  const talksContent = talkMatches[0][1];
  talkIds = extractIds(talksContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));
}

// Speaker IDs
const speakerMatches = [...dataContent.matchAll(/speakers:\s*\[([\s\S]*?)\],/g)];
let speakerIds: string[] = [];
if (speakerMatches.length > 0) {
  const speakersContent = speakerMatches[0][1];
  speakerIds = extractIds(speakersContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));
}

// Topic IDs
const topicMatches = [...dataContent.matchAll(/topics:\s*\[([\s\S]*?)\],/g)];
let topicIds: string[] = [];
if (topicMatches.length > 0) {
  const topicsContent = topicMatches[0][1];
  topicIds = extractIds(topicsContent, /id:\s*['"]([a-z]+)['"]/g).filter(id => /^[a-z]+$/.test(id));
}

// Year IDs
const yearMatches = [...dataContent.matchAll(/years:\s*\[([\s\S]*?)\],/g)];
let yearIds: string[] = [];
if (yearMatches.length > 0) {
  const yearsContent = yearMatches[0][1];
  yearIds = extractIds(yearsContent, /id:\s*['"](20\d{2})['"]/g).filter(id => /^20\d{2}$/.test(id));
}

// Vytvoříme všechny routes
const routes = [
  '/',
  ...talkIds.map(id => `/talks/${id}`),
  ...speakerIds.map(id => `/speakers/${id}`),
  ...topicIds.map(id => `/topics/${id}`),
  ...yearIds.map(id => `/years/${id}`),
];

const uniqueRoutes = [...new Set(routes)];

// Načteme HTML template
const templatePath = join(distPath, 'index.html');
let templateHtml = readFileSync(templatePath, 'utf-8');

console.log('SSG Pre-rendering routes pomocí Puppeteer...');
console.log(`Nalezeno: ${talkIds.length} přednášek, ${speakerIds.length} speakerů, ${topicIds.length} témat, ${yearIds.length} ročníků\n`);

// Spustíme preview server na pozadí
console.log('Spouštím preview server...');
const previewServer = spawn('npm', ['run', 'preview:server'], {
  cwd: join(__dirname, '..'),
  stdio: 'pipe',
  shell: true,
});

// Počkáme, až se server spustí
console.log('Čekám na spuštění serveru...');
await new Promise(resolve => setTimeout(resolve, 5000));

try {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Nastavíme viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Renderujeme všechny routes sekvenčně
  for (const route of uniqueRoutes) {
    try {
      const url = `http://localhost:4173${route}`;
      console.log(`Rendering ${route}...`);
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Počkáme, až se React načte a vyrenderuje
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Počkáme ještě chvíli, aby se vše načetlo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Získáme HTML obsah root elementu
      const htmlContent = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML : '';
      });

      if (!htmlContent || htmlContent.trim().length === 0) {
        console.warn(`⚠ ${route} - prázdný obsah`);
        continue;
      }

      // Vložíme vyrenderovaný obsah do template
      let html = templateHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${htmlContent}</div>`
      );

      // Pro ne-root routes upravíme cesty k assetům
      if (route !== '/') {
        const depth = route.split('/').filter(Boolean).length;
        const assetBasePath = '../'.repeat(depth);
        
        html = html.replace(/href="\.\//g, `href="${assetBasePath}`);
        html = html.replace(/src="\.\//g, `src="${assetBasePath}`);
        
        if (html.includes('<base')) {
          html = html.replace(/<base[^>]*href="[^"]*"[^>]*>/, `<base href="${assetBasePath}">`);
        }
      }

      // Vytvoříme složku pro route
      const routePath = route === '/' ? distPath : join(distPath, ...route.split('/').filter(Boolean));
      if (!existsSync(routePath)) {
        mkdirSync(routePath, { recursive: true });
      }

      // Uložíme HTML soubor
      if (route === '/') {
        writeFileSync(join(distPath, 'index.html'), html);
      } else {
        writeFileSync(join(routePath, 'index.html'), html);
      }

      console.log(`✓ ${route}`);
    } catch (error) {
      console.error(`✗ Chyba při renderování ${route}:`, error);
      if (error instanceof Error) {
        console.error(`  ${error.message}`);
      }
    }
  }

  await browser.close();
  previewServer.kill();

  console.log(`\n✅ SSG Pre-rendering dokončen! ${uniqueRoutes.length} routes vytvořeno.`);
  console.log('📁 Statické HTML soubory jsou v dist/ složce.');
  console.log('🚀 Fungují i bez JavaScriptu (obsah je pre-renderovaný)');
  console.log('💡 JS se načte pro interaktivitu (hydration)');
} catch (error) {
  previewServer.kill();
  console.error('❌ Kritická chyba:', error);
  if (error instanceof Error) {
    console.error(`  ${error.message}`);
    console.error(`  ${error.stack}`);
  }
  process.exit(1);
}
