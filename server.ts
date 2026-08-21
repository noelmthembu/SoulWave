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

    const defaultUrl = 'https://api-ap-south-1.hygraph.com/v2/cmhbi308501mb07w7xwb16yd5/master';
    const defaultToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjE3MzQ2NTEsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtaGJpMzA4NTAxbWIwN3c3eHdiMTZ5ZDUvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiMjlkYmQzMC1iMjhjLTQyMTAtYTkyNC03YjUxYmEyNTNhZTEiLCJqdGkiOiJjbWhidmJvcTcwanBxMDdwbjR2N3M0N2F1In0.lctlFtrsisbVIPp_fDbAs78dNqXTBNpqi_1sYe4lqoMZ5oqxmNdWE2D7s8atUIjA9MYqWaLwsFfwIyR2Sw3ndj6sabxWyRASkI_jRqWdiuOQab9Y0XxhVwvb49OxlF9ZFUyHHEnO2r8_SPB04Nv_Cxz_1AC3PbpgwwBvknrjSLpA5fPsqJRD1Cck-xfks39PB7OUirmaSLA75TTM6nZJmBKGdpxDWobfTL6imAgYe1mct6bPk-kgfOTmbfB1N2lt1NP-fHi9HKm_cteTLy_c85U_WWO9qSUtMQBwiVmWXP4TuQ5pPHiv8P_vD6urV5bo7Qfko8cOQcKSlVz95-bkyuhAMT4vrRtBs6-ew141XjPqWAMxU0ZIbGlhyiRm6YT0aPSJ-GFzLtHnIDB7HYtlQlDEYBC55rKjPU4EKYX6pv87zdC1G3UHoiWjC1ug53UyDkbzTO0zMbJDubkUzShpFF7ZEc5ej-Pzt8-fv0TXfLPZJIpLXwyknWd1wyXqLN3ngQe4X-K7ARVSJWUS7t7iHswpzcuL2WVLp03u7PgW-1h-X27J3ePII1hQErUZ3-E-2XkE0DC1D2u-zaeQMRvFRzOUFA8n1zxRCTS8WDmv5HlIW8qyx1SifMitqF9L-8nZ3gP0mfHVMsGGGc-jInLB1MW-a4e8OEROKLTi-7jFxXw';
    const catalogUrl = process.env.HYGRAPH_API_URL || defaultUrl;
    const catalogToken = process.env.HYGRAPH_AUTH_TOKEN || defaultToken;

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
