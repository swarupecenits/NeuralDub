import type React from 'react'
import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Alert from '../components/Alert'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const navigate = useNavigate()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return
    }
    // Handle signup logic here
    // For now, redirect to dashboard
    navigate('/dashboard')
  }

  const passwordStrength = {
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumbers: /\d/.test(formData.password),
    hasMinLength: formData.password.length >= 8,
  }

  const isPasswordStrong = Object.values(passwordStrength).every((val) => val)

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join NeuralDub and start translating</p>
        </div>

        <Card>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              {formData.password && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Password strength</p>
                  <div className="space-y-1">
                    {Object.entries(passwordStrength).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            value
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'border-slate-600'
                          }`}
                        >
                          {value && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs text-slate-400">
                          {key === 'hasUpperCase' && 'Uppercase letter'}
                          {key === 'hasLowerCase' && 'Lowercase letter'}
                          {key === 'hasNumbers' && 'Number'}
                          {key === 'hasMinLength' && 'At least 8 characters'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              error={
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-4 h-4 mt-1"
                required
              />
              <span className="text-sm text-slate-300">
                I agree to the{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200 transition">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-300 hover:text-purple-200 transition">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isPasswordStrong || !formData.acceptTerms}
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">Or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-purple-500/30 rounded-lg text-slate-300 hover:bg-purple-500/10 transition"
            >
              Continue with Google
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-purple-500/30 rounded-lg text-slate-300 hover:bg-purple-500/10 transition"
            >
              Continue with GitHub
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-500/20 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-300 hover:text-purple-200 transition font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-6">
          <Alert
            type="info"
            message="By signing up, you agree to our Terms of Service and Privacy Policy"
          />
        </div>
      </div>
    </div>
  )
}
