import { useState, useMemo } from 'react'
import { Plus, Users, Pencil, Trash2, Search, SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ContactModal } from '@/components/contacts/ContactModal'
import { useContacts } from '@/hooks/useContacts'
import { useConnections } from '@/hooks/useConnections'
import { createContact, updateContact, deleteContact } from '@/services/contactService'
import { useAuthStore } from '@/store/authStore'
import type { Contact, CreateContactData } from '@/types/contact.types'

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-orange-500',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
]

const getAvatarColor = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash]
}

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

export const ContactsPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  const [deleting, setDeleting] = useState<Contact | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [filterConnectionId, setFilterConnectionId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { contacts, loading } = useContacts(filterConnectionId)
  const { connections } = useConnections()
  const { user } = useAuthStore()

  const connectionMap = useMemo(
    () => Object.fromEntries(connections.map((c) => [c.id, c.name])),
    [connections],
  )

  const CONNECTION_BADGE_COLORS: Record<string, string> = useMemo(() => {
    const palette = [
      'bg-blue-100 text-blue-700',
      'bg-violet-100 text-violet-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-cyan-100 text-cyan-700',
      'bg-pink-100 text-pink-700',
    ]
    return Object.fromEntries(connections.map((c, i) => [c.id, palette[i % palette.length]]))
  }, [connections])

  const filtered = useMemo(
    () =>
      search.trim()
        ? contacts.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.phone.includes(search),
          )
        : contacts,
    [contacts, search],
  )

  const handleSave = async (data: CreateContactData) => {
    if (!user) return
    if (editing) await updateContact(editing.id, data)
    else await createContact(user.uid, data)
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try { await deleteContact(deleting.id) }
    finally { setDeleteLoading(false); setDeleting(null) }
  }

  if (loading) return <LoadingSpinner fullPage />

  const hasFilters = !!(search || filterConnectionId)

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Contatos"
        subtitle={`${contacts.length} contato${contacts.length !== 1 ? 's' : ''} cadastrado${contacts.length !== 1 ? 's' : ''}`}
        icon={<Users size={20} />}
        gradient="bg-gradient-to-br from-violet-500 to-violet-700"
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Novo Contato
          </button>
        }
      />

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-main-text placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white shadow-sm"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={filterConnectionId ?? ''}
            onChange={(e) => setFilterConnectionId(e.target.value || null)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-main-text outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Todas as conexões</option>
            {connections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={26} />}
          title={hasFilters ? 'Nenhum contato encontrado' : 'Nenhum contato ainda'}
          description={hasFilters ? 'Tente ajustar os filtros de busca.' : 'Adicione seu primeiro contato para começar a disparar mensagens.'}
          action={
            !hasFilters ? (
              <button
                onClick={() => { setEditing(null); setModalOpen(true) }}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Novo Contato
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* table header */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] sm:grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-0 border-b border-gray-100 bg-slate-50/70 px-5 py-3">
            <div className="w-8" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">Nome</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">Telefone</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 hidden sm:block">Conexão</span>
            <div className="w-20" />
          </div>

          {/* rows */}
          {filtered.map((contact, i) => (
            <div
              key={contact.id}
              className={`grid grid-cols-[auto_1fr_1fr_auto] sm:grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-0 px-5 py-3.5 hover:bg-violet-50/40 transition-colors group ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              {/* avatar */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {getInitials(contact.name)}
              </div>

              <span className="px-3 font-semibold text-sm text-main-text truncate">{contact.name}</span>
              <span className="px-3 text-sm text-muted-text font-mono">{contact.phone}</span>

              <div className="px-3 hidden sm:block">
                {connectionMap[contact.connectionId] ? (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CONNECTION_BADGE_COLORS[contact.connectionId] ?? 'bg-slate-100 text-slate-600'}`}>
                    {connectionMap[contact.connectionId]}
                  </span>
                ) : (
                  <span className="text-xs text-muted-text">—</span>
                )}
              </div>

              <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditing(contact); setModalOpen(true) }}
                  className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleting(contact)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactModal
        open={modalOpen}
        editing={editing}
        connections={connections}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Excluir contato"
        description={`Tem certeza que deseja excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
