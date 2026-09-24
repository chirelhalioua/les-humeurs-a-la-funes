import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = String(session.user?.id || '')
  if (!ObjectId.isValid(id)) throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })

  const db = await getHumeursDb(event)
  const userId = new ObjectId(id)

  await db.collection('suivi_humeurs').deleteMany({ userId })
  await db.collection('passwordResetTokens').deleteMany({ userId })
  await db.collection('users').deleteOne({ _id: userId })

  await clearUserSession(event)
  return { ok: true }
})
