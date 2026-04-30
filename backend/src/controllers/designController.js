const User = require("../models/User");

// SAVE QUIZ RESULT
exports.saveQuizResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passed } = req.body;

    await User.findByIdAndUpdate(userId, {
      quizPassed: passed,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save quiz result" });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
};