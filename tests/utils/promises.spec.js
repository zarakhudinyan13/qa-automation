import { test, expect } from '@playwright/test';
import { allSettledOrThrow } from '../../utils/promises.js';

test('allSettledOrThrow returns values in task order', async () => {
  const values = await allSettledOrThrow([
    async () => 1,
    async () => 2,
  ]);

  expect(values).toEqual([1, 2]);
});

test('allSettledOrThrow finishes every task and throws the first error', async () => {
  const seen = [];

  await expect(allSettledOrThrow([
    async () => {
      seen.push('a');
      throw new Error('first');
    },
    async () => {
      seen.push('b');
      return 'ok';
    },
  ])).rejects.toThrow('first');

  expect(seen).toEqual(['a', 'b']);
});
