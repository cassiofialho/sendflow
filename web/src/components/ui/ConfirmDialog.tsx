import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={onCancel}
        disabled={loading}
        sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif' }}
      >
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        color="error"
        sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif' }}
      >
        {loading ? 'Aguarde...' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
)
