import { chatReplyStream, AIError } from '../shared/ai.js'
import { checkOrigin, checkContentType, rateLimit, readJsonBody, isProd } from '../shared/guards.js'

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')
  // Lightweight prewarm — GET /api/chat?warmup=1 returns 204 so the serverless
  // function is initialized before the visitor sends their first message.
  if (req.method === 'GET' && req.query?.warmup) {
    return res.status(204).end()
  }
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

  // Stream NDJSON: {"chunk":"..."} per token batch, then a final {"done":true,"readyToDraft":bool}.
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  // Vercel/Node: disable buffering so chunks flush immediately.
  res.setHeader('X-Accel-Buffering', 'no')
  if (typeof res.flushHeaders === 'function') res.flushHeaders()

  const write = (obj) => {
    res.write(JSON.stringify(obj) + '\n')
    if (typeof res.flush === 'function') res.flush()
  }

  try {
    const { readyToDraft } = await chatReplyStream(body?.messages, (chunk) => {
      if (chunk) write({ chunk })
    })
    write({ done: true, readyToDraft: Boolean(readyToDraft) })
    res.end()
  } catch (err) {
    if (err instanceof AIError) {
      const payload = { error: err.message }
      if (!isProd()) payload.detail = err.detail
      write(payload)
    } else {
      const payload = { error: 'Unexpected server error.' }
      if (!isProd()) payload.detail = String(err)
      write(payload)
    }
    res.end()
  }
}
