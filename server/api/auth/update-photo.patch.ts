import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = String(session.user?.id || '')
  if (!ObjectId.isValid(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })
  }

  const body = await readBody<{ photo?: string | null }>(event)
  const photo = body.photo === null ? null : String(body.photo || '')

  if (photo && !/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo)) {
    throw createError({ statusCode: 400, statusMessage: 'Format de photo invalide.' })
  }

  if (photo && photo.length > 900_000) {
    throw createError({ statusCode: 400, statusMessage: 'La photo est trop volumineuse.' })
  }

  const db = await getHumeursDb(event)
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { photo } }
  )

  await setUserSession(event, {
    user: {
      id: userId,
      name: String(session.user?.name || 'Membre'),
      email: String(session.user?.email || ''),
      photo
    }
  })

  return { ok: true, photo }
})
