const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Safe parsing
const adminEmails = JSON.parse(process.env.ADMIN_EMAILS || "[]");
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD_HASH) {
    throw new Error("ADMIN_PASSWORD_HASH missing in .env");
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!adminEmails.includes(email)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("adminToken", token, {
        httpOnly: true,
        secure: false, // localhost
        sameSite: "lax",
    });

    res.status(200).json({ message: "Login successful" });
};

exports.dashboard = (req, res) => {
    res.status(200).json({
        message: `Welcome to the Admin Dashboard, ${req.admin.email}`,
    });
};
