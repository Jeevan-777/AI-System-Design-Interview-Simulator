import { useState } from "react";

function Level5() {
  // 🤖 AI states
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // 🧪 Quiz states
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 🤖 Ask AI
  const handleAskAI = async () => {
    if (!aiInput) {
      alert("Enter your question");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/design/ask-learning-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: aiInput,
            level: "Level 5",
          }),
        }
      );

      const data = await res.json();

      setAiResponse(data.answer);

    } catch (err) {
      console.error(err);
      alert("AI failed");
    }
  };

  // 🧪 Questions
  const questions = [
    {
      question:
        "What is horizontal scaling?",
      options: [
        "Adding more servers",
        "Increasing RAM only",
        "Deleting databases",
        "Removing APIs",
      ],
      answer: "Adding more servers",
    },

    {
      question:
        "What is vertical scaling?",
      options: [
        "Adding multiple users",
        "Increasing server power",
        "Using queues",
        "Caching data",
      ],
      answer: "Increasing server power",
    },

    {
      question:
        "What is replication used for?",
      options: [
        "Reduce availability",
        "Backup and high availability",
        "Delete traffic",
        "Stop databases",
      ],
      answer: "Backup and high availability",
    },

    {
      question:
        "What is the purpose of a CDN?",
      options: [
        "Store passwords",
        "Speed up content delivery",
        "Replace APIs",
        "Delete cache",
      ],
      answer: "Speed up content delivery",
    },
  ];

  // 🧪 Select answer
  const handleOptionChange = (qIndex, option) => {
    setAnswers({
      ...answers,
      [qIndex]: option,
    });
  };

  // 🧪 Submit quiz
  const handleSubmitQuiz = async() => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    // ✅ Final Completion
    if (correct >= 2) {
      const token = localStorage.getItem("token");

  await fetch(
  "http://localhost:5000/api/design/update-progress",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      unlockedLevel: 5,
      completedLevel: 5,
    }),
  }
);
    }
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
      {/* Heading */}
      <h1 style={{ textAlign: "center" }}>
        Level 5: Scalability 🚀
      </h1>

      {/* 📘 Learn Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          background: "#151b2e",
          padding: "30px",
          borderRadius: "15px",
          lineHeight: "1.8",
        }}
      >
        <h2>📘 Learn Content</h2>

        <p>
          Scalability means handling increasing
          traffic and users efficiently.
        </p>

        <p>
          Large systems like Netflix and YouTube
          must scale to support millions of users.
        </p>

        <h3>⚡ Types of Scaling</h3>

        <ul>
          <li>
            <b>Vertical Scaling</b> → Increase
            CPU/RAM of a server
          </li>

          <li>
            <b>Horizontal Scaling</b> → Add more
            servers
          </li>
        </ul>

        <h3>⚡ Replication</h3>

        <p>
          Replication copies data across multiple
          servers for:
        </p>

        <ul>
          <li>High availability</li>
          <li>Fault tolerance</li>
          <li>Backup systems</li>
        </ul>

        <h3>⚡ CDN</h3>

        <p>
          CDN (Content Delivery Network) helps
          deliver images/videos faster from nearby
          locations.
        </p>

        <h3>✅ Scaling Flow</h3>

        <div
          style={{
            background: "#0f172a",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          User → CDN → Load Balancer → Multiple
          Servers → Database
        </div>
      </div>

      {/* 🤖 Ask AI */}
      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          background: "#151b2e",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
        <h2>🤖 Ask AI</h2>

        <input
          type="text"
          placeholder="Ask scalability questions..."
          value={aiInput}
          onChange={(e) =>
            setAiInput(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            marginTop: "15px",
          }}
        />

        <button
          onClick={handleAskAI}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Ask AI 🚀
        </button>

        {aiResponse && (
          <div
            style={{
              marginTop: "25px",
              background: "#0f172a",
              padding: "20px",
              borderRadius: "10px",
              whiteSpace: "pre-line",
            }}
          >
            {aiResponse}
          </div>
        )}
      </div>

      {/* 🧪 Quiz */}
      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          background: "#151b2e",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
        <h2>🧪 Quiz</h2>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            style={{
              marginTop: "30px",
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
                    checked={
                      answers[qIndex] === option
                    }
                    onChange={() =>
                      handleOptionChange(
                        qIndex,
                        option
                      )
                    }
                    style={{
                      marginRight: "10px",
                    }}
                  />

                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        {!submitted && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmitQuiz}
              style={{
                marginTop: "40px",
                padding: "12px 30px",
                background: "#22c55e",
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
              background: "#0f172a",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2>
              Score: {score} / {questions.length}
            </h2>

            {score >= 2 ? (
              <>
                <h2
                  style={{
                    color: "#22c55e",
                  }}
                >
                  🎉 Congratulations!
                </h2>

                <p>
                  You completed the System Design
                  Learning Path 🚀
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/dashboard")
                  }
                  style={{
                    marginTop: "20px",
                    padding: "12px 25px",
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Back to Dashboard
                </button>
              </>
            ) : (
              <>
                <h2
                  style={{
                    color: "#ef4444",
                  }}
                >
                  ❌ Failed
                </h2>

                <p>
                  Minimum 2/4 required
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
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
                  Retry
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Level5;