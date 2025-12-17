/**
 * Scrape Chofetz Chaim content from Wikisource
 */

import fs from 'fs/promises';
import path from 'path';

const WIKISOURCE_API = 'https://he.wikisource.org/w/api.php';
const OUTPUT_DIR = './data/chofetz-chaim';

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
    throw new Error(`Wikisource API error: ${data.error.info}`);
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

  text = text.replace(/[\u0591-\u05C7]/g, '');
  return text;
}

async function scrapeKlal(section, klalNum) {
  const sectionName = section === 'lashon_hara' ? 'לשון_הרע' : 'רכילות';
  const pageTitle = `חפץ_חיים/הלכות_איסורי_${sectionName}/כלל_${klalNum}`;

  console.log(`Scraping: ${pageTitle}...`);

  try {
    const page = await fetchPage(pageTitle);
    const wikitext = page.wikitext;
    const seifim = [];

    const seifRegex = /={2,3}\s*סעיף\s+([א-ת]+)\s*={2,3}(.*?)(?=={2,3}\s*סעיף|$)/gs;
    let match;

    while ((match = seifRegex.exec(wikitext)) !== null) {
      const seifLetter = match[1];
      const content = match[2].trim();
      const seifNum = 'אבגדהוזחטיכלמנסעפצקרשת'.indexOf(seifLetter) + 1;

      seifim.push({
        seif: seifNum > 0 ? seifNum : 1,
        seifLetter,
        content: parseHTML(content),
        rawContent: content,
      });
    }

    if (seifim.length === 0) {
      seifim.push({
        seif: 1,
        seifLetter: 'א',
        content: parseHTML(page.text),
        rawContent: wikitext,
      });
    }

    return {
      section,
      klal: klalNum,
      title: `כלל ${klalNum}`,
      seifim,
    };
  } catch (error) {
    console.error(`Error scraping ${pageTitle}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Chofetz Chaim scraping...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const allData = {
    lashon_hara: [],
    rechilut: [],
  };

  console.log('\n📖 Scraping Hilchot Lashon Hara...');
  for (let klal = 1; klal <= 10; klal++) {
    const data = await scrapeKlal('lashon_hara', klal);
    if (data) allData.lashon_hara.push(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📖 Scraping Hilchot Rechilut...');
  for (let klal = 1; klal <= 9; klal++) {
    const data = await scrapeKlal('rechilut', klal);
    if (data) allData.rechilut.push(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const outputPath = path.join(OUTPUT_DIR, 'chofetz-chaim-raw.json');
  await fs.writeFile(outputPath, JSON.stringify(allData, null, 2), 'utf-8');

  console.log(`\n✅ Scraping complete!`);
  console.log(`📁 Saved to: ${outputPath}`);

  const totalSeifim = [
    ...allData.lashon_hara,
    ...allData.rechilut,
  ].reduce((sum, klal) => sum + klal.seifim.length, 0);

  console.log(`   - Total seifim: ${totalSeifim}`);
}

main().catch(console.error);
