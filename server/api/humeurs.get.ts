import { getHumeursDb } from '../utils/mongodb'

const moodMap = [
  { source: 'Heureux', key: 'heureux', name: 'Heureux', emoji: '🤩', tone: 'gold' },
  { source: 'Rieur', key: 'bien', name: 'Bien', emoji: '😌', tone: 'sage' },
  { source: 'Étonné', key: 'moyen', name: 'Moyen', emoji: '😐', tone: 'sand' },
  { source: 'Fatigué', key: 'fatigue', name: 'Fatigué', emoji: '😴', tone: 'peach' },
  { source: 'Énervé', key: 'nul', name: 'Nul', emoji: '😡', tone: 'cocoa' }
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  try {
    const db = await getHumeursDb(event)
    const documents = await db
      .collection(config.mongodbCollection)
      .find({ title: { $in: moodMap.map(mood => mood.source) } })
      .toArray()

    const byTitle = new Map(
      documents.map(document => [String(document.title).trim().toLowerCase(), document])
    )

    return moodMap
      .map(mood => {
        const document = byTitle.get(mood.source.toLowerCase())

        if (!document) {
          return null
        }

        return {
          key: mood.key,
          name: mood.name,
          emoji: mood.emoji,
          tone: mood.tone,
          quote: String(document.subtitle || ''),
          film: String(document.film || ''),
          image: String(document.image || '')
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Erreur MongoDB /api/humeurs:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de charger les humeurs.'
    })
  }
})
