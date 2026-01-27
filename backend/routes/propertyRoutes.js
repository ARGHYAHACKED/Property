const express = require('express');
const {
    addProperty,
    getAllProperties,
    getPropertyById,
    deleteProperty,
    getFilterOptions,
} = require('../controllers/propertyController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // For file uploads
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a property (protected route)
router.post('/', upload.array('images', 10), addProperty); // Allow up to 10 images

// Get all properties
router.get('/', getAllProperties);

// Get filter options (locations, area ranges, price ranges)
router.get('/filters', getFilterOptions);

// Get a property by ID
router.get('/:id', getPropertyById);

// Delete a property (protected route)
router.delete('/:id', deleteProperty);

module.exports = router;
