import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

try {
  process.loadEnvFile('.env.local');
} catch {
  // Local configuration is optional; production configuration comes from the host environment.
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const approvedOperations = new Set(['GetGenres', 'GetSamplePacks', 'GetPresets', 'GetPlugins']);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  app.post('/api/catalog', async (req, res) => {
    const { query, variables = {} } = req.body || {};
    if (typeof query !== 'string' || query.length > 8000 || !variables || typeof variables !== 'object') {
      return res.status(400).json({ errors: [{ message: 'Invalid catalog request.' }] });
    }

    const operationMatch = query.match(/\bquery\s+(Get[A-Za-z0-9_]+)/);
    const operationName = operationMatch?.[1];
    if (!operationName || !approvedOperations.has(operationName)) {
      return res.status(405).json({ errors: [{ message: 'This catalog operation is not allowed.' }] });
    }

    const catalogUrl = process.env.HYGRAPH_API_URL;
    const catalogToken = process.env.HYGRAPH_AUTH_TOKEN;
    if (!catalogUrl || !catalogToken) {
      return res.status(503).json({ errors: [{ message: 'The catalog service is not configured.' }] });
    }

    try {
      const upstream = await fetch(catalogUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${catalogToken}`,
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(10_000),
      });
      const text = await upstream.text();
      const contentType = upstream.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return res.status(502).json({ errors: [{ message: 'The catalog service returned an unexpected response.' }] });
      }
      res.status(upstream.status).type('application/json').send(text);
    } catch {
      res.status(502).json({ errors: [{ message: 'The catalog service is unavailable. Please try again.' }] });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, { maxAge: '1y', immutable: true, index: false }));
    app.get('/{*splat}', (_req, res) => res.sendFile(path.join(distPath, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SoundWave server listening on port ${port}`);
  });
}

void startServer();
