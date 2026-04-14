import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './Pages/site/HomePage'
import LoginPage from './Pages/auth/LoginPage'
import SignupPage from './Pages/auth/SignupPage'
import OtpPage from './Pages/auth/OtpPage'
import ForgotPasswordPage from './Pages/auth/ForgotPasswordPage'
import ForgotPasswordOtpPage from './Pages/auth/ForgotPasswordOtpPage'
import ResetPasswordPage from './Pages/auth/ResetPasswordPage'
import AboutPage from './Pages/site/AboutPage'
import ServicesPage from './Pages/site/ServicesPage'
import ContactPage from './Pages/site/ContactPage'
import OurTeamPage from './Pages/site/OurTeamPage'
import PolypDetectionPage from './Pages/models/PolypDetectionPage'
import DentimapPage from './Pages/models/DentimapPage'

const THEME_STORAGE_KEY = 'models-frontend-theme'

export type AppTheme = 'white' | 'black'

function readStoredTheme(): AppTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'black' || stored === 'white') return stored
  } catch {
  }
  return 'white'
}

function MainLayout() {
  const [theme, setTheme] = useState<AppTheme>(() => readStoredTheme())
  const isBlack = theme === 'black'

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'black' ? 'white' : 'black'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
      }
      return next
    })
  }

  return (
    <div
      className={`${isBlack ? 'bg-black text-zinc-100' : 'bg-white text-zinc-900'} min-h-screen transition-colors duration-300`}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Outlet context={{ theme }} />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/forgot-password/otp" element={<ForgotPasswordOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="our-team" element={<OurTeamPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="models/polyp" element={<PolypDetectionPage />} />
        <Route path="models/dentimap" element={<DentimapPage />} />
      </Route>
    </Routes>
  )
}

export default App
