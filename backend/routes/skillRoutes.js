const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { email, teachSkill, learnSkill } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (teachSkill && !user.teachSkills.includes(teachSkill)) {
        user.teachSkills.push(teachSkill);
    }

    if (learnSkill && !user.learnSkills.includes(learnSkill)) {
       user.learnSkills.push(learnSkill);
    }
    
    user.teachSkills = [...new Set(user.teachSkills)];
    user.learnSkills = [...new Set(user.learnSkills)];
    
    await user.save();

    res.json({
      message: "Skills added successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add skills",
      error: error.message
    });
  }
});

module.exports = router;