const admin = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function processMessages() {
  const now = admin.firestore.Timestamp.now()

  const snapshot = await db
    .collection('messages')
    .where('status', '==', 'agendada')
    .where('scheduledAt', '<=', now)
    .get()

  if (snapshot.empty) {
    console.log('Nenhuma mensagem para processar.')
    return
  }

  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status: 'enviada',
      sentAt: now,
      updatedAt: now,
    })
  })

  await batch.commit()
  console.log(`${snapshot.size} mensagem(ns) processada(s).`)
}

processMessages().catch((err) => {
  console.error(err)
  process.exit(1)
})
