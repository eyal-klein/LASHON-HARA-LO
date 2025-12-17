/**
 * Scrape Chofetz Chaim content from Wikisource - FIXED VERSION
 * Correct URL structure: חפץ_חיים/הלכות_לשון_הרע/א_א (not הלכות_איסורי_לשון_הרע/כלל_א/א)
 */

import fs from 'fs/promises';
import path from 'path';

const WIKISOURCE_API = 'https://he.wikisource.org/w/api.php';
const OUTPUT_DIR = './data/chofetz-chaim';

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(pageTitle) {
  const params = new URLSearchParams({
    action: 'parse',
    page: pageTitle,
    format: 'json',
    prop: 'text',
    formatversion: '2',
  });

  const response = await fetch(`${WIKISOURCE_API}?${params}`);
  const data = await response.json();

  if (data.error) {
    console.log(`  ⚠️  Page not found: ${pageTitle}`);
    return null;
  }

  return data.parse.text;
}

// Klal structure from Wikisource (verified from the TOC)
const KLALIM = {
  lashon_hara: [
    { num: 'א', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'] },
    { num: 'ב', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג'] },
    { num: 'ג', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'] },
    { num: 'ד', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'] },
    { num: 'ה', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'] },
    { num: 'ו', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'] },
    { num: 'ז', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד'] },
    { num: 'ח', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד'] },
    { num: 'ט', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו'] },
    { num: 'י', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז'] }
  ],
  rechilut: [
    { num: 'א', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא'] },
    { num: 'ב', seifim: ['א', 'ב', 'ג', 'ד'] },
    { num: 'ג', seifim: ['א', 'ב', 'ג', 'ד'] },
    { num: 'ד', seifim: ['א', 'ב', 'ג'] },
    { num: 'ה', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'] },
    { num: 'ו', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'] },
    { num: 'ז', seifim: ['א', 'ב', 'ג', 'ד', 'ה'] },
    { num: 'ח', seifim: ['א', 'ב', 'ג', 'ד', 'ה'] },
    { num: 'ט', seifim: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו'] }
  ]
};

async function scrapeSeif(section, klalNum, seifLetter) {
  // CORRECT URL FORMAT: חפץ_חיים/הלכות_לשון_הרע/א_א
  const sectionName = section === 'lashon_hara' ? 'לשון_הרע' : 'רכילות';
  const pageTitle = `חפץ_חיים/הלכות_${sectionName}/${klalNum}_${seifLetter}`;

  try {
    const html = await fetchPage(pageTitle);
    if (!html) return null;

    return {
      seifLetter,
      content: html,
      url: `https://he.wikisource.org/wiki/${pageTitle}`
    };
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function scrapeKlal(section, klalInfo) {
  const { num, seifim } = klalInfo;
  console.log(`\n📖 Scraping כלל ${num} (${seifim.length} seifim)...`);

  const klalData = {
    title: `כלל ${num}`,
    seifim: []
  };

  for (const seifLetter of seifim) {
    process.stdout.write(`  סעיף ${seifLetter}...`);
    const seif = await scrapeSeif(section, num, seifLetter);
    
    if (seif) {
      klalData.seifim.push(seif);
      console.log(' ✅');
    } else {
      console.log(' ⚠️  skipped');
    }
    
    await sleep(500); // Be nice to Wikisource
  }

  return klalData;
}

async function main() {
  console.log('🚀 Starting Chofetz Chaim scraping (v4 - FIXED URLs)...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const allData = {
    lashon_hara: [],
    rechilut: []
  };

  // Scrape Lashon Hara
  console.log('\n=== הלכות לשון הרע ===');
  for (const klalInfo of KLALIM.lashon_hara) {
    const klal = await scrapeKlal('lashon_hara', klalInfo);
    allData.lashon_hara.push(klal);
  }

  // Scrape Rechilut
  console.log('\n=== הלכות רכילות ===');
  for (const klalInfo of KLALIM.rechilut) {
    const klal = await scrapeKlal('rechilut', klalInfo);
    allData.rechilut.push(klal);
  }

  // Save
  const outputPath = path.join(OUTPUT_DIR, 'chofetz-chaim-raw.json');
  await fs.writeFile(outputPath, JSON.stringify(allData, null, 2), 'utf-8');

  // Stats
  const totalSeifim = [
    ...allData.lashon_hara,
    ...allData.rechilut
  ].reduce((sum, klal) => sum + klal.seifim.length, 0);

  console.log(`\n✅ Scraping complete!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`   - Lashon Hara: ${allData.lashon_hara.length} klalim`);
  console.log(`   - Rechilut: ${allData.rechilut.length} klalim`);
  console.log(`   - Total seifim: ${totalSeifim}`);
  
  const fileSize = (await fs.stat(outputPath)).size;
  console.log(`   - File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
