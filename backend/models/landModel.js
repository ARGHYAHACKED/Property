const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
    title: { 
        type: String, 
        // required: true 
    },
    description: { 
        type: String, 
        // required: true 
    },
    age: { 
        type: Number, // Represents the age of the property in years
        // required: true 
    },
    location: { 
        type: String, 
        // required: true 
    },
    amenities: { 
        type: String, // An array of strings to list available amenities
        // required: true 
    },
    price: { 
        type: Number, 
        // required: true 
    },
    area: { 
        type: String, // Represents the size/area of the property
        // required: true 
    },
    imageUrls: { 
        type: [String], // A single URL or file path for the image
        default: '' 
    },
    
});

module.exports = mongoose.model('Land', landSchema);
