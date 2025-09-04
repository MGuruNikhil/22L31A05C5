const express = require('express');
const { URL } = require('url');
const router = express.Router();

const linkStore = require('../services/linkStore');
const logger = require('../services/logger');

// Create short URL
router.post('/shorturls', async (req, res) => {
  const { url: originalUrl, validity, shortcode } = req.body || {};

  await logger.info('route', `POST /shorturls payload=${JSON.stringify(req.body)}`);

  if (!originalUrl || typeof originalUrl !== 'string') {
    await logger.info('route', 'Invalid url in request');
    return res.status(400).json({ error: 'invalid url' });
  }

  try {
    new URL(originalUrl);
  } catch (e) {
    await logger.info('route', 'Malformed url');
    return res.status(400).json({ error: 'malformed url' });
  }

  const validMinutes = Number.isInteger(validity) ? validity : 30;
  if (validMinutes <= 0) {
    return res.status(400).json({ error: 'validity must be positive integer minutes' });
  }

  let sc = shortcode;
  if (sc) {
    if (!linkStore.isValidShortcode(sc)) {
      await logger.info('route', `Invalid shortcode requested: ${sc}`);
      return res.status(400).json({ error: 'invalid shortcode format' });
    }
    if (linkStore.exists(sc)) {
      await logger.info('route', `Shortcode collision for requested: ${sc}`);
      return res.status(409).json({ error: 'shortcode already exists' });
    }
  } else {
    sc = linkStore.genShortcode();
  }

  const expiry = linkStore.create(sc, originalUrl, validMinutes);

  const host = req.get('host') || `localhost:3000`;
  const protocol = req.protocol || 'http';
  const shortLink = `${protocol}://${host}/${sc}`;

  await logger.info('route', `Created short link ${sc} -> ${originalUrl}`);

  res.status(201).json({ shortLink, expiry: expiry.toISOString() });
});

// Redirect
router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const entry = linkStore.get(shortcode);
  if (!entry) {
    await logger.info('route', `Redirect missing shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'shortcode not found' });
  }

  const now = new Date();
  if (new Date(entry.expiry) < now) {
    await logger.info('route', `Redirect expired shortcode: ${shortcode}`);
    return res.status(410).json({ error: 'shortcode expired' });
  }

  // record click
  const click = {
    timestamp: now.toISOString(),
    referrer: req.get('referer') || null,
    ip: req.ip || (req.connection && req.connection.remoteAddress) || null
  };
  linkStore.recordClick(shortcode, click);
  await logger.info('route', `Redirecting ${shortcode} click recorded`);

  res.redirect(entry.originalUrl);
});

// Stats
router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const entry = linkStore.get(shortcode);
  if (!entry) {
    await logger.info('route', `Stats missing shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'shortcode not found' });
  }

  const stats = {
    shortcode,
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    clickCount: entry.clicks.length,
    clicks: entry.clicks
  };

  await logger.info('route', `Stats retrieved for ${shortcode}`);
  res.json(stats);
});

module.exports = router;
