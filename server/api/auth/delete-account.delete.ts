import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = String(session.user?.id || '')
  if (!ObjectId.isValid(id)) throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })
  const db = await getHumeursDb()
  await db.collection('users').deleteOne({ _id: new ObjectId(id) })
  await clearUserSession(event)
  return { ok: true }
})
