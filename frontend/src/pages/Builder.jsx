import { useState, useEffect } from "react";

/* ─── Component Icons ─────────────────────────────────────────────────── */
const ICONS = {
  User: "👤",
  "Load Balancer": "⚖️",
  "API Gateway": "🔀",
  "API Server": "🖥️",
  Database: "🗄️",
  Cache: "⚡",
  Queue: "📬",
};

const NODE_COLORS = {
  User: { bg: "#1e3a5f", border: "#3b82f6", glow: "rgba(59,130,246,0.35)" },
  "Load Balancer": { bg: "#1e3f2f", border: "#22c55e", glow: "rgba(34,197,94,0.35)" },
  "API Gateway": { bg: "#3f2a1e", border: "#f97316", glow: "rgba(249,115,22,0.35)" },
  "API Server": { bg: "#2e1e3f", border: "#a855f7", glow: "rgba(168,85,247,0.35)" },
  Database: { bg: "#1e2e3f", border: "#06b6d4", glow: "rgba(6,182,212,0.35)" },
  Cache: { bg: "#3f3a1e", border: "#eab308", glow: "rgba(234,179,8,0.35)" },
  Queue: { bg: "#3f1e2e", border: "#ec4899", glow: "rgba(236,72,153,0.35)" },
};

/* ─── Validation Rules ───────────────────────────────────────────────── */
// Maps each component to its allowed downstream targets
const VALID_CONNECTIONS = {
  User: ["Load Balancer"],
  "Load Balancer": ["API Gateway", "API Server"],
  "API Gateway": ["API Server"],
  "API Server": ["Database", "Cache", "Queue"],
  Database: ["Cache"],
  Cache: [],
  Queue: [],
};

