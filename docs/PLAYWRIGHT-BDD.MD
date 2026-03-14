# Playwright — Truck Management BDD demo

This document explains what we added and why, shows how to run the demo locally. It focuses on the Playwright changes made for the Truck Management component (BDD syntax + reporting + stable selectors).

Narrative
--------
I converted the previous tests into a BDD-style Playwright suite, added stable `data-testid` attributes to the Add Truck form for robust selectors, and configured Playwright reporting (HTML, JUnit, JSON) plus traces/screenshots/videos on failures so you have readable reports and artifacts for CI or a live demo.

What we changed / added
-----------------------
- Modified frontend form to include stable selectors:
  - greenguard-frontend/src/TruckManagement/AddTrucks.js
    - Added `data-testid` on inputs/selects/buttons: `truck-reg`, `truck-model`, `truck-capacity`, `truck-insurance`, `truck-inspection`, `truck-driver`, `truck-active`, `truck-submit`, `truck-cancel`
- Added Playwright configuration with multiple reporters + artifact capture:
  - playwright.config.js
    - HTML reporter, JUnit, JSON, trace/screenshot/video settings
- Added BDD-style test file (JavaScript):
  - tests/truckManagement.bdd.spec.js
    - Uses `test.step()` to label Given/When/Then-style steps
    - Tags tests with inline annotations like `@smoke`, `@validation`, `@happy-path`
    - Interacts with `data-testid` selectors for resilience
- Optional recommended scripts (add to package.json):
  - "test:playwright": "playwright test"
  - "test:playwright:headed": "playwright test --headed"
  - "show-report": "playwright show-report"

Why these choices (short)
-------------------------
- BDD-style (Given/When/Then) improves readability and maps tests directly to behavior requirements — beneficial during a viva exam.
- `data-testid` attributes create stable selectors, reducing flakiness from visual/text changes.
- Multiple reporters:
  - HTML for human-friendly reports (interactive).
  - JUnit XML for CI integrations (GitHub Actions, etc).
  - JSON for dashboards or custom processing.
- Artifacts (trace/video/screenshots) make debugging failing tests easy and provide demonstrable evidence during demo or grading.

Files summary
----------------------------------------
- greenguard-frontend/src/TruckManagement/AddTrucks.js
  - Show the added `data-testid` attributes and validation callbacks.
- playwright.config.js
  - Show the reporter configuration and the use options (trace/screenshot/video).
- tests/truckManagement.bdd.spec.js
  - Walk through one test and point out the BDD phrasing using `test.step()`.

Key Playwright features used (short explanations)
-------------------------------------------------
- test.describe/test.beforeEach/test.afterEach: group tests and setup/teardown.
- test.step: mark sub-steps inside tests (maps directly to Given/When/Then).
- getByTestId / getByText / selectOption / fill / click / waitForEvent: interaction primitives.
- page.waitForEvent('dialog'): handle JS alert/dialogs.
- expect(page).toHaveURL / toBeVisible: assertions.
- reporter: ['html', 'junit', 'json'] — multiple outputs for local and CI consumption.
- trace/video/screenshot: capture artifacts for debugging or demo.

How to run the demo locally
---------------------------
1. Start backend and frontend:
   - Backend (example):
     ```bash
     cd greenguard-backend
     npm install
     npm start       # or node server.js
     ```
   - Frontend:
     ```bash
     cd greenguard-frontend
     npm install
     npm start           # usually runs on http://localhost:3000
     ```

2. Run Playwright tests:
   - Quick run (headless):
     ```bash
     npx playwright test
     ```
   - Run a single spec (show UI - headed):
     ```bash
     npx playwright test tests/truckManagement.bdd.spec.js --headed
     ```
   - Run a single test by grep tag (e.g. happy-path):
     ```bash
     npx playwright test --grep "@happy-path" --headed
     ```
   - Open Playwright test runner UI (debugging):
     ```bash
     PWDEBUG=1 npx playwright test tests/truckManagement.bdd.spec.js
     ```

3. After the run, open the HTML report:
   ```bash
   npx playwright show-report
   ```
   - The report folder will contain screenshots, videos and trace links for failing tests.

4. Viewing traces (optional):
   - After a failed run, locate the trace file (the HTML report links to traces). To open manually:
     ```bash
     npx playwright show-trace path/to/trace.zip
     ```

Live demo script (step-by-step)
--------------------------------------------
1. Brief context (15–30s)
   - "I created BDD-style Playwright tests for the Truck Management component. I added stable selectors to the form and configured reporting and artifacts for CI and debugging."

2. Show the modified form (AddTrucks.js) (30–45s)
   - Point to `data-testid` additions and explain why they are used (stability / not visible to users).

3. Explain config (playwright.config.js) (30s)
   - Explain reporters: HTML (human), JUnit (CI), JSON (dashboards).
   - Explain artifacts: trace/screenshot/video on failures.

4. Open the test file and walk through one test (1–2 min)
   - Show the `test.step()` usage: "Given I..., When I..., Then I..."
   - Point out assertions and how dialogs are handled (dialog event).

5. Run a test live (1–2 min)
   - Use: `npx playwright test tests/truckManagement.bdd.spec.js --headed`
   - Show the browser performing the steps or use `PWDEBUG=1` to step through slow-motion.

6. Show report and artifacts (1 min)
   - `npx playwright show-report` and click into a failed run to show screenshots/traces.

7. Answer questions and highlight benefits (30s)
   - Flakiness reduction, reproducible debugging, CI integration.

Troubleshooting tips
--------------------
- If tests fail because of missing drivers data:
  - Either seed the backend DB with driver entries, or stub/route the API in tests (page.route()) for a deterministic response.
- If front-end port differs, ensure `baseURL` is correct in playwright.config.js or pass `--project` and `--config`.
- If HTML report is empty, confirm tests executed and that reporter output folders exist.

Example package.json scripts (recommended)
------------------------------------------
Add to your frontend repo package.json:
```json
{
  "scripts": {
    "test:playwright": "playwright test",
    "test:playwright:headed": "playwright test --headed",
    "show-report": "playwright show-report"
  }
}
```

Suggestions for improvement (next steps)
---------------------------------------
- Stub backend responses with `page.route()` or run an isolated test DB (deterministic tests).
- Add accessibility checks with `@axe-core/playwright`.
- Add tests for edge cases and negative flows, and API contract tests using Playwright `request`.
- Add GitHub Actions workflow to run Playwright and fail the PR if critical tests fail (consume junit.xml for annotation).

What to say in the viva (short bullets)
--------------------------------------
- "I wrote readable BDD-style tests mapping to behavior requirements, used stable selectors for reliability, and configured reporting + artifacts for CI and debugging."
- "I can run tests headlessly in CI and headed locally for a live demo; failures leave trace/video/screenshots to help debug."
- "Next I would stub the backend or seed a test DB to make the demo fully deterministic."

Appendix: essential commands quick list
--------------------------------------
- Run all tests: `npx playwright test`
- Run tests with UI: `npx playwright test --headed`
- Run a single spec: `npx playwright test tests/truckManagement.bdd.spec.js`
- Filter tests by tag: `npx playwright test --grep "@happy-path"`
- Show HTML report: `npx playwright show-report`
- Open a trace: `npx playwright show-trace path/to/trace.zip`

