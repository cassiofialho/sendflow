import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary shadow-inner">
        <div className="scale-150">{icon}</div>
      </div>
      <div className="absolute -inset-2 rounded-2xl border border-primary/10 animate-pulse" />
    </div>
    <h3 className="font-heading font-bold text-main-text text-lg mb-2">{title}</h3>
    <p className="text-muted-text text-sm max-w-xs mb-7 leading-relaxed">{description}</p>
    {action}
  </div>
)