/* ─── Inline Styles ───────────────────────────────────────────────────── */
const S = {
  /* Layout */
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    background: "#0d0f14",
    overflow: "hidden",
  },

  /* Left Panel */
  sidebar: {
    width: "220px",
    minWidth: "220px",
    background: "linear-gradient(180deg, #13151c 0%, #0d0f14 100%)",
    borderRight: "1px solid #1e2130",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    zIndex: 10,
    boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
  },

  sidebarHeader: {
    padding: "20px 16px 12px",
    borderBottom: "1px solid #1e2130",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4b5563",
  },

  sidebarSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#9ca3af",
  },

  componentList: { padding: "12px 10px", flex: 1, overflowY: "auto" },

  componentCard: (hovered) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    margin: "5px 0",
    background: hovered ? "#1a1d28" : "#12141d",
    border: `1px solid ${hovered ? "#2e3348" : "#1a1d28"}`,
    color: hovered ? "#e5e7eb" : "#9ca3af",
    cursor: "grab",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    userSelect: "none",
    transition: "all 0.18s ease",
    boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
    transform: hovered ? "translateX(2px)" : "none",
  }),

  componentIcon: {
    fontSize: "16px",
    width: "24px",
    textAlign: "center",
  },

  dragHint: {
    padding: "12px 16px",
    borderTop: "1px solid #1e2130",
    fontSize: "11px",
    color: "#374151",
    letterSpacing: "0.02em",
  },

  /* Canvas */
  canvas: {
    flex: 1,
    position: "relative",
    background: "#0d0f14",
    overflow: "hidden",
    cursor: "default",
  },

  canvasGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, #1e2130 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    pointerEvents: "none",
  },

  canvasLabel: {
    position: "absolute",
    top: 16,
    left: 20,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#2e3348",
    pointerEvents: "none",
    fontWeight: 600,
  },

  emptyState: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    gap: "10px",
  },

  emptyIcon: {
    fontSize: "48px",
    opacity: 0.15,
  },

  emptyText: {
    fontSize: "14px",
    color: "#2e3348",
    fontWeight: 500,
    letterSpacing: "0.04em",
  },

  /* Node */
  node: (node, isStart, isSelected, hovered) => {
    const c = NODE_COLORS[node.name] || { bg: "#1a1d28", border: "#374151", glow: "rgba(255,255,255,0.1)" };
    return {
      position: "absolute",
      top: node.y,
      left: node.x,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 14px",
      background: isStart ? "#1a3a2a" : c.bg,
      border: `1.5px solid ${isStart ? "#22c55e" : isSelected ? "#c084fc" : c.border}`,
      borderRadius: "12px",
      cursor: "move",
      userSelect: "none",
      fontSize: "13px",
      fontWeight: 600,
      color: "#e5e7eb",
      boxShadow: isStart
        ? `0 0 0 3px rgba(34,197,94,0.25), 0 8px 24px rgba(0,0,0,0.5)`
        : hovered
          ? `0 0 0 2px ${c.glow}, 0 8px 24px rgba(0,0,0,0.5)`
          : `0 4px 16px rgba(0,0,0,0.4)`,
      transition: "box-shadow 0.18s ease, border-color 0.18s ease",
      minWidth: "130px",
      zIndex: isStart || isSelected ? 10 : 5,
    };
  },

  nodeIcon: { fontSize: "16px" },

  deleteBtn: (hovered) => ({
    marginLeft: "auto",
    background: hovered ? "#ef4444" : "transparent",
    color: hovered ? "#fff" : "#4b5563",
    border: "none",
    cursor: "pointer",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: 1,
    transition: "all 0.15s ease",
    flexShrink: 0,
  }),

  /* Connection hint banner */
  connectHint: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(90deg, #134e2a, #1a3a2a)",
    border: "1px solid #22c55e",
    color: "#4ade80",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    pointerEvents: "none",
    boxShadow: "0 0 20px rgba(34,197,94,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 20,
  },

  pulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    animation: "pulse 1.2s ease-in-out infinite",
  },

  /* Guidance Panel */
  guidance: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "260px",
    background: "linear-gradient(145deg, #13151c, #0d0f14)",
    border: "1px solid #1e2130",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px #1e2130",
    zIndex: 20,
  },

  guidanceHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },

  guidanceIcon: {
    fontSize: "18px",
    lineHeight: 1,
  },

  guidanceName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#e5e7eb",
    margin: 0,
  },

  guidanceBadge: (name) => ({
    marginLeft: "auto",
    fontSize: "10px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "99px",
    background: NODE_COLORS[name]?.glow || "rgba(255,255,255,0.1)",
    color: NODE_COLORS[name]?.border || "#9ca3af",
    border: `1px solid ${NODE_COLORS[name]?.border || "#374151"}`,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  }),

  guidanceText: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "12px",
    lineHeight: "1.6",
  },

  guidanceSuggestLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#374151",
    fontWeight: 700,
    marginBottom: "8px",
  },

  guidanceChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  chip: (name) => ({
    fontSize: "11px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "99px",
    background: NODE_COLORS[name]?.glow || "rgba(255,255,255,0.05)",
    color: NODE_COLORS[name]?.border || "#9ca3af",
    border: `1px solid ${NODE_COLORS[name]?.border || "#374151"}`,
    cursor: "default",
  }),

  noneChip: {
    fontSize: "11px",
    color: "#374151",
    fontStyle: "italic",
  },

  /* ── Toast notifications ── */
  toast: (type) => ({
    position: "absolute",
    top: 16,
    right: 20,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.03em",
    zIndex: 30,
    pointerEvents: "none",
    animation: "fadeInUp 0.2s ease",
    ...(type === "error"
      ? {
        background: "linear-gradient(90deg, #3a1010, #2a0d0d)",
        border: "1px solid #ef4444",
        color: "#fca5a5",
        boxShadow: "0 0 18px rgba(239,68,68,0.2)",
      }
      : {
        background: "linear-gradient(90deg, #0f2a1a, #0a1f13)",
        border: "1px solid #22c55e",
        color: "#86efac",
        boxShadow: "0 0 18px rgba(34,197,94,0.15)",
      }),
  }),

  /* ── Analyze Button ── */
  analyzeBtn: (hovered) => ({
    position: "absolute",
    top: 12,
    right: 20,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "12px",
    border: `1px solid ${hovered ? "#a855f7" : "#2e3348"}`,
    background: hovered
      ? "linear-gradient(135deg, #2e1e3f 0%, #1a1333 100%)"
      : "linear-gradient(135deg, #13151c 0%, #0d0f14 100%)",
    color: hovered ? "#c084fc" : "#9ca3af",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    zIndex: 25,
    transition: "all 0.2s ease",
    boxShadow: hovered
      ? "0 0 20px rgba(168,85,247,0.25), 0 4px 12px rgba(0,0,0,0.4)"
      : "0 4px 12px rgba(0,0,0,0.3)",
    letterSpacing: "0.03em",
  }),

  /* ── Analysis Floating Panel ── */
  analysisPanel: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "420px",
    maxHeight: "340px",
    overflowY: "auto",
    background: "linear-gradient(145deg, #13151c, #0d0f14)",
    border: "1px solid #2e3348",
    borderRadius: "16px",
    padding: "0",
    boxShadow:
      "0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,85,247,0.1)",
    zIndex: 25,
    animation: "fadeInUp 0.3s ease",
  },

  analysisPanelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px 10px",
    borderBottom: "1px solid #1e2130",
  },

  analysisPanelTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  analysisPanelClose: (hovered) => ({
    background: hovered ? "#ef4444" : "transparent",
    color: hovered ? "#fff" : "#4b5563",
    border: "none",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: 700,
    transition: "all 0.15s ease",
  }),

  analysisScore: (score) => {
    let color = "#ef4444";
    let bg = "rgba(239,68,68,0.12)";
    let borderC = "#ef4444";
    if (score >= 7) {
      color = "#22c55e";
      bg = "rgba(34,197,94,0.12)";
      borderC = "#22c55e";
    } else if (score >= 4) {
      color = "#eab308";
      bg = "rgba(234,179,8,0.12)";
      borderC = "#eab308";
    }
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      margin: "12px 18px 8px",
      padding: "10px",
      borderRadius: "12px",
      background: bg,
      border: `1px solid ${borderC}`,
      color: color,
      fontSize: "22px",
      fontWeight: 800,
      letterSpacing: "0.03em",
    };
  },

  analysisScoreLabel: {
    fontSize: "12px",
    fontWeight: 600,
    opacity: 0.8,
  },

  analysisBody: {
    padding: "10px 18px 16px",
  },

  analysisLine: (type) => ({
    fontSize: "12.5px",
    lineHeight: "1.65",
    color: type === "good" ? "#86efac" : type === "bad" ? "#fca5a5" : type === "warning" ? "#fde047" : type === "suggestion" ? "#93c5fd" : "#9ca3af",
    fontWeight: 500,
    padding: "3px 0",
  }),

  analysisSectionTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#9ca3af",
    marginTop: "14px",
    marginBottom: "6px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: "1px solid #1e2130",
    paddingBottom: "4px",
  },
};

