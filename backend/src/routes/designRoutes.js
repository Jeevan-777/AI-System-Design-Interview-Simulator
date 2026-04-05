const express = require("express");
const router = express.Router();
const Design = require("../models/Design");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("ENV KEY:", process.env.GEMINI_API_KEY);

router.post("/evaluate", async (req, res) => {
  const { problem, design } = req.body;

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
      `
    );

    const response = await result.response;
    const text = response.text();

    const lines = text.split("\n");

    let score = null;

    const scoreLine = lines.find(line =>
      line.toLowerCase().includes("score")
    );

    if (scoreLine) {
      score = scoreLine.match(/\d+/)?.[0] || null;
    }

    const feedbackArray = lines;

    // ✅ SAVE TO DATABASE
    const newDesign = new Design({
      userId: null,
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

router.get("/history", async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

module.exports = router;