import { Pencil, Trash2, CalendarClock, Users, Lock } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/utils/formatters'
import type { Message } from '@/types/message.types'

interface MessageCardProps {
  message: Message
  onEdit: (message: Message) => void
  onDelete: (message: Message) => void
}

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}…` : text

const formatContactList = (names: string[]) => {
  if (names.length === 0) return '—'
  if (names.length <= 2) return names.join(', ')
  return `${names.slice(0, 2).join(', ')} +${names.length - 2}`
}

export const MessageCard = ({ message, onEdit, onDelete }: MessageCardProps) => {
  const isLocked = message.status === 'enviada'
  const accentColor = isLocked ? 'bg-emerald-400' : 'bg-amber-400'

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} rounded-l-2xl`} />

      <div className="pl-5 pr-5 pt-5 pb-4 flex flex-col flex-1">
        {/* header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <StatusBadge status={message.status} />
          <div className="flex items-center gap-1">
            <button
              onClick={() => !isLocked && onEdit(message)}
              disabled={isLocked}
              title={isLocked ? 'Mensagem já enviada' : 'Editar'}
              className={`p-1.5 rounded-lg transition-colors ${
                isLocked
                  ? 'text-gray-200 cursor-not-allowed'
                  : 'text-slate-400 hover:text-primary hover:bg-blue-50'
              }`}
            >
              {isLocked ? <Lock size={13} /> : <Pencil size={13} />}
            </button>
            <button
              onClick={() => onDelete(message)}
              title="Excluir"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* content */}
        <p className="text-main-text text-sm leading-relaxed flex-1 mb-4">
          {truncate(message.content, 130)}
        </p>

        {/* footer meta */}
        <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-muted-text">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Users size={11} className="text-slate-500" />
            </div>
            <span className="truncate">{formatContactList(message.contactNames)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-text">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
              <CalendarClock size={11} className="text-slate-500" />
            </div>
            <span>{formatDateTime(message.scheduledAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
