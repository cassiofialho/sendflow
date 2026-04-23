import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthInput } from '@/components/ui/AuthInput'
import { signUp } from '@/services/authService'
import type { RegisterFormData } from '@/types/auth.types'

const schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const RegisterPage = () => {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      await signUp(data.email, data.password, data.name)
      navigate('/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('email-already-in-use')) {
        setServerError('Este e-mail já está em uso.')
      } else {
        setServerError('Erro ao criar conta. Tente novamente.')
      }
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a usar o SendFlow gratuitamente">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthInput
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          error={errors.name?.message}
          {...register('name')}
        />
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
        <AuthInput
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {serverError && (
          <p className="text-sm text-destructive bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-md text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-text mt-6">
        Já tem conta?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
