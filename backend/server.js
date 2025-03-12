const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes"); // Correct name


const app = express();

app.use(cors({ origin: "https://flashcard-app-frontend-aceurriquia.onrender.com", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Flashcard App Backend is Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
