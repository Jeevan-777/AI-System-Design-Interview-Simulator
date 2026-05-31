import { useState } from "react";

function Level4() {
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
            level: "Level 4",
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
        "What is the purpose of a message queue?",
      options: [
        "Store images",
        "Handle asynchronous tasks",
        "Replace APIs",
        "Delete cache",
      ],
      answer: "Handle asynchronous tasks",
    },

    {
      question:
        "Which technology is commonly used as a message queue?",
      options: [
        "Redis",
        "Kafka",
        "MongoDB",
        "MySQL",
      ],
      answer: "Kafka",
    },

    {
      question:
        "What is an example of async processing?",
      options: [
        "Sending emails",
        "Refreshing browser",
        "Writing CSS",
        "Creating tables",
      ],
      answer: "Sending emails",
    },

    {
      question:
        "Why are queues useful in large systems?",
      options: [
        "Increase server crashes",
        "Reduce scalability",
        "Handle heavy workloads smoothly",
        "Delete requests",
      ],
      answer: "Handle heavy workloads smoothly",
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

    // ✅ Unlock Level 5
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
      completedLevel: 4,
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
        Level 4: Message Queues 📩
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
          Message queues are used to process tasks
          asynchronously in large-scale systems.
        </p>

        <p>
          Instead of processing everything instantly,
          systems place tasks into queues and process
          them later.
        </p>

        <p>
          This improves:
        </p>

        <ul>
          <li>⚡ Scalability</li>
          <li>⚡ Reliability</li>
          <li>⚡ Performance</li>
        </ul>

        <p>
          Popular queue technologies:
        </p>

        <ul>
          <li>Kafka</li>
          <li>RabbitMQ</li>
          <li>AWS SQS</li>
        </ul>

        <h3>✅ Queue Flow</h3>

        <div
          style={{
            background: "#0f172a",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          User → API → Queue → Worker → Database
        </div>

        <p style={{ marginTop: "20px" }}>
          Example:
        </p>

        <p>
          Instagram sending notifications or emails
          uses queues in the background.
        </p>
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
          placeholder="Ask queue questions..."
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
                  ✅ Passed!
                </h2>

                <p>
                  Level 5 unlocked 🚀
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/levels")
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
                  Back to Levels
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

export default Level4;