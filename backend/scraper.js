const playwright = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // storage for all scraped articles
  const allArticles = [];

  try {
    await page.goto('https://www.nbcnews.com/');
    await page.waitForSelector('.container-side__text-content.no-author-timestamp', { timeout: 10000 });

    const articleLinks = await page.evaluate(() => {
      const links = [];
      document
        .querySelectorAll('.container-side__text-content.no-author-timestamp')
        .forEach(storyEl => {
          const a = storyEl.querySelector('h2.storyline__headline a');
          if (a) links.push(a.href);
        });
      return links;
    });

    console.log(`Found ${articleLinks.length} article links.`);

    for (const url of articleLinks) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForSelector('h1', { timeout: 10000 });
        await page.waitForSelector('.article-body__content p', { timeout: 10000 });

        const articleData = await page.evaluate(() => {
          const title = document.querySelector('h1')?.textContent.trim() ?? '';
          const paragraphs = Array.from(
            document.querySelectorAll('.article-body__content p')
          ).map(p => p.textContent.trim());
          return { title, paragraphs };
        });

        allArticles.push({
          url,
          ...articleData
        });
        console.log(`Scraped: ${articleData.title}`);
      } catch (err) {
        console.error(`Error scraping ${url}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Fatal error:', err);
  } finally {
    await browser.close();
    // write to JSON file
    fs.writeFileSync(
      'articles.json',
      JSON.stringify(allArticles, null, 2),
      'utf-8'
    );
    console.log(`Wrote ${allArticles.length} articles to articles.json`);
  }
})();
