const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SwapRequest"
    },

    type: {
      type: String,
      enum: ["swap_request", "swap_accepted", "swap_rejected"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    skillOffered: {
      type: String
    },

    skillWanted: {
      type: String
    },

    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);