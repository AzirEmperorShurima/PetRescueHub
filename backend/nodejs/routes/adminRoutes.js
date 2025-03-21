const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ...existing code...

router.post('/manage-users', adminController.manageUsers);
router.post('/manage-volunteers', adminController.manageVolunteers);
router.post('/manage-events', adminController.manageEvents);
router.get('/generate-statistics', adminController.generateStatistics);

module.exports = router;
