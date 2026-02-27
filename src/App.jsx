import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Verify from "./pages/Verify";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import { setLanguage } from "./i18n";

function App() {
  return (
    <Router>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button onClick={() => setLanguage("pt")}>PT</button>
        <button onClick={() => setLanguage("en")}>EN</button>
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/verify/:hash" element={<Verify />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
