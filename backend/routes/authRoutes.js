const express = require('express');
const { register, login, verifyToken, verifyOTP,completeRegistration,loginVerifyOtp,getAllUsers  } = require('../controllers/authController');
const { verifyToken1 } = require("../middlewares/authMiddleware");
const { getProfile } = require("../controllers/authController");
const router = express.Router();

// User registration
router.post('/register', register);

// Verify OTP
router.post('/verify-otp', verifyOTP);



router.post('/completeRegistration', completeRegistration);


router.post('/login', login);


router.post('/loginVerifyOtp', loginVerifyOtp);


router.get('/verify', verifyToken);
// router.get('/profile', getUserDetails);
// router.get('/profile/:id', getUserDetailsById);
router.get('/profile',verifyToken1,  getProfile);

router.get('/users', getAllUsers);
module.exports = router;
