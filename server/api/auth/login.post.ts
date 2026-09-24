import { getHumeursDb } from '../../utils/mongodb'
import { verifyPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail et mot de passe requis.' })
  }

  const db = await getHumeursDb()
  const user = await db.collection('users').findOne({ email })

  if (!user || !(await verifyPassword(password, String(user.passwordHash || '')))) {
    throw createError({ statusCode: 401, statusMessage: 'E-mail ou mot de passe incorrect.' })
  }

  const id = user._id.toString()
  const name = String(user.name || user.prenom || 'Membre')
  const photo = user.photo ? String(user.photo) : null
  await setUserSession(event, { user: { id, name, email, photo } })

  return { ok: true, user: { id, name, email, photo } }
})
