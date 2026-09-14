/**
 * Escapes user input before it is interpolated into a MongoDB $regex.
 *
 * Without escaping, a search like `.*` or `a{1000000` becomes a regex
 * injection / ReDoS vector. Every controller that builds a $regex from
 * req.query MUST run the value through this first.
 */
export function escapeRegExp(str) {
  return String(str ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Coerces a value to a plain trimmed string with a maximum length.
 * Rejects objects/arrays (blocks $operator objects passing into queries)
 * and caps length to blunt oversized-payload abuse.
 */
export function safeString(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}
