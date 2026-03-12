const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',   // 👈 VERY IMPORTANT
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    headless: false,

    trace: 'retain-on-failure',
    screenshot: `only-on-failure`,
    video: 'retain-on-failure',

  },
});