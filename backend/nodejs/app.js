const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const dbConfig = require('./config/db');

const app = express();

// ...existing code...

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/volunteer', volunteerRoutes);

// ...existing code...

// Connect to MongoDB
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
