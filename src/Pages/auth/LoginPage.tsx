import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import loginImage from '../../assets/Websites/Login/Login.png'
import type { AuthUser } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login: authLogin } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOAuth2Success = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://map.paninsight.org/api/auth/oauth2-success', {
        method: 'GET',
        credentials: 'include',
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        data?: {
          user: {
            id: string | number
            firstName?: string
            lastName?: string
            email: string
            createdAt?: string
          }
        }
      }

      if (data.success && data.data?.user) {
        const u = data.data.user
        authLogin({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          dateOfBirth: u.createdAt ?? new Date().toISOString(),
        })
        toast({
          title: 'Logged in',
          description: 'Google login successful! Welcome!',
          duration: 3000,
        })
        navigate('/')
      } else {
        setError(data.message ?? 'Google login failed.')
      }
    } catch {
      setError('Failed to complete Google login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [authLogin, navigate, toast])

  useEffect(() => {
    const oauth2Success = searchParams.get('oauth2_success')
    const oauth2Failure = searchParams.get('oauth2_failure')

    if (oauth2Success === 'true') {
      void handleOAuth2Success()
    } else if (oauth2Failure === 'true') {
      setError('Google login failed. Please try again.')
    }
  }, [searchParams, handleOAuth2Success])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        data?: AuthUser
      }

      if (data.success && data.data) {
        authLogin(data.data)
        toast({
          title: 'Logged in',
          description: 'Login successful! Welcome back.',
          duration: 3000,
        })
        navigate('/')
      } else {
        setError(data.message ?? 'Login failed. Please check your credentials.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'https://map.paninsight.org/oauth2/authorization/google'
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-white text-zinc-900">
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 md:px-12 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900">Welcome back</h2>
          <p className="text-sm text-zinc-600">Please enter your details</p>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  className="mt-1 w-full rounded-md border border-zinc-300 py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  onChange={(ev) => setPassword(ev.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600 hover:text-zinc-900"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link
                to="/forgot-password"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-md py-2.5 text-sm font-semibold transition ${
                isLoading
                  ? 'cursor-not-allowed bg-zinc-400 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-zinc-500">or</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-300 py-2.5 transition hover:bg-zinc-50 disabled:opacity-50"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} className="mt-0.5 shrink-0" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-zinc-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="relative hidden min-h-[100dvh] flex-1 md:block">
        <div
          className="absolute inset-0 overflow-hidden bg-zinc-200 [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
          aria-hidden
        >
          <img
            src={loginImage}
            alt=""
            className="h-full w-full min-h-[100dvh] scale-[1.06] object-cover object-center motion-safe:transition-transform motion-safe:duration-[1.2s] motion-safe:ease-out"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-white/5 to-zinc-900/15 [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
          aria-hidden
        />
      </div>
    </div>
  )
}
