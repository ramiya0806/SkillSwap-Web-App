const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills,
        learningGoal: user.learningGoal,
        learningLevel: user.learningLevel
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills,
        learningGoal: user.learningGoal,
        learningLevel: user.learningLevel
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


// GET USER PROFILE
router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message
    });
  }
});


// UPDATE LEARNING GOAL
router.put("/learning-goal", async (req, res) => {
  try {
    const {
      email,
      learningGoal,
      learningLevel
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.learningGoal = learningGoal;
    user.learningLevel = learningLevel;

    await user.save();

    res.json({
      message: "Learning goal updated successfully",
      learningGoal: user.learningGoal,
      learningLevel: user.learningLevel
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update learning goal",
      error: error.message
    });
  }
});


module.exports = router;