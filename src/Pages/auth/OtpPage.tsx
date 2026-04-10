import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

type PendingUser = {
  firstName?: string
  lastName?: string
  email?: string
  gender?: string
  password?: string
  confirmPassword?: string
  dateOfBirth?: string
  dateofBirth?: string
}

export default function OtpPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState<string[]>(['', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 4) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleResendOTP = async () => {
    let userdata: PendingUser = {}
    try {
      userdata = JSON.parse(localStorage.getItem('PendingUser') || '{}') as PendingUser
    } catch {
      userdata = {}
    }

    if (!userdata.email) {
      toast({
        title: 'No pending registration',
        description: 'Please sign up again.',
        variant: 'destructive',
        duration: 3000,
      })
      navigate('/signup')
      return
    }

    setIsResending(true)

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/resend-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userdata.email }),
      })

      const res = (await response.json()) as { success?: boolean; message?: unknown }

      if (res.success) {
        toast({
          title: 'OTP sent',
          description: 'A new OTP has been sent to your email.',
          duration: 3000,
        })
        setCode(['', '', '', '', ''])
      } else {
        toast({
          title: 'Resend failed',
          description: String(res.message ?? 'Failed to resend OTP.'),
          variant: 'destructive',
          duration: 3000,
        })
      }
    } catch {
      toast({
        title: 'Resend failed',
        description: 'Failed to resend OTP. Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleVerify = async () => {
    const otpcode = code.join('')

    if (otpcode.length !== 5) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 5-digit code.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    let userdata: PendingUser = {}
    try {
      userdata = JSON.parse(localStorage.getItem('PendingUser') || '{}') as PendingUser
    } catch {
      userdata = {}
    }

    if (!userdata.email) {
      toast({
        title: 'No pending registration',
        description: 'Please sign up again.',
        variant: 'destructive',
        duration: 3000,
      })
      navigate('/signup')
      return
    }

    const dateOfBirth = userdata.dateOfBirth ?? userdata.dateofBirth ?? ''

    const payload = {
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      dateOfBirth,
      gender: userdata.gender,
      email: userdata.email,
      password: userdata.password,
      confirmPassword: userdata.confirmPassword,
      otp: otpcode,
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/verify-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const res = (await response.json()) as { success?: boolean; message?: unknown }

      if (res.success) {
        localStorage.removeItem('PendingUser')
        toast({
          title: 'Registration complete',
          description: 'Please log in.',
          duration: 3000,
        })
        navigate('/login')
      } else {
        toast({
          title: 'Verification failed',
          description: String(res.message ?? 'OTP verification failed.'),
          variant: 'destructive',
          duration: 3000,
        })
      }
    } catch {
      toast({
        title: 'Verification error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-zinc-900">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-md">
        <h2 className="mb-2 text-2xl font-bold text-zinc-900">Email verification</h2>
        <p className="mb-6 text-sm text-zinc-600">
          Enter the 5-digit verification code that was sent to your email.
        </p>
        <div className="mb-6 flex justify-center gap-4">
          {code.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-12 rounded-md border border-zinc-300 text-center text-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={isLoading}
          className={`w-full rounded-md py-2.5 text-sm font-semibold text-white transition-colors ${
            isLoading ? 'cursor-not-allowed bg-zinc-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Verifying…' : 'Verify account'}
        </button>
        <p className="mt-4 text-sm text-zinc-500">
          Didn&apos;t receive code?{' '}
          <button
            type="button"
            disabled={isResending || isLoading}
            className={`font-medium ${
              isResending || isLoading ? 'cursor-not-allowed text-zinc-400' : 'text-blue-600 hover:underline'
            }`}
            onClick={() => void handleResendOTP()}
          >
            {isResending ? 'Sending…' : 'Resend'}
          </button>
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700"
        >
          Back to login
        </button>
      </div>
    </div>
  )
}
