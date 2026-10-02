import { ImapFlow } from 'imapflow';

const RECENT_WINDOW_MS = 15 * 60 * 1000;

function readImapConfig() {
  const host = process.env.IMAP_HOST?.trim();
  const user = process.env.IMAP_USER?.trim();
  const password = process.env.IMAP_PASSWORD;
  if (!host || !user || !password) return null;

  const port = Number(process.env.IMAP_PORT || 993);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('IMAP_PORT must be a positive integer');
  }

  return {
    host,
    port,
    secure: process.env.IMAP_SECURE !== 'false',
    user,
    password,
    mailbox: process.env.IMAP_MAILBOX?.trim() || 'INBOX',
  };
}

export function imapConfigured() {
  return readImapConfig() !== null;
}

function createClient(config) {
  return new ImapFlow({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    logger: false,
  });
}

async function closeClient(client) {
  try {
    await client.logout();
  } catch {
    client.close();
  }
}

async function withMailbox(fn) {
  const config = readImapConfig();
  if (!config) {
    throw new Error('IMAP_HOST, IMAP_USER, and IMAP_PASSWORD must be set');
  }

  const client = createClient(config);
  await client.connect();
  const lock = await client.getMailboxLock(config.mailbox);
  try {
    return await fn(client);
  } finally {
    lock.release();
    await closeClient(client);
  }
}

export async function mailboxExists() {
  return withMailbox((client) => client.mailbox.exists);
}

/**
 * Wait for one unseen message sent to this test's own address.
 * The recipient must be unique per test so parallel runs do not share mail.
 */
export async function waitForUnseen({
  to,
  subjectIncludes,
  timeoutMs = 60_000,
  pollMs = 3_000,
  newerThanMs = RECENT_WINDOW_MS,
} = {}) {
  if (!to) {
    throw new Error('waitForUnseen requires the recipient address for this test');
  }

  const config = readImapConfig();
  if (!config) {
    throw new Error('IMAP_HOST, IMAP_USER, and IMAP_PASSWORD must be set');
  }

  const client = createClient(config);
  await client.connect();
  const deadline = Date.now() + timeoutMs;

  try {
    while (Date.now() <= deadline) {
      const lock = await client.getMailboxLock(config.mailbox);
      try {
        const since = new Date();
        since.setUTCDate(since.getUTCDate() - 1);

        const found = await client.search({
          seen: false,
          to,
          since,
        });
        const uids = Array.isArray(found) ? found : [];
        const oldest = Date.now() - newerThanMs;

        for (const uid of uids) {
          const message = await client.fetchOne(
            String(uid),
            { envelope: true, internalDate: true },
            { uid: true },
          );
          const subject = message?.envelope?.subject || '';
          const receivedAt = message?.internalDate ? new Date(message.internalDate).getTime() : 0;
          if (receivedAt < oldest) continue;
          if (subjectIncludes && !subject.includes(subjectIncludes)) continue;

          await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
          return { subject, to };
        }
      } finally {
        lock.release();
      }

      if (Date.now() + pollMs > deadline) break;
      await new Promise((resolve) => setTimeout(resolve, pollMs));
    }

    throw new Error(`No unseen message for ${to} within ${timeoutMs}ms`);
  } finally {
    await closeClient(client);
  }
}
