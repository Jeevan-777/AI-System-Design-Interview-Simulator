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

      const data = await res.json();
      setResult(data.explanation);
    } catch {
      alert("Failed to fetch explanation");
    }
  };

  // 🔥 SAVE FUNCTION (ADDED)
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/api/design/save-explanation", {
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

      alert("Saved successfully ✅");
    } catch {
      alert("Failed to save");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>System Design Learning 📘</h1>

      {/* 🔥 AI Learning Assistant */}
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

      {/* 🔹 Result + SAVE BUTTON */}
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

      {/* 🔥 Topics */}
      <h2 style={{ marginTop: "40px" }}>Select a Topic</h2>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => window.location.href = "/learning/load-balancer"}>
          Load Balancer
        </button>

        <br /><br />

        <button onClick={() => window.location.href = "/learning/database"}>
          Database
        </button>

        <br /><br />

        <button onClick={() => window.location.href = "/learning/cache"}>
          Cache (Redis)
        </button>

        <br /><br />

        <button onClick={() => window.location.href = "/learning/queue"}>
          Message Queue
        </button>
      </div>

      <br /><br />

      <button onClick={() => window.location.href = "/learning-history"}>
        View Saved Learnings 📚
      </button>
      <br></br>

      <button onClick={() => window.location.href = "/dashboard"}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Learning;