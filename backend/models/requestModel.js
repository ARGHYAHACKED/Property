const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landId: { type: mongoose.Schema.Types.ObjectId, ref: "Land", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
