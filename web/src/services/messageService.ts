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
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Message,
  CreateMessageData,
  UpdateMessageData,
  MessageStatusFilter,
} from '@/types/message.types'

const COLLECTION = 'messages'

const toTimestamp = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date()

const toMessage = (id: string, data: Record<string, unknown>): Message => ({
  id,
  userId: data.userId as string,
  content: data.content as string,
  contactIds: data.contactIds as string[],
  contactNames: data.contactNames as string[],
  scheduledAt: toTimestamp(data.scheduledAt),
  status: data.status as Message['status'],
  sentAt: data.sentAt instanceof Timestamp ? data.sentAt.toDate() : null,
  createdAt: toTimestamp(data.createdAt),
  updatedAt: toTimestamp(data.updatedAt),
})

export const subscribeToMessages = (
  userId: string,
  statusFilter: MessageStatusFilter,
  callback: (messages: Message[]) => void,
): (() => void) => {
  const constraints = [
    where('userId', '==', userId),
    ...(statusFilter !== 'all' ? [where('status', '==', statusFilter)] : []),
    orderBy('scheduledAt', 'desc'),
  ]
  const q = query(collection(db, COLLECTION), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) =>
      toMessage(docSnap.id, docSnap.data() as Record<string, unknown>),
    )
    callback(messages)
  })
}

export const createMessage = async (
  userId: string,
  data: CreateMessageData,
): Promise<void> => {
  await addDoc(collection(db, COLLECTION), {
    userId,
    content: data.content,
    contactIds: data.contactIds,
    contactNames: data.contactNames,
    scheduledAt: Timestamp.fromDate(data.scheduledAt),
    status: 'agendada',
    sentAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateMessage = async (
  id: string,
  data: UpdateMessageData,
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    content: data.content,
    contactIds: data.contactIds,
    contactNames: data.contactNames,
    scheduledAt: Timestamp.fromDate(data.scheduledAt),
    updatedAt: serverTimestamp(),
  })
}

export const deleteMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}

export const processPastDueMessages = async (userId: string): Promise<void> => {
  const now = Timestamp.now()
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    where('status', '==', 'agendada'),
    where('scheduledAt', '<=', now),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return

  const batch = writeBatch(db)
  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      status: 'enviada',
      sentAt: now,
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}
