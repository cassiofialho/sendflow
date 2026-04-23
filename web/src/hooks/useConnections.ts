import { useState, useEffect } from 'react'
import { subscribeToConnections } from '@/services/connectionService'
import { useAuthStore } from '@/store/authStore'
import type { Connection } from '@/types/connection.types'

interface UseConnectionsReturn {
  connections: Connection[]
  loading: boolean
}

export const useConnections = (): UseConnectionsReturn => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      setConnections([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToConnections(user.uid, (data) => {
      setConnections(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { connections, loading }
}
