import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loggedInAs: Locator;
  readonly logoutLink: Locator;
  readonly signupLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loggedInAs = page.getByText('Logged in as');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.signupLoginLink = page.locator('a[href="/login"]');
  }

  async logout() {
    await this.logoutLink.click();
  }
}