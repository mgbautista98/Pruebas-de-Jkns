const fs = require("fs");
const { test, expect, chromium } = require("@playwright/test");
const { loadConfig } = require("../../../scripts/lib/config");
const { HeaderNavigationPage } = require("../../pages/HeaderNavigationPage");

const config = loadConfig();

test("TC-HEADER-001: navega a En Vivo desde el header", async () => {
  test.skip(
    !fs.existsSync(config.authFile),
    "Ejecuta npm run login para generar una sesion autenticada."
  );

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();
  const header = new HeaderNavigationPage(page);

  try {
    await page.goto(config.expectedUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Ingresar", { exact: true })).toHaveCount(0);
    await expect(header.liveMenuItem).toBeVisible();
    await expect(header.liveMenuItem).toBeEnabled();

    await header.openLive();
  } finally {
    await context.close();
    await browser.close();
  }
});

test("TC-HEADER-002: navega a Hermes desde el header", async () => {
  test.skip(
    !fs.existsSync(config.authFile),
    "Ejecuta npm run login para generar una sesion autenticada."
  );

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();
  const header = new HeaderNavigationPage(page);

  try {
    await page.goto(config.expectedUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Ingresar", { exact: true })).toHaveCount(0);
    await expect(header.hermesMenuItem).toBeVisible();
    await expect(header.hermesMenuItem).toBeEnabled();

    await header.openHermes();
  } finally {
    await context.close();
    await browser.close();
  }
});
