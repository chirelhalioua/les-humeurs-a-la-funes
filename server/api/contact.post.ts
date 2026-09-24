import { getHumeursDb } from '../utils/mongodb'
import { sendBrevoEmail } from '../utils/brevo'

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character] || character))

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

  try {
    await sendBrevoEmail({
      to: 'contact@chirelhalioua.fr',
      toName: 'Chirel Dev',
      replyTo: email,
      subject: 'Nouveau message de contact — Les Humeurs à la Funes',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#392b24">
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(email)}</p>
          <p><strong>Message :</strong></p>
          <div style="padding:16px;background:#f5efe5;border-radius:10px;white-space:pre-wrap">${escapeHtml(message)}</div>
          <p style="margin-top:24px">
            Tu peux répondre directement à <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a>.
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Erreur Brevo formulaire de contact:', error)
  }

  return { ok: true }
})
