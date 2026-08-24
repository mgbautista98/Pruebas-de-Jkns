class StudentAccountMenuPage {
  constructor(page) {
    this.page = page;
    this.menu = page.locator("#student-account-menu");
    this.profileMenuItem = page.locator("#student-menu-profile");
    this.plansMenuItem = page.locator("#student-menu-plans");
    this.workshopsMenuItem = page.locator("#student-menu-workshops");
    this.publicationsMenuItem = page.locator("#student-menu-publications");
    this.topAteniensesMenuItem = page.locator(
      "#student-menu-top-atenienses"
    );
    this.videoMindMenuItem = page.locator("#student-menu-videomind");
    this.certificatesMenuItem = page.locator("#student-menu-certificates");
    this.communityTicketsMenuItem = page.locator(
      "#student-menu-community-tickets"
    );
    this.logoutMenuItem = page.locator("#student-menu-logout");
  }

  async openProfile() {
    await this.profileMenuItem.click();
  }

  async openPlans() {
    await this.plansMenuItem.click();
  }

  async openWorkshops() {
    await this.workshopsMenuItem.click();
  }

  async openPublications() {
    await this.publicationsMenuItem.click();
  }

  async openTopAtenienses() {
    await this.topAteniensesMenuItem.click();
  }

  async openVideoMind() {
    await this.videoMindMenuItem.click();
  }

  async openCertificates() {
    await this.certificatesMenuItem.click();
  }

  async openCommunityTickets() {
    await this.communityTicketsMenuItem.click();
  }

  async logout() {
    await this.logoutMenuItem.click();
  }
}

module.exports = { StudentAccountMenuPage };
