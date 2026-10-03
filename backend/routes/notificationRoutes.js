const express = require("express");
const Notification = require("../models/Notification");
const User = require("../models/User");

const router = express.Router();

// Get notifications for a user
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const notifications = await Notification.find({
      recipient: user._id
    })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json({
      notifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get notifications",
      error: error.message
    });
  }
});

module.exports = router;