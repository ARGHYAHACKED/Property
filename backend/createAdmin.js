const mongoose = require('mongoose');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/adminModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected');
    createAdmin();
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin already exists with email: admin@gmail.com');
            console.log('Existing admin:', existingAdmin);
            mongoose.connection.close();
            return;
        }

        // Create new admin
        const newAdmin = new Admin({
            email: 'admin@gmail.com',
            password: 'shamik',
            name: 'Admin'
        });

        await newAdmin.save();

        console.log('✅ Admin created successfully!');
        console.log('📧 Email: admin@gmail.com');
        console.log('🔐 Password: shamik');
        console.log('\nYou can now login with these credentials!');
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}
