const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  problem: String,
  design: String,
  feedback: [String],
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Design", designSchema);