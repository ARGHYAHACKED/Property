const LandRequest = require('../models/requestModel');
const User = require('../models/userModel');
const Property = require('../models/propertyModel');

module.exports = {
  createPropertyRequest: async (req, res) => {
    try {
      console.log('--- createPropertyRequest Controller Hit ---');
      console.log('Request Body:', req.body);
      console.log('Authenticated User ID:', req.user?._id);

      const { landId, propertyId } = req.body;
      const propertyOrLandId = propertyId || landId;
      const userId = req.user?._id;

      if (!propertyOrLandId) {
        console.error('Missing propertyId or landId');
        return res.status(400).json({ message: "propertyId or landId is required" });
      }

      if (!userId) {
        console.error('User not authenticated (userId missing)');
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await User.findById(userId);
      const property = await Property.findById(propertyOrLandId);

      if (!user) {
        console.error('User not found in database:', userId);
        return res.status(404).json({ message: "User not found" });
      }

      if (!property) {
        console.error('Property not found in database:', propertyOrLandId);
        return res.status(404).json({ message: "Property not found" });
      }

      const existing = await LandRequest.findOne({ userId, landId: propertyOrLandId });
      if (existing) {
        console.warn('Duplicate request detected for userId:', userId, 'propertyId:', propertyOrLandId);
        return res.status(400).json({ message: "You have already requested papers for this property" });
      }

      const newRequest = await LandRequest.create({ userId, landId: propertyOrLandId });
      console.log('Successfully created property paper request:', newRequest._id);

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
      console.error('Error in createPropertyRequest:', error.message);
      res.status(500).json({ message: "Error creating property request", error: error.message });
    }
  },

  getPropertyRequests: async (req, res) => {
    try {
      console.log('--- getPropertyRequests Controller Hit ---');
      const requests = await LandRequest.find()
        .populate("userId", "name phone email")
        .populate("landId", "title location");

      console.log(`Retrieved ${requests.length} property requests`);
      res.status(200).json({
        message: "Property requests retrieved successfully",
        data: requests,
      });
    } catch (error) {
      console.error('Error in getPropertyRequests:', error.message);
      res.status(500).json({ message: "Error retrieving property requests", error: error.message });
    }
  },
};
