class HeaderNavigationPage {
  constructor(page) {
    this.page = page;
    this.liveMenuItem = page.locator("#student-header-menuitem-live");
    this.hermesMenuItem = page.locator("#student-header-menuitem-hermes");
  }

  async openLive() {
    await this.liveMenuItem.click();
  }

  async openHermes() {
    await this.hermesMenuItem.click();
  }
}

module.exports = { HeaderNavigationPage };
