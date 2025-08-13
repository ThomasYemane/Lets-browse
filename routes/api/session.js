const express = require('express');
const router = express.Router();

// TODO: add real login/logout/get-session handlers here
router.get('/', (_req, res) => res.json({ ok: true, at: '/api/session' }));

module.exports = router;