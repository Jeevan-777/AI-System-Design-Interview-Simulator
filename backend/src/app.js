require("dotenv").config();
console.log("Loaded ENV:", process.env.GEMINI_API_KEY);
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const designRoutes = require("./routes/designRoutes");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/design", designRoutes);

app.get("/", (req, res) => {
  res.send("AI System Design Simulator Backend Running");
});

const PORT = 5000;
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});