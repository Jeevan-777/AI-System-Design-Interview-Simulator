import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [data, setData] = useState({
    total: 0,
    average: 0,
    best: 0,
    scores: []
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    fetch("http://localhost:5000/api/design/analytics", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        console.log(resData); 
      })
      .catch(() => alert("Failed to load analytics"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Analytics Dashboard 📊</h1>

      <h3>Total Attempts: {data.total}</h3>
      <h3>Average Score: {data.average}/10</h3>
      <h3>Best Score: {data.best}/10 ⭐</h3>
      <br></br>
      {data.scores && data.scores.length > 0 && (
    <div style={{ marginTop: "40px" }}>
      <h2>Score Trend 📈</h2>

     <LineChart width={700} height={300} data={data.scores}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="attempt" />
         <YAxis domain={[0, 10]} />
         <Tooltip />
         <Line type="monotone" dataKey="score" />
      </LineChart>
  </div>
)}

      <br />

      <button onClick={() => window.location.href = "/dashboard"}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Analytics;