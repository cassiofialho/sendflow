import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Connection, CreateConnectionData, UpdateConnectionData } from '@/types/connection.types'

const COLLECTION = 'connections'

const toTimestamp = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date()

const toConnection = (id: string, data: Record<string, unknown>): Connection => ({
  id,
  userId: data.userId as string,
  name: data.name as string,
  createdAt: toTimestamp(data.createdAt),
  updatedAt: toTimestamp(data.updatedAt),
})

export const subscribeToConnections = (
  userId: string,
  callback: (connections: Connection[]) => void,
): (() => void) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snapshot) => {
    const connections = snapshot.docs.map((docSnap) =>
      toConnection(docSnap.id, docSnap.data() as Record<string, unknown>),
    )
    callback(connections)
  })
}

export const createConnection = async (
  userId: string,
  data: CreateConnectionData,
): Promise<void> => {
  await addDoc(collection(db, COLLECTION), {
    userId,
    name: data.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateConnection = async (
  id: string,
  data: UpdateConnectionData,
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    name: data.name,
    updatedAt: serverTimestamp(),
  })
}

export const deleteConnection = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}
