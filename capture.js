const { chromium } = require('playwright');
const fs = require('fs');

// Your exact Canva links
const slides = [
  { name: 'openingslide.png', url: 'https://www.canva.com/design/DAHSvMYVZiw/jAKrJhIlDSrhWAGDSWm31A/view' },
  { name: 'lighthouse.png', url: 'https://www.canva.com/design/DAHSvInfGe8/c93IWau0PamtxXcytv1dtw/view' },
  { name: 'basictraining.png', url: 'https://www.canva.com/design/DAHSvBG8V5s/RO-2ZU0NMJH1eYMTYiO5cw/view' },
  { name: 'baptism.png', url: 'https://www.canva.com/design/DAHSvGTeY8s/FWMaOJzr2yuwlQXVKHQ1jQ/view' },
  { name: 'csm.png', url: 'https://www.canva.com/design/DAHSvCoDPhM/cwaESubAm9faR_E1w7VqmQ/view' },
  { name: 'socials.png', url: 'https://www.canva.com/design/DAHSvOZwXTM/AMgi3FQ8NmWrH0_qw7xATw/view' },
  { name: 'lightteam.png', url: 'https://www.canva.com/design/DAHSvNQgGxo/PNsGUrduB5ziPc1QBO9lzw/view' },
  { name: 'discipleshipintensive.png', url: 'https://www.canva.com/design/DAHTgHliE6Q/46rYBZFO7lMTJJT1IutshQ/view' },
  { name: 'christianityexplored.png', url: 'https://www.canva.com/design/DAHSvCzwdU8/vRRkHVsdHzbWJ5HPgv4ZHg/view' },
  { name: 'weeklyevents.png', url: 'https://www.canva.com/design/DAHSvIZhv9U/ZHQFT9KxrbD8LXZ95Zbs6A/view' },
  { name: 'eventspage.png', url: 'https://www.canva.com/design/DAHSvF2sDcI/ULeOkKs0_1QS2N0SiXz5aQ/view' },
  { name: 'endslide.png', url: 'https://www.canva.com/design/DAHV8gD2ecE/uodcC7Pja_3RYNbv38m8EA/view' }
];

(async () => {
  if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 2160, height: 3840 }
  });

  for (const slide of slides) {
    console.log(`Rendering ${slide.name}...`);
    const page = await context.newPage();
    
    // Automatically upgrade the URL to Canva's clean embed mode
    const embedUrl = slide.url.includes('?embed') ? slide.url : slide.url + '?embed';
    
    await page.goto(embedUrl, { waitUntil: 'networkidle' });
    
    // Give Canva's canvas time to render fully
    await page.waitForTimeout(3000);

    // Inject a permanent CSS style to force all Canva links, buttons, and footers to be completely invisible
    await page.addStyleTag({ content: `
      a, button, [class*="footer"], [class*="overlay"], [class*="toolbar"] { 
        display: none !important; 
        opacity: 0 !important; 
        visibility: hidden !important; 
      }
    `});

    // Move the virtual mouse off-screen to trigger Canva's auto-hide feature just in case
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);

    // Capture the clean screenshot
    await page.screenshot({ path: `./images/${slide.name}` });
    await page.close();
  }

  await browser.close();
  console.log('All slides captured cleanly.');
})();
