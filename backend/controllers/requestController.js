const LandRequest = require('../models/requestModel');
const User = require('../models/userModel'); // Assuming you have a User model
const Land = require('../models/propertyModel'); // Assuming you have a Land model

module.exports = {
  createLandRequest: async (req, res) => {
    try {
      const { userId, landId, propertyId } = req.body;
      const propertyOrLandId = propertyId || landId;
      if (!propertyOrLandId) {
        return res.status(400).json({ message: "propertyId or landId is required" });
      }
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const user = await User.findById(userId);
      const property = await Land.findById(propertyOrLandId);

      if (!user || !property) {
        return res.status(404).json({ message: "User or Property not found" });
      }

      const existing = await LandRequest.findOne({ userId, landId: propertyOrLandId });
      if (existing) {
        return res.status(400).json({ message: "You have already requested papers for this property" });
      }

      const newRequest = await LandRequest.create({ userId, landId: propertyOrLandId });

      res.status(201).json({
        message: "Request created successfully",
        data: {
          _id: newRequest._id,
          user: { name: user.name, phone: user.phone },
          property: { title: property.title, location: property.location },
          createdAt: newRequest.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating land request", error: error.message });
    }
  },

  getLandRequests: async (req, res) => {
    try {
      const requests = await LandRequest.find()
        .populate("userId", "name phone") // Fetch name and phone from User
        .populate("landId", "title location"); // Fetch title and location from Land

      res.status(200).json({
        message: "Land requests retrieved successfully",
        data: requests,
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving land requests", error: error.message });
    }
  },
};
