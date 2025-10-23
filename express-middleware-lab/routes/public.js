const express = require('express');
const router = express.Router();

router.get('/public', (req, res) => {
  res.json({ message: "This is a public route. No authentication required." });
});

module.exports = router;
