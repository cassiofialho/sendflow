import { BrowserRouter } from 'react-router-dom'
import { useAuthListener } from '@/hooks/useAuth'
import { AppRouter } from '@/router'

const AuthInit = () => {
  useAuthListener()
  return <AppRouter />
}

export const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthInit />
  </BrowserRouter>
)
