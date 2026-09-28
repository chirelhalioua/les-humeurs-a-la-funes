<script setup lang="ts">
const form = reactive({ name: '', email: '', message: '' })
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    sent.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Impossible d’envoyer ton message.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="contact-page">
    <div class="contact-heading">
      <span class="eyebrow"><span></span> nous écrire</span>
      <h1>Une question ?<br><i>On t’écoute.</i></h1>
      <p>Une remarque, une question ou simplement envie de nous écrire ? Laisse-nous un message.</p>
    </div>

    <div class="contact-layout">
      <div class="contact-card">
        <form v-if="!sent" class="contact-form" @submit.prevent="submit">
          <label>Nom ou prénom
            <input v-model="form.name" type="text" autocomplete="name" placeholder="Ton prénom" required>
          </label>
          <label>E-mail
            <input v-model="form.email" type="email" autocomplete="email" placeholder="toi@exemple.fr" required>
          </label>
          <label>Message
            <textarea v-model="form.message" rows="6" placeholder="Écris ton message ici…" minlength="5" required></textarea>
          </label>
          <p v-if="error" class="auth-message auth-error">{{ error }}</p>
          <button class="auth-submit" type="submit" :disabled="loading">
            {{ loading ? 'Envoi en cours…' : 'Envoyer mon message' }} <span>→</span>
          </button>
        </form>

        <div v-else class="contact-success">
          <span>✓</span>
          <h2>Message envoyé !</h2>
          <p>Merci pour ton message. Nous reviendrons vers toi dès que possible.</p>
          <button type="button" @click="sent = false">Envoyer un autre message</button>
        </div>
      </div>
      <section class="faq-section">
        <div class="faq-heading">
          <span class="eyebrow"><span></span> questions fréquentes</span>
          <h2>La petite <i>FAQ.</i></h2>
        </div>
        <details>
          <summary>À quoi servent Les Humeurs à la Funes ?</summary>
          <p>L’application permet de noter simplement ton humeur et, avec un compte, de retrouver son évolution dans le temps.</p>
        </details>
        <details>
          <summary>Mes humeurs sont-elles privées ?</summary>
          <p>Ton espace est personnel. Les informations de ton compte et ton suivi sont associés à ton compte.</p>
        </details>
        <details>
          <summary>Puis-je supprimer mon compte ?</summary>
          <p>Oui. L’option « Supprimer mon profil » est disponible depuis ton espace Profil.</p>
        </details>
        <details>
          <summary>Comment choisir le moment de mon humeur ?</summary>
          <p>Sur la page « Mon humeur », tu peux choisir Matin, Après-midi ou Soir, puis indiquer une heure précise.</p>
        </details>
      </section>
    </div>
  </section>
</template>
