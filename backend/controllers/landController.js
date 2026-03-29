const mongoose = require('mongoose');
const Land = require('../models/landModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.addLand = async (req, res) => {
    try {
        const { images, documents, ...otherData } = req.body;

        // 1. Upload images to Cloudinary
        let imageUrls = [];
        if (images && Array.isArray(images)) {
            const uploadPromises = images.map((image) =>
                cloudinary.uploader.upload(image, {
                    folder: "property_images",
                    resource_type: "auto",
                    chunk_size: 6000000,
                    timeout: 120000
                })
            );
            const uploadedImages = await Promise.all(uploadPromises);
            imageUrls = uploadedImages.map((result) => result.secure_url);
        }

        // 2. Upload documents to Cloudinary if they are base64
        let processedDocuments = [];
        if (documents && Array.isArray(documents)) {
            processedDocuments = await Promise.all(
                documents.map(async (doc) => {
                    if (doc.url && doc.url.startsWith('data:')) {
                        try {
                            const result = await cloudinary.uploader.upload(doc.url, {
                                folder: "property_docs",
                                resource_type: "auto"
                            });
                            return { name: doc.name, url: result.secure_url };
                        } catch (err) {
                            console.error('Document upload error:', err);
                            return doc;
                        }
                    }
                    return doc;
                })
            );
        }

        const newLand = new Land({
            ...otherData,
            imageUrls,
            documents: processedDocuments,
            owner: req.user ? req.user.id : null // Set owner if authenticated
        });

        await newLand.save();
        res.status(201).json({ message: "Land details submitted successfully", land: newLand });
    } catch (error) {
        console.error('Land submission error:', error);
        res.status(500).json({ error: "Failed to submit land details", message: error.message });
    }
};

exports.getAllLands = async (req, res) => {
    try {
        // Fetch all lands
        const lands = await Land.find({});

        // Map to a structure that's easy for the frontend to consume (flattening some deeper nests if needed, but keeping core structure)
        const updatedLands = lands.map((land) => ({
            id: land._id,
            title: land.title,
            description: land.description ? land.description.split(' ').slice(0, 15).join(' ') + '...' : '',
            price: land.price, // Return the whole price object
            location: land.location, // Return the whole location object
            area: land.area, // Return the whole area object
            propertyType: land.propertyType,
            ownershipType: land.ownershipType,
            imageUrls: land.imageUrls || [],
            imageUrl: land.imageUrls && land.imageUrls.length > 0 ? land.imageUrls[0] : null,
            createdAt: land.createdAt
        }));

        res.status(200).json(updatedLands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLandById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        const land = await Land.findById(id).populate('owner', 'name email');
        if (!land) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json(land);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateLand = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        let updateData = { ...req.body };

        // Handle Image Updates
        if (updateData.images && Array.isArray(updateData.images)) {
            const uploadPromises = updateData.images.map(async (img) => {
                if (img.startsWith('data:image')) {
                    const result = await cloudinary.uploader.upload(img, {
                        folder: "property_images",
                        resource_type: "auto"
                    });
                    return result.secure_url;
                }
                return img;
            });
            updateData.imageUrls = await Promise.all(uploadPromises);
            delete updateData.images;
        }

        // Handle Document Updates
        if (updateData.documents && Array.isArray(updateData.documents)) {
            updateData.documents = await Promise.all(
                updateData.documents.map(async (doc) => {
                    if (doc.url && doc.url.startsWith('data:')) {
                        const result = await cloudinary.uploader.upload(doc.url, {
                            folder: "property_docs",
                            resource_type: "auto"
                        });
                        return { name: doc.name, url: result.secure_url };
                    }
                    return doc;
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid land ID format' });
        }

        const land = await Land.findByIdAndDelete(id);
        if (!land) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getFilterOptions = async (req, res) => {
    try {
        const lands = await Land.find({}, 'location price area propertyType');
        
        const cities = [...new Set(lands.map(l => l.location?.city).filter(Boolean))].sort();
        const types = [...new Set(lands.map(l => l.propertyType).filter(Boolean))].sort();
        
        const prices = lands.map(l => l.price?.total).filter(p => typeof p === 'number').sort((a,b) => a-b);
        const areas = lands.map(l => l.area?.value).filter(a => typeof a === 'number').sort((a,b) => a-b);

        res.json({
            cities,
            propertyTypes: types,
            priceRange: {
                min: prices[0] || 0,
                max: prices[prices.length - 1] || 0
            },
            areaRange: {
                min: areas[0] || 0,
                max: areas[areas.length - 1] || 0
            }
        });
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        res.status(500).json({ error: 'Server error fetching filter options' });
    }
};
