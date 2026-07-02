import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function aiApiPlugin(env) {
  return {
    name: 'msak-ai-api',
    configureServer(server) {
      for (const [k, v] of Object.entries(env)) {
        if (!(k in process.env)) process.env[k] = v;
      }
      const handle = (fnName) => async (req, res) => {
        const guards = await server.ssrLoadModule('/shared/guards.js');
        const mod = await server.ssrLoadModule('/shared/ai.js');
        const { AIError } = mod;
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        if (!guards.checkContentType(req)) { res.statusCode = 415; return res.end(JSON.stringify({ error: 'Unsupported content type.' })); }
        if (!guards.checkOrigin(req))     { res.statusCode = 403; return res.end(JSON.stringify({ error: 'Origin not allowed.' })); }
        const rl = guards.rateLimit(req);
        if (!rl.ok) { res.setHeader('Retry-After', String(rl.retryAfter)); res.statusCode = 429; return res.end(JSON.stringify({ error: 'Too many requests.' })); }
        let body;
        try { body = await guards.readJsonBody(req); }
        catch (err) { res.statusCode = 400; return res.end(JSON.stringify({ error: String(err.message || err) })); }
        try {
          let result;
          if (fnName === 'chat') result = await mod.chatReply(body?.messages);
          else result = { draft: await mod.generateBrief(body?.messages) };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          const status = err instanceof AIError ? err.status : 500;
          res.statusCode = status;
          res.end(JSON.stringify({ error: err.message, detail: err.detail }));
        }
      };
      server.middlewares.use('/api/chat', handle('chat'));
      server.middlewares.use('/api/draft', handle('draft'));
    },
  };
}

// Split heavy vendors into their own chunks so they cache and don't ship on
// every page. Three.js especially — only Home loads it.
function chunkFor(id) {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('three'))                                      return 'three-vendor';
  if (id.includes('gsap') || id.includes('@studio-freight'))     return 'gsap-vendor';
  if (id.includes('framer-motion'))                              return 'motion-vendor';
  if (id.includes('react-router'))                               return 'react-vendor';
  if (id.includes('/react/') || id.includes('/react-dom/'))      return 'react-vendor';
  return 'vendor';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), aiApiPlugin(env)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      rolldownOptions: {
        output: { manualChunks: chunkFor },
      },
    },
  };
});
