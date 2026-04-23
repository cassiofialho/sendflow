export interface Connection {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateConnectionData {
  name: string
}

export interface UpdateConnectionData {
  name: string
}
