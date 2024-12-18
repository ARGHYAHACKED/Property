const LandRequest = require('../models/requestModel');
const User = require('../models/userModel'); // Assuming you have a User model
const Land = require('../models/propertyModel'); // Assuming you have a Land model

module.exports = {
  createLandRequest: async (req, res) => {
    console.log(req.body)
    try {
      const { userId, landId } = req.body;
      console.log(userId)
      console.log(req.body)
      console.log(landId)

      // Fetch user and land details
      const user = await User.findById(userId);
      const land = await Land.findById(landId);

      if (!user || !land) {
        return res.status(404).json({ message: "User or Land not found" });
      }

      // Create the request
      const newRequest = await LandRequest.create({ userId, landId });

      // Respond with fetched details
      res.status(201).json({
        message: "Land request created successfully",
        data: {
          _id: newRequest._id,
          user: {
            name: user.name,
            mobile: user.mobile,
          },
          land: {
            title: land.title,
            location: land.location,
          },
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
        .populate("userId", "name mobile") // Fetch name and mobile from User
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
