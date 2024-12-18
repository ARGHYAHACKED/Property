const express = require("express");
const router = express.Router();
const { adminLogin, verifyAdmin } = require("../controllers/adminController");

// Admin login route
router.post("/login", adminLogin);

// Verify admin token route
router.get("/verify", verifyAdmin);

module.exports = router;
