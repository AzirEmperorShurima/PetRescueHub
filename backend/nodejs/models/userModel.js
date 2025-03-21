const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // ...schema definition...
});

module.exports = mongoose.model('User', userSchema);
