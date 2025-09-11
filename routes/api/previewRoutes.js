//routes/api/previewRoutes.js

const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
  res.json({ message: 'Preview route works!' });
});

module.exports = router;
