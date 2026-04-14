import { useState, type ChangeEvent, type FormEvent } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

export default function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Password and confirm password must be the same.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    try {
      const response = await fetch('https://map.paninsight.org/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          gender: formData.gender,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const res = (await response.json()) as { success?: boolean; message?: unknown }

      if (res.success) {
        try {
          localStorage.setItem(
            'PendingUser',
            JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              gender: formData.gender,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }),
          )
        } catch {
        }
        toast({
          title: 'Registration started',
          description: 'OTP sent to your email. Please verify.',
          duration: 3000,
        })
        navigate('/otp')
      } else {
        toast({
          title: 'Registration failed',
          description: String(res.message ?? 'Unable to register'),
          variant: 'destructive',
          duration: 3000,
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 pb-12 pt-24 text-zinc-900 md:px-12">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-zinc-900">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-zinc-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-zinc-300 py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600 hover:text-zinc-900"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
