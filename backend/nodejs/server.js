server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
const rescueRequests = [
    { id: 1, title: "Giải cứu chó bị bỏ rơi", location: "Hà Nội", status: "Pending" },
    { id: 2, title: "Mèo bị thương cần giúp đỡ", location: "HCM", status: "Pending" }
];

const pets = [
    { id: 1, name: 'Luna', type: 'Dog', age: 2, status: 'Available' },
    { id: 2, name: 'Milo', type: 'Cat', age: 1, status: 'Available' }
];

// Routes
app.get('/api/volunteer/rescue-requests', (req, res) => {
    res.json(rescueRequests);
});

app.get('/api/pets', (req, res) => {
    res.json(pets);
});

app.get('/api/pets/:id', (req, res) => {
    const pet = pets.find(p => p.id === parseInt(req.params.id));
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
});

app.post('/api/pets', (req, res) => {
    const pet = {
        id: pets.length + 1,
        ...req.body
    };
    pets.push(pet);
    res.status(201).json(pet);
});

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'Pet Rescue Hub API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});