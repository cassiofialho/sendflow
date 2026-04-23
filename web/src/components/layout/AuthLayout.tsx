import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className="min-h-screen flex">
    <div
      className="hidden lg:flex lg:w-[55%] relative bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(8,15,32,0.85) 0%, rgba(10,31,78,0.7) 60%, rgba(0,89,232,0.3) 100%), url(https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80)',
      }}
    >
      <div className="flex flex-col justify-between p-10 w-full">
        <img src="/logo.svg" alt="SendFlow" className="h-9 w-auto" />
        <div>
          <h1 className="font-heading font-extrabold text-white text-4xl mb-4 leading-tight">
            Mensagens certas,<br />na hora certa.
          </h1>
          <p className="text-white/70 text-lg">
            Gerencie contatos, crie mensagens e agende envios com precisão.
          </p>
        </div>
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} SendFlow</p>
      </div>
    </div>

    <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-page-bg">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden inline-flex items-center bg-[#0a1f4e] rounded-lg px-3 py-1.5">
          <img src="/logo.svg" alt="SendFlow" className="h-7 w-auto" />
        </div>

        <h2 className="font-heading font-bold text-main-text text-2xl mb-1">{title}</h2>
        <p className="text-muted-text text-sm mb-8">{subtitle}</p>

        {children}
      </div>
    </div>
  </div>
)
