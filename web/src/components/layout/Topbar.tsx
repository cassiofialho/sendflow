import { Menu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface TopbarProps {
  onMenuOpen: () => void
}

export const Topbar = ({ onMenuOpen }: TopbarProps) => {
  const { user } = useAuthStore()

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuário'
  const email = user?.email ?? ''
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-60 z-20 h-14 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-3 shadow-sm">
      {/* menu hamburguer — só mobile */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* logo — só mobile */}
      <div className="lg:hidden">
        <img src="/logo.svg" alt="SendFlow" className="h-6 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(21%) sepia(72%) saturate(2000%) hue-rotate(210deg) brightness(90%) contrast(105%)' }} />
      </div>

      {/* espaço flexível */}
      <div className="flex-1" />

      {/* info do usuário */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-main-text">{displayName}</span>
          <span className="text-xs text-muted-text">{email}</span>
        </div>

        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white text-sm font-semibold select-none">
          {initials}
        </div>
      </div>
    </header>
  )
}
