import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { EMAIL, PASSWORD, INVALID_EMAIL, INVALID_PASSWORD } from '../src/common/constants';

const validUser = { email: EMAIL, password: PASSWORD };
const invalidUser = { email: INVALID_EMAIL, password: INVALID_PASSWORD };

test.describe('Login', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC01 - Login with valid credentials', async ({ page }) => {
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.loggedInAs).toBeVisible();
    await expect(homePage.logoutLink).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('TC02 - Login with valid email and wrong password', async ({ page }) => {
    await loginPage.login(validUser.email, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('TC03 - Login with unregistered email', async ({ page }) => {
    await loginPage.login(invalidUser.email, validUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('TC04 - Login with empty email shows validation', async ({ page }) => {
    await loginPage.passwordInput.fill(validUser.password);
    await loginPage.loginButton.click();
    const msg = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });

  test('TC05 - Login with empty password shows validation', async ({ page }) => {
    await loginPage.emailInput.fill(validUser.email);
    await loginPage.loginButton.click();
    const msg = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });

  test('TC06 - Login with invalid email format shows validation', async ({ page }) => {
    await loginPage.login('abc.com', validUser.password);
    const msg = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Logout', () => {
  test('TC07 - Logout redirects to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.loggedInAs).toBeVisible();

    await homePage.logout();

    await expect(page).toHaveURL(/login/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC08 - User is logged out after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await homePage.logout();

    await page.goto('/');
    await expect(homePage.loggedInAs).toHaveCount(0);
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});