const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Flashcard = require("../models/Flashcard");

// ✅ Check if route is hit (DEBUGGING)
router.use((req, res, next) => {
  console.log("🔍 Flashcards Route Hit:", req.method, req.path);
  next();
});

// ✅ Get all flashcards
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching flashcards for user:", req.user.userId);
    const flashcards = await Flashcard.find({ userId: req.user.userId });
    res.json(flashcards);
  } catch (error) {
    console.error("❌ Error fetching flashcards:", error.message);
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

    console.log("📤 Creating flashcard for user:", req.user.userId);

    const newFlashcard = new Flashcard({
      userId: req.user.userId,
      question,
      answer,
    });

    await newFlashcard.save();
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error("❌ Error adding flashcard:", error.message);
    res.status(500).json({ message: "Server error while adding flashcard" });
  }
});

// ✅ Delete a flashcard
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("🗑️ Deleting flashcard ID:", req.params.id);
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: "Flashcard deleted" });
  } catch (error) {
    console.error("❌ Error deleting flashcard:", error.message);
    res.status(500).json({ message: "Error deleting flashcard" });
  }
});

module.exports = router;
