import { test, expect } from '@playwright/test';

// Test 1: Check if the Truck Dashboard page loads correctly
test('Truck Dashboard loads correctly', async ({ page }) => {
    // Navigate to the Truck Dashboard page
    await page.goto('http://localhost:3000/truck');
    // Verify that the page contains the text 'Truck Manager' and it's visible
    await expect(page.locator('text=Truck Manager')).toBeVisible();

});

// Test 2: Check if the Add Truck page loads
test('Add Truck page loads', async ({ page }) => {

    await page.goto('http://localhost:3000/addTruck');

    await expect(page.locator('text=Registration Number')).toBeVisible();

});

// Test 3: Validate the Truck ID input field
test('Truck ID validation works', async ({ page }) => {

    await page.goto('http://localhost:3000/addTruck');

    await page.fill('input[name="regNum"]', 'INVALID');

    await page.locator('input[name="regNum"]').blur();

    await expect(page.locator('text=Invalid Truck ID format')).toBeVisible();

});

// Test 4: Validate the Capacity input field
test('Capacity validation works', async ({ page }) => {

    await page.goto('http://localhost:3000/addTruck');

    // Fill the capacity input with an invalid number
    await page.fill('input[type="number"]', '100');
    // Trigger blur event to activate validation
    await page.locator('input[type="number"]').blur();

    // Check that the capacity validation error message is visible
    await expect(page.locator('text=Capacity must be between')).toBeVisible();

});

// Test 5: Submit the Add Truck form
test('Add truck form submission', async ({ page }) => {
    // Navigate to the Add Truck page
    await page.goto('http://localhost:3000/addTruck');

    // Listen for dialog pop-ups (alerts) and verify the message
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Truck added');
        await dialog.accept();
    });

    await page.fill('input[name="regNum"]', 'AB-1234');

    await page.selectOption('select', 'Toyota');

    await page.fill('input[type="number"]', '2000');

    await page.check('input[type="checkbox"]');

    await page.click('button[type="submit"]');

});

