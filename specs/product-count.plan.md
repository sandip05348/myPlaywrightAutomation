# Authenticated Product Catalog Count Test Plan

## Application Overview

Verify that a user can log in to Automation Exercise, open https://automationexercise.com/products, and count all products in the catalog. At planning time, the authenticated page displayed 34 product cards and no pagination controls; treat 34 as the current expected baseline, subject to intentional catalog updates.

## Test Scenarios

### 1. Authenticated Product Catalog Count

**Seed:** `seed.spec.ts`

#### 1.1. Valid login displays and counts all 34 products

**File:** `tests/products/product-count.spec.ts`

**Steps:**
  1. Start with a fresh browser context and navigate to https://automationexercise.com/login.
    - expect: The login page is displayed with email, password, and Login controls.
  2. Enter the valid QA account credentials from the configured test data and submit Login.
    - expect: Login succeeds and the site displays an authenticated indicator such as Logged in as and Logout.
  3. Navigate to https://automationexercise.com/products.
    - expect: The All Products page is displayed at the expected URL.
    - expect: The authenticated indicator remains visible.
  4. Wait until the product listing is rendered, then count each product card in the All Products listing once (for example, each .features_items .product-image-wrapper element). Scroll through the complete page if needed.
    - expect: The listing contains exactly 34 product cards for the current catalog baseline.
    - expect: All counted cards belong to the All Products listing; category and brand navigation elements are not included.
    - expect: There are no pagination controls indicating additional product pages.

#### 1.2. Product count remains consistent after page reload

**File:** `tests/products/product-count-reload.spec.ts`

**Steps:**
  1. Start with a fresh browser context, log in with valid QA account credentials, and navigate to https://automationexercise.com/products.
    - expect: The All Products page is displayed and the authenticated indicator is visible.
  2. Count the product cards in the All Products listing and record the result.
    - expect: The initial count is 34 for the current catalog baseline.
  3. Reload the page, wait for the listing to finish rendering, and count the same product-card elements again.
    - expect: The reloaded page displays exactly 34 product cards.
    - expect: The count matches the initial count, with no duplicate counting caused by reload or scrolling.

#### 1.3. Invalid login does not proceed to product counting

**File:** `tests/products/product-count-invalid-login.spec.ts`

**Steps:**
  1. Start with a fresh browser context and navigate to https://automationexercise.com/login.
    - expect: The login page is displayed.
  2. Submit an unregistered email address and an incorrect password.
    - expect: The site displays an invalid-credentials error.
    - expect: The user is not shown as logged in.
  3. Attempt to continue to the product-count flow by opening https://automationexercise.com/products.
    - expect: The user is not authenticated.
    - expect: The test does not report a successful authenticated product-count result.
