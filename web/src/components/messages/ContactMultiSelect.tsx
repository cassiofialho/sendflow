import { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'
import type { Contact } from '@/types/contact.types'
import type { Connection } from '@/types/connection.types'

interface ContactMultiSelectProps {
  contacts: Contact[]
  connections: Connection[]
  selectedIds: string[]
  onChange: (ids: string[], names: string[]) => void
  error?: string
}

export const ContactMultiSelect = ({
  contacts,
  connections,
  selectedIds,
  onChange,
  error,
}: ContactMultiSelectProps) => {
  const [search, setSearch] = useState('')
  const [filterConnectionId, setFilterConnectionId] = useState('')

  const connectionMap = useMemo(
    () => Object.fromEntries(connections.map((c) => [c.id, c.name])),
    [connections],
  )

  const contactMap = useMemo(
    () => Object.fromEntries(contacts.map((c) => [c.id, c])),
    [contacts],
  )

  const filtered = useMemo(() => {
    let list = contacts
    if (filterConnectionId) list = list.filter((c) => c.connectionId === filterConnectionId)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
      )
    }
    return list
  }, [contacts, filterConnectionId, search])

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id]
    onChange(next, next.map((sid) => contactMap[sid]?.name ?? sid))
  }

  const remove = (id: string) => {
    const next = selectedIds.filter((s) => s !== id)
    onChange(next, next.map((sid) => contactMap[sid]?.name ?? sid))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-text">
        Contatos *
      </label>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-accent/40 rounded-md border border-border">
          {selectedIds.map((id) => {
            const c = contactMap[id]
            if (!c) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="hover:text-white/70 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            )
          })}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar contato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border outline-none focus:border-primary focus:shadow-input transition-all placeholder:text-slate-400 text-main-text"
          />
        </div>
        <select
          value={filterConnectionId}
          onChange={(e) => setFilterConnectionId(e.target.value)}
          className="px-3 py-2 rounded-md border border-border text-sm text-main-text outline-none focus:border-primary transition-all bg-white min-w-[140px]"
        >
          <option value="">Todas</option>
          {connections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className={`max-h-48 overflow-y-auto rounded-md border ${error ? 'border-destructive' : 'border-border'} bg-white`}>
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-text py-6">Nenhum contato encontrado</p>
        ) : (
          filtered.map((contact) => {
            const isSelected = selectedIds.includes(contact.id)
            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => toggle(contact.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-50 last:border-0
                  ${isSelected ? 'bg-primary/8 text-primary' : 'text-main-text hover:bg-secondary-bg'}`}
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-text">{contact.phone} · {connectionMap[contact.connectionId]}</p>
                </div>
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center
                  ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
