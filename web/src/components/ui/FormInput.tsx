import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldWrapperProps {
  label: string
  error?: string
  children: React.ReactNode
}

const FieldWrapper = ({ label, error, children }: FieldWrapperProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-muted-text">{label}</label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
)

const fieldClasses = (error?: string) =>
  `w-full px-3.5 py-2.5 rounded-md text-sm text-main-text border transition-all duration-200 placeholder:text-slate-400 outline-none bg-white ${
    error
      ? 'border-destructive shadow-input-error'
      : 'border-border focus:border-primary focus:shadow-input'
  }`

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error}>
      <input ref={ref} className={`${fieldClasses(error)} ${className ?? ''}`} {...props} />
    </FieldWrapper>
  ),
)
FormInput.displayName = 'FormInput'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, rows = 4, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error}>
      <textarea
        ref={ref}
        rows={rows}
        className={`${fieldClasses(error)} resize-none ${className ?? ''}`}
        {...props}
      />
    </FieldWrapper>
  ),
)
FormTextarea.displayName = 'FormTextarea'
