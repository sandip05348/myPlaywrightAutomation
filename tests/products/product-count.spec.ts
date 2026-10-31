// spec: specs/product-count.plan.md
// seed: seed.spec.ts

import { expect, test } from '@playwright/test';
import { EMAIL, PASSWORD } from '../../src/common/constants';

test.describe('Authenticated Product Catalog Count', () => {
  test('Valid login displays and counts all 34 products', async ({ page }) => {
    // 1. Start with a fresh browser context and navigate to the login page.
    await page.goto('https://automationexercise.com/login');
    const loginForm = page.locator('form').filter({ hasText: 'Login' });
    await expect(loginForm.getByPlaceholder('Email Address')).toBeVisible();
    await expect(loginForm.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(loginForm.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Enter valid QA account credentials and submit Login.
    await loginForm.getByPlaceholder('Email Address').fill(EMAIL);
    await loginForm.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await loginForm.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(/Logged in as/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    // 3. Navigate to the products page and verify the authenticated state remains.
    await page.goto('https://automationexercise.com/products');
    await expect(page).toHaveURL('https://automationexercise.com/products');
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(page.getByText(/Logged in as/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    // 4. Count the rendered product cards and verify there are no additional pages.
    const productCards = page.locator('.features_items .product-image-wrapper');
    await expect(productCards).toHaveCount(34);
    await expect(page.locator('.pagination a')).toHaveCount(0);
  });
});
