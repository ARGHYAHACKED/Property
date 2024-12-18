const express = require('express');
const { login, dashboard } = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Login route
router.post('/login', login);

// Dashboard route (protected)
router.get('/dashboard', verifyAdmin, dashboard);

module.exports = router;
