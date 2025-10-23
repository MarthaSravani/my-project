const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,  // hashed
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
