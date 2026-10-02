# Final lesson — Advanced suite practices

Guest home tests, the shared login, and two browser contexts are already in the project. This last lesson is the advanced set: how those pieces stay safe when the suite grows, how to read mail without mixing tests, and how the full suite runs itself every Monday.

## Topics to cover

1. **Two contexts on one browser** — a second tab is not a second user.
2. **IMAP mailbox checks** — one unique recipient, TLS, a deadline, and a connection that always closes.
3. **Monday full run** — every Playwright project, 08:00 UTC, same secrets as a pull request.
4. **Parallel-safe users** — workers must not share an email or a timestamp.
5. **Shared account vs throwaway account** — logout and delete belong on the throwaway user.
6. **CI evidence** — retries, traces, and the HTML report, without keeping videos of green tests.
7. **Secrets** — passwords live in the environment. `auth/user.json` stays off git.

## 1. Two contexts on one browser

`openTwoSessions()` in `utils/session.js` calls `createUserSession()` twice. Each call has its own API client and its own cookie jar. `tests/examples/two-contexts.spec.js` opens both home pages together. The `twoSessions` fixture in `fixtures/auth.fixtures.js` closes both when the test ends, including on failure.

Say this plainly: two pages inside one context are still one login. A second user is a second context.

The `two-contexts` project does not depend on `setup`. It must not read `auth/user.json`. That file is the shared account.

## 2. IMAP

Use a mailbox only when the product sends mail (a signup link, a reset code). Login on Automation Exercise does not. Do not invent a mail check for the shared user.

`utils/imap.js` is the pattern. `tests/mail/inbox.spec.js` is the project that runs it.

Practices to describe:

- **A dedicated test mailbox.** Not a personal inbox. An app password goes in `IMAP_PASSWORD`, never in git.
- **TLS.** Port 993 and `secure: true`. Set `IMAP_SECURE=false` only for a local dummy server.
- **One unique recipient per test.** Search `to` that address. Parallel workers must not read “the newest message”.
- **A second token in the subject** when the product puts one there. `waitForUnseen({ to, subjectIncludes })` ignores other mail to the same address.
- **A recent window.** IMAP’s date search is whole days, so the helper asks for unseen mail since yesterday, then keeps only messages received in the last 15 minutes. Monday’s run does not match last Monday’s message.
- **Poll until a deadline.** The default is 60 seconds. Do not `waitForTimeout` and hope the message is there.
- **Mark seen only the message you matched.** Do not mark the whole inbox. Do not delete mail the search did not uniquely match.
- **Do not log the password or the raw message.** The client logger is off. Assertions use the subject.
- **Close the connection on failure.** `logout()` runs in `finally`. A locked mailbox is worse than a failed test.
- **Skip when secrets are missing.** The Monday job still runs the `mail` project. Without `IMAP_HOST`, `IMAP_USER`, and `IMAP_PASSWORD`, the live check is skipped and the rest of the suite continues.

```js
import { waitForUnseen } from '../../utils/imap.js';

const message = await waitForUnseen({
  to: user.email,
  subjectIncludes: 'Confirm your account',
});
```

Send the product mail to `user.email` first. Then wait. The address comes from `generateUniqueEmail()` or a plus-address that still lands in the test inbox (`qa+<id>@your-domain`).

## 3. Monday 08:00 UTC — every project

GitHub schedules are UTC. The workflow cron is `0 8 * * 1`: Monday at 08:00 UTC. The schedule runs only after this workflow is on the default branch.

`npm run test:ci` is `playwright test --workers=2`. It does not name a subset, so every project in `playwright.config.js` runs:

| Project | What it runs |
| --- | --- |
| `setup` | API login for the shared user. Writes `auth/user.json`. |
| `chromium` | Guest home tests in `tests/ui/`. |
| `chromium-auth` | Logged-in specs. Starts `setup` first. |
| `two-contexts` | Two users, two contexts. Does not use the shared cookies. |
| `mail` | Mailbox open/close when IMAP secrets exist. Otherwise skipped. |

Push and pull request runs use the same job. The Monday run needs the same repository secrets: `TEST_EMAIL`, `TEST_PASSWORD`, `TEST_USER_NAME`. Add `IMAP_HOST`, `IMAP_USER`, `IMAP_PASSWORD`, and optionally `IMAP_PORT` and `IMAP_MAILBOX`, only if the mailbox check should connect.

The job uploads the HTML report every time and `test-results/` when something fails. It does not create the shared account. `two-contexts` still creates two throwaway users and deletes them.

A scheduled run that nobody looks at is not a signal. Open the report when the Monday job fails. GitHub may pause schedules after a long stretch with no repository activity; a push starts them again.

## 4. Parallel-safe users

CI uses 2 workers. Locally the config uses 3. `utils/dataGenerator.js` builds ids from the time plus random bytes. Two signups in the same millisecond must not share an email. That is why `openTwoSessions()` can create both users together.

## 5. Shared account vs throwaway account

`tests/auth/auth.setup.js` logs in the `.env` user through the API and saves the `sessionid` cookie. Later auth tests reuse it. Do not click Logout on that user. Do not delete that account.

Logout, delete, and “two people at once” use `createUserSession()` / `openTwoSessions()`. Those accounts are created for the test and removed in `cleanup()`.

## 6. CI evidence

From `playwright.config.js`:

- `forbidOnly` is on when `CI` is set, so a leftover `test.only` fails the job.
- Retries are 2 on CI and 0 locally.
- A trace is kept on the first retry. Screenshot and video are kept only on failure.
- `test:ci` passes `--workers=2`, matching the CI worker count.

Do not turn on headed mode or `trace: 'on'` for the Monday job. The report artifact is the place to look.

## 7. Secrets

`.env` is gitignored. So is `auth/*.json`. The workflow reads `TEST_EMAIL`, `TEST_PASSWORD`, and `TEST_USER_NAME` from repository secrets and copies them into `EMAIL`, `PASSWORD`, and `USER_NAME`.

Mailbox secrets are separate from the site login. A student password for Automation Exercise is not an IMAP password.
