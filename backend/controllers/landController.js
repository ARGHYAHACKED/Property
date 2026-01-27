const Land = require('../models/landModel');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.addLand = async (req, res) => {
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
  
      const newLand = new Land({
        title,
        description,
        location,
        price,
        imageUrls,
        age,
        area,
        amenities,
      });
  
      await newLand.save();
      res.status(201).json({ message: "Land details submitted successfully", land: newLand });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while submitting land details" });
    }
  };
  


exports.getAllLands = async (req, res) => {
    try {
        // Fetch specific fields from the Land model
        const lands = await Land.find({}, 'title description price location imageUrls');

        // Modify description to include only the first 15 words
        const updatedLands = lands.map((land) => ({
            id:land._id,
            title: land.title,
            description: land.description.split(' ').slice(0, 15).join(' ') + '...', // Limit description to 15 words
            price: land.price,
            location: land.location,
            imageUrl: land.imageUrls && land.imageUrls.length > 0 ? land.imageUrls[0] : null,
        }));

        res.status(200).json(updatedLands); // Return the updated land data
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getLandById = async (req, res) => {
    try {
        // Retrieve the land by ID without populating any fields since 'seller' is not a reference
        const land = await Land.findById(req.params.id);
        console.log(req.params.id)
        
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
        const updatedLand = await Land.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updatedLand) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json(updatedLand);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteLand = async (req, res) => {
    try {
        const land = await Land.findByIdAndDelete(req.params.id);

        if (!land) return res.status(404).json({ message: 'Land not found' });

        res.status(200).json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get filter options (locations, area ranges, price ranges)
exports.getFilterOptions = async (req, res) => {
    try {
        const lands = await Land.find({}, 'location area price');

        if (!lands || lands.length === 0) {
            return res.json({
                locations: [],
                areaRanges: [],
                priceRanges: []
            });
        }

        // Extract unique locations
        const locationsSet = new Set(lands.map(l => l.location).filter(l => l));
        const locations = Array.from(locationsSet).sort();

        // Parse areas and get min/max
        const areaValues = lands
            .map(l => {
                // Convert area string to number (e.g., "50 acres" or "2000 sq ft" -> number)
                const num = parseFloat(l.area);
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
        const prices = lands
            .map(l => l.price)
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














