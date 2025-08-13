const express = require('express');
const router = express.Router();

// TODO: add real signup handler here
router.get('/', (_req, res) => res.json({ ok: true, at: '/api/users' }));

module.exports = router;