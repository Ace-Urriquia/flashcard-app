const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Flashcard = require("../models/Flashcard");


// Get all flashcards for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
     if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    
    console.log("🔍 Fetching flashcards for user:", req.user.userId); 
    const flashcards = await Flashcard.find({ userId: req.user.userId }); 

    



    res.json(flashcards);
  } catch (error) {
    console.error("❌ Error fetching flashcards:", error.message);
    res.status(500).json({ message: "Server error while fetching flashcards" });
  }
});

// Add a new flashcard
router.post("/", authMiddleware, async (req, res) => {

  console.log("🔍 Authenticated user data:", req.user);
  const { question, answer } = req.body;

  if (!question || !answer) {
    console.log("❌ Missing question or answer in request body");
    return res.status(400).json({ message: "Both question and answer are required" });
  }

   if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

  
  // 🔥 Add these logs here
  console.log("👤 User ID in request:", req.user?.userId);
  console.log("📋 Incoming Data:", req.body);

  try {
    const newFlashcard = new Flashcard({
      userId: req.user.userId,
      question,
      answer,
    });

    await newFlashcard.save();
    console.log("✅ Flashcard added successfully");
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error("❌ Error adding flashcard:", error.message);
    res.status(500).json({ message: "Server error while adding flashcard" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Flashcard deleted" });
});


module.exports = router;
