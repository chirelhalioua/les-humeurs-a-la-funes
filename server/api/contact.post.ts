import { getHumeursDb } from '../utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; message?: string }>(event)
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const message = String(body.message || '').trim()

  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: 'Merci d’indiquer ton nom ou prénom.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  if (message.length < 5) throw createError({ statusCode: 400, statusMessage: 'Ton message est trop court.' })

  const db = await getHumeursDb()
  await db.collection('contactMessages').insertOne({
    name,
    email,
    message,
    createdAt: new Date()
  })

  return { ok: true }
})
