const { chromium } = require('playwright');
const fs = require('fs');

// Your exact Canva links
const slides = [
  { name: 'openingslide.png', url: 'https://www.canva.com/design/DAHV8g2BZ6g/elyMbOKwk_dHfv0Nlcis5g/view' },
  { name: 'lighthouse.png', url: 'https://www.canva.com/design/DAHV8mNtZxc/5xpkn0EHC5auuDAQrUbKBA/view' },
  { name: 'basictraining.png', url: 'https://www.canva.com/design/DAHV8vQn4wk/kLXJMW-d7k7KcFgdBpnrZA/view' },
  { name: 'baptism.png', url: 'https://www.canva.com/design/DAHV8iNAnQM/v7DwBm5O_Ostl5L_DMBXRA/view' },
  { name: 'csm.png', url: 'https://www.canva.com/design/DAHV8tNew7Y/31NmDtfJ4i4NchST8rSdhg/view' },
  { name: 'lightteam.png', url: 'https://www.canva.com/design/DAHV8gVWpJo/6_XIjl0rpRO-9jqOyw3-fg/view' },
  { name: 'discipleshipintensive.png', url: 'https://www.canva.com/design/DAHV8hYlzbM/CGZpRchI0OKWt2_SLQSIEw/view' },
  { name: 'christianityexplored.png', url: 'https://www.canva.com/design/DAHV8qZjJY8/bv6aRT4dbIkQWoca44-G2g/view' },
  { name: 'weeklyevents.png', url: 'https://www.canva.com/design/DAHV8vAyDew/ZxM05sNzvH2q0H2AWiFVIA/view' },
  { name: 'eventspage.png', url: 'https://www.canva.com/design/DAHV8gWbwD0/1XhB9LdFKz0Z27tUXXQSwg/view' },
  { name: 'socials.png', url: 'https://www.canva.com/design/DAHV8rZLy8Y/jFn1ql5KcF5vUFfZkE4dew/view' },
  { name: 'endslide.png', url: 'https://www.canva.com/design/DAHV8ngJdhI/jOYHxQmLoUJi_HAXD9givA/view' }
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
