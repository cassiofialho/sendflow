import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { FormInput } from '@/components/ui/FormInput'
import type { Connection, CreateConnectionData } from '@/types/connection.types'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
})

interface ConnectionModalProps {
  open: boolean
  editing: Connection | null
  onSave: (data: CreateConnectionData) => Promise<void>
  onClose: () => void
}

export const ConnectionModal = ({ open, editing, onSave, onClose }: ConnectionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConnectionData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(editing ? { name: editing.name } : { name: '' })
    }
  }, [open, editing, reset])

  const onSubmit = async (data: CreateConnectionData) => {
    await onSave(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
          {editing ? 'Editar conexão' : 'Nova conexão'}
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <FormInput
            label="Nome da conexão"
            placeholder="Ex: WhatsApp Vendas"
            error={errors.name?.message}
            {...register('name')}
          />
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
