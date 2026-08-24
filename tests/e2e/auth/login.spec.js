const { test, expect, chromium } = require("@playwright/test");
const { loadConfig } = require("../../../scripts/lib/config");
const { AteneaLoginPage } = require("../../pages/AteneaLoginPage");

const config = loadConfig();

test.describe("Autenticacion en Atenea", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AteneaLoginPage(page);
    await loginPage.open(config.loginUrl);
  });

  test("TC-LOGIN-001: muestra los campos de correo y contrasena", async () => {
    await expect(loginPage.email).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  test("TC-LOGIN-002: correo y contrasena son obligatorios", async () => {
    await expect(loginPage.email).toHaveAttribute("required", "");
    await expect(loginPage.password).toHaveAttribute("required", "");
  });

});

test("TC-LOGIN-003: envia credenciales configuradas", async () => {
  test.skip(
    !config.username || !config.password,
    "Define ATENEA_USERNAME y ATENEA_PASSWORD en .env para ejecutar este caso."
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new AteneaLoginPage(page);

  try {
    await loginPage.open(config.loginUrl);
    await loginPage.fillCredentials(config.username, config.password);
    await expect(loginPage.email).toHaveValue(config.username);
    await expect(loginPage.password).toHaveValue(config.password);
    await loginPage.submitLogin();
    await expect(page).not.toHaveURL(/\/login\/?$/);
  } finally {
    await browser.close();
  }
});
