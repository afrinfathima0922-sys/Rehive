const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload;
    next();
  });
}

// Create listing (protected)
router.post('/', verifyToken, (req, res) => {
  const { title, description, price, location } = req.body;
  const stmt = db.prepare(`INSERT INTO listings (title, description, price, location, created_by) VALUES (?, ?, ?, ?, ?)`);
  stmt.run(title, description, price || 0, location, req.user.id, function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    db.get(`SELECT * FROM listings WHERE id = ?`, [this.lastID], (err, row) => {
      res.json({ listing: row });
    });
  });
});

// List all
router.get('/', (req, res) => {
  db.all(`SELECT l.*, u.email as owner_email FROM listings l LEFT JOIN users u ON l.created_by = u.id ORDER BY l.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ listings: rows });
  });
});

// Get one
router.get('/:id', (req, res) => {
  db.get(`SELECT l.*, u.email as owner_email FROM listings l LEFT JOIN users u ON l.created_by = u.id WHERE l.id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ listing: row });
  });
});

// Update (protected & owner-only)
router.put('/:id', verifyToken, (req, res) => {
  const { title, description, price, location } = req.body;
  db.get(`SELECT created_by FROM listings WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Not found' });
    if (row.created_by !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    db.run(`UPDATE listings SET title=?, description=?, price=?, location=? WHERE id=?`, [title, description, price, location, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      db.get(`SELECT * FROM listings WHERE id = ?`, [req.params.id], (err, updated) => res.json({ listing: updated }));
    });
  });
});

// Delete (protected & owner-only)
router.delete('/:id', verifyToken, (req, res) => {
  db.get(`SELECT created_by FROM listings WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Not found' });
    if (row.created_by !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    db.run(`DELETE FROM listings WHERE id = ?`, [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  });
});

module.exports = router;
