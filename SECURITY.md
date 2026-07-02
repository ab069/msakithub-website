# Security posture — MSAK IT Hub

This document maps each common web threat to where the protection lives in
this repo. The site is a static SPA + two read-only AI endpoints, so several
classic risks (SQL injection, broken auth, session hijacking) do not apply —
they are listed here only to confirm they were considered.

## Cross-site scripting (XSS)
- React renders all dynamic strings as text by default. We never call
  `dangerouslySetInnerHTML` with user content.
- `Content-Security-Policy` (vercel.json) restricts script and style sources to
  `'self'` plus the Google Fonts stylesheet. `object-src 'none'`, `base-uri
  'self'`, and `upgrade-insecure-requests` are enforced.
- `X-Content-Type-Options: nosniff` blocks MIME-sniffing of CSS/JS as scripts.

## Distributed denial of service (DDoS) / rate limiting
- Per-IP token bucket in `shared/guards.js` (20 requests / 60s window) applied
  to `/api/chat` and `/api/draft`. Burst returns `429` with `Retry-After`.
- 64 KB JSON body cap in `readJsonBody`.
- Vercel's edge network sits in front of all routes and is the network-level
  WAF/DDoS layer. Enable Vercel Firewall in the dashboard for IP/country
  rules.

## SQL injection
- The project has no database. There is no SQL anywhere in the codebase.

## Cross-site request forgery (CSRF)
- `checkOrigin` in `shared/guards.js` rejects POSTs unless the Origin/Referer
  matches the allow-list, equals the request Host, or (in dev) is localhost.
  This is the standard SameSite-style mitigation.
- No cookies are issued; there is no session state to ride.

## Brute-force attacks
- Rate limit above. No login endpoint exists.

## Credential security
- API keys (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`) are read from
  `process.env` server-side only — never bundled into the client.
- `.env` is in `.gitignore`. Use Vercel project env vars in production.

## File upload vulnerabilities
- No upload endpoint. The bundler only serves static assets compiled from
  `/src`. There is no path-from-user input.

## Directory traversal
- No endpoint takes a filesystem path. Vercel's static serving is sandboxed to
  the build output; the SPA rewrite in `vercel.json` only sends paths to
  `/index.html`.

## Remote code execution (RCE)
- No `eval`, `Function()`, `child_process.exec`, or dynamic `require` is used
  anywhere in the codebase.
- Inbound bodies are parsed strictly with `JSON.parse` and rejected if not a
  plain object.

## Server-side request forgery (SSRF)
- The only outbound HTTP calls from the server are hard-coded to:
  `https://generativelanguage.googleapis.com` and
  `https://openrouter.ai/api/v1/chat/completions`.
- No URL field is ever taken from a user and fetched.

## Session hijacking
- No sessions, no cookies.

## Broken access control
- All routes are public marketing pages. The two API endpoints serve the same
  public chatbot. There is no privileged role to misuse.

## Clickjacking
- `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` (vercel.json) stop
  the site being embedded in third-party frames.

## XML external entity (XXE)
- No XML parser in the runtime path. `sitemap.xml` is static, not parsed.
- Bodies must be `application/json`; `checkContentType` enforces that.

## Prompt injection (AI-specific)
- All user text is sanitized in `shared/ai.js` (`sanitizeUserText`):
  control / zero-width / bidi chars stripped, length capped, our own
  delimiter tag neutralised.
- Each user turn is wrapped in `<user_msg>...</user_msg>` so the model sees a
  clear trust boundary.
- System prompts explicitly forbid following instructions inside `<user_msg>`,
  forbid leaking system text / env / code, and require staying on-topic.
- Gemini `safetySettings` are set to `BLOCK_MEDIUM_AND_ABOVE` for harassment,
  hate, sexual, and dangerous categories.

## Web application firewall (WAF)
- Vercel Firewall (dashboard → Firewall → Rules) is the network-level WAF for
  this deploy. Recommended starter rules: rate-limit `/api/*` to 60 req/min
  per IP, block known bad ASNs, geo-allow if the audience is regional.
- For a self-hosted version, put Cloudflare or AWS WAF in front and replicate
  the same rules.

## Transport security
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  forces HTTPS for two years.

## Headers summary (vercel.json)
- `Content-Security-Policy` (locked down)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` minimal allow-list
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`
- `Strict-Transport-Security` (HSTS preload)
- `Origin-Agent-Cluster: ?1`
- `X-Permitted-Cross-Domain-Policies: none`
- `X-Robots-Tag: noindex, nofollow` on `/api/*`
