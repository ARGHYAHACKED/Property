const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(`in the middle ware {$token}`)
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    // Try to get token from cookies first
    let token = req.cookies.adminToken;
    
    // If not in cookies, try Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
    }
    
    console.log('Admin token from cookies:', req.cookies.adminToken ? 'YES' : 'NO');
    console.log('Admin token from header:', req.headers.authorization ? 'YES' : 'NO');
    console.log('Token found:', token ? 'YES' : 'NO');
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. No admin token provided. Please login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Add the admin payload to the request object
        console.log('Token verified successfully for:', decoded.email);
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: "Invalid or expired token. Please login again." });
    }
};

exports.authMiddleware = (req, res, next) => {
  const token2 = req.cookies.token; // Get token from cookies
  console.log(token2)
  

  if (!token2) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
    // navigate("/login")
  }

  try {
    const decoded = jwt.verify(token2, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to the request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};



exports.verifyToken1 = async (req, res, next) => {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
     
      if (!token) {
          return res.status(401).json({ message: 'Authentication token is missing' });
      }
      console.log("this is VerifyToken1")

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
          return res.status(401).json({ message: 'Invalid or expired token' });
      }

      req.user = { id: decoded.id }; // Include user ID in request object
      next();
  } catch (error) {
      console.error('Error in verifyToken middleware:', error.message);
      res.status(500).json({ error: 'Server error' });
      console.log(error)
  }
};