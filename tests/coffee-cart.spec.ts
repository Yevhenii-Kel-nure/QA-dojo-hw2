import { test, expect } from '@playwright/test';

test('completes checkout for one Espresso Macchiato with promotion opt-in', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Dana Doe');
  await page.getByRole('textbox', { name: 'Email' }).fill('d@ddd.ccc');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('button', { name: 'Thanks for your purchase. Please check your email for payment.' })).toBeVisible();
});


test('adds Cafe Breve and Espresso to cart and shows $25.00 total', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Cafe_Breve"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $25.00');
  await expect(page.locator('#app')).toContainText('Cafe Breve x 1+-Espresso x 1+-');
});


test('accepts Mocha upsell after Cappuccino and shows $45.00 total', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await expect(page.locator('#app')).toMatchAriaSnapshot(`
    - text: It's your lucky day! Get an extra cup of Mocha for $4. espresso chocolate syrup steamed milk whipped cream
    - button "Yes, of course!"
    - button "Nah, I'll skip."
    `);
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.locator('[data-test="checkout"]').hover();
  await expect(page.locator('#app')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - text: (Discounted) Mocha x 1
        - button "Add one (Discounted) Mocha": +
        - button "Remove one (Discounted) Mocha": "-"
      - listitem:
        - text: Cappuccino x 1
        - button "Add one Cappuccino": +
        - button "Remove one Cappuccino": "-"
      - listitem:
        - text: Espresso x 1
        - button "Add one Espresso": +
        - button "Remove one Espresso": "-"
      - listitem:
        - text: Espresso Macchiato x 1
        - button "Add one Espresso Macchiato": +
        - button "Remove one Espresso Macchiato": "-"
    `);
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $45.00');
});


test('shows $0.00 total for an empty cart', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});


test('keeps payment form open when submitted with empty name and email', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Payment details' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Thanks for your purchase. Please check your email for payment.' })).toHaveCount(0);

});


