import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3000/dashboard/overview');
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
