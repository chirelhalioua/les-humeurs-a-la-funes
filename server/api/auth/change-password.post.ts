import { getHumeursDb } from '../../utils/mongodb'
import { verifyPassword, hashPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>(event)
  const currentPassword = String(body.currentPassword || '')
  const newPassword = String(body.newPassword || '')
  if (newPassword.length < 8) throw createError({ statusCode: 400, statusMessage: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
  if (newPassword !== String(body.confirmPassword || '')) throw createError({ statusCode: 400, statusMessage: 'Les mots de passe ne correspondent pas.' })

  const db = await getHumeursDb()
  const user = await db.collection('users').findOne({ _id: new (await import('mongodb')).ObjectId(String(session.user?.id)) })
  if (!user || !(await verifyPassword(currentPassword, String(user.passwordHash || '')))) {
    throw createError({ statusCode: 401, statusMessage: 'Le mot de passe actuel est incorrect.' })
  }
  await db.collection('users').updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(newPassword), updatedAt: new Date() } })
  return { ok: true }
})
