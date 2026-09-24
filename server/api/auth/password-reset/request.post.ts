import { getHumeursDb } from '../../../utils/mongodb'
import { randomBytes } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })

  const db = await getHumeursDb()
  const user = await db.collection('users').findOne({ email })
  if (user) {
    const token = randomBytes(32).toString('hex')
    await db.collection('passwordResetTokens').insertOne({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date()
    })
  }
  return { ok: true }
})
