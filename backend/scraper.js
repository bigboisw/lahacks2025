const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Go to the NBC News website
    await page.goto('https://www.nbcnews.com/');

    // Wait for the news article containers to load. Adjust selector if needed.
    await page.waitForSelector('.container-side__text-content.no-author-timestamp', { timeout: 10000 });

    // Extract the links of the news articles
    const articleLinks = await page.evaluate(() => {
      const links = [];
      const storyElements = document.querySelectorAll('.container-side__text-content.no-author-timestamp');
      storyElements.forEach((storyElement) => {
        const linkElement = storyElement.querySelector('h2.storyline__headline a');
        if (linkElement) {
          links.push(linkElement.getAttribute('href'));
        }
      });
      return links;
    });

    console.log('Found the following article links:', articleLinks);

    // Loop through each article link and extract the title and paragraphs
    for (const articleUrl of articleLinks) {
      try {
        console.log(`\nNavigating to: ${articleUrl}`);
        await page.goto(articleUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for the title and at least one paragraph to load
        await page.waitForSelector('h1', { timeout: 10000 });
        await page.waitForSelector('.article-body__content p', { timeout: 10000 });

        const articleData = await page.evaluate(() => {
          const titleElement = document.querySelector('h1');
          const paragraphElements = document.querySelectorAll('.article-body__content p');

          const title = titleElement ? titleElement.textContent.trim() : 'No Title Found';
          const paragraphs = Array.from(paragraphElements).map(p => p.textContent.trim());

          return { title, paragraphs };
        });

        console.log('Article Title:', articleData.title);
        console.log('Article Paragraphs:');
        articleData.paragraphs.forEach((paragraph, index) => {
          console.log(`${index + 1}: ${paragraph}`);
        });

      } catch (error) {
        console.error(`Error processing article at ${articleUrl}:`, error);
      }
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})();