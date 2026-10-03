const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const TypingStatus = require("../models/TypingStatus");
const OnlineStatus = require("../models/OnlineStatus");

const router = express.Router();

// Send message
router.post("/send", async (req, res) => {
  try {
    const { senderEmail, receiverEmail, message } = req.body;

    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    console.log("Sender Email:",senderEmail);
    console.log("Receiver Email:",receiverEmail);

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "Sender or receiver not found"
      });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      message
    });

    await newMessage.save();

    const savedMessage = await Message.findById(newMessage._id)
    .populate("sender", "email")
    .populate("receiver", "email");

    res.status(201).json({
      message: "Message sent successfully",
      newMessage:savedMessage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message
    });
  }
});

router.post("/typing", async (req, res) => {
  try {
    const { userEmail, partnerEmail, isTyping } = req.body

    const user = await User.findOne({
      email: userEmail
    })

    const partner = await User.findOne({
      email: partnerEmail
    })

    if (!user || !partner) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    await TypingStatus.findOneAndUpdate(
      {
        user: user._id,
        partner: partner._id
      },
      {
        isTyping
      },
      {
        upsert: true,
        new: true
      }
    )

    res.json({
      message: "Typing status updated"
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to update typing status",
      error: error.message
    })
  }
})

router.get("/typing/:userEmail/:partnerEmail", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.userEmail
    })

    const partner = await User.findOne({
      email: req.params.partnerEmail
    })

    if (!user || !partner) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const typingStatus = await TypingStatus.findOne({
      user: user._id,
      partner: partner._id
    })

    if (!typingStatus) {
      return res.json({
        isTyping: false
      })
    }

    // Typing status expires after 3 seconds
    const currentTime = Date.now()
    const updatedTime = new Date(typingStatus.updatedAt).getTime()

    const isRecentlyTyping =
      typingStatus.isTyping &&
      currentTime - updatedTime < 3000

    res.json({
      isTyping: isRecentlyTyping
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to get typing status",
      error: error.message
    })
  }
})

router.get("/unread/:email/:partnerEmail", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    })

    const partner = await User.findOne({
      email: req.params.partnerEmail
    })

    if (!user || !partner) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const unreadCount = await Message.countDocuments({
      receiver: user._id,
      sender: partner._id,
      seen: false
    })

    res.json({
      unreadCount
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to get unread messages",
      error: error.message
    })
  }
})


router.get("/unread/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const unreadCount = await Message.countDocuments({
      receiver: user._id,
      seen: false
    })

    res.json({
      unreadCount
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to get unread messages",
      error: error.message
    })
  }
})

router.put("/seen/:email/:partnerEmail", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    })

    const partner = await User.findOne({
      email: req.params.partnerEmail
    })

    if (!user || !partner) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    await Message.updateMany(
      {
        sender: partner._id,
        receiver: user._id,
        seen: false
      },
      {
        $set: {
          seen: true
        }
      }
    )

    res.json({
      message: "Messages marked as seen"
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to mark messages as seen",
      error: error.message
    })
  }
})

router.get("/online/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const onlineStatus = await OnlineStatus.findOne({
      user: user._id
    })

    res.json({
      isOnline: onlineStatus ? onlineStatus.isOnline : false
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to get online status",
      error: error.message
    })
  }
})

// Get chat messages
router.get("/:senderEmail/:receiverEmail", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;

    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: sender._id,
          receiver: receiver._id
        },
        {
          sender: receiver._id,
          receiver: sender._id
        }
      ]
    })
    .populate("sender", "email")
    .populate("receiver", "email")
    .sort({ createdAt: 1 });

    res.json({
      messages
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get messages",
      error: error.message
    });
  }
});

router.post("/online", async (req, res) => {
  try {
    const { email, isOnline } = req.body

    console.log("ONLINE STATUS:", email, isOnline)

    const user = await User.findOne({
      email
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    await OnlineStatus.findOneAndUpdate(
      {
        user: user._id
      },
      {
        isOnline
      },
      {
        upsert: true
      }
    )

    res.json({
      message: "Online status updated"
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to update online status",
      error: error.message
    })
  }
})

module.exports = router;