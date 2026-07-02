import { generateBrief, AIError } from '../shared/ai.js'
import { checkOrigin, checkContentType, rateLimit, readJsonBody, isProd } from '../shared/guards.js'

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkContentType(req)) return res.status(415).json({ error: 'Unsupported content type.' })
  if (!checkOrigin(req)) return res.status(403).json({ error: 'Origin not allowed.' })
  const rl = rateLimit(req)
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter))
    return res.status(429).json({ error: 'Too many requests.' })
  }
  let body
  try { body = await readJsonBody(req) }
  catch (err) { return res.status(400).json({ error: String(err.message || err) }) }
  try {
    const draft = await generateBrief(body?.messages)
    return res.status(200).json({ draft })
  } catch (err) {
    if (err instanceof AIError) {
      const safeStatus = err.status >= 400 && err.status <= 599 ? err.status : 500
      const payload = { error: err.message }
      if (!isProd()) payload.detail = err.detail
      return res.status(safeStatus).json(payload)
    }
    if (!isProd()) return res.status(500).json({ error: 'Unexpected server error.', detail: String(err) })
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
}
