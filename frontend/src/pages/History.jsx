import { useEffect, useState } from "react";

function History() {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  fetch("http://localhost:5000/api/design/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setDesigns(data))
    .catch(() => alert("Failed to load history"));
}, []);
   

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Design History</h1>

      {designs.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            margin: "20px 0",
            padding: "15px",
          }}
        >
          <h3>Problem: {item.problem}</h3>
          <p><b>Design:</b> {item.design}</p>
           <h2>Score: {item.score}/10 ⭐</h2>
          <h4>Feedback:</h4>
        <ul>
            {item.feedback
             .filter(line => !line.toLowerCase().includes("score"))
             .map((f, i) => (
            <li key={i}>{f}</li>
            ))}
        </ul>

          <small>
            {new Date(item.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default History;