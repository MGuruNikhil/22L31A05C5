const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Shortener service listening on ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`Port ${PORT} is already in use. (EADDRINUSE)`);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.error('Server error:', err && err.stack ? err.stack : err);
  process.exit(1);
});
