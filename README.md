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

- React 18
- TypeScript
- React Router DOM (routing)
- Vite
- CSS3 (minimalistický design podle FrontKon webu)

## Instalace

```bash
npm install
```

## Spuštění

Pro vývojový server:

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`

## Build

Pro produkční build, který vytvoří statické HTML soubory:

```bash
npm run build
```

Build automaticky:
1. Zkompiluje TypeScript
2. Vytvoří produkční build pomocí Vite
3. Pre-renderuje všechny routes do statických HTML souborů

Výsledek je v `dist/` složce:
- Každá route má svůj vlastní `index.html` soubor
- Všechny soubory jsou statické a nevyžadují server
- Používá relativní cesty, takže funguje v jakékoliv podsložce
- Můžete je nasadit na jakýkoliv statický hosting (Netlify, Vercel, GitHub Pages, atd.)
- Nebo je otevřít přímo v prohlížeči (dvojklik na `dist/index.html`)
- **Nasazení do podsložky**: Stačí nahrát obsah `dist/` složky do jakékoliv podsložky na serveru (např. `/data/demo/`, `/prototype/`, atd.)

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
   - Nahraje obsah `dist/` složky na `gh-pages` branch
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

2. Nahrajte obsah `dist/` složky na GitHub Pages:
   - Buď použijte GitHub Actions
   - Nebo nahrajte soubory přímo do `gh-pages` branch

**Struktura dist/ po buildu:**
```
dist/
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
src/
  ├── pages/          # Stránky (Home, TalkDetail, SpeakerDetail, atd.)
  ├── components/     # React komponenty
  │   ├── TalkCard.tsx
  │   ├── SpeakerCard.tsx
  │   ├── TopicCard.tsx
  │   ├── YearCard.tsx
  │   └── Card.css
  ├── types.ts        # TypeScript typy
  ├── data.ts         # Data (30 přednášek, 15 speakerů, 12 témat, 6 ročníků)
  ├── App.tsx         # Hlavní komponenta s routing
  ├── App.css         # Hlavní styly
  └── main.tsx        # Vstupní bod
```

## Routing

- `/` - Domovská stránka se seznamy
- `/talks/:id` - Detail přednášky
- `/speakers/:id` - Detail speakera
- `/topics/:id` - Detail tématu
- `/years/:id` - Detail ročníku

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

Data jsou uložena v `src/data.ts`. Můžete je upravit podle potřeby nebo v budoucnu připojit k API/backendu.

## SSG (Static Site Generation)

Aplikace je připravena pro SSG. Build vytváří statické HTML soubory, které lze nasadit na jakýkoliv statický hosting (Netlify, Vercel, GitHub Pages, atd.).
