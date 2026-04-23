import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
  })
  return credential.user
}

export const signIn = async (email: string, password: string): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export const signOut = (): Promise<void> => firebaseSignOut(auth)

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
): (() => void) => onAuthStateChanged(auth, callback)
