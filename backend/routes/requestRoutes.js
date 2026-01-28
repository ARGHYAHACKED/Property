const express = require('express');
const router = express.Router();

// Import Controller (Create it if it doesn't exist)
const { createLandRequest, getLandRequests, updateLandRequest, deleteLandRequest } = require('../controllers/requestController');

// Define Routes
router.post('/', createLandRequest); // Handle land request creation
router.get('/', getLandRequests); // Retrieve all land requests
// router.put('/:id', updateLandRequest); // Update a specific land request
// router.delete('/:id', deleteLandRequest); // Delete a specific land request

module.exports = router;
