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

async function openLoginForm(page) {
  // Selectores confirmados en el formulario de Atenea.
  const emailField = page.locator('input#student-login-email[name="email"]');
  if (await emailField.count()) {
    return emailField;
  }

  await page.locator("#public-header-link-login").click();
  await emailField.waitFor({ state: "visible" });
  return emailField;
}

async function loginWithCredentials(page, config) {
  const emailField = await openLoginForm(page);
  const passwordField = page.locator(
    'input#student-login-password[name="password"]'
  );

  await emailField.fill(config.username);
  await passwordField.fill(config.password);
  await page.locator("#student-login-submit").click();

  console.log("Credenciales enviadas. Esperando la confirmacion del acceso...");
}

async function main() {
  const config = loadConfig();
  fs.mkdirSync(path.dirname(config.authFile), { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Abriendo ${config.loginUrl}`);
  await page.goto(config.loginUrl, { waitUntil: "domcontentloaded" });

  if (config.username && config.password) {
    await loginWithCredentials(page, config);
  } else {
    console.log(
      "No se configuraron ATENEA_USERNAME y ATENEA_PASSWORD; inicia sesion manualmente en Chromium."
    );
  }

  await waitForEnter();

  console.log(`Confirmando sesion en: ${page.url()}`);

  await context.storageState({ path: config.authFile });
  await browser.close();

  console.log(`Sesion guardada en ${config.authFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
