// lib/rateLimit.js
// Rate limiting simple en memoria por clave (ej. IP). Se reinicia si el servidor se reinicia.
const buckets = new Map();

export function isRateLimited(key, { windowMs, max }) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) {
    buckets.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return false;
}

export function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}
