require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');

const app = express();
app.use(cors());
app.use(express.json());

// ensure tables
const initSql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');
db.exec(initSql, (err) => {
  if (err) console.error('DB init error', err);
  else console.log('DB initialized');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
