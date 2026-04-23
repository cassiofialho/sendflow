import { Clock, CheckCircle2 } from 'lucide-react'
import type { MessageStatus } from '@/types/message.types'

interface StatusBadgeProps {
  status: MessageStatus
}

const config: Record<MessageStatus, { label: string; dot: string; text: string; bg: string; icon: React.ReactNode }> = {
  agendada: {
    label: 'Agendada',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50 border border-amber-200',
    icon: <Clock size={11} />,
  },
  enviada: {
    label: 'Enviada',
    dot: 'bg-emerald-400',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50 border border-emerald-200',
    icon: <CheckCircle2 size={11} />,
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, dot, text, bg, icon } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {icon}
      {label}
    </span>
  )
}
