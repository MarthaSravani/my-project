const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { SECRET } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  const { name, username, password, balance } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, username, password: hashed, balance });
  await user.save();
  res.status(201).json({ message: "User registered", user });
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
