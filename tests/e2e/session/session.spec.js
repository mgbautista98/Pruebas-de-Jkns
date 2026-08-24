const fs = require("fs");
const { test, expect, chromium } = require("@playwright/test");
const { loadConfig } = require("../../../scripts/lib/config");

const config = loadConfig();

test("TC-SESSION-001: reutiliza una sesion autenticada", async () => {
  test.skip(
    !fs.existsSync(config.authFile),
    "Ejecuta npm run login para generar la sesion."
  );

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();

  try {
    await page.goto(config.expectedUrl, { waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveURL(/\/login\/?$/);
    await expect(page.getByText("Ingresar", { exact: true })).toHaveCount(0);
  } finally {
    await context.close();
    await browser.close();
  }
});
