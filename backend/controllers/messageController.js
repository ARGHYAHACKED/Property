const Message = require("../models/message");

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { name, phone, altPhone, mouja, plot, khatian, comment } = req.body;
    const token = req.cookies.token;
    console.log(token)


    if (!name || !phone || !mouja || !plot || !khatian) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Save to database
    const newMessage = new Message({
      name,
      phone,
      altPhone,
      mouja,
      plot,
      khatian,
      comment,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message created successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};