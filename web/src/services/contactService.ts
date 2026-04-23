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
import type { Contact, CreateContactData, UpdateContactData } from '@/types/contact.types'

const COLLECTION = 'contacts'

const toTimestamp = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date()

const toContact = (id: string, data: Record<string, unknown>): Contact => ({
  id,
  userId: data.userId as string,
  connectionId: data.connectionId as string,
  name: data.name as string,
  phone: data.phone as string,
  createdAt: toTimestamp(data.createdAt),
  updatedAt: toTimestamp(data.updatedAt),
})

export const subscribeToContacts = (
  userId: string,
  connectionId: string | null,
  callback: (contacts: Contact[]) => void,
): (() => void) => {
  const constraints = [
    where('userId', '==', userId),
    ...(connectionId ? [where('connectionId', '==', connectionId)] : []),
    orderBy('createdAt', 'desc'),
  ]
  const q = query(collection(db, COLLECTION), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const contacts = snapshot.docs.map((docSnap) =>
      toContact(docSnap.id, docSnap.data() as Record<string, unknown>),
    )
    callback(contacts)
  })
}

export const createContact = async (
  userId: string,
  data: CreateContactData,
): Promise<void> => {
  await addDoc(collection(db, COLLECTION), {
    userId,
    connectionId: data.connectionId,
    name: data.name,
    phone: data.phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateContact = async (
  id: string,
  data: UpdateContactData,
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    connectionId: data.connectionId,
    name: data.name,
    phone: data.phone,
    updatedAt: serverTimestamp(),
  })
}

export const deleteContact = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}
