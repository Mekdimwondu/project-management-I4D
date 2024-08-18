// routes/dashboard.js

const express = require('express');
const auth = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

module.exports = router;
