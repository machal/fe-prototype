import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');

// Načteme data
const dataPath = join(__dirname, '..', 'src', 'data.ts');
const dataContent = readFileSync(dataPath, 'utf-8');

// Extrahujeme všechny IDs z dat
const extractIds = (content, pattern) => {
  const matches = [...content.matchAll(new RegExp(pattern, 'g'))];
  return matches.map(m => m[1]).filter(Boolean);
};

// Talk IDs - hledáme id: 'číslo'
const talkIds = extractIds(dataContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));

// Speaker IDs
const speakerIds = extractIds(dataContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));

// Topic IDs - hledáme string IDs
const topicIds = extractIds(dataContent, /id:\s*['"]([a-z]+)['"]/g).filter(id => /^[a-z]+$/.test(id));

// Year IDs
const yearIds = extractIds(dataContent, /id:\s*['"](20\d{2})['"]/g).filter(id => /^20\d{2}$/.test(id));

// Vytvoříme všechny routes
const routes = [
  '/',
  ...talkIds.map(id => `/talks/${id}`),
  ...speakerIds.map(id => `/speakers/${id}`),
  ...topicIds.map(id => `/topics/${id}`),
  ...yearIds.map(id => `/years/${id}`),
];

// Odstraníme duplicity
const uniqueRoutes = [...new Set(routes)];

// Načteme index.html
const indexHtml = readFileSync(join(distPath, 'index.html'), 'utf-8');

console.log('Pre-rendering routes...');
console.log(`Nalezeno: ${talkIds.length} přednášek, ${speakerIds.length} speakerů, ${topicIds.length} témat, ${yearIds.length} ročníků\n`);

uniqueRoutes.forEach(route => {
  // Vytvoříme HTML pro každou route
  let html = indexHtml;
  
  // Pro ne-root routes potřebujeme upravit base path
  if (route !== '/') {
    const depth = route.split('/').filter(Boolean).length;
    const basePath = '../'.repeat(depth - 1) || './';
    
    // Upravíme cesty k assetům - najdeme všechny absolutní cesty
    html = html.replace(/href="\//g, `href="${basePath}`);
    html = html.replace(/src="\//g, `src="${basePath}`);
    
    // Také upravíme base tag pokud existuje
    if (html.includes('<base')) {
      html = html.replace(/<base[^>]*>/, `<base href="${basePath}">`);
    }
  }
  
  // Vytvoříme složku pro route
  const routePath = route === '/' ? distPath : join(distPath, ...route.split('/').filter(Boolean));
  if (!existsSync(routePath)) {
    mkdirSync(routePath, { recursive: true });
  }
  
  // Pro nested routes vytvoříme index.html
  if (route === '/') {
    writeFileSync(join(distPath, 'index.html'), html);
  } else {
    writeFileSync(join(routePath, 'index.html'), html);
  }
  
  console.log(`✓ ${route}`);
});

console.log(`\n✅ Pre-rendering dokončen! ${uniqueRoutes.length} routes vytvořeno.`);
console.log('📁 Statické soubory jsou v dist/ složce.');
console.log('🚀 Můžete je nasadit na jakýkoliv statický hosting (Netlify, Vercel, GitHub Pages, atd.)');
console.log('💡 Nebo je můžete otevřít přímo v prohlížeči (index.html)');
