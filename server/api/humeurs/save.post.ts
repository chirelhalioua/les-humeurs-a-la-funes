import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../utils/mongodb'

const allowedMoments = new Set(['matin', 'apres-midi', 'soir'])

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = String(session.user?.id || '')

  if (!ObjectId.isValid(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })
  }

  const body = await readBody(event)
  const moodKey = String(body?.moodKey || '').trim()
  const moodName = String(body?.moodName || '').trim()
  const emoji = String(body?.emoji || '').trim()
  const tone = String(body?.tone || '').trim()
  const quote = String(body?.quote || '').trim()
  const film = String(body?.film || '').trim()
  const image = String(body?.image || '').trim()
  const moment = String(body?.moment || '').trim()
  const exactTime = String(body?.exactTime || '').trim()

  if (!moodKey || !moodName || !allowedMoments.has(moment)) {
    throw createError({ statusCode: 400, statusMessage: 'Humeur ou moment invalide.' })
  }

  if (exactTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(exactTime)) {
    throw createError({ statusCode: 400, statusMessage: 'Heure invalide.' })
  }

  const db = await getHumeursDb(event)

  const entry = {
    userId: new ObjectId(userId),
    moodKey,
    moodName,
    emoji,
    tone,
    quote,
    film,
    image,
    moment,
    exactTime: exactTime || null,
    createdAt: new Date()
  }

  const result = await db.collection('suivi_humeurs').insertOne(entry)

  return {
    ok: true,
    id: result.insertedId.toString()
  }
})
