import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Link2,
  Users,
  MessageSquare,
  LogOut,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { signOut } from '@/services/authService'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Conexões', to: '/connections', icon: <Link2 size={18} /> },
  { label: 'Contatos', to: '/contacts', icon: <Users size={18} /> },
  { label: 'Mensagens', to: '/messages', icon: <MessageSquare size={18} /> },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-sidebar-bg border-r border-white/[0.08]
          transition-all duration-300
          ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08]">
          {!collapsed && (
            <img src="/logo.svg" alt="SendFlow" className="h-7 w-auto" />
          )}
          {collapsed && <Send size={20} className="text-primary mx-auto" />}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded text-white/40 hover:text-white/80 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 text-sm transition-all duration-200
                 ${collapsed ? 'justify-center px-0' : 'px-5'}
                 ${isActive
                  ? 'bg-primary/20 text-blue-400 border-l-[3px] border-primary'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border-l-[3px] border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="py-4 border-t border-white/[0.08]">
          <button
            onClick={handleSignOut}
            className={`
              flex items-center gap-3 w-full py-3 text-sm
              text-slate-400 hover:bg-white/[0.06] hover:text-white
              transition-colors duration-200
              ${collapsed ? 'justify-center px-0' : 'px-5'}
            `}
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
