import './env.js';
import { analysisWorker } from './analysis-worker.js';

analysisWorker.on('ready', () => {
  console.log('Analysis worker ready');
});

analysisWorker.on('failed', (job, err) => {
  console.error('Analysis worker failed', {
    jobId: job?.id,
    error: String(err),
  });
});

process.on('SIGINT', async () => {
  await analysisWorker.close();
  process.exit(0);
});

import { createServer } from 'http';
const port = process.env.PORT || 3002;
createServer((_req, res) => {
  res.writeHead(200);
  res.end('Worker is active\\n');
}).listen(port, () => {
  console.log(`Worker dummy server listening on port ${port}`);
});
