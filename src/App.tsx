import { Suspense, lazy, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './Pages/site/HomePage'
import LoginPage from './Pages/auth/LoginPage'
import SignupPage from './Pages/auth/SignupPage'
import OtpPage from './Pages/auth/OtpPage'
import ForgotPasswordPage from './Pages/auth/ForgotPasswordPage'
import ForgotPasswordOtpPage from './Pages/auth/ForgotPasswordOtpPage'
import ResetPasswordPage from './Pages/auth/ResetPasswordPage'
const AboutPage = lazy(() => import('./Pages/site/AboutPage'))
const ServicesPage = lazy(() => import('./Pages/site/ServicesPage'))
const ContactPage = lazy(() => import('./Pages/site/ContactPage'))
const OurTeamPage = lazy(() => import('./Pages/site/OurTeamPage'))
const PolypDetectionPage = lazy(() => import('./Pages/models/PolypDetectionPage'))
const DentimapPage = lazy(() => import('./Pages/models/DentimapPage'))
const VCEClassificationPage = lazy(() => import('./Pages/models/VCEClassificationPage'))

const THEME_STORAGE_KEY = 'models-frontend-theme'

export type AppTheme = 'white' | 'black'

function readStoredTheme(): AppTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'black' || stored === 'white') return stored
  } catch {
    void 0
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
        void 0
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
  const routeLoader = (
    <div className="px-6 pb-16 pt-[5.5rem] text-sm text-zinc-500">
      Loading page...
    </div>
  )

  return (
    <Suspense fallback={routeLoader}>
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
          <Route path="models/vce" element={<VCEClassificationPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
