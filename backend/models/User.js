const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  teachSkills: {
    type: [String],
    default: []
  },

  learnSkills: {
    type: [String],
    default: []
  },

  learningGoal: {
    type: String,
    default: ""
  },

  learningLevel: {
    type: String,
    default: "Beginner"
  }

});

module.exports = mongoose.model("User", userSchema);