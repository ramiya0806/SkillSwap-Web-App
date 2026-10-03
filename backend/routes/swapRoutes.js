const express = require("express");
const User = require("../models/User");
const SwapRequest = require("../models/SwapRequest");
const Notification = require("../models/Notification");

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const {
      senderEmail,
      receiverEmail,
      skillOffered,
      skillWanted
    } = req.body;

    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "Sender or receiver not found"
      });
    }

    const request = new SwapRequest({
      sender: sender._id,
      receiver: receiver._id,
      skillOffered,
      skillWanted
    });

    await request.save();

    const notification = new Notification({
  recipient: receiver._id,
  sender: sender._id,
  requestId: request._id,
  type: "swap_request",
  message: `${sender.name} sent you a skill swap request`,
  skillOffered,
  skillWanted
});

await notification.save();


    res.status(201).json({
      message: "Swap request sent successfully",
      request
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to send swap request",
      error: error.message
    });
  }
});

router.put("/respond/:requestId", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected"
      });
    }

    const request = await SwapRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        message: "Swap request not found"
      });
    }

    request.status = status;

    await request.save();
    
    const notification = new Notification({
  recipient: request.sender,
  sender: request.receiver,
  requestId: request._id,
  type:
    status === "accepted"
      ? "swap_accepted"
      : "swap_rejected",

  message:
    status === "accepted"
      ? "Your skill swap request has been accepted"
      : "Your skill swap request has been rejected"
});

await notification.save();

    res.json({
      message: `Swap request ${status}`,
      request
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update request",
      error: error.message
    });
  }
});

router.get("/my-requests/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const requests = await SwapRequest.find({
      $or: [
        { sender: user._id },
        { receiver: user._id }
      ]
    })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json({
      message: "Requests found",
      requests
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get requests",
      error: error.message
    });
  }
});

module.exports = router;