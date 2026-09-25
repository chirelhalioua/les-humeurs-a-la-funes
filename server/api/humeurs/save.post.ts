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
  const dayKey = String(body?.dayKey || '').trim()

  if (!moodKey || !moodName || !allowedMoments.has(moment)) {
    throw createError({ statusCode: 400, statusMessage: 'Humeur ou moment invalide.' })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    throw createError({ statusCode: 400, statusMessage: 'Date invalide.' })
  }

  if (exactTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(exactTime)) {
    throw createError({ statusCode: 400, statusMessage: 'Heure invalide.' })
  }

  const db = await getHumeursDb(event)
  const now = new Date()

  const result = await db.collection('suivi_humeurs').findOneAndUpdate(
    {
      userId: new ObjectId(userId),
      dayKey,
      moment
    },
    {
      $set: {
        moodKey,
        moodName,
        emoji,
        tone,
        quote,
        film,
        image,
        exactTime: exactTime || null,
        updatedAt: now
      },
      $setOnInsert: {
        userId: new ObjectId(userId),
        dayKey,
        moment,
        createdAt: now
      }
    },
    {
      upsert: true,
      returnDocument: 'after'
    }
  )

  return {
    ok: true,
    id: result?._id?.toString(),
    updated: Boolean(result?.createdAt && result.createdAt.getTime() !== now.getTime())
  }
})
