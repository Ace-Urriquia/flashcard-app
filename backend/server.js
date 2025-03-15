const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Ensure required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing required environment variables (MONGO_URI or JWT_SECRET). Check your .env file.");
  process.exit(1); // Stop the server if critical variables are missing
}

const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcards");

const app = express();

// ✅ Improved CORS to allow both production & local development
const allowedOrigins = [
  "https://flashcard-app-frontend-aceurriquia.onrender.com",
  "http://localhost:5173" // Add your local development URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS Not Allowed"));
    }
  },
  credentials: true
}));

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
