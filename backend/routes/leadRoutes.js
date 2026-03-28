const express = require('express');
const { createLead, getAllLeads, deleteLead } = require('../controllers/leadController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route for lead capture
router.post('/', createLead);

// Admin-only routes
router.get('/', verifyAdmin, getAllLeads);
router.delete('/:id', verifyAdmin, deleteLead);

module.exports = router;
