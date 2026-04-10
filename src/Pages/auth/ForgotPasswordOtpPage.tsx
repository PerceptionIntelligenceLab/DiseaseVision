import { useRef, useState, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

type ForgotOtpLocationState = {
  email?: string
}

export default function ForgotPasswordOtpPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  useEffect(() => {
    const state = location.state as ForgotOtpLocationState | null
    const stateEmail = state?.email
    const urlParams = new URLSearchParams(window.location.search)
    const urlEmail = urlParams.get('email') ?? ''

    setEmail(stateEmail || urlEmail)

    if (!stateEmail && !urlEmail) {
      navigate('/forgot-password', { replace: true })
    }
  }, [location, navigate])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)

    if (value && index < 4) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const enteredOtp = otp.join('')

    if (enteredOtp.length !== 5) {
      setError('Please enter the complete 5-digit OTP')
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the complete 5-digit code.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp, email }),
      })

      const data = (await response.json()) as { message?: unknown }

      if (response.ok) {
        setMessage('OTP verified successfully! Redirecting to password reset…')
        toast({
          title: 'OTP verified',
          description: 'Redirecting to reset your password…',
          duration: 3000,
        })
        window.setTimeout(() => {
          navigate('/reset-password', { state: { email, otp: enteredOtp } })
        }, 2000)
      } else {
        const msg = String(data.message ?? 'Invalid OTP. Please try again.')
        setError(msg)
        toast({
          title: 'Verification failed',
          description: msg,
          variant: 'destructive',
          duration: 3000,
        })
        setOtp(['', '', '', '', ''])
        inputsRef.current[0]?.focus()
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

  const handleResendOTP = async () => {
    if (!email) {
      setError('Email not found. Please go back to forgot password page.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { message?: unknown }

      if (response.ok) {
        setMessage('New OTP sent successfully! Please check your email.')
        setOtp(['', '', '', '', ''])
        inputsRef.current[0]?.focus()
        toast({
          title: 'Code sent',
          description: 'Check your email for a new code.',
          duration: 3000,
        })
      } else {
        setError(String(data.message ?? 'Failed to resend OTP'))
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-zinc-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Enter the 5-digit OTP</h2>
        <p className="text-sm text-zinc-600">We&apos;ve sent it to {email || '…'}</p>

        {message ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete="one-time-code"
                className="h-12 w-12 rounded-md border border-zinc-300 text-center text-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(ev) => handleChange(index, ev.target.value)}
                onKeyDown={(ev) => handleKeyDown(index, ev)}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                required
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void handleResendOTP()}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Sending…' : 'Resend OTP'}
          </button>
          <div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit email address
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
