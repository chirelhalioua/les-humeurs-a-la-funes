import { getHumeursDb } from '../../utils/mongodb'
import { hashPassword } from '../../utils/password'
import { sendBrevoEmail } from '../../utils/brevo'

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

  try {
    await sendBrevoEmail({
      to: email,
      toName: name,
      subject: 'Bienvenue sur Les Humeurs à la Funes',
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#392b24"><h1>Bienvenue, ${name} !</h1><p>Ton compte Les Humeurs à la Funes vient d’être créé.</p><p>Tu peux maintenant enregistrer tes humeurs et retrouver ton suivi dans le temps.</p><p style="margin-top:28px">À bientôt,<br><strong>Les Humeurs à la Funes</strong></p></div>`
    })
  } catch (error) {
    console.error('Erreur Brevo confirmation inscription:', error)
  }

  await setUserSession(event, {
    user: { id: result.insertedId.toString(), name, email, photo: null }
  })

  return { ok: true, user: { id: result.insertedId.toString(), name, email, photo: null } }
})
