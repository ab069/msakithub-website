// Lightweight request guards shared by Vercel functions and the dev middleware.
// Goal: defence in depth without a heavy framework. Each guard is cheap, fails
// closed in production, and stays permissive enough for local dev.

const RAW_ALLOWED = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
const DEFAULT_ALLOWED = [
  'https://msakithub.com',
  'https://www.msakithub.com',
]
const LOCAL_HOST_RE = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/

export function isProd() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
}

function getAllowed() {
  return RAW_ALLOWED.length ? RAW_ALLOWED : DEFAULT_ALLOWED
}

// Returns the host part of a URL string, or null on parse error.
function hostOf(url) {
  try { return new URL(url).host } catch { return null }
}

/**
 * Accept the request when ANY of the following holds:
 *   - Origin or Referer match an explicit allowed origin.
 *   - The request is same-origin: the Host header equals the Origin host.
 *   - We are not in production and the Origin/Referer points at localhost.
 *   - Both Origin and Referer are missing (e.g. server-to-server) and we are
 *     not in production.
 *
 * This is a CSRF mitigation — it does not authenticate, it only blocks
 * cross-site POSTs that try to abuse the user's browser as a proxy.
 */
export function checkOrigin(req) {
  const origin = req.headers?.origin || ''
  const referer = req.headers?.referer || ''
  const host = req.headers?.host || ''
  const allowed = getAllowed()

  if (origin && allowed.includes(origin)) return true
  if (referer) {
    const rOrigin = hostOf(referer) && new URL(referer).origin
    if (rOrigin && allowed.includes(rOrigin)) return true
  }

  // Same-origin: Origin's host equals the request Host.
  if (origin && host) {
    const oHost = hostOf(origin)
    if (oHost && oHost === host) return true
  }
  if (referer && host) {
    const rHost = hostOf(referer)
    if (rHost && rHost === host) return true
  }

  // Dev: allow localhost variants.
  if (!isProd()) {
    if (origin) {
      const oHost = hostOf(origin)
      if (oHost && LOCAL_HOST_RE.test(oHost)) return true
    }
    if (referer) {
      const rHost = hostOf(referer)
      if (rHost && LOCAL_HOST_RE.test(rHost)) return true
    }
    if (host && LOCAL_HOST_RE.test(host)) return true
    if (!origin && !referer) return true
  }

  return false
}

export function checkContentType(req) {
  const ct = (req.headers?.['content-type'] || '').toLowerCase()
  return ct.includes('application/json')
}

// In-memory token bucket per IP. Best-effort: persists per warm instance.
const buckets = new Map()
const WINDOW_MS = 60_000
const MAX_REQS = 20

function ipOf(req) {
  const fwd = req.headers?.['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown'
}

export function rateLimit(req) {
  const ip = ipOf(req)
  const now = Date.now()
  const b = buckets.get(ip) || { count: 0, reset: now + WINDOW_MS }
  if (now > b.reset) { b.count = 0; b.reset = now + WINDOW_MS }
  b.count++
  buckets.set(ip, b)
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k)
  }
  return { ok: b.count <= MAX_REQS, retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)) }
}

// Cap inbound JSON. Throws on overflow, malformed JSON, or non-object roots.
export async function readJsonBody(req, maxBytes = 64 * 1024) {
  // On Vercel, req.body may already be parsed.
  if (req.body && typeof req.body === 'object') {
    const size = JSON.stringify(req.body).length
    if (size > maxBytes) throw new Error('Request body too large.')
    return req.body
  }
  let received = 0
  let raw = ''
  for await (const chunk of req) {
    received += chunk.length
    if (received > maxBytes) throw new Error('Request body too large.')
    raw += chunk
  }
  if (!raw) return {}
  let parsed
  try { parsed = JSON.parse(raw) } catch { throw new Error('Invalid JSON body.') }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Body must be a JSON object.')
  }
  return parsed
}
