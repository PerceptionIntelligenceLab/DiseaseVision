import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useToast } from '../../hooks/useToast'

type ResetLocationState = {
  email?: string
  otp?: string
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    const state = location.state as ResetLocationState | null
    const stateEmail = state?.email
    const stateOtp = state?.otp

    if (!stateEmail || !stateOtp) {
      navigate('/forgot-password', { replace: true })
      return
    }

    setEmail(stateEmail)
    setOtp(stateOtp)
  }, [location, navigate])

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return 'Password must be at least 6 characters long'
    }
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      toast({
        title: 'Invalid password',
        description: passwordError,
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match')
      toast({
        title: 'Mismatch',
        description: 'Password and confirm password do not match',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          email,
          password,
          confirmPassword,
        }),
      })

      const data = (await response.json()) as { message?: unknown }

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to login…')
        toast({
          title: 'Password reset',
          description: 'Your password has been reset successfully.',
          duration: 3000,
        })
        window.setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        const msg = String(data.message ?? 'Failed to reset password')
        setError(msg)
        toast({
          title: 'Reset failed',
          description: msg,
          variant: 'destructive',
          duration: 3000,
        })
      }
    } catch {
      setError('Network error. Please try again.')
      toast({
        title: 'Network error',
        description: 'Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-zinc-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="text-3xl font-bold text-zinc-900">Reset your password</h2>
        <p className="text-sm text-zinc-600">Enter your new password below</p>

        {message ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-zinc-700">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                name="password"
                placeholder="Enter your new password"
                className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-zinc-500">Password must be at least 6 characters long</p>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="mb-1 block text-sm font-medium text-zinc-700">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  className="w-full rounded-md border border-zinc-300 py-2 pl-4 pr-10 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600 hover:text-zinc-900"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  )
}
