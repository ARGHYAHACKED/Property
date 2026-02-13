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
        default: []
    },
    developer: String,
    emiStarts: String,
    possessionStarts: String,
    avgPrice: String,
    sizes: String,
    configurations: String,
    reraId: String,
    projectUnits: String,
    areaUnit: String,
    projectSize: String,
    launchDate: String,
    overviewProject: String,
    aroundProject: [{
        category: String,
        name: String,
        distance: String
    }],
    moreAboutProject: String,
    floorPlans: [{
        title: String,
        size: String,
        price: String,
        imageUrl: String
    }],
    tourVideos: [String],
    amenitiesList: [String],
    specifications: {
        type: Map,
        of: Map
    },
    reviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    priceTrends: String,
    brochureUrl: String,
    locality: String,
    contactDeveloper: {
        name: String,
        phone: String,
        email: String
    }
});

module.exports = mongoose.model('Land', landSchema);
