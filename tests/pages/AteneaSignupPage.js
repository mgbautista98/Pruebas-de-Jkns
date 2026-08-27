class AteneaSignupPage {
  constructor(page) {
    this.page = page;
    this.signupLink = page.locator("#public-header-button-signup");
    this.name = page.locator("#name");
    this.lastName = page.locator("#lastname");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.confirmPassword = page.locator("#confirmPassword");
    this.termsAcceptance = page.locator('input[type="checkbox"]');
    this.submit = page.locator('button[type="submit"]');
    this.emailVerificationTitle = page.getByRole("heading", {
      name: "Verifica tu email"
    });
  }

  async open(signupUrl) {
    await this.page.goto(signupUrl, { waitUntil: "domcontentloaded" });
  }

  async openFromHeader() {
    await this.signupLink.click();
  }

  async fillRegistrationData({ name, lastName, email, password }) {
    await this.name.fill(name);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmPassword.fill(password);
  }

  async acceptTerms() {
    await this.termsAcceptance.check();
  }

  async submitRegistration() {
    await this.submit.click();
  }
}

module.exports = { AteneaSignupPage };
