const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing required environment variables (MONGO_URI or JWT_SECRET). Check your .env file.");
  process.exit(1);
}

const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcards"); // ✅ Ensure flashcards route is loaded

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Flashcard App Backend is Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes); // ✅ Register flashcards route

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
