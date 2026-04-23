import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MessageSquare, Clock, CheckCircle2, LayoutGrid } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { MessageCard } from '@/components/messages/MessageCard'
import { useMessages } from '@/hooks/useMessages'
import { deleteMessage } from '@/services/messageService'
import type { Message, MessageStatusFilter } from '@/types/message.types'

const STATUS_OPTIONS: { value: MessageStatusFilter; label: string; icon: ReactNode; activeClass: string }[] = [
  { value: 'all', label: 'Todas', icon: <LayoutGrid size={13} />, activeClass: 'bg-slate-800 text-white' },
  { value: 'agendada', label: 'Agendadas', icon: <Clock size={13} />, activeClass: 'bg-amber-500 text-white' },
  { value: 'enviada', label: 'Enviadas', icon: <CheckCircle2 size={13} />, activeClass: 'bg-emerald-500 text-white' },
]

export const MessagesPage = () => {
  const [statusFilter, setStatusFilter] = useState<MessageStatusFilter>('all')
  const [deleting, setDeleting] = useState<Message | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  const { messages, loading } = useMessages(statusFilter)
  const { messages: allMessages } = useMessages('all')

  const countByStatus = (status: MessageStatusFilter) =>
    status === 'all' ? allMessages.length : allMessages.filter((m) => m.status === status).length

  const handleConfirmDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try { await deleteMessage(deleting.id) }
    finally { setDeleteLoading(false); setDeleting(null) }
  }

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Mensagens"
        subtitle={`${allMessages.length} mensagem${allMessages.length !== 1 ? 'ns' : ''} no total`}
        icon={<MessageSquare size={20} />}
        gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
        action={
          <button
            onClick={() => navigate('/messages/new')}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Nova Mensagem
          </button>
        }
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-7 flex-wrap">
        {STATUS_OPTIONS.map((opt) => {
          const count = countByStatus(opt.value)
          const isActive = statusFilter === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? `${opt.activeClass} shadow-md`
                  : 'bg-white text-slate-500 border border-gray-200 hover:border-gray-300 hover:text-slate-700'
              }`}
            >
              {opt.icon}
              {opt.label}
              <span className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={26} />}
          title={statusFilter !== 'all' ? 'Nenhuma mensagem aqui' : 'Nenhuma mensagem ainda'}
          description={
            statusFilter !== 'all'
              ? `Nenhuma mensagem com status "${statusFilter === 'agendada' ? 'Agendada' : 'Enviada'}".`
              : 'Crie sua primeira mensagem agendada e dispare para seus contatos.'
          }
          action={
            statusFilter === 'all' ? (
              <button
                onClick={() => navigate('/messages/new')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Nova Mensagem
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onEdit={(msg) => navigate(`/messages/${msg.id}/edit`)}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Excluir mensagem"
        description="Tem certeza que deseja excluir esta mensagem?"
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
