const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User=require("./models/User");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const matchRoutes = require("./routes/matchRoutes");
const swapRoutes = require("./routes/swapRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/swap", swapRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/",(req,res)=>{
    res.send("SkillSwap Backend is Running!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    

const PORT=5000;

app.listen(PORT,()=>{
    console.log("Server running on http://localhost:5000");
});

})
.catch((error)=>{
    console.log("MongoDB connection failed:",error.message);
});