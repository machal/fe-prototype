# FrontKon - Prototyp databáze přednášek

Prototyp webové aplikace pro správu a zobrazení databáze přednášek, speakerů a témat z konference FrontKon.

## Funkce

- 📚 **Přednášky** - Přehled všech přednášek s detaily (délka, úroveň, témata, speaker)
- 👥 **Speakeři** - Seznam všech speakerů s jejich biografií a přednáškami
- 🏷️ **Témata** - Kategorizace přednášek podle témat
- 📅 **Ročníky** - Organizace přednášek podle ročníků FrontKonu (2020-2025)
- 🔗 **Routing** - Každá přednáška, speaker, téma a ročník má vlastní URL
- 🎥 **YouTube videa** - Placeholder pro YouTube videa u každé přednášky
- 📸 **Fotky speakerů** - Placeholder pro fotky speakerů
- 🔄 **Proklikávací odkazy** - Všechno je proklikávací (speaker, talk, topic, year)
- 📋 **Související obsah** - Seznamy souvisejících přednášek u každé struktury

## Technologie

- **Next.js 14** - React framework s App Router
- **React 18** - UI knihovna
- **TypeScript** - Typování
- **Static Site Generation (SSG)** - Pravé statické HTML soubory
- **CSS3** - Minimalistický design podle FrontKon webu

## Instalace

```bash
npm install
```

## Spuštění

Pro vývojový server:

```bash
npm run dev
```

Aplikace poběží na `http://localhost:3000`

## Build

Pro produkční build, který vytvoří statické HTML soubory:

```bash
npm run build
```

Next.js automaticky:
1. Zkompiluje TypeScript
2. Pre-renderuje všechny routes do statických HTML souborů pomocí `generateStaticParams`
3. Vytvoří statické HTML soubory v `out/` složce

Výsledek je v `out/` složce:
- Každá route má svůj vlastní `index.html` soubor
- Všechny soubory jsou statické a nevyžadují server
- Používá relativní cesty, takže funguje v jakékoliv podsložce
- Můžete je nasadit na jakýkoliv statický hosting (Netlify, Vercel, GitHub Pages, atd.)
- Nebo je otevřít přímo v prohlížeči (dvojklik na `out/index.html`)
- **Nasazení do podsložky**: Stačí nahrát obsah `out/` složky do jakékoliv podsložky na serveru (např. `/data/demo/`, `/prototype/`, atd.)

## Nasazení na GitHub Pages

### Automatické nasazení (doporučeno)

1. **Vytvořte GitHub repository** (pokud ještě nemáte):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VASE_USERNAME/VASE_REPO.git
   git push -u origin main
   ```

2. **Nasaďte na GitHub Pages**:
   ```bash
   npm run deploy
   ```

   Tento příkaz:
   - Vytvoří build
   - Nahraje obsah `out/` složky na `gh-pages` branch
   - GitHub Pages automaticky nasadí stránky

3. **Aktivujte GitHub Pages**:
   - Jděte do Settings vašeho repository
   - V sekci "Pages" vyberte source: `gh-pages` branch
   - Vaše stránky budou dostupné na: `https://VASE_USERNAME.github.io/VASE_REPO/`

### Manuální nasazení

Pokud chcete nasadit manuálně:

1. Spusťte build:
   ```bash
   npm run build
   ```

2. Nahrajte obsah `out/` složky na GitHub Pages:
   - Buď použijte GitHub Actions
   - Nebo nahrajte soubory přímo do `gh-pages` branch

**Struktura out/ po buildu:**
```
out/
├── index.html          # Domovská stránka
├── talks/
│   ├── 1/
│   │   └── index.html  # Detail přednášky 1
│   ├── 2/
│   │   └── index.html
│   └── ...
├── speakers/
│   ├── 1/
│   │   └── index.html  # Detail speakera 1
│   └── ...
├── topics/
│   ├── react/
│   │   └── index.html  # Detail tématu React
│   └── ...
└── years/
    ├── 2020/
    │   └── index.html  # Detail ročníku 2020
    └── ...
```

## Struktura projektu

```
app/
  ├── layout.tsx        # Hlavní layout
  ├── page.tsx          # Domovská stránka
  ├── globals.css       # Globální styly
  ├── talks/
  │   └── [id]/
  │       └── page.tsx  # Detail přednášky
  ├── speakers/
  │   └── [id]/
  │       └── page.tsx  # Detail speakera
  ├── topics/
  │   └── [id]/
  │       └── page.tsx  # Detail tématu
  └── years/
      └── [id]/
          └── page.tsx  # Detail ročníku
components/
  ├── TalkCard.tsx
  ├── SpeakerCard.tsx
  ├── TopicCard.tsx
  └── YearCard.tsx
data.json              # Data (30 přednášek, 15 speakerů, 12 témat, 6 ročníků)
types.ts               # TypeScript typy
```

## Routing

- `/` - Domovská stránka se seznamy
- `/talks/:id/` - Detail přednášky
- `/speakers/:id/` - Detail speakera
- `/topics/:id/` - Detail tématu
- `/years/:id/` - Detail ročníku

## Datový model

### Talk (Přednáška)
- id, title, description
- duration (v minutách)
- speakerId (odkaz na speakera)
- topicIds (pole odkazů na témata)
- yearId (odkaz na ročník)
- level (beginner/intermediate/advanced)
- language (cs/en)
- youtubeId (volitelné, pro YouTube video)

### Speaker (Speaker)
- id, name, bio
- company (volitelné)
- avatar (volitelné)
- twitter, github, website, linkedin (volitelné)

### Topic (Téma)
- id, name, description

### Year (Ročník)
- id, year
- location, date (volitelné)

## Úpravy dat

Data jsou uložena v `data.json`. Můžete je upravit podle potřeby nebo v budoucnu připojit k API/backendu.

## SSG (Static Site Generation)

Aplikace používá Next.js s `output: 'export'`, což vytváří skutečné statické HTML soubory. Všechny stránky jsou pre-renderovány při buildu pomocí `generateStaticParams`, takže:

- ✅ Obsah je viditelný i bez JavaScriptu
- ✅ SEO-friendly (plně indexovatelné vyhledávači)
- ✅ Rychlé načítání (žádné server-side rendering)
- ✅ Funguje na jakémkoliv statickém hostingu
- ✅ Může být nasazeno do jakékoliv podsložky

## Proč Next.js místo Vite + Puppeteer?

Next.js má SSG zabudovaný přímo v frameworku:
- ✅ Žádné externí nástroje (Puppeteer, Vite preview server)
- ✅ Rychlejší build (pouze kompilace, žádné renderování v prohlížeči)
- ✅ Nativní podpora pro statický export
- ✅ Automatické generování všech routes pomocí `generateStaticParams`
- ✅ Správný způsob, jak dělat SSG v React ekosystému
