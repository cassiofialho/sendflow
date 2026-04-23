import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDateTime = (date: Date): string =>
  format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

export const formatDate = (date: Date): string =>
  format(date, 'dd/MM/yyyy', { locale: ptBR })

export const formatPhone = (phone: string): string => phone
