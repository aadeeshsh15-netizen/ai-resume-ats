import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import LandingPage from "./pages/LandingPage"
import AnalyzerPage from "./pages/AnalyzerPage"
import ResultsPage from "./pages/ResultsPage"
import HistoryPage from "./pages/HistoryPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="analyze" element={<AnalyzerPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
