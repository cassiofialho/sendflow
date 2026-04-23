import { useEffect } from 'react'
import { subscribeToAuthChanges } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

export const useAuthListener = (): void => {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Safety timeout: if Firebase doesn't respond in 5s, stop the loading state
    const timeout = setTimeout(() => setLoading(false), 5000)

    const unsubscribe = subscribeToAuthChanges((user) => {
      clearTimeout(timeout)
      setUser(user)
      setLoading(false)
    })
    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [setUser, setLoading])
}
