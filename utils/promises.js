/**
 * Run every task. Wait until all of them settle.
 * If any reject, throw the first rejection in task order.
 * Successful tasks are not abandoned when an earlier one fails.
 */
export async function allSettledOrThrow(tasks) {
  const results = await Promise.allSettled(tasks.map((task) => task()));
  const failure = results.find((result) => result.status === 'rejected');
  if (failure) throw failure.reason;
  return results.map((result) => result.value);
}
