import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ConnectionsPage } from '@/pages/ConnectionsPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { MessagesPage } from '@/pages/MessagesPage'
import { MessageFormPage } from '@/pages/MessageFormPage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingSpinner fullPage />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    <Route
      element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/messages/new" element={<MessageFormPage />} />
      <Route path="/messages/:id/edit" element={<MessageFormPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
)
