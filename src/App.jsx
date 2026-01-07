import { BrowserRouter, Routes, Route } from "react-router-dom";

import Upload from "./pages/Upload";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fluxo principal do cliente */}
        <Route path="/" element={<Upload />} />

        {/* Registro manual por hash (avançado) */}
        <Route path="/register" element={<Register />} />

        {/* Certificado + PDF */}
        <Route path="/verify" element={<Verify />} />

        {/* Pós-pagamento (opcional) */}
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
