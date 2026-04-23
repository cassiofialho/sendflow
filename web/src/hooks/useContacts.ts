import { useState, useEffect } from 'react'
import { subscribeToContacts } from '@/services/contactService'
import { useAuthStore } from '@/store/authStore'
import type { Contact } from '@/types/contact.types'

interface UseContactsReturn {
  contacts: Contact[]
  loading: boolean
}

export const useContacts = (connectionId: string | null = null): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      setContacts([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToContacts(user.uid, connectionId, (data) => {
      setContacts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user, connectionId])

  return { contacts, loading }
}
