import { Pencil, Trash2, Users, Link2 } from 'lucide-react'
import type { Connection } from '@/types/connection.types'

interface ConnectionCardProps {
  connection: Connection
  contactCount: number
  onEdit: (connection: Connection) => void
  onDelete: (connection: Connection) => void
}

const GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700',
  'from-indigo-500 to-indigo-700',
  'from-sky-500 to-sky-700',
  'from-purple-500 to-purple-700',
]

const getGradient = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % GRADIENTS.length
  return GRADIENTS[hash]
}

export const ConnectionCard = ({ connection, contactCount, onEdit, onDelete }: ConnectionCardProps) => {
  const gradient = getGradient(connection.name)
  const initials = connection.name.slice(0, 2).toUpperCase()

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* gradient top strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* avatar + name */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-main-text text-base leading-tight truncate">{connection.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Link2 size={11} className="text-muted-text" />
              <span className="text-xs text-muted-text">Canal ativo</span>
            </div>
          </div>
        </div>

        {/* stats chip */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
            <Users size={13} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">
              {contactCount} {contactCount === 1 ? 'contato' : 'contatos'}
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
          <button
            onClick={() => onEdit(connection)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary hover:bg-blue-50 py-2 rounded-lg transition-colors"
          >
            <Pencil size={13} />
            Editar
          </button>
          <div className="w-px h-5 bg-gray-100" />
          <button
            onClick={() => onDelete(connection)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
