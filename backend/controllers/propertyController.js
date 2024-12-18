const Property = require('../models/propertyModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Add a new property
exports.addProperty = async (req, res) => {
    try {
        const { title, description, location, age, area, price, amenities, images } = req.body;

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: "Images must be provided as an array" });
        }

        // Upload images to Cloudinary
        const uploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image, { folder: "property_images" })
        );

        const uploadedImages = await Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map((result) => result.secure_url);

        const newProperty = new Property({
            title,
            description,
            location,
            price,
            imageUrls,
            age,
            area,
            amenities,
        });

        await newProperty.save();
        res.status(201).json({ message: "Property details submitted successfully", property: newProperty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while submitting property details" });
    }
};

// Get all properties with specific fields
exports.getAllProperties = async (req, res) => {
    try {
        // Fetch specific fields from the Property model
        const properties = await Property.find({}, 'title description price location imageUrls');

        // Modify description to include only the first 15 words
        const updatedProperties = properties.map((property) => ({
            id: property._id,
            title: property.title,
            description: property.description.split(' ').slice(0, 15).join(' ') + '...', // Limit description to 15 words
            price: property.price,
            location: property.location,
            imageUrl: property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null,
        }));

        res.status(200).json(updatedProperties); // Return the updated property data
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
    try {
        // Retrieve the property by ID
        const property = await Property.findById(req.params.id);

        // If the property is not found, return a 404 error
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Send back the property details as JSON
        res.status(200).json(property);
    } catch (error) {
        // Handle server errors
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update property details
exports.updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });

        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) return res.status(404).json({ message: 'Property not found' });

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};











