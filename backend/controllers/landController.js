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














