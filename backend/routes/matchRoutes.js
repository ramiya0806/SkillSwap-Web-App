const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/:email", async (req, res) => {
  try {
    const currentUser = await User.findOne({
      email: req.params.email
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const users = await User.find({
      email: { $ne: currentUser.email }
    });

    const matches = users.filter((user) => {
      const teachMatch = user.teachSkills.some((skill) =>
        currentUser.learnSkills.includes(skill)
      );

      const learnMatch = user.learnSkills.some((skill) =>
        currentUser.teachSkills.includes(skill)
      );

      return teachMatch && learnMatch;
    });

    const safeMatches = matches.map((user) => ({
         id: user._id,
         name: user.name,
         email: user.email,
         teachSkills: user.teachSkills,
         learnSkills: user.learnSkills
}));

    res.json({
         message: "Matching users found",
         matches: safeMatches
});

  } catch (error) {
    res.status(500).json({
      message: "Failed to find matches",
      error: error.message
    });
  }
});

module.exports = router;