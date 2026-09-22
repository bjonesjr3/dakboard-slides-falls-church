const { chromium } = require('playwright');
const fs = require('fs');

// Your exact Canva links
const slides = [
  { name: 'openingslide.png', url: 'https://www.canva.com/design/DAHV7wbQy60/enU9OQDLjcFDQ4ND8y9j0g/view' },
  { name: 'lighthouse.png', url: 'https://www.canva.com/design/DAHV797f8YY/wrUCmYh0YwF_ORTCDvifqw/view' },
  { name: 'basictraining.png', url: 'https://www.canva.com/design/DAHV75F7VE8/h583LtW-t0hOnG7PNm6PgQ/view' },
  { name: 'baptism.png', url: 'https://www.canva.com/design/DAHV731CTnw/VO6DUqO3iyJrm_TtvxWFaw/view' },
  { name: 'csm.png', url: 'https://www.canva.com/design/DAHV78h77mg/m9v2WD_e_vBYAoJIBlEIqA/view' },
  { name: 'lightteam.png', url: 'https://www.canva.com/design/DAHV73duYf0/j-0Ve_J6xAoDv3n1iHsVBQ/view' },
  { name: 'discipleshipintensive.png', url: 'https://www.canva.com/design/DAHV8UyEyjs/yj7Fmo-gQP9ihqMlVvGEfQ/view' },
  { name: 'christianityexplored.png', url: 'https://www.canva.com/design/DAHV79oPunw/Ks2sCKaLfl-mcC2jOU6P5g/view' },
  { name: 'weeklyevents.png', url: 'https://www.canva.com/design/DAHV78cgbHo/cJIgN9KuV0nzb0-uviK8cQ/view' },
  { name: 'eventspage.png', url: 'https://www.canva.com/design/DAHV7zAuk1k/W8I5PMtLalA2E3L-p3j8SQ/view' },
  { name: 'socials.png', url: 'https://www.canva.com/design/DAHV7-grNrE/rSsNorOQ9-ab8shje3YmBg/view' },
  { name: 'endslide.png', url: 'https://www.canva.com/design/DAHV74NTGkc/XLqcWMutFxTNGcyduKLunQ/view' }
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
