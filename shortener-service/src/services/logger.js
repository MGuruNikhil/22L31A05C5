const { Log } = require('logging-middleware');

async function info(pkg, message) {
  try {
    await Log('backend', 'info', pkg, message);
  } catch (e) {
    // fallback to console but avoid crashing
    // eslint-disable-next-line no-console
    console.error('logging failed', e && e.message ? e.message : e);
  }
}

module.exports = { info };
