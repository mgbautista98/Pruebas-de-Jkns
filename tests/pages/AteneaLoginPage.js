class AteneaLoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('input#student-login-email[name="email"]');
    this.password = page.locator(
      'input#student-login-password[name="password"]'
    );
    this.submit = page.locator("#student-login-submit");
  }

  async open(loginUrl) {
    await this.page.goto(loginUrl, { waitUntil: "domcontentloaded" });
  }

  async fillCredentials(username, password) {
    await this.email.fill(username);
    await this.password.fill(password);
  }

  async submitLogin() {
    await this.submit.click();
  }

  async login(username, password) {
    await this.fillCredentials(username, password);
    await this.submitLogin();
  }
}

module.exports = { AteneaLoginPage };
