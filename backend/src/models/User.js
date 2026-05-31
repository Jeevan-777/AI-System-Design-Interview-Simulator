const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    quizPassed: {
      type: Boolean,
      default: false,
    },

    learningProgress: {
      unlockedLevel: {
        type: Number,
        default: 1,
      },

      completedLevels: {
        type: [Number],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);