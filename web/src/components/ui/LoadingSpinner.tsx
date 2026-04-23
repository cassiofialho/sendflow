interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

const sizeClasses = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-12 h-12' }

export const LoadingSpinner = ({ size = 'md', fullPage = false }: LoadingSpinnerProps) => {
  const spinner = (
    <div
      className={`${sizeClasses[size]} border-2 border-accent border-t-primary rounded-full animate-spin`}
    />
  )
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    )
  }
  return spinner
}
