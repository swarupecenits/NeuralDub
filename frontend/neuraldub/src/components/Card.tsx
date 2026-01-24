import type React from 'react'
import type { LucideIcon } from 'lucide-react'

interface CardProps {
  title?: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 backdrop-blur-sm ${
        hover ? 'hover:border-purple-500/50 hover:bg-slate-800/70 transition' : ''
      } ${className}`}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        </div>
      )}
      {description && <p className="text-slate-400 text-sm mb-4">{description}</p>}
      {children}
    </div>
  )
}
