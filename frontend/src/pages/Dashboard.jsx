import { useEffect, useState } from "react";

function Dashboard() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.userId);
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleStartInterview = () => {
  window.location.href = "/design?mode=interview";
  };

  const handleCustomProblem = () => {
   window.location.href = "/design?mode=custom";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>AI System Design Dashboard</h1>

      <p>Welcome! User ID: {userId}</p>

      <h2 style={{ marginTop: "30px" }}>Choose Interview Mode</h2>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleStartInterview}>
          Start System Design Interview
        </button>

        <br /><br />

        <button onClick={handleCustomProblem}>
          Custom System Design Problem
        </button>
      </div>

      <br /><br />

      <button onClick={() => window.location.href = "/history"}>
       View History
      </button>
      <br/><br/>

      <button onClick={() => window.location.href = "/analytics"}>
       View Analytics 📊
     </button><br></br>

     <button onClick={() => window.location.href = "/learning"}>
       Learning Mode 📘
     </button>
     <br></br>

     <button onClick={() => window.location.href = "/builder"}>
        Architecture Builder 🧱
     </button>
     <br></br>
     
    <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;