import { test, expect } from '@playwright/test';

test('Create truck Requst', async ({ page }) => {

    await page.goto('http://localhost:3000/CreateTruckRequest/PU0001');

    // wait until form loads
    await page.waitForSelector('#truckCapacity');

    // fill truck capacity
    await page.fill('#truckCapacity', "2500");

    // change priority
    await page.selectOption('#priority', 'Medium');

    // submit form
    await page.click('button[type="submit"]');

});

test('view all truck requests', async ({ page }) => {

    await page.goto('http://localhost:3000/ReadAllTruckRequests');

    // wait for table
    await page.waitForSelector('.read-req-table');

    // check header exists
    await expect(page.locator('text=Request ID')).toBeVisible();
});