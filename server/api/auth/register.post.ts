import { getHumeursDb } from '../../utils/mongodb'
import { hashPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; password?: string; confirmPassword?: string }>(event)
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const confirmPassword = String(body.confirmPassword || '')

  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: 'Prénom ou nom trop court.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 8 caractères.' })
  if (password !== confirmPassword) throw createError({ statusCode: 400, statusMessage: 'Les mots de passe ne correspondent pas.' })

  const db = await getHumeursDb()
  const users = db.collection('users')
  const existing = await users.findOne({ email })
  if (existing) throw createError({ statusCode: 409, statusMessage: 'Un compte existe déjà avec cette adresse e-mail.' })

  const passwordHash = await hashPassword(password)
  const result = await users.insertOne({
    name,
    email,
    passwordHash,
    createdAt: new Date()
  })

  await setUserSession(event, {
    user: { id: result.insertedId.toString(), name, email }
  })

  return { ok: true, user: { id: result.insertedId.toString(), name, email } }
})
