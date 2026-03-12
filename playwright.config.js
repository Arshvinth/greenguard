const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',   // 👈 VERY IMPORTANT

  use: {
    baseURL: 'http://localhost:3000',
    headless: false
  },
});