const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  skillOffered: {
    type: String,
    required: true
  },

  skillWanted: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("SwapRequest", swapRequestSchema);