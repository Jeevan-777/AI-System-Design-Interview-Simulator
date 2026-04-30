import { useState } from "react";

function Learning() {
  const [system, setSystem] = useState("");
  const [result, setResult] = useState("");

  // 🔥 Explain system
  const handleExplain = async () => {
    const token = localStorage.getItem("token");

    if (!system) {
      alert("Enter system name");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/design/explain-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ system }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error from server");
        return;
      }

      const data = await res.json();
      setResult(data.explanation);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch explanation");
    }
  };

  // 🔥 SAVE FUNCTION
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!result) {
      alert("Nothing to save");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/design/save-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          system,
          explanation: result,
        }),
      });

      if (!res.ok) {
        alert("Save failed");
        return;
      }

      alert("Saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>System Design Learning 📘</h1>

      {/* AI Learning */}
      <h2 style={{ marginTop: "30px" }}>AI Learning Assistant 🤖</h2>

      <input
        type="text"
        placeholder="e.g., Design Instagram"
        value={system}
        onChange={(e) => setSystem(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <br /><br />

      <button onClick={handleExplain}>Explain</button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Explanation</h3>
          <p style={{ whiteSpace: "pre-line" }}>{result}</p>

          <br />

          <button onClick={handleSave}>
            Save Explanation 💾
          </button>
        </div>
      )}

      {/* STEP 1 */}
      <h2 style={{ marginTop: "40px" }}>Step 1: Learn Concepts</h2>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => (window.location.href = "/learning/load-balancer")}>
          Load Balancer
        </button>

        <br /><br />

        <button onClick={() => (window.location.href = "/learning/database")}>
          Database
        </button>

        <br /><br />

        <button onClick={() => (window.location.href = "/learning/cache")}>
          Cache (Redis)
        </button>

        <br /><br />

        <button onClick={() => (window.location.href = "/learning/queue")}>
          Message Queue
        </button>
      </div>

      {/* STEP 2 */}
      <h2 style={{ marginTop: "40px" }}>Step 2: Test Your Knowledge</h2>

      <button onClick={() => (window.location.href = "/learning/quiz")}>
        Take Quiz
      </button>

      {/* STEP 3 */}
      <h2 style={{ marginTop: "40px" }}>Step 3: System Design Levels</h2>

      <button
        onClick={() => {
          const passed = localStorage.getItem("quizPassed");
          if (passed === "true") {
            window.location.href = "/levels";
          } else {
            alert("⚠️ Complete quiz first (minimum 50%)");
          }
        }}
      >
        Start Levels
      </button>

      <br /><br />

      <button onClick={() => (window.location.href = "/learning-history")}>
        View Saved Learnings 📚
      </button>

      <br /><br />

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Learning;