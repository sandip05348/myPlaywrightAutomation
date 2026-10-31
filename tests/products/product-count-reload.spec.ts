// spec: specs/product-count.plan.md
// seed: seed.spec.ts

import { expect, test } from '@playwright/test';
import { EMAIL, PASSWORD } from '../../src/common/constants';

test.describe('Authenticated Product Catalog Count', () => {
  test('Product count remains consistent after page reload', async ({ page }) => {
    // 1. Log in with valid credentials and open the products page.
    await page.goto('https://automationexercise.com/login');
    const loginForm = page.locator('form').filter({ hasText: 'Login' });
    await loginForm.getByPlaceholder('Email Address').fill(EMAIL);
    await loginForm.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await loginForm.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(/Logged in as/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    await page.goto('https://automationexercise.com/products');
    await expect(page).toHaveURL('https://automationexercise.com/products');
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(page.getByText(/Logged in as/)).toBeVisible();

    // 2. Count the initial product cards and record the baseline.
    const productCards = page.locator('.features_items .product-image-wrapper');
    await expect(productCards).toHaveCount(34);
    const initialProductCount = await productCards.count();
    expect(initialProductCount).toBe(34);

    // 3. Reload and verify the same product count is rendered.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(page.getByText(/Logged in as/)).toBeVisible();
    await expect(productCards).toHaveCount(34);
    await expect(productCards).toHaveCount(initialProductCount);
  });
});
