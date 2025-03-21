const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    // ...schema definition...
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
