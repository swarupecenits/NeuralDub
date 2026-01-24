import { FileQuestion, Home, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <FileQuestion className="w-24 h-24 text-purple-400 mx-auto mb-6 opacity-50" />
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 mb-8">
          <p className="text-slate-300 mb-4">
            Let's get you back on track with our main features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/">
              <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-slate-200 flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <Link to="/translator">
              <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-slate-200 flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Translator
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-slate-200 flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
          </div>
        </Card>

        <Link to="/">
          <Button size="lg">
            <Home className="w-5 h-5" />
            Go Back Home
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
