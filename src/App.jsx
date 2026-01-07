import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Registro */}
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />

        {/* Verificação */}
        <Route path="/verify" element={<Verify />} />

        {/* Sucesso após pagamento */}
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
