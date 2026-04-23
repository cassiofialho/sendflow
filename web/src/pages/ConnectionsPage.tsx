import { useState } from 'react'
import { Plus, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ConnectionCard } from '@/components/connections/ConnectionCard'
import { ConnectionModal } from '@/components/connections/ConnectionModal'
import { useConnections } from '@/hooks/useConnections'
import { useContacts } from '@/hooks/useContacts'
import { createConnection, updateConnection, deleteConnection } from '@/services/connectionService'
import { useAuthStore } from '@/store/authStore'
import type { Connection, CreateConnectionData } from '@/types/connection.types'

export const ConnectionsPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Connection | null>(null)
  const [deleting, setDeleting] = useState<Connection | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { connections, loading } = useConnections()
  const { contacts } = useContacts()
  const { user } = useAuthStore()

  const getContactCount = (connectionId: string) =>
    contacts.filter((c) => c.connectionId === connectionId).length

  const handleOpenCreate = () => { setEditing(null); setModalOpen(true) }
  const handleOpenEdit = (connection: Connection) => { setEditing(connection); setModalOpen(true) }

  const handleSave = async (data: CreateConnectionData) => {
    if (!user) return
    if (editing) await updateConnection(editing.id, data)
    else await createConnection(user.uid, data)
  }

  const handleConfirmDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try { await deleteConnection(deleting.id) }
    finally { setDeleteLoading(false); setDeleting(null) }
  }

  if (loading) return <LoadingSpinner fullPage />

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Conexões"
        subtitle={`${connections.length} canal${connections.length !== 1 ? 'is' : ''} de comunicação`}
        icon={<Link2 size={20} />}
        gradient="bg-gradient-to-br from-blue-500 to-blue-700"
        action={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Nova Conexão
          </button>
        }
      />

      {connections.length === 0 ? (
        <EmptyState
          icon={<Link2 size={26} />}
          title="Nenhuma conexão ainda"
          description="Crie sua primeira conexão para começar a organizar seus contatos e disparar mensagens."
          action={
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Nova Conexão
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              contactCount={getContactCount(connection.id)}
              onEdit={handleOpenEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <ConnectionModal
        open={modalOpen}
        editing={editing}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Excluir conexão"
        description={`Tem certeza que deseja excluir a conexão "${deleting?.name}"? Os contatos vinculados não serão excluídos.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
