import type { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly logo: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;

  constructor(private readonly page: Page) {
    this.logo = page.getByRole('link', { name: 'QA Dojo' });
    this.signInButton = page.getByTestId('nav-sign-in');
    this.signUpButton = page.getByTestId('nav-sign-up');
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
