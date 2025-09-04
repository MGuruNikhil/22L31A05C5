const links = new Map(); // shortcode -> { originalUrl, createdAt, expiry, clicks: [] }

function isValidShortcode(sc) {
  return typeof sc === 'string' && /^[a-zA-Z0-9_-]{3,16}$/.test(sc);
}

function genShortcode() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sc;
  do {
    sc = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  } while (links.has(sc));
  return sc;
}

function create(shortcode, originalUrl, validMinutes) {
  const now = new Date();
  const expiry = new Date(now.getTime() + validMinutes * 60 * 1000);
  links.set(shortcode, {
    originalUrl,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  });
  return expiry;
}

function get(shortcode) {
  return links.get(shortcode);
}

function exists(shortcode) {
  return links.has(shortcode);
}

function recordClick(shortcode, click) {
  const entry = links.get(shortcode);
  if (entry) entry.clicks.push(click);
}

module.exports = {
  isValidShortcode,
  genShortcode,
  create,
  get,
  exists,
  recordClick
};
