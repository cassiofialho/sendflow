import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, MenuItem, Select, FormControl, InputLabel, FormHelperText,
} from '@mui/material'
import { FormInput } from '@/components/ui/FormInput'
import type { Contact, CreateContactData } from '@/types/contact.types'
import type { Connection } from '@/types/connection.types'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(20, 'Telefone inválido')
    .regex(/^[+\d\s()-]+$/, 'Apenas números e caracteres + ( ) - são permitidos'),
  connectionId: z.string().min(1, 'Selecione uma conexão'),
})

interface ContactModalProps {
  open: boolean
  editing: Contact | null
  connections: Connection[]
  onSave: (data: CreateContactData) => Promise<void>
  onClose: () => void
}

export const ContactModal = ({ open, editing, connections, onSave, onClose }: ContactModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateContactData>({ resolver: zodResolver(schema) })

  const connectionId = watch('connectionId')

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? { name: editing.name, phone: editing.phone, connectionId: editing.connectionId }
          : { name: '', phone: '', connectionId: '' },
      )
    }
  }, [open, editing, reset])

  const onSubmit = async (data: CreateContactData) => {
    await onSave(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
          {editing ? 'Editar contato' : 'Novo contato'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <FormInput label="Nome" placeholder="Nome do contato" error={errors.name?.message} {...register('name')} />
          <FormInput label="Telefone" placeholder="+55 11 99999-8888" error={errors.phone?.message} {...register('phone')} />
          <FormControl error={!!errors.connectionId} size="small">
            <InputLabel sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem' }}>Conexão</InputLabel>
            <Select
              value={connectionId ?? ''}
              label="Conexão"
              onChange={(e) => setValue('connectionId', e.target.value, { shouldValidate: true })}
              sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
            >
              {connections.map((c) => (
                <MenuItem key={c.id} value={c.id} sx={{ fontFamily: 'Inter, sans-serif' }}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.connectionId && (
              <FormHelperText>{errors.connectionId.message}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ textTransform: 'none', bgcolor: '#0059e8', '&:hover': { bgcolor: '#0047c7' } }}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
