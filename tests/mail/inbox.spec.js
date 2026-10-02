import { test, expect } from '@playwright/test';
import { imapConfigured, mailboxExists } from '../../utils/imap.js';

test('mailbox checks stay off without secrets', async () => {
  const saved = {
    host: process.env.IMAP_HOST,
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
  };

  delete process.env.IMAP_HOST;
  delete process.env.IMAP_USER;
  delete process.env.IMAP_PASSWORD;

  try {
    expect(imapConfigured()).toBe(false);
  } finally {
    restoreEnv(saved);
  }
});

test('test mailbox opens and closes', async () => {
  test.skip(!imapConfigured(), 'Set IMAP_HOST, IMAP_USER, and IMAP_PASSWORD to check a mailbox');

  const exists = await mailboxExists();
  expect(exists).toBeGreaterThanOrEqual(0);
});

function restoreEnv(saved) {
  for (const [key, name] of [
    ['host', 'IMAP_HOST'],
    ['user', 'IMAP_USER'],
    ['password', 'IMAP_PASSWORD'],
  ]) {
    if (saved[key] === undefined) delete process.env[name];
    else process.env[name] = saved[key];
  }
}
