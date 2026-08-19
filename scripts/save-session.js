const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { chromium } = require("@playwright/test");
const { loadConfig } = require("./lib/config");

function waitForEnter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("Cuando hayas iniciado sesion y veas Atenea, presiona Enter: ", () => {
      rl.close();
      resolve();
    });
  });
}

async function main() {
  const config = loadConfig();
  fs.mkdirSync(path.dirname(config.authFile), { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Abriendo ${config.loginUrl}`);
  await page.goto(config.loginUrl, { waitUntil: "domcontentloaded" });
  await waitForEnter();

  await context.storageState({ path: config.authFile });
  await browser.close();

  console.log(`Sesion guardada en ${config.authFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
