'use client'

export type ToastVariant = 'success' | 'error'

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
}

export function Toast({
  message,
  variant = 'success',
  onClose,
}: {
  message: string
  variant?: ToastVariant
  onClose?: () => void
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md z-50 ${variantStyles[variant]}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  )
}
