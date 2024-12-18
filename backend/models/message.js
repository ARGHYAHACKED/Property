const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  altPhone: {
    type: String,
  },
  mouja: {
    type: String,
    required: true,
  },
  plot: {
    type: String,
    required: true,
  },
  khatian: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
