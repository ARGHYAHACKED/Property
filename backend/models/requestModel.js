const mongoose = require("mongoose");

// Used for property papers requests: userId + property id stored in landId (ref Property)
const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
