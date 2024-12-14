const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Pode ser 'admin' ou 'user'
});

const User = mongoose.model('User ', userSchema);

module.exports = User;