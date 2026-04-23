import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export const processScheduledMessages = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (_context) => {
    try {
      const now = admin.firestore.Timestamp.now()

      const snapshot = await db
        .collection('messages')
        .where('status', '==', 'agendada')
        .where('scheduledAt', '<=', now)
        .get()

      if (snapshot.empty) {
        functions.logger.info('Nenhuma mensagem agendada para processar.')
        return null
      }

      const batches: admin.firestore.WriteBatch[] = []
      let currentBatch = db.batch()
      let operationCount = 0

      snapshot.docs.forEach((docSnap) => {
        if (operationCount > 0 && operationCount % 499 === 0) {
          batches.push(currentBatch)
          currentBatch = db.batch()
        }
        currentBatch.update(docSnap.ref, {
          status: 'enviada',
          sentAt: now,
          updatedAt: now,
        })
        operationCount++
      })

      batches.push(currentBatch)

      await Promise.all(batches.map((b) => b.commit()))

      functions.logger.info(`${operationCount} mensagem(ns) processada(s) com sucesso.`)
      return null
    } catch (error) {
      functions.logger.error('Erro ao processar mensagens agendadas:', error)
      throw error
    }
  })
