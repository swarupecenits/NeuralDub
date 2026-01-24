import type React from 'react'
import { useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Alert from '../components/Alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    // For now, redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your NeuralDub account</p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-300 hover:text-purple-200 transition">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
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
              Don't have an account?{' '}
              <a href="/signup" className="text-purple-300 hover:text-purple-200 transition font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-6">
          <Alert
            type="info"
            message="Demo Mode: Use any email and password to continue"
          />
        </div>
      </div>
    </div>
  )
}
