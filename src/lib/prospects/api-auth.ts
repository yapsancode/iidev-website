/** Shortest token we accept. A shorter secret is treated as "not configured". */
export const MIN_SALES_TOKEN_LENGTH = 32;

function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return difference === 0;
}

/**
 * True only when the request carries `Authorization: Bearer <SALES_API_TOKEN>`.
 * A missing or too-short configured token locks the API rather than opening it.
 */
export function isAuthorizedSalesRequest(authorization: string | null, configuredToken: string | undefined): boolean {
  if (!configuredToken || configuredToken.length < MIN_SALES_TOKEN_LENGTH) return false;
  if (!authorization || !authorization.startsWith("Bearer ")) return false;
  return constantTimeEqual(authorization.slice("Bearer ".length), configuredToken);
}
