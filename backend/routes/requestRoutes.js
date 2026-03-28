const express = require('express');
const router = express.Router();

// Import Controller (Create it if it doesn't exist)
const { createPropertyRequest, getPropertyRequests, updatePropertyRequest, deletePropertyRequest } = require('../controllers/requestController');
const { authenticate } = require('../middlewares/authMiddleware');

// Define Routes
router.post('/create', authenticate, (req, res, next) => {
    console.log('POST /api/request/create called');
    next();
}, createPropertyRequest); // Handle property request creation

router.get('/', (req, res, next) => {
    console.log('GET /api/request/ called');
    next();
}, getPropertyRequests); // Retrieve all property requests

module.exports = router;
