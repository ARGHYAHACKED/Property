const mongoose = require('mongoose');
const LandRequest = require('../models/requestLandModel');

exports.createLandRequest = async (req, res) => {
  const { landId } = req.body;

  // Ensure `req.user` is available
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user._id; // Get user ID from the authenticated user object

  if (!mongoose.Types.ObjectId.isValid(landId)) {
    return res.status(400).json({ error: 'Invalid land ID' });
  }

  try {
    // Check if the request already exists
    const existingRequest = await LandRequest.findOne({ userId, landId });
    if (existingRequest) {
      return res.status(400).json({ error: 'Request already exists for this land' });
    }

    // Create a new land request
    const landRequest = new LandRequest({ userId, landId });
    await landRequest.save();

    res.status(201).json({ message: 'Land request created successfully', data: landRequest });
  } catch (error) {
    console.error('Error creating land request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLandRequests = async (req, res) => {
  try {
    const landRequests = await LandRequest.find().populate('userId', 'name email').populate('landId', 'title area price location');
    res.status(200).json({ data: landRequests });
  } catch (error) {
    console.error('Error fetching land requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

