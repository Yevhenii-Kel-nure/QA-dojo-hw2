import { test, expect } from '@playwright/test';
import { generateUser } from './helpers/user-generator';

test.beforeEach(async ({ page }) => {
  const url = test.info().project.use.baseURL;
  if (!url) {
    throw new Error('BASE_URL environment variable is not set');
  }

  await page.goto(url);
  await expect(page.getByRole('link', { name: 'QA Dojo' })).toBeVisible();
});

test.describe('Registration', () => {
test('Simple Registration', async ({ page }) => {
  const registrationData = generateUser();

  await page.getByTestId('nav-sign-up').click();
  await expect(page.getByRole('heading')).toContainText('Create an account');
  await page.getByTestId('auth-username').fill(registrationData.username);
  await page.getByTestId('auth-email').fill(registrationData.email);
  await page.getByTestId('auth-password').fill(registrationData.password);
  await page.getByTestId('register-confirm-password').fill(registrationData.password);
  await page.getByTestId('register-country').selectOption('Poland');
  await page.getByTestId('register-newsletter').uncheck();
  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();
  await expect(page.getByTestId('nav-profile')).toBeVisible();
  await expect(page.getByRole('link', { name: 'QA Dojo' })).toBeVisible();
  await expect(page.getByTestId('feed-tab-your')).toBeVisible();
  await expect(page.getByTestId('article-list-empty')).toBeVisible();
});

test('Registration with used email', async ({ page }) => {
  await page.getByTestId('nav-sign-up').click();
  await expect(page.getByRole('heading')).toContainText('Create an account');
  await page.getByTestId('auth-username').fill('testUsername');
  await page.getByTestId('auth-email').fill('olena@example.com');
  await page.getByTestId('auth-password').fill('testPassword');
  await page.getByTestId('register-confirm-password').fill('testPassword');
  await page.getByText('A colleague recommended it').check();
  await page.getByTestId('register-source-friend').check();
  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();
  await expect(page.getByText('body email або username')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  await expect(page.getByTestId('feed-tab-your')).not.toBeVisible();
  await expect(page.getByTestId('article-list-empty')).not.toBeVisible();
});

test('Registration with invalid data', async ({ page }) => {
  await page.getByTestId('nav-sign-up').click();
  await expect(page.getByRole('heading')).toContainText('Create an account');
  await page.getByTestId('auth-username').fill('testUsername');
  await page.getByTestId('auth-email').fill('olena@examsdasdasdacom');
  await page.getByTestId('auth-password').fill('1');
  await page.getByTestId('register-confirm-password').fill('2');
  await page.getByText('A colleague recommended it').check();
  await page.getByTestId('register-source-friend').check();
  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();
  await expect(page.getByText('confirm password doesn\'t match')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  await expect(page.getByTestId('feed-tab-your')).not.toBeVisible();
  await expect(page.getByTestId('article-list-empty')).not.toBeVisible();
});
});

test.describe('Login', () => {
test('Successful login', async ({ page }) => {
  await page.getByTestId('nav-sign-in').click();
  await expect(page.getByRole('heading')).toContainText('Sign in');
  await page.getByTestId('auth-email').fill('olena@example.com');
  await page.getByTestId('auth-password').fill('password');
  await page.getByTestId('auth-submit').click();
  await expect(page.getByTestId('nav-profile')).toHaveText('olena');
  await expect(page.getByRole('link', { name: 'QA Dojo' })).toBeVisible();
  await expect(page.getByTestId('feed-tab-your')).toBeVisible();
})

test('Login with invalid password', async ({ page }) => {
  await page.getByTestId('nav-sign-in').click();
  await expect(page.getByRole('heading')).toContainText('Sign in');
  await page.getByTestId('auth-email').fill('olena@example.com');
  await page.getByTestId('auth-password').fill('wrongPassword');
  await page.getByTestId('auth-submit').click();
  await expect(page.getByText('email or password неправильні')).toBeVisible();
});


test ('Login with unregistered email', async ({ page }) => {
  await page.getByTestId('nav-sign-in').click();
  await expect(page.getByRole('heading')).toContainText('Sign in');
  await page.getByTestId('auth-email').fill('unregistered@example.com');
  await page.getByTestId('auth-password').fill('testPassword');
  await page.getByTestId('auth-submit').click();
  await expect(page.getByText('email or password неправильні')).toBeVisible();
});
});