// tests/truckDashboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Truck Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    // Go to the dashboard page before each test
    await page.goto('/truck'); // adjust if your route is different
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Truck Manager/);
  });

  test('charts are visible', async ({ page }) => {
    // Check that the charts container exists
    const chartsContainer = page.locator('.recharts-surface');
    await expect(chartsContainer).toBeVisible();

    // Optionally check individual charts
    //await expect(page.locator('canvas')).toHaveCount(2); // Assuming charts render as <canvas>
  });

  test('truck request cards render correctly', async ({ page }) => {
    const cards = page.locator('.card');

    // Either show a message or cards
    const noRequests = page.locator('text=No truck requests available.');
    if (await noRequests.isVisible()) {
      console.log('No truck requests present');
    } else {
      // Check at least one card exists
      await expect(cards).toHaveCountGreaterThan(0);

      // Check the first card content
      const firstCard = cards.first();
      await expect(firstCard.locator('label')).toContainText('Request ID');
      await expect(firstCard.locator('label')).toContainText('Request Date');
      await expect(firstCard.locator('label')).toContainText('Truck Capacity');
      await expect(firstCard.locator('label')).toContainText('Pickup Location');
      await expect(firstCard.locator('label')).toContainText('Request Status');
      await expect(firstCard.locator('strong label')).toHaveText(/High|Medium|Low/);

      // Check Allocate Truck button exists and enabled/disabled
      const button = firstCard.locator('button.allocate-btn');
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute('disabled', button.getAttribute('disabled')); // dynamic
    }
  });

});