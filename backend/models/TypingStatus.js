const mongoose = require("mongoose")

const typingStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isTyping: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("TypingStatus", typingStatusSchema)