const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Ensure the required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing environment variables. Check your .env file.");
  process.exit(1);
}

// ✅ Load routes
const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcards"); // ✅ Ensures the flashcards route is loaded

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test API root
app.get("/", (req, res) => {
  res.send("✅ Flashcard App Backend is Running 🚀");
});

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes); // ✅ This must be present

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
