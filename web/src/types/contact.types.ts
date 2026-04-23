export interface Contact {
  id: string
  userId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateContactData {
  connectionId: string
  name: string
  phone: string
}

export interface UpdateContactData {
  connectionId: string
  name: string
  phone: string
}
