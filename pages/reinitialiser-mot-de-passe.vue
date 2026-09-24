<script setup lang="ts">
const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const sent = ref(false)
const resetDone = ref(false)
const error = ref('')

async function requestReset() {
  error.value = ''
  try {
    await $fetch('/api/auth/password-reset/request', { method: 'POST', body: { email: email.value } })
    sent.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Une erreur est survenue.'
  }
}

async function confirmReset() {
  error.value = ''
  try {
    await $fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      body: { token: token.value, password: password.value, confirmPassword: confirmPassword.value }
    })
    resetDone.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Impossible de réinitialiser le mot de passe.'
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-intro">
      <span class="eyebrow"><span></span> accès au compte</span>
      <h1>Mot de passe<br><i>oublié ?</i></h1>
      <p v-if="token">Choisis un nouveau mot de passe pour ton compte.</p>
      <p v-else>Entre ton adresse e-mail pour recevoir un lien de réinitialisation.</p>
    </div>

    <div class="auth-card">
      <template v-if="token && !resetDone">
        <form @submit.prevent="confirmReset">
          <label>Nouveau mot de passe
            <input v-model="password" type="password" autocomplete="new-password" minlength="8" required>
          </label>
          <label>Confirmer le mot de passe
            <input v-model="confirmPassword" type="password" autocomplete="new-password" minlength="8" required>
          </label>
          <p v-if="error" class="auth-message auth-error">{{ error }}</p>
          <button class="auth-submit">Enregistrer le nouveau mot de passe <span>→</span></button>
        </form>
      </template>

      <template v-else-if="resetDone">
        <p class="auth-message auth-success">Ton mot de passe a été réinitialisé. Tu peux maintenant te connecter.</p>
        <p class="auth-foot"><NuxtLink to="/connexion">← Retour à la connexion</NuxtLink></p>
      </template>

      <template v-else-if="!sent">
        <form @submit.prevent="requestReset">
          <label>E-mail
            <input v-model="email" type="email" autocomplete="email" required>
          </label>
          <p v-if="error" class="auth-message auth-error">{{ error }}</p>
          <button class="auth-submit">Recevoir le lien <span>→</span></button>
        </form>
      </template>

      <template v-else>
        <p class="auth-message auth-success">Si un compte correspond à cette adresse, un lien de réinitialisation vient d’être envoyé. Vérifie ta messagerie.</p>
        <p class="auth-foot"><NuxtLink to="/connexion">← Retour à la connexion</NuxtLink></p>
      </template>
    </div>
  </section>
</template>
