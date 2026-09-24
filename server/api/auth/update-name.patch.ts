import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = String(session.user?.id || '')
  if (!ObjectId.isValid(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })
  }

  const body = await readBody<{ name?: string }>(event)
  const name = String(body.name || '').trim()

  if (name.length < 2 || name.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Le prénom ou nom doit contenir entre 2 et 80 caractères.' })
  }

  const db = await getHumeursDb(event)
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { name } }
  )

  if (!result.matchedCount) {
    throw createError({ statusCode: 404, statusMessage: 'Compte introuvable.' })
  }

  await setUserSession(event, {
    user: {
      id: userId,
      name,
      email: String(session.user?.email || '')
    }
  })

  return { ok: true, name }
})
