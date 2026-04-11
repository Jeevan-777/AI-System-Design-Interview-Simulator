import { useState, useEffect, useRef } from "react";

function DesignInput() {
  const [mode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode");
  });

  const [problem, setProblem] = useState("");
  const [design, setDesign] = useState("");
  const [feedback, setFeedback] = useState([]);
  const hasGenerated = useRef(false);

  // 🔥 Generate AI problem
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (mode === "interview" && token && !hasGenerated.current) {
      hasGenerated.current = true;

      fetch("http://localhost:5000/api/design/generate-problem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProblem(data.problem);
        })
        .catch(() => {
          alert("Failed to generate problem");
        });
    }
  }, [mode]);

  // 🔥 Submit design
  const handleSubmit = async () => {
    if (!problem || !design) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/design/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ problem, design }),
      });

      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  // 🔥 Parse feedback into sections
  const sections = {
    score: "",
    strengths: [],
    weakness: [],
    suggestions: [],
    missing: [],
    scalability: [],
    verdict: ""
  };

  let current = "";

  feedback.forEach((line) => {
    const l = line.toLowerCase();

    if (l.includes("score")) {
      sections.score = line;
    } else if (l.includes("strength")) {
      current = "strengths";
    } else if (l.includes("weakness")) {
      current = "weakness";
    } else if (l.includes("suggestion")) {
      current = "suggestions";
    } else if (l.includes("missing")) {
      current = "missing";
    } else if (l.includes("scalability")) {
      current = "scalability";
    } else if (l.includes("verdict")) {
      current = "verdict";
    } else if (line.startsWith("-")) {
      if (current !== "verdict") {
        sections[current].push(line.replace("-", "").trim());
      }
    } else {
      if (current === "verdict") {
        sections.verdict += line + " ";
      }
    }
  });

  return (
    <div style={{ padding: "40px" }}>
      <h1>
        {mode === "interview"
          ? "System Design Interview"
          : "Custom System Design Practice"}
      </h1>

      <h3>
        {mode === "interview"
          ? "AI Generated Problem"
          : "Enter Problem"}
      </h3>

      <input
        type="text"
        placeholder="e.g., Design Twitter"
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        disabled={mode === "interview"}
        style={{ width: "400px", padding: "8px" }}
      />

      <br /><br />

      <h3>Describe Your Design</h3>
      <textarea
        placeholder="Explain your architecture..."
        value={design}
        onChange={(e) => setDesign(e.target.value)}
        rows="8"
        cols="60"
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit Design</button>

      <br /><br />

      {/* 🔥 Structured Feedback UI */}
      {feedback.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>{sections.score}</h2>

          <h3>✅ Strengths</h3>
          <ul>
            {sections.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>⚠️ Weakness</h3>
          <ul>
            {sections.weakness.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>💡 Suggestions</h3>
          <ul>
            {sections.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>🚧 Missing Components</h3>
          <ul>
            {sections.missing.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>🚀 Scalability Tips</h3>
          <ul>
            {sections.scalability.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>🧠 Final Verdict</h3>
          <p>{sections.verdict}</p>
        </div>
      )}

      <br />

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default DesignInput;