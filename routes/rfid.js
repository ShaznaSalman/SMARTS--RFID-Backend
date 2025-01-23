const express = require('express');
const { handleRFID } = require('../controllers/rfidController');

const router = express.Router();

// Route to handle RFID scanning and attendance management
router.post('/api/rfid', handleRFID);

module.exports = router;
