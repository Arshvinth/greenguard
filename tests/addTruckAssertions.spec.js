// Import Playwright testing functions
import { test, expect } from '@playwright/test';

// Group all truck-related tests together
test.describe('Truck Management Tests', () => {

  // Setup: runs before every test
  test.beforeEach(async ({ page }) => {
    console.log('Opening application...');
    await page.goto('/');
  });

  // Teardown: runs after every test
  test.afterEach(async ({ page }) => {
    console.log('Test finished');
  });

  // Test 1: Truck Dashboard page loads
  test('Truck Dashboard loads correctly', async ({ page }) => {

    await page.goto('/truck'); 
    // Assertion: Check if "Truck Manager" text is visible
    await expect(page.locator('text=Truck Manager')).toBeVisible();

  });

  // Test 2: Add Truck page loads
  test('Add Truck page loads', async ({ page }) => {

    await page.goto('/addTruck');
    // Assertion: Verify Registration Number field label is visible
    await expect(page.locator('text=Registration Number')).toBeVisible();

  });

  // Test 3: Truck ID validation
  test('Truck ID validation works', async ({ page }) => {

    await page.goto('/addTruck');
    // Enter truck details with invalid registration number
    await page.fill('input[name="regNum"]', 'INVALID');
    // Trigger validation by leaving the input field
    await page.locator('input[name="regNum"]').blur();

    await expect(page.locator('text=Invalid Truck ID format')).toBeVisible();

  });

  // Test 4: Capacity validation
  test('Capacity validation works', async ({ page }) => {

    await page.goto('/addTruck');

    await page.fill('input[type="number"]', '100');

    await page.locator('input[type="number"]').blur();

    await expect(page.locator('text=Capacity must be between')).toBeVisible();

  });

  // Test 5: Add Truck form submission
  test('Add truck form submission', async ({ page }) => {

    await page.goto('/addTruck');

    // Handle alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Truck added');
      await dialog.accept();
    });

    await page.fill('input[name="regNum"]', 'AB-1234');

    await page.selectOption('select', 'Toyota');

    await page.fill('input[type="number"]', '2000');

    await page.check('input[type="checkbox"]');
    // Submit the form
    await page.click('button[type="submit"]');

  });

});
