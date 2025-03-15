const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Flashcard = require("../models/Flashcard");

// ✅ Get all flashcards for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user.userId });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching flashcards" });
  }
});

// ✅ Add a new flashcard
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Both question and answer are required." });
    }

    const newFlashcard = new Flashcard({
      userId: req.user.userId,
      question,
      answer,
    });

    await newFlashcard.save();
    res.status(201).json(newFlashcard);
  } catch (error) {
    res.status(500).json({ message: "Server error while adding flashcard" });
  }
});

// ✅ Delete a flashcard
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: "Flashcard deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flashcard" });
  }
});

module.exports = router;
