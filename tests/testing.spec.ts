import { test, expect } from '@playwright/test';

test('Open web browser', async ({ page }) => {

await page.goto('https://www.google.com/');
  await expect(page).toHaveURL(/google\.com/);

  await page.goto('https://www.careerorbits.com/');
  await expect(page).toHaveURL(/careerorbits\.com/);

  await page.goBack();
  await expect(page).toHaveURL(/google\.com/);

  await page.goForward();
  await expect(page).toHaveURL(/careerorbits\.com/);
  

  await page.reload();
  await expect(page).toHaveURL(/careerorbits\.com/);
  //await page.lo
})



 