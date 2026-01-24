import React from 'react'

interface ProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  color?: 'purple' | 'green' | 'blue'
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = 'purple',
}: ProgressBarProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
  }

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-purple-300">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden border border-purple-500/20">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
