const mongoose = require('mongoose');
const Land = require('../models/landModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.addLand = async (req, res) => {
    try {
        const { images, ...otherData } = req.body;

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: "Images must be provided as an array" });
        }

        // Upload main land images to Cloudinary with increased size limits
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

        const newLand = new Land({
            ...otherData,
            imageUrls,
            floorPlans: processedFloorPlans
        });

        await newLand.save();
        res.status(201).json({ message: "Land details submitted successfully", land: newLand });
    } catch (error) {
        console.error('Land submission error:', error);

        // Handle Cloudinary-specific errors
        if (error.message && error.message.includes('File size too large')) {
            return res.status(400).json({
                error: "Image file too large",
                message: "One or more images exceed the maximum allowed size. Please compress your images or upload fewer images at once.",
                details: error.message
            });
        }

        res.status(500).json({
            error: "An error occurred while submitting land details",
            message: error.message || "Unknown error"
        });
    }
};

exports.getAllLands = async (req, res) => {
    try {
        // Fetch specific fields from the Land model
        const lands = await Land.find({}, 'title description price location imageUrls showInBanner');

        // Modify description to include only the first 15 words
        const updatedLands = lands.map((land) => ({
            id: land._id,
            title: land.title,
            description: land.description ? land.description.split(' ').slice(0, 15).join(' ') + '...' : '', // Limit description to 15 words
            price: land.price,
            location: land.location,
            imageUrl: land.imageUrls && land.imageUrls.length > 0 ? land.imageUrls[0] : null,
            showInBanner: land.showInBanner || false,
        }));

        res.status(200).json(updatedLands); // Return the updated land data
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLandById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid Land ID received: ${id}`);
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        // Retrieve the land by ID
        const land = await Land.findById(id);
        console.log(`Fetching Land ID: ${id}`);

        // If the land is not found, return a 404 error
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        // Send back the land details as JSON
        res.status(200).json(land);
    } catch (error) {
        // Handle server errors
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateLand = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid Land ID for update: ${id}`);
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        let updateData = { ...req.body };

        // 1. Handle main images (base64 check)
        if (updateData.images && Array.isArray(updateData.images)) {
            const uploadPromises = updateData.images.map(async (img) => {
                if (img.startsWith('data:image')) {
                    const result = await cloudinary.uploader.upload(img, {
                        folder: "property_images",
                        resource_type: "auto",
                        chunk_size: 6000000,
                        timeout: 120000
                    });
                    return result.secure_url;
                }
                return img; // Already a URL
            });
            updateData.imageUrls = await Promise.all(uploadPromises);
            delete updateData.images;
        }

        // 2. Handle floor plan images (base64 check)
        if (updateData.floorPlans && Array.isArray(updateData.floorPlans)) {
            updateData.floorPlans = await Promise.all(
                updateData.floorPlans.map(async (plan) => {
                    if (plan.imageUrl && plan.imageUrl.startsWith('data:image')) {
                        try {
                            const result = await cloudinary.uploader.upload(plan.imageUrl, {
                                folder: "floor_plans",
                                resource_type: "auto",
                                chunk_size: 6000000,
                                timeout: 120000
                            });
                            return { ...plan, imageUrl: result.secure_url };
                        } catch (err) {
                            console.error('Floor plan upload error during update:', err);
                            return plan;
                        }
                    }
                    return plan;
                })
            );
        }

        const updatedLand = await Land.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedLand) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json(updatedLand);
    } catch (error) {
        console.error('Update land error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

exports.deleteLand = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid Land ID for deletion: ${id}`);
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        const land = await Land.findByIdAndDelete(id);

        if (!land) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get filter options (locations, area ranges, price ranges)
exports.getFilterOptions = async (req, res) => {
    try {
        console.log('Fetching lands for filters...');
        const lands = await Land.find({}, 'location area price');
        console.log(`Found ${lands.length} lands for filters`);

        if (!lands || lands.length === 0) {
            console.log('No lands found, returning empty filters');
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
            lands
                .map(l => {
                    if (!l || !l.location) return null;
                    return l.location.trim();
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
        const prices = lands
            .map(l => {
                if (!l || typeof l.price !== 'number') return 0;
                return l.price > 0 ? l.price : 0;
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
