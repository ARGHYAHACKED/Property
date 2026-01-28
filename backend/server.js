const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');
const requestLandRoutes = require('./routes/requestLandRoutes');


dotenv.config();

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const landRoutes = require('./routes/landRoutes');
const adminRoutes = require('./routes/authAdminRoutes'); // Admin routes
const messageRoutes = require("./routes/messageRoutes");


const RequestRoutes = require('./routes/requestRoutes');

// Existing routes
 // New route for land requests



const app = express();
app.use(cookieParser());

// CORS Configuration to allow credentials
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      'http://localhost:5173', // Local development frontend
      'http://localhost:3000',  // Alternative local development
      'https://property-0lu6.onrender.com', // Render backend URL (if frontend is on same domain)
      process.env.FRONTEND_URL, // Environment variable (Vercel frontend)
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true); // Allow requests with no origin
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (origin && origin.includes('vercel.app')) {
      callback(null, true); // Allow all Vercel URLs
    } else {
      console.log('CORS rejected for origin:', origin);
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent with the request
};
app.use(cors(corsOptions)); // Use the CORS middleware with the updated options
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Auth-related routes
app.use('/api/properties', propertyRoutes); // Property routes
app.use('/api/lands', landRoutes); // Land routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use("/api/messages", messageRoutes);  
app.use('/api/land-request', requestLandRoutes); // Land request routes
app.use('/api/request', RequestRoutes); // Additional request routes

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
