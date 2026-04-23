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
    .get()

  const due = snapshot.docs.filter(
    (doc) => doc.data().scheduledAt.toMillis() <= now.toMillis()
  )

  if (due.length === 0) {
    console.log('Nenhuma mensagem para processar.')
    return
  }

  const batch = db.batch()
  due.forEach((doc) => {
    batch.update(doc.ref, {
      status: 'enviada',
      sentAt: now,
      updatedAt: now,
    })
  })

  await batch.commit()
  console.log(`${due.length} mensagem(ns) processada(s).`)
}

processMessages().catch((err) => {
  console.error(err)
  process.exit(1)
})
