import { useState } from "react";

function DesignInput() {
  const [problem, setProblem] = useState("");
  const [design, setDesign] = useState("");
  const [feedback, setFeedback] = useState([]);

  const handleSubmit = async () => {
  if (!problem || !design) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/design/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problem, design }),
    });

    const data = await res.json();
    setFeedback(data.feedback || ["No feedback received"]);
 

  } catch (err) {
    alert("Error connecting to backend");
  }
};

  return (
    <div style={{ padding: "40px" }}>
      <h1>System Design Interview</h1>

      <h3>Enter Problem</h3>
      <input
        type="text"
        placeholder="e.g., Design Twitter"
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
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
        {feedback.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <h3>Feedback</h3>
    <ul>
       {feedback.map((f, index) => (
          <li key={index}>{f}</li>
      ))}
    </ul>
    </div>
)}

      <button onClick={() => window.location.href = "/dashboard"}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default DesignInput;