const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Check balance
router.get('/balance', auth, async (req, res) => {
const user = await User.findById(req.user.id);
res.json({ balance: user.balance });
});

// Deposit
router.post('/deposit', auth, async (req, res) => {
const { amount } = req.body;
const user = await User.findById(req.user.id);
user.balance += amount;
await user.save();
res.json({ message: `Deposited $${amount}`, newBalance: user.balance });
});

// Withdraw
router.post('/withdraw', auth, async (req, res) => {
const { amount } = req.body;
const user = await User.findById(req.user.id);
if (user.balance < amount) return res.status(400).json({ message: "Insufficient balance" });
user.balance -= amount;
await user.save();
res.json({ message: `Withdrew $${amount}`, newBalance: user.balance });
});

// Transfer
router.post('/transfer', auth, async (req, res) => {
const { toUsername, amount } = req.body;
const sender = await User.findById(req.user.id);
const receiver = await User.findOne({ username: toUsername });

if (!receiver) return res.status(404).json({ message: "Receiver not found" });
if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

sender.balance -= amount;
receiver.balance += amount;
await sender.save();
await receiver.save();

res.json({ message: `Transferred $${amount} to ${receiver.username}`, senderBalance: sender.balance });
});

module.exports = router;
