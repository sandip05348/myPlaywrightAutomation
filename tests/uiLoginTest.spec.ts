import  logger from '../src/utils/logger';
import { test, expect } from '../src/fixtures/pageFixtures';
import { EMAIL, PASSWORD, INVALID_EMAIL, INVALID_PASSWORD } from '../src/common/constants';

const validUser = { email: EMAIL, password: PASSWORD };
const invalidUser = { email: INVALID_EMAIL, password: INVALID_PASSWORD };

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC01 - Login with valid credentials', async ({ page, loginPage, homePage }) => {
    await loginPage.login(validUser.email, validUser.password);
    logger.info('Test started: Login with valid email & password');
    await expect(homePage.loggedInAs).toBeVisible();
    await expect(homePage.logoutLink).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('TC02 - Login with valid email and wrong password', async ({ page, loginPage }) => {
    await loginPage.login(validUser.email, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('TC03 - Login with unregistered email', async ({ page, loginPage }) => {
    await loginPage.login(invalidUser.email, validUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('TC04 - Login with empty email shows validation', async ({ page, loginPage }) => {
    await loginPage.passwordInput.fill(validUser.password);
    await loginPage.loginButton.click();
    const msg = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });

  test('TC05 - Login with empty password shows validation', async ({ page, loginPage }) => {
    await loginPage.emailInput.fill(validUser.email);
    await loginPage.loginButton.click();
    const msg = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });

  test('TC06 - Login with invalid email format shows validation', async ({ page, loginPage }) => {
    await loginPage.login('abc.com', validUser.password);
    const msg = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg).not.toBe('');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Logout', () => {
  test('TC07 - Logout redirects to login page', async ({ page, loginPage, homePage }) => {
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.loggedInAs).toBeVisible();

    await homePage.logout();

    await expect(page).toHaveURL(/login/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC08 - User is logged out after logout', async ({ page, loginPage, homePage }) => {
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await homePage.logout();

    await page.goto('/');
    await expect(homePage.loggedInAs).toHaveCount(0);
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});