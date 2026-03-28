const Property = require('../models/propertyModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Add a new property
exports.addProperty = async (req, res) => {
    try {
        const { images, ...otherData } = req.body;

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: "Images must be provided as an array" });
        }

        // Upload main property images to Cloudinary with increased size limits
        const uploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image, {
                folder: "property_images",
                resource_type: "auto",
                chunk_size: 6000000, // 6MB chunks for large files
                timeout: 120000 // 2 minute timeout
            })
        );

        const uploadedImages = await Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map((result) => result.secure_url);

        // Upload floor plan images to Cloudinary
        let processedFloorPlans = [];
        if (otherData.floorPlans && Array.isArray(otherData.floorPlans)) {
            processedFloorPlans = await Promise.all(
                otherData.floorPlans.map(async (plan) => {
                    if (plan.imageUrl && plan.imageUrl.startsWith('data:')) {
                        // Upload base64 image to Cloudinary
                        try {
                            const uploadResult = await cloudinary.uploader.upload(plan.imageUrl, {
                                folder: "floor_plans",
                                resource_type: "auto",
                                chunk_size: 6000000,
                                timeout: 120000
                            });
                            return { ...plan, imageUrl: uploadResult.secure_url };
                        } catch (err) {
                            console.error('Floor plan image upload error:', err);
                            return plan; // Keep original if upload fails
                        }
                    }
                    return plan;
                })
            );
        }

        const newProperty = new Property({
            ...otherData,
            imageUrls,
            floorPlans: processedFloorPlans
        });

        await newProperty.save();
        res.status(201).json({ message: "Property details submitted successfully", property: newProperty });
    } catch (error) {
        console.error('Property submission error:', error);

        // Handle Cloudinary-specific errors
        if (error.message && error.message.includes('File size too large')) {
            return res.status(400).json({
                error: "Image file too large",
                message: "One or more images exceed the maximum allowed size. Please compress your images or upload fewer images at once.",
                details: error.message
            });
        }

        res.status(500).json({
            error: "An error occurred while submitting property details",
            message: error.message || "Unknown error"
        });
    }
};

// Get all properties with specific fields
exports.getAllProperties = async (req, res) => {
    try {
        // Fetch specific fields from the Property model
        const properties = await Property.find({}, 'title description price location imageUrls showInBanner');

        // Modify description to include only the first 15 words
        const updatedProperties = properties.map((property) => ({
            id: property._id,
            title: property.title,
            description: property.description ? property.description.split(' ').slice(0, 15).join(' ') + '...' : '', // Limit description to 15 words
            price: property.price,
            location: property.location,
            imageUrl: property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null,
            showInBanner: property.showInBanner || false,
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
        console.log('Fetching properties for filters...');
        const properties = await Property.find({}, 'location area price');
        console.log(`Found ${properties.length} properties for filters`);

        if (!properties || properties.length === 0) {
            console.log('No properties found, returning empty filters');
            return res.json({
                locations: [],
                areaRanges: [
                    { label: "0 - 5 acres", min: 0, max: 5 },
                    { label: "5 - 10 acres", min: 5, max: 10 },
                    { label: "10 - 20 acres", min: 10, max: 20 },
                    { label: "20 - 55 acres", min: 20, max: 55 },
                    { label: "55+ acres", min: 55, max: Infinity }
                ],
                priceRanges: []
            });
        }

        // Extract unique locations with null checking
        const locationsSet = new Set(
            properties
                .map(p => {
                    if (!p || !p.location) return null;
                    return p.location.trim();
                })
                .filter(l => l && l.length > 0)
        );
        const locations = Array.from(locationsSet).sort();
        console.log('Extracted locations:', locations);

        // Define smart area ranges
        const areaRanges = [
            { label: "0 - 5 acres", min: 0, max: 5 },
            { label: "5 - 10 acres", min: 5, max: 10 },
            { label: "10 - 20 acres", min: 10, max: 20 },
            { label: "20 - 55 acres", min: 20, max: 55 },
            { label: "55+ acres", min: 55, max: Infinity }
        ];

        // Get min and max prices with better error handling
        const prices = properties
            .map(p => {
                if (!p || typeof p.price !== 'number') return 0;
                return p.price > 0 ? p.price : 0;
            })
            .filter(p => p > 0)
            .sort((a, b) => a - b);

        console.log(`Found ${prices.length} prices for filtering`);

        // Helper function to format price in Lakhs or Crores
        const formatPriceLabel = (priceInRupees) => {
            const lakhs = priceInRupees / 100000;
            if (lakhs >= 100) {
                // Convert to Crores if >= 1 Crore
                const crores = lakhs / 100;
                return crores % 1 === 0 ? `₹${crores} Cr` : `₹${crores.toFixed(2)} Cr`;
            } else {
                // Keep in Lakhs
                return lakhs % 1 === 0 ? `₹${lakhs}L` : `₹${lakhs.toFixed(2)}L`;
            }
        };

        let priceRanges = [];
        if (prices.length > 0) {
            try {
                const minPrice = prices[0];
                const maxPrice = prices[prices.length - 1];
                console.log(`Price range: ${minPrice} to ${maxPrice}`);

                // If min and max are the same, create a single range
                if (minPrice === maxPrice) {
                    priceRanges = [
                        { label: `${formatPriceLabel(maxPrice)}+`, min: minPrice, max: maxPrice }
                    ];
                } else {
                    // Generate dynamic price ranges
                    const priceStep = Math.max(1, Math.ceil((maxPrice - minPrice) / 5));

                    for (let i = 0; i < 5; i++) {
                        const rangeMin = minPrice + (i * priceStep);
                        const rangeMax = i === 4 ? maxPrice : minPrice + ((i + 1) * priceStep);

                        const minLabel = formatPriceLabel(rangeMin);
                        const maxLabel = formatPriceLabel(rangeMax);

                        const label = minLabel === maxLabel
                            ? `${minLabel}+`
                            : `${minLabel} - ${maxLabel}`;

                        priceRanges.push({
                            label,
                            min: rangeMin,
                            max: rangeMax
                        });
                    }
                }
                console.log('Generated price ranges:', priceRanges.length);
            } catch (priceError) {
                console.error('Error calculating price ranges:', priceError.message);
                priceRanges = [];
            }
        }

        const response = {
            locations,
            areaRanges,
            priceRanges
        };

        console.log('Sending filter response:', {
            locationsCount: locations.length,
            areaRangesCount: areaRanges.length,
            priceRangesCount: priceRanges.length
        });

        res.json(response);
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Server error fetching filter options',
            message: error.message
        });
    }
};

exports.getHomeBanners = async (req, res) => {
    try {
        const Land = require('../models/landModel');
        const [properties, lands] = await Promise.all([
            Property.find({ showInBanner: true }),
            Land.find({ showInBanner: true })
        ]);

        const bannerItems = [
            ...properties.map(p => ({ ...p._doc, id: p._id, type: 'property' })),
            ...lands.map(l => ({ ...l._doc, id: l._id, type: 'land' }))
        ];

        if (bannerItems.length === 0) {
            return res.status(404).json({ message: 'No banner items selected' });
        }

        res.status(200).json(bannerItems);
    } catch (error) {
        console.error('Error fetching home banners:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
