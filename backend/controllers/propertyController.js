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

// Get filter options (locations, area ranges, price ranges)
exports.getFilterOptions = async (req, res) => {
    try {
        const properties = await Property.find({}, 'location area price');

        if (!properties || properties.length === 0) {
            return res.json({
                locations: [],
                areaRanges: [],
                priceRanges: []
            });
        }

        // Extract unique locations
        const locationsSet = new Set(properties.map(p => p.location).filter(l => l));
        const locations = Array.from(locationsSet).sort();

        // Parse areas and get min/max
        const areaValues = properties
            .map(p => {
                // Convert area string to number (e.g., "50 acres" or "2000 sq ft" -> number)
                const num = parseFloat(p.area);
                return isNaN(num) ? 0 : num;
            })
            .filter(a => a > 0);

        // Define smart area ranges
        const areaRanges = [
            { label: "0 - 5 acres", min: 0, max: 5 },
            { label: "5 - 10 acres", min: 5, max: 10 },
            { label: "10 - 20 acres", min: 10, max: 20 },
            { label: "20 - 55 acres", min: 20, max: 55 },
            { label: "55+ acres", min: 55, max: Infinity }
        ];

        // Get min and max prices
        const prices = properties
            .map(p => p.price)
            .filter(p => p > 0)
            .sort((a, b) => a - b);

        let priceRanges = [];
        if (prices.length > 0) {
            const minPrice = prices[0];
            const maxPrice = prices[prices.length - 1];

            // Generate dynamic price ranges
            const priceStep = Math.ceil((maxPrice - minPrice) / 5);
            
            for (let i = 0; i < 5; i++) {
                const rangeMin = minPrice + (i * priceStep);
                const rangeMax = i === 4 ? maxPrice : minPrice + ((i + 1) * priceStep);
                
                const minLakh = Math.floor(rangeMin / 100000);
                const maxLakh = Math.ceil(rangeMax / 100000);
                
                const label = minLakh === maxLakh 
                    ? `₹${minLakh}L+`
                    : `₹${minLakh}L - ₹${maxLakh}L`;
                
                priceRanges.push({
                    label,
                    min: rangeMin,
                    max: rangeMax
                });
            }
        }

        res.json({
            locations,
            areaRanges,
            priceRanges
        });
    } catch (error) {
        console.error('Error in getFilterOptions:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};











