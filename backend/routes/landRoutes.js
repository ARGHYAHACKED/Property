const express = require('express');
const {
    addLand,
    getAllLands,
    getLandById,
    updateLand,
    deleteLand,
    getFilterOptions,
} = require('../controllers/landController');
const { authenticate, verifyAdminOrUser } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // For file uploads
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a land (protected route)
router.post('/', upload.array('images', 10), addLand); // Allow up to 10 images

// Get all lands
router.get('/', getAllLands);

// Get filter options (locations, area ranges, price ranges)
router.get('/filters', getFilterOptions);

// Get a land by ID
router.get('/:id', getLandById);

// Update a land (admin or authenticated user)
router.put('/:id', verifyAdminOrUser, updateLand);

// Delete a land (protected route)
router.delete('/:id', authenticate, deleteLand);

module.exports = router;
