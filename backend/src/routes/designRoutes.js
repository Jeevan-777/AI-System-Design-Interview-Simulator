const express = require("express");
const router = express.Router();
const Design = require("../models/Design");
const protect = require("../middleware/authMiddleware");
const Learning = require("../models/Learning");
const { saveQuizResult, getMe } = require("../controllers/designController");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("ENV KEY:", process.env.GEMINI_API_KEY);

router.post("/evaluate", protect, async (req, res) =>  {
  const { problem, design } = req.body;
  const userId = req.user.id; // ✅ from JWT

  if (!problem || !design) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `You are a system design interviewer.

       Evaluate this system design strictly.

       Problem: ${problem}
       Design: ${design}

       Give response in this format:

       Score: X/10

       Strengths:
       - point 1
       - point 2

       Weakness:
       - point 1
       - point 2

       Suggestions:
       - point 1
       - point 2

       Missing Components:
       - point 1
       - point 2

       Scalability Tips:
       - point 1
       - point 2

       Final Verdict:
       - Short summary of overall design quality`
    );

    const response = await result.response;
    const text = response.text();

    const lines = text.split("\n");

    let score = null;

    const scoreLine = lines.find(line =>
      line.toLowerCase().includes("score")
    );

    if (scoreLine) {
      score = parseInt(scoreLine.match(/\d+/)?.[0]) || null;
    }

    const feedbackArray = lines;

    // ✅ SAVE TO DATABASE
    const newDesign = new Design({
      userId: userId,
      problem,
      design,
      feedback: feedbackArray,
      score: score,
    });

    await newDesign.save();

    // ✅ SEND RESPONSE
    res.json({ feedback: feedbackArray });

  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({
      feedback: ["AI failed. Check backend logs."],
    });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const designs = await Design.find({
    userId: req.user.id   // ✅ from token
  }).sort({ createdAt: -1 });

    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

router.get("/generate-problem", protect, async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Generate ONE system design interview question.

       Example format:
       Design Instagram

       Only give one short problem statement. No explanation.`
    );

    const response = await result.response;
    const text = response.text().trim();

    res.json({ problem: text });

  } catch (err) {
    res.status(500).json({ message: "Failed to generate problem" });
  }
});

router.get("/analytics", protect, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user.id })
      .sort({ createdAt: 1 });

    const total = designs.length;

    const scoresArray = designs.map(d => d.score || 0);

    const average =
      total > 0
        ? (scoresArray.reduce((a, b) => a + b, 0) / total).toFixed(2)
        : 0;

    const best = total > 0 ? Math.max(...scoresArray) : 0;

    const scores = designs.map((d, index) => ({
      attempt: index + 1,
      score: d.score || 0,
    }));

    res.json({
      total,
      average,
      best,
      scores, // ✅ for graph
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

router.post("/explain-system", protect, async (req, res) => {
  const { system } = req.body;

  if (!system) {
    return res.status(400).json({ message: "System name required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

   const result = await model.generateContent(
  `Explain the system design of ${system} in a simple and structured way.

   Include:
   - Key components
   - Architecture overview
   - How scaling is handled
   - Simple explanation (for beginners)

   Keep it concise and clear.`
);

    const response = await result.response;
    const text = response.text();

    res.json({ explanation: text });

  } catch (err) {
    res.status(500).json({ message: "Failed to generate explanation" });
  }
});

router.post("/save-explanation", protect, async (req, res) => {
  const { system, explanation } = req.body;

  if (!system || !explanation) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const newEntry = new Learning({
      userId: req.user.id,
      system,
      explanation,
    });

    await newEntry.save();

    res.json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save" });
  }
});

router.get("/learning-history", protect, async (req, res) => {
  try {
    const data = await Learning.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch learning history" });
  }
});

module.exports = router;