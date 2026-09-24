import { ObjectId } from 'mongodb'
import { getHumeursDb } from '../../../utils/mongodb'
import { hashPassword } from '../../../utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string; confirmPassword?: string }>(event)
  const token = String(body.token || '').trim()
  const password = String(body.password || '')
  const confirmPassword = String(body.confirmPassword || '')

  if (!token) throw createError({ statusCode: 400, statusMessage: 'Lien de réinitialisation invalide.' })
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 8 caractères.' })
  if (password !== confirmPassword) throw createError({ statusCode: 400, statusMessage: 'Les mots de passe ne correspondent pas.' })

  const db = await getHumeursDb(event)
  const reset = await db.collection('passwordResetTokens').findOne({
    token,
    expiresAt: { $gt: new Date() }
  })

  if (!reset || !ObjectId.isValid(String(reset.userId))) {
    throw createError({ statusCode: 400, statusMessage: 'Ce lien est invalide ou expiré.' })
  }

  await db.collection('users').updateOne(
    { _id: new ObjectId(String(reset.userId)) },
    { $set: { passwordHash: await hashPassword(password), updatedAt: new Date() } }
  )

  await db.collection('passwordResetTokens').deleteMany({ userId: reset.userId })

  return { ok: true }
})
