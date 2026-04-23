import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: ReactNode
  gradient?: string
}

export const PageHeader = ({ title, subtitle, action, icon, gradient }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-7">
    <div className="flex items-center gap-4">
      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 ${gradient ?? 'bg-primary'}`}>
          {icon}
        </div>
      )}
      <div>
        <h1 className="font-heading font-extrabold text-main-text text-2xl leading-tight">{title}</h1>
        {subtitle && <p className="text-muted-text text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)
