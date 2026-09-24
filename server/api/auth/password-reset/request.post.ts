import { getHumeursDb } from '../../../utils/mongodb'
import { randomBytes } from 'node:crypto'
import { sendBrevoEmail } from '../../../utils/brevo'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })

  const db = await getHumeursDb()
  const user = await db.collection('users').findOne({ email })
  if (user) {
    const token = randomBytes(32).toString('hex')
    await db.collection('passwordResetTokens').deleteMany({ userId: user._id })
    await db.collection('passwordResetTokens').insertOne({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date()
    })

    const config = useRuntimeConfig(event)
    const resetUrl = `${config.public.siteUrl || ''}/reinitialiser-mot-de-passe?token=${token}`
    try {
      await sendBrevoEmail({
        to: email,
        toName: String(user.name || ''),
        subject: 'Réinitialisation de ton mot de passe',
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#392b24"><h1>Mot de passe oublié ?</h1><p>Une demande de réinitialisation a été faite pour ton compte Les Humeurs à la Funes.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#392b24;color:#fffaf2;text-decoration:none;border-radius:10px">Réinitialiser mon mot de passe</a></p><p>Ce lien est valable 30 minutes.</p><p>Si tu n’es pas à l’origine de cette demande, tu peux ignorer cet e-mail.</p></div>`
      })
    } catch (error) {
      console.error('Erreur Brevo réinitialisation:', error)
    }
  }
  return { ok: true }
})
