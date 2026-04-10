import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { message?: unknown }

      if (response.ok) {
        toast({
          title: 'Check your email',
          description: 'If an account exists, we sent a reset code.',
          duration: 3000,
        })
        navigate('/forgot-password/otp', { state: { email } })
      } else {
        const msg = String(data.message ?? 'Could not send reset code.')
        setError(msg)
        toast({
          title: 'Request failed',
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
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-zinc-900">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">Forgot password</h1>
        <p className="text-sm text-zinc-600">Enter your email and we&apos;ll send a 5-digit code to reset your password.</p>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-md py-2.5 text-sm font-semibold text-white transition-colors ${
              isLoading ? 'cursor-not-allowed bg-zinc-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Sending…' : 'Send reset code'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
