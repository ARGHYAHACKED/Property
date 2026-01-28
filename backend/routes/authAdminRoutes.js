const express = require('express');
const { login, dashboard, createAdmin, getAllAdmins } = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/create', createAdmin); // Create new admin

// Protected routes
router.get('/dashboard', verifyAdmin, dashboard);
router.get('/all', verifyAdmin, getAllAdmins); // Get all admins (for verification)

module.exports = router;
