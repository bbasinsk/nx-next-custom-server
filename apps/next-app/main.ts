import express from 'express';
import next from 'next';

const conf = require('./next.config.js').default;

const APP_DIR = 'apps/next-app';
const port = parseInt(process.env.PORT, 10) || 4200;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf, dir: APP_DIR });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // @ts-ignore
  server.use(handler);

  server.listen(port, err => {
    if (err) throw err;
    console.info(`> Ready on port: ${port}`);
  });
});
