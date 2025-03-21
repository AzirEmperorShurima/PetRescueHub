const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// ...existing code...

router.post('/register', volunteerController.register);
router.post('/receive-rescue-request', volunteerController.receiveRescueRequest);
router.post('/manage-rescue-operations', volunteerController.manageRescueOperations);

module.exports = router;
