const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || '1h';

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare(`INSERT INTO users (email, password_hash) VALUES (?, ?)`);
    stmt.run(email, hash, function(err) {
      if (err) return res.status(400).json({ error: 'User exists or DB error' });
      const user = { id: this.lastID, email };
      const token = createToken({ id: user.id, email: user.email });
      res.json({ token, user });
    });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT id, email, password_hash FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = createToken({ id: row.id, email: row.email });
    res.json({ token, user: { id: row.id, email: row.email } });
  });
});

module.exports = router;
