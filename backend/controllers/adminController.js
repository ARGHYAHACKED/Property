const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require('../models/adminModel');
const Property = require('../models/propertyModel');
const Land = require('../models/landModel');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        console.log('Login attempt for email:', email);

        // Find admin in database
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (!admin) {
            console.log(`Failed login attempt with invalid email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Direct password comparison (no hash)
        if (admin.password !== password) {
            console.log(`Failed login attempt with wrong password for: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: admin.email, adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Set secure cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log(`Admin login successful for: ${email}`);
        res.status(200).json({ 
            message: "Login successful",
            token: token, // Send token in response
            email: admin.email,
            name: admin.name || 'Admin',
            profilePic: admin.profilePic || ''
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};

exports.dashboard = (req, res) => {
    try {
        res.status(200).json({
            message: `Welcome to the Admin Dashboard, ${req.admin.email}`,
            admin: {
                email: req.admin.email
            }
        });
    } catch (error) {
        console.error('Error accessing dashboard:', error);
        res.status(500).json({ message: "Server error" });
    }
};

// New endpoint: Create admin user (for setup)
exports.createAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        // Create new admin (NO HASHING - PLAIN TEXT)
        const newAdmin = new Admin({
            email: email.toLowerCase(),
            password: password, // Store plain text password
            name: name || 'Admin'
        });

        await newAdmin.save();

        console.log(`New admin created: ${email}`);
        res.status(201).json({ 
            message: "Admin created successfully",
            admin: {
                email: newAdmin.email,
                name: newAdmin.name
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: "Server error while creating admin" });
    }
};

// Endpoint: Get all admins (for verification)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, { password: 0 }); // Don't show passwords
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateBannerStatus = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { showInBanner } = req.body;

        // Note: Removed Promise.all block that cleared other items to allow multiple selections.

        let item;
        if (type === 'property') {
            item = await Property.findByIdAndUpdate(id, { showInBanner }, { new: true });
        } else if (type === 'land') {
            item = await Land.findByIdAndUpdate(id, { showInBanner }, { new: true });
        } else {
            return res.status(400).json({ message: "Invalid type. Must be 'property' or 'land'" });
        }

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ 
            message: `Banner status updated for ${type}`, 
            item 
        });
    } catch (error) {
        console.error('Error updating banner status:', error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getBannerItems = async (req, res) => {
    try {
        const [properties, lands] = await Promise.all([
            Property.find({ showInBanner: true }),
            Land.find({ showInBanner: true })
        ]);

        res.status(200).json({
            properties,
            lands
        });
    } catch (error) {
        console.error('Error fetching banner items:', error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.verifyAdmin = (req, res) => {
    res.status(200).json({ message: "Admin verified" });
};
