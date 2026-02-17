import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Success from "./pages/Success";
import Verify from "./pages/Verify";
import { setLanguage } from "./i18n";

function App() {
  return (
    <Router>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button onClick={() => setLanguage("pt")}>PT</button>
        <button onClick={() => setLanguage("en")}>EN</button>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/success" />} />
        <Route path="/success" element={<Success />} />
        <Route path="/verify/:hash" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;
