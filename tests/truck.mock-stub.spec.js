import { test, expect } from "@playwright/test";

const FRONTEND = "http://localhost:3000";

/* ---------------- Helper: Fill Truck Form ---------------- */
async function fillTruckForm(page, truck) {
  await page.fill('input[name="regNum"]', truck.RegNumber);
  await page.waitForTimeout(500);
  await page.selectOption('select[name="selectModel"]', truck.Model);
  await page.waitForTimeout(500);
  await page.fill('input[type="number"]', String(truck.Capacity));
  await page.waitForTimeout(500);
  await page.fill('input[name="insurance"]', truck.Insurance_Expiry);
  await page.waitForTimeout(500);
  await page.fill('input[name="inspection"]', truck.Inspection__date);
  await page.waitForTimeout(500);
  await page.selectOption('select[name="driver"]', truck.driverID);
  await page.waitForTimeout(500);
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(500);
}

/* ---------------- Helper: Stub Drivers ---------------- */
async function stubDrivers(page) {
  await page.route("**/user/drivers", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ driverID: "D001", first_name: "John" }]),
    });
  });
}

/* ---------------- TC1 - Mock GET all trucks ---------------- */
test("TC1 - Mock GET all trucks", async ({ page }) => {
  await page.route("**/truck/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          RegNumber: "AB-1234",
          Model: "Toyota",
          Capacity: 2000,
          Insurance_Expiry: "2026-08-09",
          Inspection__date: "2026-09-10",
          driver_id: "D002",
          isActive: true,
        },
        {
          RegNumber: "AB-4567",
          Model: "Force",
          Capacity: 2500,
          Insurance_Expiry: "2026-05-27",
          Inspection__date: "2026-07-15",
          driver_id: "D003",
          isActive: true,
        },
        {
          RegNumber: "AB-6789",
          Model: "Volvo",
          Capacity: 2400,
          Insurance_Expiry: "2026-08-14",
          Inspection__date: "2026-04-20",
          driver_id: "D004",
          isActive: true,
        },
      ]),
    });
  });

  await page.goto(`${FRONTEND}/getAllTruck`);
  await page.locator("table tr").first().waitFor({ state: "visible" });
  await page.waitForTimeout(1000); // demo-friendly pause

  await expect(page.locator("text=AB-1234")).toBeVisible();
  await expect(page.locator("text=Toyota")).toBeVisible();
});

/* ---------------- TC2 - Mock empty truck list ---------------- */
test("TC2 - Mock empty truck list", async ({ page }) => {
  await page.route("**/truck/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto(`${FRONTEND}/getAllTruck`);
  await page.waitForTimeout(1000);
  await expect(page.locator("text=No trucks found")).toBeVisible();
});

/* ---------------- TC3 - Mock server error ---------------- */
test("TC3 - Mock server error", async ({ page }) => {
  await page.route("**/truck/", async (route) => {
    await route.fulfill({ status: 500, body: "Server Error" });
  });

  await page.goto(`${FRONTEND}/getAllTruck`);
  await page.waitForTimeout(1000);
  await expect(
    page.locator("text=Failed to load trucks. Please try again."),
  ).toBeVisible();
});

/* ---------------- TC4 - Stub Add Truck Success ---------------- */
test("TC4 - Stub Add Truck Success", async ({ page }) => {
  await stubDrivers(page);
  await page.route("**/truck/addTruck", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Truck added successfully" }),
    });
  });

  await page.goto(`${FRONTEND}/addTruck`);
  await page.waitForTimeout(1000);

  await fillTruckForm(page, {
    RegNumber: "AB-1234",
    Model: "Toyota",
    Capacity: 2000,
    Insurance_Expiry: "2026-06-01",
    Inspection__date: "2026-06-15",
    driverID: "D001",
  });

  const dialogPromise = page.waitForEvent("dialog");
  await page.click('button[type="submit"]');
  const dialog = await dialogPromise;
  console.log("Dialog Message:", dialog.message());
  await page.waitForTimeout(1000);
  await dialog.accept();
});

/* ---------------- TC5 - Stub Add Truck Duplicate Error ---------------- */
test("TC5 - Stub Add Truck Duplicate Error", async ({ page }) => {
  await stubDrivers(page);
  await page.route("**/truck/addTruck", async (route) => {
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({
        message:
          "Duplication error. Truck with this registration number already exists",
      }),
    });
  });

  await page.goto(`${FRONTEND}/addTruck`);
  await page.waitForTimeout(1000);

  await fillTruckForm(page, {
    RegNumber: "AB-1234",
    Model: "Toyota",
    Capacity: 2000,
    Insurance_Expiry: "2026-06-01",
    Inspection__date: "2026-06-15",
    driverID: "D001",
  });

  const dialogPromise = page.waitForEvent("dialog");
  await page.click('button[type="submit"]');
  const dialog = await dialogPromise;
  console.log("Dialog Message:", dialog.message());
  await page.waitForTimeout(1000);
  await dialog.accept();
});

/* ---------------- TC6 - Stub Delayed API Response ---------------- */
test("TC6 - Stub Delayed API Response", async ({ page }) => {
  await stubDrivers(page);
  await page.route("**/truck/addTruck", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate delay
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Truck added successfully" }),
    });
  });

  await page.goto(`${FRONTEND}/addTruck`);
  await page.waitForTimeout(1000);

  await fillTruckForm(page, {
    RegNumber: "AB-5555",
    Model: "Force",
    Capacity: 2500,
    Insurance_Expiry: "2026-08-01",
    Inspection__date: "2026-08-10",
    driverID: "D001",
  });

  const dialogPromise = page.waitForEvent("dialog");
  await page.click('button[type="submit"]');
  const dialog = await dialogPromise;
  console.log("Dialog Message:", dialog.message());
  await page.waitForTimeout(1000);
  await dialog.accept();
});
