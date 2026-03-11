const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',   // 👈 VERY IMPORTANT

  use: {
    baseURL: 'http://localhost:3000',
     // If running in GitHub Actions, run headless; otherwise show browser
    headless: isCI ? true : false,
  },
});