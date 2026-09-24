export async function sendBrevoEmail(options: {
  to: string
  toName?: string
  subject: string
  htmlContent: string
}) {
  const config = useRuntimeConfig()

  if (!config.brevoApiKey || !config.brevoSenderEmail) {
    throw new Error('Configuration Brevo incomplète.')
  }

  const response = await $fetch<{ messageId?: string }>('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': config.brevoApiKey,
      'content-type': 'application/json'
    },
    body: {
      sender: {
        name: config.brevoSenderName || 'Les Humeurs à la Funes',
        email: config.brevoSenderEmail
      },
      to: [{ email: options.to, name: options.toName }],
      subject: options.subject,
      htmlContent: options.htmlContent
    }
  })

  return response
}
