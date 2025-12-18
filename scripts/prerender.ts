import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

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
const talkIds = extractIds(dataContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));

// Speaker IDs  
const speakerIds = extractIds(dataContent, /id:\s*['"]([\d]+)['"]/g).filter(id => /^\d+$/.test(id));

// Topic IDs
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

const uniqueRoutes = [...new Set(routes)];

// Načteme HTML template
const templatePath = join(distPath, 'index.html');
let templateHtml = readFileSync(templatePath, 'utf-8');

console.log('SSG Pre-rendering routes...');
console.log(`Nalezeno: ${talkIds.length} přednášek, ${speakerIds.length} speakerů, ${topicIds.length} témat, ${yearIds.length} ročníků\n`);

// Vytvoříme dočasné soubory bez CSS importů
const srcPath = join(__dirname, '..', 'src');
const tempPath = join(__dirname, '..', '.temp-ssg');

if (!existsSync(tempPath)) {
  mkdirSync(tempPath, { recursive: true });
}

// Funkce pro odstranění CSS importů z souboru
const removeCssImports = (content: string): string => {
  return content.replace(/import\s+['"].*\.css['"];?\s*/g, '');
};

// Zkopírujeme a upravíme potřebné soubory
const filesToProcess = [
  'App.tsx',
  'pages/Home.tsx',
  'pages/TalkDetail.tsx',
  'pages/SpeakerDetail.tsx',
  'pages/TopicDetail.tsx',
  'pages/YearDetail.tsx',
  'components/TalkCard.tsx',
  'components/SpeakerCard.tsx',
  'components/TopicCard.tsx',
  'components/YearCard.tsx',
];

filesToProcess.forEach(file => {
  const sourcePath = join(srcPath, file);
  const targetPath = join(tempPath, file);
  const targetDir = dirname(targetPath);
  
  if (existsSync(sourcePath)) {
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    const content = readFileSync(sourcePath, 'utf-8');
    const contentWithoutCss = removeCssImports(content);
    writeFileSync(targetPath, contentWithoutCss);
  }
});

// Zkopírujeme ostatní soubory beze změny
const otherFiles = ['data.ts', 'types.ts', 'main.tsx', 'vite-env.d.ts'];
otherFiles.forEach(file => {
  const sourcePath = join(srcPath, file);
  const targetPath = join(tempPath, file);
  if (existsSync(sourcePath)) {
    const content = readFileSync(sourcePath, 'utf-8');
    writeFileSync(targetPath, content);
  }
});

try {
  // Dynamicky importujeme App z dočasné složky
  const { default: App } = await import('../.temp-ssg/App.tsx');

  uniqueRoutes.forEach(route => {
    try {
      // Renderujeme React komponentu do HTML stringu
      const htmlContent = renderToString(
        React.createElement(StaticRouter, { location: route },
          React.createElement(App)
        )
      );

      // Vložíme vyrenderovaný obsah do template
      let html = templateHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${htmlContent}</div>`
      );

      // Pro ne-root routes upravíme cesty k assetům
      if (route !== '/') {
        const depth = route.split('/').filter(Boolean).length;
        const assetBasePath = '../'.repeat(depth);
        
        // Upravíme cesty k assetům
        html = html.replace(/href="\.\//g, `href="${assetBasePath}`);
        html = html.replace(/src="\.\//g, `src="${assetBasePath}`);
        
        // Upravíme base tag
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
    }
  });
} finally {
  // Smazeme dočasnou složku
  const { rmSync } = await import('fs');
  if (existsSync(tempPath)) {
    rmSync(tempPath, { recursive: true, force: true });
  }
}

console.log(`\n✅ SSG Pre-rendering dokončen! ${uniqueRoutes.length} routes vytvořeno.`);
console.log('📁 Statické HTML soubory jsou v dist/ složce.');
console.log('🚀 Fungují i bez JavaScriptu (obsah je pre-renderovaný)');
console.log('💡 JS se načte pro interaktivitu (hydration)');
