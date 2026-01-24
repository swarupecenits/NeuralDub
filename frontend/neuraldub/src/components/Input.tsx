import type React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2.5 ${
            icon ? 'pl-10' : ''
          } text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition ${
            error ? 'border-red-500/50 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
