const fs = require("fs");
const { chromium } = require("@playwright/test");
const { loadConfig } = require("./lib/config");

async function main() {
  const config = loadConfig();
  if (!fs.existsSync(config.authFile)) {
    throw new Error(
      `No existe ${config.authFile}. Ejecuta primero "npm run login".`
    );
  }

  const browser = await chromium.launch({ headless: !config.headed });
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();

  await page.goto(config.expectedUrl, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  console.log(`URL actual: ${page.url()}`);
  console.log("Sesion cargada correctamente.");

  await browser.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
