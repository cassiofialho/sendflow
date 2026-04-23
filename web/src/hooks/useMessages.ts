import { useState, useEffect } from 'react'
import { subscribeToMessages, processPastDueMessages } from '@/services/messageService'
import { useAuthStore } from '@/store/authStore'
import type { Message, MessageStatusFilter } from '@/types/message.types'

interface UseMessagesReturn {
  messages: Message[]
  loading: boolean
}

export const useMessages = (statusFilter: MessageStatusFilter = 'all'): UseMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  // Processa mensagens vencidas imediatamente e a cada minuto,
  // espelhando o que a Cloud Function faz em produção.
  useEffect(() => {
    if (!user) return
    processPastDueMessages(user.uid)
    const interval = setInterval(() => processPastDueMessages(user.uid), 60_000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    if (!user) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToMessages(user.uid, statusFilter, (data) => {
      setMessages(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user, statusFilter])

  return { messages, loading }
}
