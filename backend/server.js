const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Ensure environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing MONGO_URI or JWT_SECRET in .env file.");
  process.exit(1);
}

// ✅ Load Routes
const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcards"); // ✅ Register flashcards route

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Root API Test
app.get("/", (req, res) => {
  res.send("✅ Flashcard App Backend is Running 🚀");
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes); // ✅ Ensure this is included

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
