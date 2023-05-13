const puppeteer = require("puppeteer");

(async () => {
  const url = "www.google.com";
  const browser = puppeteer.launch();

  const page = browser.page();

  await page.goto(url);
})();
