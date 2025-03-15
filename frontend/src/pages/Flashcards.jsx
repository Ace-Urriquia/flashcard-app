import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Flashcards.css";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://flashcard-app-backend.onrender.com/api/flashcards",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFlashcards(response.data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);

        // 🔥 FIX: Redirect only if unauthorized (401)
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchFlashcards();
  }, [navigate]);

  const handleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddFlashcard = async () => {
    const token = localStorage.getItem("token");

    // 🔥 FIX: Check if token is missing before sending request
    if (!token) {
      alert("Unauthorized! Please log in again.");
      return;
    }

    // 🔥 FIX: Prevent sending empty question or answer
    const newFlashcard = {
      question: question.trim(),
      answer: answer.trim(),
    };

    if (!newFlashcard.question || !newFlashcard.answer) {
      alert("Both question and answer are required.");
      return;
    }

    try {
      console.log("📤 Sending request to add flashcard:", newFlashcard);

      const response = await axios.post(
        "https://flashcard-app-backend.onrender.com/api/flashcards",
        newFlashcard,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Flashcard added:", response.data);
      setFlashcards([...flashcards, response.data]);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      // 🔥 FIX: Improved error handling
      console.error("❌ Error adding flashcard:", error.response?.data || error);
      alert(
        `Failed to add flashcard. ${
          error.response?.data?.message || "Please try again."
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://flashcard-app-backend.onrender.com/api/flashcards/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFlashcards(flashcards.filter((card) => card._id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert("Failed to delete flashcard. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flashcards-container">
      <h1>Flashcards</h1>
      <form
        className="add-flashcard-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddFlashcard();
        }}
      >
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <button type="submit">Add Flashcard</button>
        <button type="button" className="exit-button" onClick={handleLogout}>
          Exit
        </button>
      </form>
      <div className="flashcards-grid">
        {flashcards.map((card, index) => (
          <div
            key={card._id}
            className={`flashcard ${flipped[index] ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">{card.question}</div>
              <div className="flashcard-back">{card.answer}</div>
            </div>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(card._id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
