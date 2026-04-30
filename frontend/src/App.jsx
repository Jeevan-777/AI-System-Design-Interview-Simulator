import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import DesignInput from "./pages/DesignInput";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Learning from "./pages/learning/Learning";
import LoadBalancer from "./pages/learning/LoadBalancer";
import Database from "./pages/learning/Database";
import Cache from "./pages/learning/Cache";
import Queue from "./pages/learning/Queue";
import LearningHistory from "./pages/LearningHistory";
import Builder from "./pages/Builder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/design" element={<DesignInput />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/load-balancer" element={<LoadBalancer />} />
        <Route path="/learning/database" element={<Database />} />
        <Route path="/learning/cache" element={<Cache />} />
        <Route path="/learning/queue" element={<Queue />} />
        <Route path="/learning-history" element={<LearningHistory />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;