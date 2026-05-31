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
import Quiz from "./pages/Quiz";
import Levels from "./pages/Levels";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/level3";
import Level4 from "./pages/level4";
import Level5 from "./pages/level5";

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
        <Route path="/learning/quiz" element={<Quiz />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/levels/level1" element={<Level1 />} />
        <Route path="/levels/level2" element={<Level2 />} />
        <Route path="/levels/level3" element={<Level3 />} />
        <Route path="/levels/level4" element={<Level4 />} />
        <Route path="/levels/level5" element={<Level5 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;