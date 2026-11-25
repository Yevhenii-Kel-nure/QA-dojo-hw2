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
    const signUpButton = page.getByTestId('nav-sign-up');
    const header = page.getByRole('heading');
    const inputUsername = page.getByTestId('auth-username');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const inputConfirmPassword = page.getByTestId('register-confirm-password');
    const dropdownCountry = page.getByTestId('register-country');
    const checkboxNewsletter = page.getByTestId('register-newsletter');
    const checkboxTerms = page.getByTestId('register-terms');
    const submitButton = page.getByTestId('auth-submit');
    const navProfile = page.getByTestId('nav-profile');
    const linkQaDojo = page.getByRole('link', { name: 'QA Dojo' });
    const feedTab = page.getByTestId('feed-tab-your');
    const articleListEmpty = page.getByTestId('article-list-empty');

    await signUpButton.click();
    await expect(header).toContainText('Create an account');
    await inputUsername.fill(registrationData.username);
    await inputEmail.fill(registrationData.email);
    await inputPassword.fill(registrationData.password);
    await inputConfirmPassword.fill(registrationData.password);
    await dropdownCountry.selectOption('Poland');
    await checkboxNewsletter.uncheck();
    await checkboxTerms.check();
    await submitButton.click();
    await expect(navProfile).toBeVisible();
    await expect(linkQaDojo).toBeVisible();
    await expect(feedTab).toBeVisible();
    await expect(articleListEmpty).toBeVisible();
  });

  test('Registration with used email', async ({ page }) => {
    const signUpButton = page.getByTestId('nav-sign-up');
    const header = page.getByRole('heading');
    const inputUsername = page.getByTestId('auth-username');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const inputConfirmPassword = page.getByTestId('register-confirm-password');
    const recommendationText = page.getByText('A colleague recommended it');
    const sourceFriendCheckbox = page.getByTestId('register-source-friend');
    const termsCheckbox = page.getByTestId('register-terms');
    const submitButton = page.getByTestId('auth-submit');
    const duplicateError = page.getByText('body email або username');
    const registrationHeader = page.getByRole('heading', { name: 'Create an account' });
    const feedTab = page.getByTestId('feed-tab-your');
    const articleListEmpty = page.getByTestId('article-list-empty');

    await signUpButton.click();
    await expect(header).toContainText('Create an account');
    await inputUsername.fill('testUsername');
    await inputEmail.fill('olena@example.com');
    await inputPassword.fill('testPassword');
    await inputConfirmPassword.fill('testPassword');
    await recommendationText.check();
    await sourceFriendCheckbox.check();
    await termsCheckbox.check();
    await submitButton.click();
    await expect(duplicateError).toBeVisible();
    await expect(registrationHeader).toBeVisible();
    await expect(feedTab).not.toBeVisible();
    await expect(articleListEmpty).not.toBeVisible();
  });

  test('Registration with invalid data', async ({ page }) => {
    const signUpButton = page.getByTestId('nav-sign-up');
    const header = page.getByRole('heading');
    const inputUsername = page.getByTestId('auth-username');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const inputConfirmPassword = page.getByTestId('register-confirm-password');
    const recommendationText = page.getByText('A colleague recommended it');
    const sourceFriendCheckbox = page.getByTestId('register-source-friend');
    const termsCheckbox = page.getByTestId('register-terms');
    const submitButton = page.getByTestId('auth-submit');
    const passwordMismatchError = page.getByText('confirm password doesn\'t match');
    const registrationHeader = page.getByRole('heading', { name: 'Create an account' });
    const feedTab = page.getByTestId('feed-tab-your');
    const articleListEmpty = page.getByTestId('article-list-empty');

    await signUpButton.click();
    await expect(header).toContainText('Create an account');
    await inputUsername.fill('testUsername');
    await inputEmail.fill('olena@examsdasdasdacom');
    await inputPassword.fill('1');
    await inputConfirmPassword.fill('2');
    await recommendationText.check();
    await sourceFriendCheckbox.check();
    await termsCheckbox.check();
    await submitButton.click();
    await expect(passwordMismatchError).toBeVisible();
    await expect(registrationHeader).toBeVisible();
    await expect(feedTab).not.toBeVisible();
    await expect(articleListEmpty).not.toBeVisible();
  });
});

test.describe('Login', () => {
  test('Successful login', async ({ page }) => {
    const signInButton = page.getByTestId('nav-sign-in');
    const header = page.getByRole('heading');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const submitButton = page.getByTestId('auth-submit');
    const navProfile = page.getByTestId('nav-profile');
    const linkQaDojo = page.getByRole('link', { name: 'QA Dojo' });
    const feedTab = page.getByTestId('feed-tab-your');

    await signInButton.click();
    await expect(header).toContainText('Sign in');
    await inputEmail.fill('olena@example.com');
    await inputPassword.fill('password');
    await submitButton.click();
    await expect(navProfile).toHaveText('olena');
    await expect(linkQaDojo).toBeVisible();
    await expect(feedTab).toBeVisible();
  });

  test('Login with invalid password', async ({ page }) => {
    const signInButton = page.getByTestId('nav-sign-in');
    const header = page.getByRole('heading');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const submitButton = page.getByTestId('auth-submit');
    const loginError = page.getByText('email or password неправильні');

    await signInButton.click();
    await expect(header).toContainText('Sign in');
    await inputEmail.fill('olena@example.com');
    await inputPassword.fill('wrongPassword');
    await submitButton.click();
    await expect(loginError).toBeVisible();
  });

  test('Login with unregistered email', async ({ page }) => {
    const signInButton = page.getByTestId('nav-sign-in');
    const header = page.getByRole('heading');
    const inputEmail = page.getByTestId('auth-email');
    const inputPassword = page.getByTestId('auth-password');
    const submitButton = page.getByTestId('auth-submit');
    const loginError = page.getByText('email or password неправильні');

    await signInButton.click();
    await expect(header).toContainText('Sign in');
    await inputEmail.fill('unregistered@example.com');
    await inputPassword.fill('testPassword');
    await submitButton.click();
    await expect(loginError).toBeVisible();
  });
});