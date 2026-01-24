import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

export default function Alert({
  type = 'info',
  title,
  message,
  onClose,
}: AlertProps) {
  const styles = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-200',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-200',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-200',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-200',
      icon: Info,
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.text}`} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
