const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cookies = require('js-cookie');

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



require('dotenv').config();

exports.verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    console.log(token)


    // if (!token) {
    //     return res.status(401).json({ message: "Access denied. No token provided." });
    // }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Add the admin payload to the request object
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
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


// New check