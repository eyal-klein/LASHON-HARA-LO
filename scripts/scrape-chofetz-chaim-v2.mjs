/**
 * Scrape Chofetz Chaim content from Wikisource (CORRECT URLs)
 */

import fs from 'fs/promises';

const WIKISOURCE_API = 'https://he.wikisource.org/w/api.php';
const OUTPUT_DIR = './data/chofetz-chaim';

// Hebrew letters for klalim and seifim
const KLAL_LETTERS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];

// Seifim count per klal (from Wikisource structure)
const LASHON_HARA_SEIFIM = {
  'א': 9, 'ב': 13, 'ג': 8, 'ד': 12, 'ה': 8,
  'ו': 12, 'ז': 14, 'ח': 14, 'ט': 6, 'י': 17,
};

const RECHILUT_SEIFIM = {
  'א': 11, 'ב': 4, 'ג': 4, 'ד': 3, 'ה': 7,
  'ו': 10, 'ז': 5, 'ח': 5, 'ט': 15,
};

const SEIF_LETTERS = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
  'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז',
];

async function fetchPage(pageTitle) {
  const params = new URLSearchParams({
    action: 'parse',
    page: pageTitle,
    format: 'json',
    prop: 'text|wikitext',
    formatversion: '2',
  });

  const response = await fetch(`${WIKISOURCE_API}?${params}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(`API error: ${data.error.info}`);
  }

  return data.parse;
}

function parseHTML(html) {
  let text = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove nikud
  text = text.replace(/[\u0591-\u05C7]/g, '');
  return text;
}

async function scrapeSeif(section, klalLetter, seifLetter) {
  const sectionName = section === 'lashon_hara' ? 'לשון_הרע' : 'רכילות';
  const pageTitle = `חפץ_חיים/הלכות_${sectionName}/${klalLetter}_${seifLetter}`;

  console.log(`  Scraping: ${pageTitle}...`);

  try {
    const page = await fetchPage(pageTitle);
    
    return {
      seifLetter,
      seifNum: SEIF_LETTERS.indexOf(seifLetter) + 1,
      content: parseHTML(page.text),
      rawWikitext: page.wikitext,
    };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return null;
  }
}

async function scrapeKlal(section, klalLetter, seifCount) {
  console.log(`\nKlal ${klalLetter} (${seifCount} seifim):`);

  const seifim = [];

  for (let i = 0; i < seifCount; i++) {
    const seifLetter = SEIF_LETTERS[i];
    const seif = await scrapeSeif(section, klalLetter, seifLetter);
    
    if (seif) {
      seifim.push(seif);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return {
    section,
    klalLetter,
    klalNum: KLAL_LETTERS.indexOf(klalLetter) + 1,
    title: `כלל ${klalLetter}`,
    seifim,
  };
}

async function main() {
  console.log('🚀 Starting Chofetz Chaim scraping (v2)...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const allData = {
    lashon_hara: [],
    rechilut: [],
  };

  // Scrape Lashon Hara
  console.log('📖 Scraping Hilchot Lashon Hara...');
  for (const [klalLetter, seifCount] of Object.entries(LASHON_HARA_SEIFIM)) {
    const klal = await scrapeKlal('lashon_hara', klalLetter, seifCount);
    allData.lashon_hara.push(klal);
  }

  // Scrape Rechilut
  console.log('\n📖 Scraping Hilchot Rechilut...');
  for (const [klalLetter, seifCount] of Object.entries(RECHILUT_SEIFIM)) {
    const klal = await scrapeKlal('rechilut', klalLetter, seifCount);
    allData.rechilut.push(klal);
  }

  // Save to JSON
  const outputPath = `${OUTPUT_DIR}/chofetz-chaim-raw.json`;
  await fs.writeFile(outputPath, JSON.stringify(allData, null, 2), 'utf-8');

  console.log(`\n✅ Scraping complete!`);
  console.log(`📁 Saved to: ${outputPath}`);

  const totalSeifim = [
    ...allData.lashon_hara,
    ...allData.rechilut,
  ].reduce((sum, klal) => sum + klal.seifim.length, 0);

  console.log(`\n📊 Statistics:`);
  console.log(`   - Lashon Hara: ${allData.lashon_hara.length} klalim`);
  console.log(`   - Rechilut: ${allData.rechilut.length} klalim`);
  console.log(`   - Total seifim: ${totalSeifim}`);
}

main().catch(console.error);
