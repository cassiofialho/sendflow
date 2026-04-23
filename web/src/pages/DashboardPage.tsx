import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Link2, Users, MessageSquare, Clock, CheckCircle2,
  Plus, ArrowRight, Zap, TrendingUp,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useConnections } from '@/hooks/useConnections'
import { useContacts } from '@/hooks/useContacts'
import { useMessages } from '@/hooks/useMessages'
import { useAuthStore } from '@/store/authStore'
import { formatDateTime } from '@/utils/formatters'

interface StatCardProps {
  label: string
  value: number
  icon: ReactNode
  gradient: string
  shadow: string
  onClick: () => void
}

const StatCard = ({ label, value, icon, gradient, shadow, onClick }: StatCardProps) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl p-5 text-left w-full transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${gradient} ${shadow}`}
  >
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
        <p className="text-white font-heading font-extrabold text-4xl leading-none">{value}</p>
      </div>
      <div className="bg-white/20 group-hover:bg-white/30 rounded-xl p-2.5 text-white transition-colors">
        {icon}
      </div>
    </div>
    <div className="absolute -bottom-5 -right-5 w-28 h-28 rounded-full bg-white/10" />
    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
    <div className="absolute top-3 right-14 w-10 h-10 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
)

interface QuickActionProps {
  label: string
  description: string
  icon: ReactNode
  onClick: () => void
  iconBg: string
}

const QuickAction = ({ label, description, icon, onClick, iconBg }: QuickActionProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200 text-left group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-main-text">{label}</p>
      <p className="text-xs text-muted-text truncate mt-0.5">{description}</p>
    </div>
    <ArrowRight size={15} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
  </button>
)

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { connections, loading: connLoading } = useConnections()
  const { contacts, loading: contLoading } = useContacts()
  const { messages, loading: msgLoading } = useMessages()

  const loading = connLoading || contLoading || msgLoading

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  })()

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'usuário'
  const scheduled = messages.filter((m) => m.status === 'agendada')
  const sent = messages.filter((m) => m.status === 'enviada')
  const recent = [...messages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="max-w-5xl mx-auto">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-[#060f2a] via-[#0a1f4e] to-[#0039a6] px-8 py-8">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-blue-500/20 -translate-y-1/3 translate-x-1/4 blur-2xl" />
        <div className="absolute bottom-0 right-24 w-40 h-40 rounded-full bg-indigo-400/20 translate-y-1/2 blur-xl" />
        <div className="absolute top-1/2 right-10 w-20 h-20 rounded-full bg-blue-300/20 -translate-y-1/2" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="mb-3">
              <img src="/logo.svg" alt="SendFlow" className="h-6 w-auto opacity-70" />
            </div>
            <h1 className="font-heading font-extrabold text-white text-3xl mb-2 leading-tight">
              {greeting}, {displayName}! 👋
            </h1>
            <p className="text-white/55 text-sm">
              Você tem{' '}
              <span className="text-white font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                {scheduled.length} mensagem{scheduled.length !== 1 ? 'ns' : ''} agendada{scheduled.length !== 1 ? 's' : ''}
              </span>{' '}
              aguardando envio.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3">
            <TrendingUp size={18} className="text-emerald-400" />
            <div>
              <p className="text-white font-bold text-lg leading-none">{sent.length}</p>
              <p className="text-white/50 text-xs mt-0.5">enviadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Conexões"
          value={connections.length}
          icon={<Link2 size={20} />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          shadow="shadow-lg shadow-blue-200"
          onClick={() => navigate('/connections')}
        />
        <StatCard
          label="Contatos"
          value={contacts.length}
          icon={<Users size={20} />}
          gradient="bg-gradient-to-br from-violet-500 to-violet-700"
          shadow="shadow-lg shadow-violet-200"
          onClick={() => navigate('/contacts')}
        />
        <StatCard
          label="Agendadas"
          value={scheduled.length}
          icon={<Clock size={20} />}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          shadow="shadow-lg shadow-amber-200"
          onClick={() => navigate('/messages')}
        />
        <StatCard
          label="Enviadas"
          value={sent.length}
          icon={<CheckCircle2 size={20} />}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          shadow="shadow-lg shadow-emerald-200"
          onClick={() => navigate('/messages')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent messages */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MessageSquare size={15} className="text-indigo-600" />
              </div>
              <h2 className="font-semibold text-main-text text-sm">Mensagens Recentes</h2>
            </div>
            <button
              onClick={() => navigate('/messages')}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
            >
              Ver todas <ArrowRight size={12} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-14 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <MessageSquare size={22} className="text-indigo-500" />
              </div>
              <p className="text-main-text font-semibold text-sm mb-1">Nenhuma mensagem ainda</p>
              <p className="text-muted-text text-xs mb-5">Crie sua primeira mensagem agendada</p>
              <button
                onClick={() => navigate('/messages/new')}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg"
              >
                <Plus size={13} /> Nova Mensagem
              </button>
            </div>
          ) : (
            <div>
              {recent.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors ${i < recent.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <StatusBadge status={msg.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-main-text font-medium truncate">{msg.content}</p>
                    <p className="text-xs text-muted-text mt-0.5 truncate">
                      {msg.contactNames.slice(0, 2).join(', ')}
                      {msg.contactNames.length > 2 && ` +${msg.contactNames.length - 2}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 hidden sm:block whitespace-nowrap">
                    {formatDateTime(msg.scheduledAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1 mb-1">
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
              <Zap size={13} className="text-amber-600" />
            </div>
            <h2 className="font-semibold text-main-text text-sm">Ações Rápidas</h2>
          </div>

          <QuickAction
            label="Nova Mensagem"
            description="Agendar envio para contatos"
            icon={<Plus size={17} className="text-white" />}
            onClick={() => navigate('/messages/new')}
            iconBg="bg-gradient-to-br from-indigo-500 to-indigo-700"
          />
          <QuickAction
            label="Nova Conexão"
            description="Criar canal de comunicação"
            icon={<Link2 size={17} className="text-blue-600" />}
            onClick={() => navigate('/connections')}
            iconBg="bg-blue-50"
          />
          <QuickAction
            label="Novo Contato"
            description="Adicionar pessoa à lista"
            icon={<Users size={17} className="text-violet-600" />}
            onClick={() => navigate('/contacts')}
            iconBg="bg-violet-50"
          />
          <QuickAction
            label="Ver Agendadas"
            description={`${scheduled.length} mensagem${scheduled.length !== 1 ? 'ns' : ''} pendente${scheduled.length !== 1 ? 's' : ''}`}
            icon={<Clock size={17} className="text-amber-600" />}
            onClick={() => navigate('/messages')}
            iconBg="bg-amber-50"
          />
        </div>

      </div>
    </div>
  )
}
