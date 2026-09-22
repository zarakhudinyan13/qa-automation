# Lesson 17 — Stable UI tests

## Topic

**Waiting for the right thing:** how Playwright auto-waits, when to listen for a network response, and how to keep Automation Exercise tests stable when ads and slow sections get in the way.

Students already know locators, assertions, and the page object model. This lesson is about why a test that passed locally fails in CI, and what to wait on instead of a timer.

## Topics to describe to the students

1. **A flaky test is usually a timing problem.** The locator is often fine. The test asked for an element before the page was ready, or it raced an ad overlay. Say this out loud before opening any code so students stop treating flakes as random.

2. **Playwright already waits before it clicks or fills.** An action runs only when the target is visible, stable, enabled, and able to receive events. Show `clickElement` and `inputElement` in `pages/BasePage.js` and point out that those methods do not add their own sleeps.

3. **Assertions retry; a one-time DOM check does not.** `expect(locator).toBeVisible()` and `toContainText()` keep trying until the expect timeout (10 seconds in `playwright.config.js`). Contrast that with reading `textContent()` once and comparing it yourself.

4. **`waitForTimeout` is not a strategy.** A fixed pause makes the suite slow and still fails when the site is slower than the number you picked. If students want to “just add a second,” ask them what user-visible thing they are actually waiting for.

5. **`networkidle` is a trap on this site.** Automation Exercise keeps loading ads, so the network rarely goes idle. `waitForNetworkIdle` in `utils/helpers.js` exists as a helper, but it is the wrong default for these pages. Prefer a specific element or a specific response.

6. **Wait for the outcome the user can see.** After subscribe, the outcome is the text “You have been successfully subscribed!” (`HomePage.subscriptionSuccess`). After scroll-up, the outcome is the hero heading. Tie this to the two flows already in `tests/ui/home.spec.js`.

7. **Pair a click with the request it sends when the UI result depends on the server.** `page.waitForResponse` should start *before* the click, then the test asserts the message. Use the footer subscribe call (`POST` that follows `#subscribe`) as the example. Do not wait for every request on the page.

8. **Choose a navigation signal on purpose.** `BasePage.navigateTo` uses `domcontentloaded`, which means the HTML is parsed and locators can start resolving. `load` also waits for images and stylesheets. Neither one means “every ad finished.”

9. **Ads steal clicks.** The Google vignette and `adsbygoogle` iframes sit on top of real controls. Walk through `dismissGoogleVignette` in `utils/helpers.js` and the locator handler on `#google_vignette` in `fixtures/auth.fixtures.js`. The lesson is: remove or dismiss the overlay, then interact — do not click through it.

10. **Scroll the target into view before you use it.** The subscription form is in the footer. `HomePage.scrollToFooter` and `scrollIntoViewIfNeeded` are there so the input is actually on screen. A locator can exist in the DOM and still be useless until it is in view.

11. **Read the failure, not just the red line.** On retry, the config records a trace. Screenshots and video are kept on failure. Teach students to open the trace at the failing action and ask: was the element missing, covered, or still loading?

12. **Assert the product behavior, not the clock.** A good test says what the user should see. It does not say how many milliseconds the site is allowed to take.

## Where to point in the project

| Idea | File |
|------|------|
| Action helpers with no sleeps | `pages/BasePage.js` |
| Footer subscribe and scroll-up | `pages/HomePage.js`, `tests/ui/home.spec.js` |
| Expect timeout, trace, screenshot, video | `playwright.config.js` |
| Overlay dismissal | `utils/helpers.js`, `fixtures/auth.fixtures.js` |
| The idle-network helper to avoid by default | `utils/helpers.js` (`waitForNetworkIdle`) |

## Classroom exercise

Stay on the home page. Do not add `waitForTimeout`.

1. Open the home page and scroll until the Subscription heading is visible.
2. Fill the email with `generateUniqueEmail('subscribe')`.
3. Start waiting for the subscribe response, then click Subscribe.
4. Assert that “You have been successfully subscribed!” is visible.
5. Reload, scroll to the footer again, click the scroll-up control, and assert the hero heading is visible without waiting for `networkidle`.

Students should be able to explain, in one sentence, which signal each step is waiting for.
