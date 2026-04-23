import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-text">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full px-3.5 py-2.5 rounded-md text-sm text-main-text
              border transition-all duration-200
              placeholder:text-slate-400
              outline-none
              ${error
                ? 'border-destructive shadow-input-error'
                : 'border-border focus:border-primary focus:shadow-input'
              }
              ${isPassword ? 'pr-10' : ''}
              ${className ?? ''}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-muted-text transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  },
)
AuthInput.displayName = 'AuthInput'
