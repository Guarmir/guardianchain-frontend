import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Register from "./pages/Register"
import Success from "./pages/Success"
import Verify from "./pages/Verify"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/register" element={<Register />} />

        <Route path="/success" element={<Success />} />

        <Route path="/verify" element={<Verify />} />

      </Routes>

    </BrowserRouter>

  )
}

export default App