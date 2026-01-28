const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Safe parsing - handle both JSON array and comma-separated formats
let adminEmails = [];
try {
    if (process.env.ADMIN_EMAILS.startsWith('[')) {
        adminEmails = JSON.parse(process.env.ADMIN_EMAILS);
    } else {
        adminEmails = process.env.ADMIN_EMAILS.split(',').map(email => email.trim());
    }
} catch (e) {
    console.warn('Could not parse ADMIN_EMAILS, defaulting to empty array');
    adminEmails = [];
}

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

console.log('Admin Emails loaded:', adminEmails); // Debug log
console.log('Password hash loaded:', !!ADMIN_PASSWORD_HASH); // Debug log

if (!ADMIN_PASSWORD_HASH) {
    throw new Error("ADMIN_PASSWORD_HASH missing in .env");
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Debug logs
        console.log('Login attempt for email:', email);
        console.log('Available admin emails:', adminEmails);

        // Check if email is in admin list
        if (!adminEmails.includes(email)) {
            console.log(`Failed login attempt with invalid email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isMatch) {
            console.log(`Failed login attempt with wrong password for: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Set secure cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        console.log(`Admin login successful for: ${email}`);
        res.status(200).json({
            message: "Login successful",
            email: email
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
