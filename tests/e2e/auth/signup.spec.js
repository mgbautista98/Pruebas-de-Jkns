const { test, expect } = require("@playwright/test");
const { loadConfig } = require("../../../scripts/lib/config");
const { AteneaSignupPage } = require("../../pages/AteneaSignupPage");

const config = loadConfig();

test.describe("Registro de cuenta en Atenea", () => {
  test("TC-SIGNUP-001: abre el formulario desde Crear cuenta", async ({ page }) => {
    const signupPage = new AteneaSignupPage(page);

    await page.goto(config.loginUrl, { waitUntil: "domcontentloaded" });
    await expect(signupPage.signupLink).toBeVisible();
    await signupPage.openFromHeader();

    await expect(page).toHaveURL(/\/signup\/?$/);
  });

  test("TC-SIGNUP-002: muestra los campos requeridos de registro", async ({ page }) => {
    const signupPage = new AteneaSignupPage(page);

    await signupPage.open(config.signupUrl);

    for (const field of [
      signupPage.name,
      signupPage.lastName,
      signupPage.email,
      signupPage.password,
      signupPage.confirmPassword
    ]) {
      await expect(field).toBeVisible();
      await expect(field).toHaveAttribute("required", "");
    }
    await expect(signupPage.termsAcceptance).toBeVisible();
  });

  test("TC-SIGNUP-003: permite capturar los datos de una cuenta", async ({ page }) => {
    const signupPage = new AteneaSignupPage(page);
    const registration = {
      name: "Ana",
      lastName: "Pruebas",
      email: `ana.pruebas.${Date.now()}@example.com`,
      password: "PruebaSegura123!"
    };

    await signupPage.open(config.signupUrl);
    await signupPage.fillRegistrationData(registration);
    await signupPage.acceptTerms();

    await expect(signupPage.name).toHaveValue(registration.name);
    await expect(signupPage.lastName).toHaveValue(registration.lastName);
    await expect(signupPage.email).toHaveValue(registration.email);
    await expect(signupPage.password).toHaveValue(registration.password);
    await expect(signupPage.confirmPassword).toHaveValue(registration.password);
    await expect(signupPage.termsAcceptance).toBeChecked();
  });

  test("TC-SIGNUP-004: crea una cuenta y solicita verificar el email", async ({ page }) => {
    const requiredRegistrationData = [
      config.signupName,
      config.signupLastName,
      config.signupEmail,
      config.signupPassword
    ];

    test.skip(
      !config.runSignup || requiredRegistrationData.some((value) => !value),
      "Define los datos ATENEA_SIGNUP_* y ATENEA_RUN_SIGNUP=true para crear una cuenta."
    );

    const signupPage = new AteneaSignupPage(page);
    await signupPage.open(config.signupUrl);
    await signupPage.fillRegistrationData({
      name: config.signupName,
      lastName: config.signupLastName,
      email: config.signupEmail,
      password: config.signupPassword
    });
    await signupPage.acceptTerms();
    await signupPage.submitRegistration();

    await expect(signupPage.emailVerificationTitle).toBeVisible();
  });
});
