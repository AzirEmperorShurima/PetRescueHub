const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    // ...schema definition...
});

module.exports = mongoose.model('Admin', adminSchema);
