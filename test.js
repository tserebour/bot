const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch(
    {headless: false,args: ['--disable-gpu']},
    
  
  );
  const page = await browser.newPage();
  await page.goto('https://www.teckifix.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();