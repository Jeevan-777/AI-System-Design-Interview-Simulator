import { useEffect, useState } from "react";

function Levels() {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/design/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setUnlockedLevel(data.unlockedLevel || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const levels = [
    {
      id: 1,
      title: "Level 1: Request Flow",
      description:
        "Learn how requests move through a system.",
    },

    {
      id: 2,
      title: "Level 2: Databases",
      description:
        "Understand SQL, NoSQL, and data storage.",
    },

    {
      id: 3,
      title: "Level 3: Caching",
      description:
        "Learn Redis, caching strategies, and speed optimization.",
    },

    {
      id: 4,
      title: "Level 4: Queues",
      description:
        "Understand asynchronous processing and message queues.",
    },

    {
      id: 5,
      title: "Level 5: Scalability",
      description:
        "Learn scaling, replication, and high availability.",
    },
  ];

  const handleOpenLevel = (levelId) => {
    if (levelId <= unlockedLevel) {
      window.location.href = `/levels/level${levelId}`;
    } else {
      alert("🔒 Complete previous levels first");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b1020",
          color: "white",
        }}
      >
        Loading Levels...
      </div>
    );
  }

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
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        System Design Levels 🚀
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "40px",
        }}
      >
        Progress: Level {unlockedLevel} / 5
      </p>

      {/* Levels Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {levels.map((level) => {
          const unlocked = level.id <= unlockedLevel;

          return (
            <div
              key={level.id}
              style={{
                background: unlocked
                  ? "#151b2e"
                  : "#1a1a1a",
                border: unlocked
                  ? "2px solid #4f46e5"
                  : "2px solid #444",
                borderRadius: "15px",
                padding: "25px",
                opacity: unlocked ? 1 : 0.6,
                transition: "0.3s",
              }}
            >
              <h2>{level.title}</h2>

              <p
                style={{
                  marginTop: "15px",
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                }}
              >
                {level.description}
              </p>

              <div style={{ marginTop: "20px" }}>
                {unlocked ? (
                  <span
                    style={{
                      color: "#22c55e",
                      fontWeight: "bold",
                    }}
                  >
                    🔓 Unlocked
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    🔒 Locked
                  </span>
                )}
              </div>

              <button
                onClick={() =>
                  handleOpenLevel(level.id)
                }
                style={{
                  marginTop: "25px",
                  width: "100%",
                  padding: "12px",
                  background: unlocked
                    ? "#4f46e5"
                    : "#444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: unlocked
                    ? "pointer"
                    : "not-allowed",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                {unlocked
                  ? "Start Level 🚀"
                  : "Locked 🔒"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() =>
            (window.location.href = "/learning")
          }
          style={{
            marginTop: "50px",
            padding: "12px 25px",
            background: "#374151",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Learning
        </button>
      </div>
    </div>
  );
}

export default Levels;