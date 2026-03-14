import { test, expect } from '@playwright/test';

test.describe('Truck Management (BDD)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/truck');
  });

  test('Dashboard is visible (@smoke)', async ({ page }) => {
    await test.step('Given I am on the Truck Dashboard', async () => {
      await expect(page).toHaveURL(/.*\/truck/);
    });
    await test.step('Then I see the Truck Manager heading', async () => {
      await expect(page.getByText('Truck Manager')).toBeVisible();
    });
  });

  test('User loads the Add Truck form (@regression)', async ({ page }) => {
    await test.step('Given I open the Add Truck page', async () => {
      await page.goto('/addTruck');
    });
    await test.step('Then the Registration Number field is visible', async () => {
      await expect(page.getByTestId('truck-reg')).toBeVisible();
    });
  });

  test('Truck ID validation message appears for bad ID (@validation)', async ({ page }) => {
    await page.goto('/addTruck');

    await test.step('When I enter an invalid registration', async () => {
      await page.getByTestId('truck-reg').fill('INVALID');
      await page.getByTestId('truck-reg').blur();
    });

    await test.step('Then I should see the invalid format error', async () => {
      await expect(page.getByText(/Invalid Truck ID format/i)).toBeVisible();
    });
  });

  test('Capacity validation message for out-of-range value (@validation)', async ({ page }) => {
    await page.goto('/addTruck');

    await test.step('When I enter capacity below range', async () => {
      await page.getByTestId('truck-capacity').fill('100');
      await page.getByTestId('truck-capacity').blur();
    });

    await test.step('Then I see the capacity range error', async () => {
      await expect(page.getByText(/Capacity must be between/i)).toBeVisible();
    });
  });

  test('Successfully adds a truck (@happy-path)', async ({ page }) => {
    await page.goto('/addTruck');

    await test.step('When I fill valid truck details', async () => {
      await page.getByTestId('truck-reg').fill('CD-1234');
      await page.getByTestId('truck-model').selectOption({ label: 'Toyota' });
      await page.getByTestId('truck-capacity').fill('2000');
      await page.getByTestId('truck-insurance').fill(formatFutureDate(30));
      await page.getByTestId('truck-inspection').fill(formatFutureDate(60));
      await page.getByTestId('truck-driver').selectOption({ index: 1 }); // first real driver option
      await page.getByTestId('truck-active').check();
    });

    await test.step('And I submit the form', async () => {
      const dialogPromise = page.waitForEvent('dialog');
      await page.getByTestId('truck-submit').click();
      const dialog = await dialogPromise;
      expect(dialog.message()).toContain('Truck added');
      await dialog.accept();
    });

    await test.step('Then I am redirected to the truck dashboard', async () => {
      await expect(page).toHaveURL(/\/truck$/);
    });
  });
});

// helper: return yyyy-mm-dd some days in future
function formatFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}