import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: number
  icon: ReactNode
  accentColor?: string
  onClick?: () => void
}

export const StatsCard = ({ label, value, icon, accentColor = 'text-primary', onClick }: StatsCardProps) => (
  <div
    onClick={onClick}
    className={`
      bg-card-bg border border-gray-100 rounded-lg p-5
      shadow-card hover:shadow-card-hover transition-shadow duration-200
      ${onClick ? 'cursor-pointer' : ''}
    `}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <span className={`${accentColor} opacity-70`}>{icon}</span>
    </div>
    <p className={`font-heading font-bold text-3xl ${accentColor}`}>{value}</p>
  </div>
)