/* ─── NODE_SIZE constants (must match rendered node width/height) ─── */
const NODE_W = 160;
const NODE_H = 44;

/* ─── Component ──────────────────────────────────────────────────────── */
function Builder() {
  const components = [
    "User",
    "Load Balancer",
    "API Gateway",
    "API Server",
    "Database",
    "Cache",
    "Queue",
  ];

  const [canvas, setCanvas] = useState([]);
  const [selected, setSelected] = useState(null);
  // Stores the full node object of the last-clicked node (for position lookup)
  const [selectedNode, setSelectedNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [startNode, setStartNode] = useState(null);

  // Hover states
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredDelete, setHoveredDelete] = useState(null);

  // Toast notification: { message, type: 'error'|'success' } | null
  const [toast, setToast] = useState(null);

  // ── Analyze feature state ──────────────────────────────────────────
  const [analysis, setAnalysis] = useState(null);
  const [analysisScore, setAnalysisScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredAnalyzeBtn, setHoveredAnalyzeBtn] = useState(false);
  const [hoveredAnalysisClose, setHoveredAnalysisClose] = useState(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Validation helper ────────────────────────────────────────────────
  const isValidConnection = (fromName, toName) => {
    const allowed = VALID_CONNECTIONS[fromName];
    if (!allowed) return false;          // unknown source — reject
    return allowed.includes(toName);
  };

  // ── Duplicate-connection guard ───────────────────────────────────────
  const isDuplicate = (fromId, toId) =>
    connections.some((c) => c.from.id === fromId && c.to.id === toId);

  // ── Suggestion chip click: auto-create + auto-connect ────────────────
  const handleSuggestionClick = (suggestionName) => {
    if (!selectedNode) return;

    // Place new node to the right of the source; if two suggestions stack vertically
    const existingCount = canvas.filter((n) => n.name === suggestionName).length;
    const newNode = {
      id: Date.now(),
      name: suggestionName,
      x: selectedNode.x + 230,
      y: selectedNode.y + existingCount * 70, // stack vertically if duplicate type
    };

    setCanvas((prev) => [...prev, newNode]);
    setConnections((prev) => [...prev, { from: selectedNode, to: newNode }]);
    setSelected(suggestionName);
    setSelectedNode(newNode);
    setToast({
      message: `✅ Added & connected: ${selectedNode.name} → ${suggestionName}`,
      type: "success",
    });
  };

  // ── Design Analyzer ────────────────────────────────────────────────
  const handleAnalyze = () => {
    const checks = [];
    const warnings = [];
    const suggestions = [];
    let score = 10;

    // ─ 1. Check for missing essential components ─────────────────────
    const essentialComponents = ["User", "Load Balancer", "API Server", "Database"];
    const placedNames = canvas.map((n) => n.name);

    essentialComponents.forEach((comp) => {
      if (!placedNames.includes(comp)) {
        checks.push({ text: `❌ Missing component: ${comp}`, type: "bad" });
        score -= 2;
        if (comp === "Load Balancer") suggestions.push("💡 Suggest adding a Load Balancer");
      } else {
        checks.push({ text: `✅ Present: ${comp}`, type: "good" });
      }
    });

    if (!placedNames.includes("Queue")) suggestions.push("💡 Suggest adding a Queue for async processing");
    if (!placedNames.includes("API Gateway")) suggestions.push("💡 Suggest adding an API Gateway for better routing/security");

    // ─ 2. Check for invalid connections ──────────────────────────────
    connections.forEach((conn) => {
      const from = conn.from.name;
      const to = conn.to.name;
      if (!isValidConnection(from, to)) {
        checks.push({ text: `❌ Wrong connection: ${from} → ${to}`, type: "bad" });
        score -= 1;
      } else {
        checks.push({ text: `✅ Good: ${from} → ${to}`, type: "good" });
      }
    });

    // ─ 3. Best-practice checks ───────────────────────────────────────
    // Check: User should connect to Load Balancer (not directly to API/DB)
    const userNodes = canvas.filter((n) => n.name === "User");
    userNodes.forEach((userNode) => {
      const userConns = connections.filter((c) => c.from.id === userNode.id);
      const connectsToLB = userConns.some((c) => c.to.name === "Load Balancer");
      const connectsToDB = userConns.some((c) => c.to.name === "Database");
      const connectsToAPI = userConns.some((c) => c.to.name === "API Server");

      if (connectsToDB) {
        checks.push({ text: "❌ Bad practice: User connected directly to Database", type: "bad" });
        score -= 2;
      }
      if (connectsToAPI && !connectsToLB) {
        checks.push({ text: "⚠️ Consider: User should go through Load Balancer first", type: "info" });
        score -= 1;
      }
      if (connectsToLB) {
        checks.push({ text: "✅ Good practice: User → Load Balancer", type: "good" });
      }
    });

    // Check: API Server should connect to Database
    const apiNodes = canvas.filter((n) => n.name === "API Server");
    apiNodes.forEach((apiNode) => {
      const apiConns = connections.filter((c) => c.from.id === apiNode.id);
      const connDB = apiConns.some((c) => c.to.name === "Database");
      if (connDB) {
        checks.push({ text: "✅ Good: API Server connected to Database", type: "good" });
      } else if (placedNames.includes("Database")) {
        checks.push({ text: "⚠️ API Server not connected to Database yet", type: "info" });
        score -= 1;
      }
    });

    // Check: No components at all
    if (canvas.length === 0) {
      checks.length = 0;
      checks.push({ text: "❌ Canvas is empty — add components to begin", type: "bad" });
      score = 0;
    }

    // Check: No connections at all (but has nodes)
    if (canvas.length > 0 && connections.length === 0) {
      checks.push({ text: "⚠️ No connections — click nodes to connect them", type: "info" });
      warnings.push("⚠️ No connections defined");
      score = Math.max(score - 2, 0);
    }

    // Additional Warnings
    const cacheCount = placedNames.filter((n) => n === "Cache").length;
    if (cacheCount > 1) {
      warnings.push("⚠️ Multiple Cache layers detected");
    }

    if (placedNames.includes("Database") && !placedNames.includes("Cache")) {
      warnings.push("⚠️ Consider adding Cache for performance");
    }

    // Clamp score
    score = Math.max(0, Math.min(10, score));

    // De-duplicate checks
    const seen = new Set();
    const uniqueChecks = checks.filter((m) => {
      if (seen.has(m.text)) return false;
      seen.add(m.text);
      return true;
    });

    const uniqueWarnings = [...new Set(warnings)];
    const uniqueSuggestions = [...new Set(suggestions)];

    setAnalysis({
      score,
      checks: uniqueChecks,
      warnings: uniqueWarnings,
      suggestions: uniqueSuggestions,
    });
    setAnalysisScore(score);
    setShowAnalysis(true);
  };

  // 🔥 Knowledge base (unchanged)
  const details = {
    User: { text: "Client sends request", next: ["Load Balancer"] },
    "Load Balancer": {
      text: "Distributes traffic across servers",
      next: ["API Gateway"],
    },
    "API Gateway": {
      text: "Handles routing and security",
      next: ["API Server"],
    },
    "API Server": {
      text: "Processes business logic",
      next: ["Database", "Cache"],
    },
    Database: {
      text: "Stores persistent data",
      next: ["Cache"],
    },
    Cache: {
      text: "Speeds up data access",
      next: [],
    },
    Queue: {
      text: "Handles background jobs",
      next: [],
    },
  };

  // 🔹 Drag start (unchanged)
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("component", item);
  };

  // 🔹 Drop (unchanged)
  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("component");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newNode = { id: Date.now(), name: item, x, y };
    setCanvas((prev) => [...prev, newNode]);
  };

  // 🔹 Move node (unchanged)
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const node = canvas.find((n) => n.id === id);
    const offsetX = e.clientX - node.x;
    const offsetY = e.clientY - node.y;

    const handleMouseMove = (eMove) => {
      const newX = eMove.clientX - offsetX;
      const newY = eMove.clientY - offsetY;
      setCanvas((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n))
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        /* Override global #root constraint for Builder full-screen layout */
        html, body { height: 100%; overflow: hidden; }
        #root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border: none !important;
          text-align: left !important;
          display: block !important;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2130; border-radius: 4px; }
      `}</style>

      <div style={S.root}>
        {/* ── LEFT PANEL ─────────────────────────────────────── */}
        <div style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <p style={S.sidebarTitle}>Components</p>
            <p style={S.sidebarSubtitle}>Drag to canvas</p>
          </div>

          <div style={S.componentList}>
            {components.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onMouseEnter={() => setHoveredComponent(item)}
                onMouseLeave={() => setHoveredComponent(null)}
                style={S.componentCard(hoveredComponent === item)}
              >
                <span style={S.componentIcon}>{ICONS[item]}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div style={S.dragHint}>⬡ Drag components onto the canvas</div>
        </div>

        {/* ── CANVAS ─────────────────────────────────────────── */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={S.canvas}
        >
          {/* Dot-grid background */}
          <div style={S.canvasGrid} />

          <span style={S.canvasLabel}>System Design Canvas</span>

          {/* ── Analyze Button ─────────────────────────────── */}
          <button
            onClick={handleAnalyze}
            onMouseEnter={() => setHoveredAnalyzeBtn(true)}
            onMouseLeave={() => setHoveredAnalyzeBtn(false)}
            style={S.analyzeBtn(hoveredAnalyzeBtn)}
          >
            🧠 Analyze
          </button>

          {/* Empty state */}
          {canvas.length === 0 && (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>🏗️</div>
              <div style={S.emptyText}>Drop components here to start designing</div>
            </div>
          )}

          {/* Connection hint banner — centered top */}
          {startNode && (
            <div style={S.connectHint}>
              <div style={S.pulse} />
              Now select the target node to connect →{" "}
              <span style={{ color: "#86efac" }}>{startNode.name}</span>
            </div>
          )}

          {/* Toast notification — top-right */}
          {toast && (
            <div style={S.toast(toast.type)}>
              {toast.message}
            </div>
          )}

          {/* ── SVG Arrows (unchanged logic) ─────────────────── */}
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <polygon points="0 0, 10 5, 0 10" fill="#4b5563" />
              </marker>
              <marker
                id="arrow-active"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <polygon points="0 0, 10 5, 0 10" fill="#22c55e" />
              </marker>
            </defs>

            {connections.map((conn, index) => {
              // Center-to-center calculation
              const x1 = conn.from.x + NODE_W / 2;
              const y1 = conn.from.y + NODE_H / 2;
              const x2 = conn.to.x + NODE_W / 2;
              const y2 = conn.to.y + NODE_H / 2;

              // Smooth cubic bezier
              const dx = x2 - x1;
              const cx1 = x1 + dx * 0.5;
              const cx2 = x2 - dx * 0.5;

              return (
                <path
                  key={index}
                  d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
                  stroke="#2e3a4e"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrow)"
                  strokeDasharray="none"
                />
              );
            })}
          </svg>

          {/* ── Nodes ────────────────────────────────────────── */}
          {canvas.map((node) => (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(node.name);
                setSelectedNode(node); // track full object for suggestion placement

                if (!startNode) {
                  // First click — mark as connection source
                  setStartNode(node);
                } else {
                  // Second click — attempt to create connection
                  if (startNode.id !== node.id) {
                    if (isDuplicate(startNode.id, node.id)) {
                      // Already connected — silent ignore (no duplicate arrows)
                      setToast({
                        message: `Already connected: ${startNode.name} → ${node.name}`,
                        type: "error",
                      });
                    } else if (!isValidConnection(startNode.name, node.name)) {
                      // Invalid architecture connection
                      setToast({
                        message: `❌ Invalid: ${startNode.name} → ${node.name}`,
                        type: "error",
                      });
                    } else {
                      // ✅ Valid — add the connection
                      setConnections((prev) => [
                        ...prev,
                        { from: startNode, to: node },
                      ]);
                      setToast({
                        message: `✅ Connected: ${startNode.name} → ${node.name}`,
                        type: "success",
                      });
                    }
                  }
                  setStartNode(null);
                }
              }}
              style={S.node(
                node,
                startNode?.id === node.id,
                selected === node.name,
                hoveredNode === node.id
              )}
            >
              <span style={S.nodeIcon}>{ICONS[node.name]}</span>
              <span>{node.name}</span>

              {/* Delete button */}
              <button
                onMouseEnter={() => setHoveredDelete(node.id)}
                onMouseLeave={() => setHoveredDelete(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setCanvas((prev) => prev.filter((n) => n.id !== node.id));
                  // Clean up connections involving this node
                  setConnections((prev) =>
                    prev.filter(
                      (c) => c.from.id !== node.id && c.to.id !== node.id
                    )
                  );
                }}
                style={S.deleteBtn(hoveredDelete === node.id)}
                title="Delete node"
              >
                ✕
              </button>
            </div>
          ))}

          {/* ── Guidance Panel ───────────────────────────────── */}
          {selected && (
            <div
              style={{
                ...S.guidance,
                animation: "fadeInUp 0.25s ease",
              }}
            >
              <div style={S.guidanceHeader}>
                <span style={S.guidanceIcon}>{ICONS[selected]}</span>
                <p style={S.guidanceName}>{selected}</p>
                <span style={S.guidanceBadge(selected)}>
                  {selected.split(" ")[0]}
                </span>
              </div>

              <p style={S.guidanceText}>{details[selected]?.text}</p>

              <div style={S.guidanceSuggestLabel}>Suggested Next</div>
              <div style={S.guidanceChips}>
                {details[selected]?.next.length > 0 ? (
                  details[selected].next.map((n) => (
                    <span
                      key={n}
                      role="button"
                      onClick={() => handleSuggestionClick(n)}
                      style={{ ...S.chip(n), cursor: "pointer" }}
                      title={`Click to add ${n}`}
                    >
                      {ICONS[n]} {n}
                    </span>
                  ))
                ) : (
                  <span style={S.noneChip}>No suggestions — terminal node</span>
                )}
              </div>
            </div>
          )}

          {/* ── Analysis Result Panel ─────────────────────── */}
          {showAnalysis && analysis && (
            <div style={S.analysisPanel}>
              <div style={S.analysisPanelHeader}>
                <p style={S.analysisPanelTitle}>
                  <span>🧠</span> Design Analysis
                </p>
                <button
                  onClick={() => setShowAnalysis(false)}
                  onMouseEnter={() => setHoveredAnalysisClose(true)}
                  onMouseLeave={() => setHoveredAnalysisClose(false)}
                  style={S.analysisPanelClose(hoveredAnalysisClose)}
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <div style={S.analysisScore(analysisScore)}>
                {analysisScore} / 10
                <span style={S.analysisScoreLabel}>
                  {analysisScore >= 7 ? " — Great" : analysisScore >= 4 ? " — Needs Work" : " — Critical"}
                </span>
              </div>

              <div style={S.analysisBody}>
                {analysis.checks?.length > 0 && (
                  <>
                    <div style={S.analysisSectionTitle}>✅ Checks</div>
                    {analysis.checks.map((item, idx) => (
                      <div key={idx} style={S.analysisLine(item.type)}>
                        {item.text}
                      </div>
                    ))}
                  </>
                )}

                {analysis.warnings?.length > 0 && (
                  <>
                    <div style={S.analysisSectionTitle}>⚠️ Warnings</div>
                    {analysis.warnings.map((text, idx) => (
                      <div key={idx} style={S.analysisLine("warning")}>
                        {text}
                      </div>
                    ))}
                  </>
                )}

                {analysis.suggestions?.length > 0 && (
                  <>
                    <div style={S.analysisSectionTitle}>💡 Suggestions</div>
                    {analysis.suggestions.map((text, idx) => (
                      <div key={idx} style={S.analysisLine("suggestion")}>
                        {text}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Builder;