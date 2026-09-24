import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../utils/mongodb'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = String(session.user?.id || '')

  if (!ObjectId.isValid(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Compte invalide.' })
  }

  const db = await getHumeursDb(event)
  const entries = await db
    .collection('suivi_humeurs')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()

  return entries.map(entry => ({
    id: entry._id.toString(),
    moodKey: entry.moodKey,
    moodName: entry.moodName,
    emoji: entry.emoji,
    tone: entry.tone,
    quote: entry.quote,
    film: entry.film,
    image: entry.image,
    moment: entry.moment,
    exactTime: entry.exactTime || null,
    createdAt: entry.createdAt
  }))
})
