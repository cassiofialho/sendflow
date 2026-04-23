import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale'
import { FormTextarea } from '@/components/ui/FormInput'
import { ContactMultiSelect } from '@/components/messages/ContactMultiSelect'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useContacts } from '@/hooks/useContacts'
import { useConnections } from '@/hooks/useConnections'
import { useMessages } from '@/hooks/useMessages'
import { createMessage, updateMessage } from '@/services/messageService'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório').max(2000),
  scheduledAt: z
    .date({ required_error: 'Data de envio é obrigatória' })
    .refine((d) => d > new Date(), { message: 'A data deve ser no futuro' }),
  contactIds: z.array(z.string()).min(1, 'Selecione pelo menos 1 contato'),
  contactNames: z.array(z.string()),
})

type FormData = z.infer<typeof schema>

export const MessageFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { contacts, loading: contactsLoading } = useContacts()
  const { connections, loading: connectionsLoading } = useConnections()
  const { messages, loading: messagesLoading } = useMessages()
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contactIds: [], contactNames: [] },
  })

  const contactIds = watch('contactIds')
  const [loadingData, setLoadingData] = useState(isEditing)

  useEffect(() => {
    if (isEditing && !messagesLoading && messages.length > 0) {
      const msg = messages.find((m) => m.id === id)
      if (msg) {
        if (msg.status === 'enviada') {
          navigate('/messages')
          return
        }
        reset({
          content: msg.content,
          scheduledAt: msg.scheduledAt,
          contactIds: msg.contactIds,
          contactNames: msg.contactNames,
        })
      }
      setLoadingData(false)
    }
    if (!isEditing) setLoadingData(false)
  }, [id, isEditing, messages, messagesLoading, navigate, reset])

  const onSubmit = async (data: FormData) => {
    if (!user) return
    if (isEditing && id) {
      await updateMessage(id, data)
    } else {
      await createMessage(user.uid, data)
    }
    navigate('/messages')
  }

  if (loadingData || contactsLoading || connectionsLoading) return <LoadingSpinner fullPage />

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/messages')}
          className="flex items-center gap-2 text-muted-text hover:text-main-text text-sm mb-5 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para mensagens
        </button>

        <h1 className="font-heading font-bold text-main-text text-2xl mb-6">
          {isEditing ? 'Editar mensagem' : 'Nova mensagem'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="bg-card-bg border border-gray-100 rounded-lg p-5 shadow-card flex flex-col gap-5">
            <FormTextarea
              label="Conteúdo da mensagem *"
              rows={5}
              placeholder="Digite o conteúdo da mensagem..."
              error={errors.content?.message}
              {...register('content')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-text">
                Data e Hora de Envio *
              </label>
              <Controller
                name="scheduledAt"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    value={field.value ?? null}
                    onChange={field.onChange}
                    disablePast
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: !!errors.scheduledAt,
                        helperText: errors.scheduledAt?.message,
                        sx: {
                          '& .MuiInputBase-root': {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.875rem',
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <ContactMultiSelect
              contacts={contacts}
              connections={connections}
              selectedIds={contactIds}
              onChange={(ids, names) => {
                setValue('contactIds', ids, { shouldValidate: true })
                setValue('contactNames', names)
              }}
              error={errors.contactIds?.message}
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="px-4 py-2.5 text-sm font-semibold text-muted-text border border-border rounded-md hover:bg-secondary-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold bg-primary hover:bg-primary-hover text-white rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Agendar mensagem'}
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  )
}
