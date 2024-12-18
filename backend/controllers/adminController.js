const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const adminEmails = JSON.parse(process.env.ADMIN_EMAILS);
const adminPassword = process.env.ADMIN_PASSWORD;

// Mock hashed password (hash this only once and store securely)
const hashedPassword = bcrypt.hashSync(adminPassword, 10);

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!adminEmails.includes(email) || !bcrypt.compareSync(password, hashedPassword)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in HTTP-only cookie
    res.cookie('adminToken', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful" });
    console.log(token)
};

exports.dashboard = (req, res) => {
    // The `req.admin` object is set by the `verifyAdmin` middleware
    const { email } = req.admin;
    res.status(200).json({ message: `Welcome to the Admin Dashboard, ${email}!` });
};
