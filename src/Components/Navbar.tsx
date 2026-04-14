import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiLogIn, FiUserPlus } from 'react-icons/fi'
import { LuSunDim } from 'react-icons/lu'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Services', to: '/services' },
  { name: 'About', to: '/about' },
  { name: 'Our Team', to: '/our-team' },
  { name: 'Contact', to: '/contact' },
] as const

type NavbarProps = {
  theme: 'white' | 'black'
  onToggleTheme: () => void
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileAccountRef = useRef<HTMLDivElement | null>(null)
  const isBlackTheme = theme === 'black'
  const navTextClass = isBlackTheme ? 'text-zinc-400 hover:text-zinc-200' : 'text-black hover:text-zinc-600'
  const navActiveClass = isBlackTheme ? 'text-zinc-100' : 'text-zinc-900'
  const iconButtonClass = isBlackTheme
    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70'
    : 'text-black hover:text-zinc-900 hover:bg-zinc-200/80'

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountOpen) return
      const target = event.target as Node
      const inDesktop = accountMenuRef.current?.contains(target)
      const inMobile = mobileAccountRef.current?.contains(target)
      if (!inDesktop && !inMobile) setAccountOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [accountOpen])

  const closeMenu = () => setOpen(false)

  const accountLinkClass = `w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
    isBlackTheme
      ? 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
      : 'text-black hover:bg-zinc-100 hover:text-zinc-900'
  }`

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 overflow-visible transition-all duration-300 ${
          hasScrolled
            ? `${isBlackTheme ? 'bg-black/85' : 'bg-white/90'} backdrop-blur-md`
            : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between w-full overflow-visible">
          <div className="flex items-center min-w-0">
            <div className="md:hidden relative" ref={mobileAccountRef}>
              <button
                type="button"
                className={`p-2 rounded-full transition-colors ${iconButtonClass}`}
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-label="account menu"
              >
                <FiUser size={20} />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-0 top-[calc(100%+0.5rem)] w-36 rounded-lg p-2 shadow-xl z-[60] ${
                      isBlackTheme ? 'bg-zinc-900' : 'bg-white'
                    }`}
                  >
                    <Link to="/login" onClick={() => setAccountOpen(false)} className={accountLinkClass}>
                      <FiLogIn size={15} />
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setAccountOpen(false)} className={accountLinkClass}>
                      <FiUserPlus size={15} />
                      Signup
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden md:block w-6 md:w-8" />
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-200 ${isActive ? `${navActiveClass} font-semibold` : navTextClass}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 -mr-4">
              <button
                type="button"
                className={`p-2 rounded-full transition-colors ${iconButtonClass}`}
                onClick={onToggleTheme}
                aria-label="toggle theme"
              >
                <LuSunDim size={18} />
              </button>
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  className={`p-2 rounded-full transition-colors ${iconButtonClass}`}
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-label="account menu"
                >
                  <FiUser size={18} />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-[calc(100%+0.5rem)] w-36 rounded-lg p-2 shadow-xl z-[60] ${
                        isBlackTheme ? 'bg-zinc-900' : 'bg-white'
                      }`}
                    >
                      <Link to="/login" onClick={() => setAccountOpen(false)} className={accountLinkClass}>
                        <FiLogIn size={15} />
                        Login
                      </Link>
                      <Link to="/signup" onClick={() => setAccountOpen(false)} className={accountLinkClass}>
                        <FiUserPlus size={15} />
                        Signup
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="button"
              className={`md:hidden p-1 transition-colors ${isBlackTheme ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-700 hover:text-zinc-900'}`}
              onClick={() => {
                setOpen((v) => !v)
                setAccountOpen(false)
              }}
              aria-label="toggle nav"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.div
              className={`fixed top-0 right-0 h-full w-64 z-50 flex flex-col pt-6 pb-8 px-6 gap-6 shadow-[-8px_0_32px_rgba(0,0,0,0.12)] md:hidden ${
                isBlackTheme ? 'bg-zinc-900' : 'bg-white'
              }`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              
              <button
                onClick={closeMenu}
                className={`self-end transition-colors mb-4 ${
                  isBlackTheme ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-700 hover:text-zinc-900'
                }`}
                aria-label="close menu"
              >
                <FiX size={22} />
              </button>

              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `text-base py-1 transition-colors ${
                      isActive
                        ? `${navActiveClass} font-semibold`
                        : isBlackTheme
                          ? 'text-zinc-300 hover:text-zinc-100'
                          : 'text-black hover:text-zinc-700'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
