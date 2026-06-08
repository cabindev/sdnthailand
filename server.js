const { createServer } = require('http');
const next = require('next');

// Native Node HTTP server (entry point for Plesk/Passenger).
// Next serves everything under public/ (images, procurement, ...) natively,
// so no extra static middleware is needed.
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
