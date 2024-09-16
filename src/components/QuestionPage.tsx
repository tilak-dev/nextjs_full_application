"use client";
import { useState } from "react";

export default function QuestionPage({ messageString  }: { messageString: string | null }) {
  // Initialize state with the messageString prop
  const [defaultQuestion, setDefaultQuestion] = useState(
    messageString || "What’s something you’ve always wanted to ask but never did? || What’s a memory that still makes you smile? || If you could change one thing about the world, what would it be?"
  );

  // Split the questions by "||"
  const questions = defaultQuestion.split(" || ");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Handle the "Next Question" button click
  const handleNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
  };

  // Copy the current question to the clipboard
  const copyToClipboard = async () => {
    try {
      const currentText = questions[currentQuestion];
      await navigator.clipboard.writeText(currentText);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="p-6 max-w-lg w-full bg-white shadow-md rounded-md text-center">
        <h1 className="text-xl font-bold mb-4">Anonymous Question</h1>
        <p className="text-lg text-gray-700 mb-6">{questions[currentQuestion]}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Copy
          </button>
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
