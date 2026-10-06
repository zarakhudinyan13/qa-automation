# QA Automation

Playwright tests for [Automation Exercise](https://automationexercise.com).

## Setup

```bash
npm install
npx playwright install chrome
cp .env.example .env
```

Set `EMAIL`, `PASSWORD`, and `USER_NAME` in `.env` to a registered account.

## Run tests

```bash
npm test
npm run test:ui
npm run test:auth
```

`test:auth` logs in through the API, writes `auth/user.json`, and opens `authenticatedPage` with that session.

## Two browser contexts

One browser, two contexts, two users. Each context has its own cookies.

| File | What it is |
| --- | --- |
| `utils/session.js` | `openTwoSessions()` — opens both contexts and closes both |
| `fixtures/auth.fixtures.js` | `twoSessions` fixture — same helper, cleanup included |
| `tests/examples/two-contexts.spec.js` | Example that opens both contexts in the test |
| `tests/auth/two-contexts.spec.js` | Same check through the `twoSessions` fixture |

```bash
npm run test:examples
```

## Final lesson

[Advanced suite practices](lessons/final-advanced.md): two contexts, IMAP mailbox rules, and the Monday full run.

Printable quiz: `lessons/quiz.html`. Instructor key: `lessons/quiz-answer-key.html`.

Student exam file to send: `lessons/QA-automation-exam.pdf` (3 pages, 15 selection questions, one short task, no answers).

Do not send `lessons/exam.html` or a GitHub link to this repository. GitHub shows the HTML as source code, and the instructor key is in the same public repo. Download the PDF and attach it, or upload only that PDF to Drive. The instructor key is `lessons/exam-answer-key.html`.

```bash
npm run test:ci    # every project
npm run test:mail  # mailbox checks; skipped without IMAP secrets
```

## CI

Set repository secrets `TEST_EMAIL`, `TEST_PASSWORD`, and `TEST_USER_NAME`. The workflow will not create an account.

The same job runs on push, on pull request, and every Monday at 08:00 UTC. It runs every Playwright project (`npm run test:ci`). Optional mailbox secrets are `IMAP_HOST`, `IMAP_USER`, `IMAP_PASSWORD`, `IMAP_PORT`, and `IMAP_MAILBOX`.
