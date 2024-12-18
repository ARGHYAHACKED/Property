const express = require('express');
const {
    addProperty,
    getAllProperties,
    getPropertyById,
    // updateLand,
    deleteProperty,
} = require('../controllers/propertyController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // For file uploads
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a land (protected route)
// router.post('/', upload.single('image'), addLand);
router.post('/', upload.array('images', 10), addProperty); // Allow up to 10 images


// Get all lands
router.get('/', getAllProperties);



// Get a land by ID
router.get('/:id', getPropertyById);

// // Update a land (protected route)
// router.put('/:id', authenticate, updateLand);

// // Delete a land (protected route)
router.delete('/:id', deleteProperty);

module.exports = router;
