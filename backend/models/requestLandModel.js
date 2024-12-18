const mongoose = require("mongoose");

const requestLandSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landId: { type: mongoose.Schema.Types.ObjectId, ref: "Land", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LandRequest", requestLandSchema);
