export type MessageStatus = 'agendada' | 'enviada'

export interface Message {
  id: string
  userId: string
  content: string
  contactIds: string[]
  contactNames: string[]
  scheduledAt: Date
  status: MessageStatus
  sentAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateMessageData {
  content: string
  contactIds: string[]
  contactNames: string[]
  scheduledAt: Date
}

export interface UpdateMessageData {
  content: string
  contactIds: string[]
  contactNames: string[]
  scheduledAt: Date
}

export type MessageStatusFilter = 'all' | MessageStatus
