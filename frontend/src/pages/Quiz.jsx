import { useState } from "react";

function Quiz() {
  const questions = [
    {
      question: "What is the main purpose of a Load Balancer?",
      options: [
        "Store data",
        "Distribute traffic",
        "Cache images",
        "Send emails",
      ],
      answer: "Distribute traffic",
    },

    {
      question: "Which component will store persistent data?",
      options: ["Cache", "Queue", "Database", "Load Balancer"],
      answer: "Database",
    },

    {
      question: "What does Cache improve?",
      options: [
        "Network cables",
        "Data access speed",
        "Screen resolution",
        "Code formatting",
      ],
      answer: "Data access speed",
    },

    {
      question: "What is the purpose of a Message Queue?",
      options: [
        "Handle async tasks",
        "Store passwords",
        "Balance traffic",
        "Replace database",
      ],
      answer: "Handle async tasks",
    },

    {
      question: "Which flow is correct?",
      options: [
        "User → Database → API",
        "User → Load Balancer → API → Database",
        "Database → User → Cache",
        "Queue → API → User",
      ],
      answer: "User → Load Balancer → API → Database",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ Select answer
  const handleOptionChange = (qIndex, option) => {
    setAnswers({
      ...answers,
      [qIndex]: option,
    });
  };

  // ✅ Submit quiz
  const handleSubmit = async () => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    // ✅ Pass condition
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/design/update-quiz-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quizPassed: correct >= 3,
      }),
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>System Design Quiz 🧠</h1>

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
        }}
      >
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            style={{
              marginBottom: "30px",
              padding: "20px",
              background: "#151b2e",
              borderRadius: "10px",
            }}
          >
            <h3>
              {qIndex + 1}. {q.question}
            </h3>

            <div style={{ marginTop: "15px" }}>
              {q.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={option}
                    checked={answers[qIndex] === option}
                    onChange={() => handleOptionChange(qIndex, option)}
                    style={{ marginRight: "10px" }}
                  />

                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        {!submitted && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 30px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit Quiz 🚀
            </button>
          </div>
        )}

        {/* Result */}
        {submitted && (
          <div
            style={{
              marginTop: "40px",
              padding: "25px",
              background: "#151b2e",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2>
              Your Score: {score} / {questions.length}
            </h2>

            {score >= 3 ? (
              <>
                <h2 style={{ color: "#22c55e" }}>✅ Passed!</h2>

                <p>Levels are now unlocked 🚀</p>

                <button
                  onClick={() => (window.location.href = "/levels")}
                  style={{
                    marginTop: "20px",
                    padding: "12px 25px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Start Levels
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: "#ef4444" }}>❌ Failed</h2>

                <p>Minimum 3/5 required to pass</p>

                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: "20px",
                    padding: "12px 25px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Retry Quiz
                </button>
              </>
            )}

            <br />
            <br />

            <button
              onClick={() => (window.location.href = "/learning")}
              style={{
                padding: "10px 20px",
                background: "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Back to Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
