import * as admin from 'firebase-admin'

admin.initializeApp()

export { processScheduledMessages } from './schedulers/processScheduledMessages'
