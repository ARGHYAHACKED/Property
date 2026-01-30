const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OTP = require('../models/otpModel');
const twilio = require('twilio');

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Generate and send OTP
exports.register = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate Twilio configuration
        if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER) {
            console.error('Twilio configuration missing:', {
                accountSid: !!accountSid,
                authToken: !!authToken,
                twilioPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER
            });
            return res.status(500).json({ error: 'SMS service not configured' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database
        await OTP.findOneAndUpdate({ phone }, { otp }, { upsert: true });

        // Send OTP via Twilio with better error handling
        try {
            await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
            
            res.status(200).json({ message: 'OTP sent successfully', phone });
        } catch (twilioError) {
            console.error('Twilio error:', {
                message: twilioError.message,
                code: twilioError.code,
                status: twilioError.status
            });
            
            // Check if it's a phone number format issue
            if (twilioError.message && twilioError.message.includes('invalid')) {
                return res.status(400).json({ 
                    error: 'Invalid phone number format. Use +country_codephonenumber (e.g., +919876543210)' 
                });
            }
            
            return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error in register:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Check if required fields are provided
        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone and OTP are required' });
        }

        // Find OTP entry in the database
        const otpEntry = await OTP.findOne({ phone, otp });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        // Remove OTP after verification
        await OTP.deleteOne({ phone });
        
        // Check if user already exists
        let user = await User.findOne({ phone });
        if (!user) {
            // Create a new user with just the phone number
            user = new User({ phone });
            await user.save();
        }

        // Respond with success and user details
        res.status(200).json({ 
            message: 'OTP verified successfully', 
            user: { 
                id: user._id, 
                phone: user.phone 
            }
        });
    } catch (error) {
        console.error('Error in verifyOTP:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update name and email, and generate auth token
exports.completeRegistration = async (req, res) => {

    try {
        // console.log("here")
        
        const { userId, name, email } = req.body;
        // console.log("There")

        if (!userId || !name || !email) {
            return res.status(400).json({ message: 'User ID, Name, and Email are required' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        user.name = name;
        user.email = email;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'User details updated successfully', token });
    } catch (error) {
        console.error('Error in completeRegistration:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.verifyToken = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user exists based on the decoded ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If token is valid and user exists
        res.status(200).json({
            message: 'Token is valid',
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error in verifyToken:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};




exports.login = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate Twilio configuration
        if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER) {
            console.error('Twilio configuration missing:', {
                accountSid: !!accountSid,
                authToken: !!authToken,
                twilioPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER
            });
            return res.status(500).json({ error: 'SMS service not configured' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await OTP.findOneAndUpdate({ phone }, { otp }, { upsert: true });
        
        // Send OTP via Twilio with better error handling
        try {
            await client.messages.create({
                body: `Your OTP for login is ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
            
            res.status(200).json({ message: 'OTP sent successfully', phone });
        } catch (twilioError) {
            console.error('Twilio error:', {
                message: twilioError.message,
                code: twilioError.code,
                status: twilioError.status
            });
            
            // Check if it's a phone number format issue
            if (twilioError.message && twilioError.message.includes('invalid')) {
                return res.status(400).json({ 
                    error: 'Invalid phone number format. Use +country_codephonenumber (e.g., +919876543210)' 
                });
            }
            
            return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error in login:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};




exports.loginVerifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone and OTP are required' });
        }

        // Find OTP entry in the database
        const otpEntry = await OTP.findOne({ phone, otp });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        // Remove OTP after verification
        await OTP.deleteOne({ phone });

        // Check if user exists
        let user = await User.findOne({ phone });
        if (!user) {
            // If user doesn't exist, create a new user with just the phone number
            user = new User({ phone });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name || null,
                email: user.email || null,
            },
        });
    } catch (error) {
        console.error('Error in loginVerifyOtp:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.getProfile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log(token)
        const userId = req.user.id; // Extracted from middleware
        const user = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error in getProfile:', error.message);
        res.status(500).json({ error: 'Server error' });
        console.log("herererererererer")
    }

 



};






// Get all users (for admin panel – always return array so counts show properly)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users: users || [] });
    } catch (error) {
        console.error('Error in getAllUsers:', error.message);
        res.status(500).json({ error: 'Server error', users: [] });
    }
};
