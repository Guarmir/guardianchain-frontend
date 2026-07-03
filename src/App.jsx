import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Landing from "./pages/LandingPage.jsx"
import Register from "./pages/Register.jsx"
import Success from "./pages/Success.jsx"
import Verify from "./pages/Verify.jsx"
import About from "./pages/About.jsx"
import Faq from "./pages/Faq.jsx"
import Terms from "./pages/Terms.jsx"
import Privacy from "./pages/Privacy.jsx"
import Support from "./pages/Support.jsx"
import RefundPolicy from "./pages/RefundPolicy.jsx"
import CertificateDemo from "./pages/CertificateDemo.jsx"

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/verify" element={<Verify />} />

        <Route path="/certificate-demo" element={<CertificateDemo />} />

        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/refund" element={<RefundPolicy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App