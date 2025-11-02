import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import FertilizerPrediction from "./pages/FertilizerPrediction";
import AgriBot from "./pages/AgriBot";
import Monitoring from "./pages/Monitoring";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      case "disease":
        return <DiseaseDetection />;
      case "fertilizer":
        return <FertilizerPrediction />;
      case "agribot":
        return <AgriBot />;
      case "monitoring":
        return <Monitoring />;
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
