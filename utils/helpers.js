export function getEnvCredentials() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const userName = process.env.USER_NAME;

  if (!email || !password) {
    throw new Error(
      'EMAIL and PASSWORD must be set. Copy .env.example to .env, or run: node scripts/ci-bootstrap-user.js',
    );
  }

  return { email, password, userName: userName || 'Test User' };
}

export async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}

export async function dismissGoogleVignette(page) {
  await page.evaluate(() => {
    document.getElementById('google_vignette')?.remove();
    document.querySelectorAll('iframe[id^="aswift_"], ins.adsbygoogle').forEach((el) => el.remove());
  }).catch(() => {});
}
