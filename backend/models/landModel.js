const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    propertyType: {
        type: String,
        enum: ['land', 'plot', 'apartment', 'villa', 'commercial'],
        required: true,
        default: 'land'
    },

    location: {
        address: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    price: {
        total: Number,
        perSqft: Number,
        negotiable: {
            type: Boolean,
            default: false
        }
    },

    area: {
        value: Number,
        unit: {
            type: String,
            enum: ['sqft', 'sqyd', 'acre', 'hectare'],
            default: 'acre'
        }
    },

    ownershipType: {
        type: String,
        enum: ['freehold', 'leasehold', 'power_of_attorney']
    },

    rera: {
        registered: {
            type: Boolean,
            default: false
        },
        reraId: String,
        state: String
    },

    amenitiesList: [String],

    imageUrls: {
        type: [String],
        default: []
    },
    
    videos: [String],

    documents: [{
        name: String,
        url: String
    }],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Land', landSchema);
