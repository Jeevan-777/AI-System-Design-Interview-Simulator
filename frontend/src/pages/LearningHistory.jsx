import { useEffect, useState } from "react";

function LearningHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/design/learning-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch(() => alert("Failed to load history"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Saved Learnings 📚</h1>

      {data.length === 0 && <p>No saved explanations yet.</p>}

      {data.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "20px 0",
          }}
        >
          <h3>{item.system}</h3>

          <p style={{ whiteSpace: "pre-line" }}>
            {item.explanation}
          </p>

          <small>
            {new Date(item.createdAt).toLocaleString()}
          </small>
        </div>
      ))}

      <br />

      <button onClick={() => (window.location.href = "/learning")}>
        Back
      </button>
    </div>
  );
}

export default LearningHistory;