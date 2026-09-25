<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })
const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const message = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  message.value=''; error.value=''; loading.value=true
  try {
    await $fetch('/api/auth/change-password',{method:'POST',body:form})
    message.value='Mot de passe modifié avec succès.'
    form.currentPassword=''; form.newPassword=''; form.confirmPassword=''
  } catch (e:any) { error.value=e?.data?.statusMessage || 'Impossible de modifier le mot de passe.' }
  finally { loading.value=false }
}

function togglePassword(event: Event) {
  const button = event.currentTarget as HTMLButtonElement
  const id = button.dataset.passwordTarget
  if (!id) return
  const input = document.getElementById(id) as HTMLInputElement | null
  if (!input) return
  input.type = input.type === 'password' ? 'text' : 'password'
  button.textContent = input.type === 'password' ? '◉' : '◌'
  button.setAttribute('aria-label', input.type === 'password' ? 'Afficher le mot de passe' : 'Masquer le mot de passe')
}
</script>
<template>
  <section class="auth-page">
    <div class="auth-intro"><span class="eyebrow"><span></span> sécurité</span><h1>Modifier mon<br><i>mot de passe.</i></h1><p>Choisis un nouveau mot de passe pour sécuriser ton espace.</p></div>
    <div class="auth-card">
      <form @submit.prevent="submit">
        <label>Mot de passe actuel<div class="password-field"><input v-model="form.currentPassword" id="password-field-1" type="password" autocomplete="current-password" required><button type="button" class="password-toggle" aria-label="Afficher le mot de passe" data-password-target="password-field-1" @click="togglePassword">◉</button></div></label>
        <label>Nouveau mot de passe<div class="password-field"><input v-model="form.newPassword" id="password-field-2" type="password" autocomplete="new-password" minlength="8" required><button type="button" class="password-toggle" aria-label="Afficher le mot de passe" data-password-target="password-field-2" @click="togglePassword">◉</button></div></label>
        <label>Confirmer<div class="password-field"><input v-model="form.confirmPassword" id="password-field-3" type="password" autocomplete="new-password" minlength="8" required><button type="button" class="password-toggle" aria-label="Afficher le mot de passe" data-password-target="password-field-3" @click="togglePassword">◉</button></div></label>
        <p v-if="error" class="auth-message auth-error">{{ error }}</p><p v-if="message" class="auth-message auth-success">{{ message }}</p>
        <button class="auth-submit" :disabled="loading">{{ loading ? 'Un instant…' : 'Modifier le mot de passe' }} <span>→</span></button>
      </form>
    </div>
  </section>
</template>
