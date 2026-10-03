const mongoose = require("mongoose")

const onlineStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    isOnline: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("OnlineStatus", onlineStatusSchema)