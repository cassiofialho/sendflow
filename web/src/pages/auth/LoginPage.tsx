import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthInput } from '@/components/ui/AuthInput'
import { signIn } from '@/services/authService'
import type { LoginFormData } from '@/types/auth.types'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const LoginPage = () => {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      await signIn(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setServerError('E-mail ou senha inválidos.')
      } else {
        setServerError('Erro ao entrar. Tente novamente.')
      }
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre com sua conta para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthInput
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <AuthInput
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p className="text-sm text-destructive bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-md text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-text mt-6">
        Não tem conta?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  )
}
